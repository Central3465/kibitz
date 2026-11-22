import { Move } from "chess.js";

import ReportOptions from "./types/AnalysisOptions";
import { StateTreeNode } from "@/types/game/position/StateTreeNode";
import { getLineGroupSibling, getTopEngineLine } from "@/types/game/position/EngineLine";
import Evaluation from "@/types/game/position/Evaluation";
import { Classification, classifValues } from "@/constants/Classification";
import {
    extractPreviousStateTreeNode,
    extractCurrentStateTreeNode
} from "./utils/extractNode";
import { ExtractedPreviousNode } from "./types/ExtractedNode";

import { getOpeningName } from "./utils/opening";
import { pointLossClassify } from "./classification/pointLoss";
import { considerBrilliantClassification } from "./classification/brilliant";
import { considerCriticalClassification } from "./classification/critical";
import { considerMissClassification } from "./classification/miss";

const maxEngineLines = 5;

/**
 * @description If the played move was one of the engine's candidate lines
 * in the previous position, returns the evaluation of that line. This
 * evaluation comes from the same search as the top move, so comparing
 * against it is more consistent than an evaluation from a new search.
 */
function getPlayedLineEvaluation(
    previous: ExtractedPreviousNode,
    playedMove: Move
): Evaluation | undefined {
    for (let index = 2; index <= maxEngineLines; index++) {
        const line = getLineGroupSibling(
            previous.state.engineLines,
            previous.topLine,
            index
        );

        if (!line) return;
        if (line.moves.at(0)?.san != playedMove.san) continue;

        return line.evaluation;
    }
}

/**
 * @description Evaluation of the position before the opponent's last move,
 * used to detect missed opportunities.
 */
function getOpponentPreviousEvaluation(node: StateTreeNode) {
    const grandparent = node.parent?.parent;
    if (!grandparent) return;

    return getTopEngineLine(grandparent.state.engineLines)?.evaluation;
}

export function classify(
    node: StateTreeNode,
    options?: ReportOptions
) {
    if (!node.parent) {
        throw new Error("no parent node exists to compare with.");
    }

    const previous = extractPreviousStateTreeNode(node.parent);
    const current = extractCurrentStateTreeNode(node);

    if (!previous || !current) {
        throw new Error("information missing from current or previous node.");
    }

    const opts: Required<ReportOptions> = {
        includeBrilliant: true,
        includeCritical: true,
        includeTheory: true,
        includeMiss: true,
        ...options
    };

    // Consider forced classification
    if (previous.board.moves().length <= 1) {
        return Classification.FORCED;
    }

    // Consider theory classification
    const openingName = getOpeningName(current.state.fen);

    if (opts.includeTheory && openingName) {
        return Classification.THEORY;
    }

    // Short-circuit checkmates with best
    if (current.board.isCheckmate()) {
        return Classification.BEST;
    }

    const topMovePlayed = previous.topMove.san == current.playedMove.san;

    // Prefer the evaluation of the played move from the previous search
    // when it is available and both evaluations are in centipawns
    const lineEvaluation = getPlayedLineEvaluation(
        previous, current.playedMove
    );

    const currentEvaluation = (
        lineEvaluation
        && lineEvaluation.type == "centipawn"
        && current.evaluation.type == "centipawn"
        && previous.evaluation.type == "centipawn"
    ) ? lineEvaluation : current.evaluation;

    // Point loss classify
    let classification = topMovePlayed
        ? Classification.BEST
        : pointLossClassify(previous, current, currentEvaluation);

    // Consider miss classification
    if (
        opts.includeMiss
        && considerMissClassification(
            previous,
            current,
            currentEvaluation,
            classification,
            getOpponentPreviousEvaluation(node)
        )
    ) return Classification.MISS;

    // Consider only and brilliant classification
    if (
        opts.includeCritical
        && topMovePlayed
        && considerCriticalClassification(previous, current)
    ) classification = Classification.CRITICAL;

    if (
        opts.includeBrilliant
        && classifValues[classification] >= classifValues[Classification.BEST]
        && considerBrilliantClassification(previous, current)
    ) classification = Classification.BRILLIANT;

    return classification;
}
