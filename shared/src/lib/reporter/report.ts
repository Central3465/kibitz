import { GameAnalysis } from "@/types/game/GameAnalysis";
import { StateTreeNode, getNodeChain } from "@/types/game/position/StateTreeNode";
import AnalysisOptions from "./types/AnalysisOptions";
import { adaptPieceColour } from "@/constants/PieceColour";
import {
    extractCurrentStateTreeNode,
    extractPreviousStateTreeNode
} from "./utils/extractNode";
import { getOpeningName } from "./utils/opening";
import { getGameAccuracy, getMoveAccuracy } from "./accuracy";
import { classify } from "./classify";

/**
 * @description Applies a classification, opening name and accuracy to the
 * board state of a single node, in place.
 */
export function analyseNode(
    node: StateTreeNode,
    options?: AnalysisOptions
) {
    try {
        node.state.classification = classify(node, options);
    } catch {
        node.state.classification = undefined;
    }

    node.state.opening = getOpeningName(node.state.fen);

    if (!node.parent) return node;

    const previous = extractPreviousStateTreeNode(node.parent);
    const current = extractCurrentStateTreeNode(node);

    if (!previous || !current) return node;

    node.state.accuracy = getMoveAccuracy(
        previous.evaluation,
        current.evaluation,
        adaptPieceColour(current.playedMove.color)
    );

    return node;
}

/**
 * @description A rough rating estimate from a game accuracy.
 */
function estimateRating(accuracy: number) {
    if (isNaN(accuracy)) return 0;

    const rating = 3200 / (1 + Math.exp(-0.09 * (accuracy - 75)));

    return Math.round(Math.min(3200, Math.max(100, rating)) / 25) * 25;
}

export function getGameAnalysis(
    rootNode: StateTreeNode,
    options?: AnalysisOptions
): GameAnalysis {
    for (const node of getNodeChain(rootNode)) {
        analyseNode(node, options);
    }

    const accuracies = getGameAccuracy(rootNode);

    return {
        estimatedRatings: {
            white: estimateRating(accuracies.white),
            black: estimateRating(accuracies.black)
        },
        stateTree: rootNode
    };
}
