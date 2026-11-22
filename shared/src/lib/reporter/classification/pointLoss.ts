import { WHITE } from "chess.js";

import {
    ExtractedCurrentNode,
    ExtractedPreviousNode
} from "../types/ExtractedNode";
import { Classification } from "@/constants/Classification";
import { adaptPieceColour } from "@/constants/PieceColour";
import Evaluation from "@/types/game/position/Evaluation";
import { getExpectedPointsLoss } from "../expectedPoints";

/**
 * Upper bounds of expected points loss (0 - 1) for each classification
 * when comparing two centipawn evaluations.
 */
export const pointLossThresholds = {
    [Classification.BEST]: 0.01,
    [Classification.EXCELLENT]: 0.035,
    [Classification.OKAY]: 0.07,
    [Classification.INACCURACY]: 0.11,
    [Classification.MISTAKE]: 0.2
} as const;

export function classifyPointLoss(pointLoss: number) {
    if (pointLoss < pointLossThresholds[Classification.BEST]) {
        return Classification.BEST;
    } else if (pointLoss < pointLossThresholds[Classification.EXCELLENT]) {
        return Classification.EXCELLENT;
    } else if (pointLoss < pointLossThresholds[Classification.OKAY]) {
        return Classification.OKAY;
    } else if (pointLoss < pointLossThresholds[Classification.INACCURACY]) {
        return Classification.INACCURACY;
    } else if (pointLoss < pointLossThresholds[Classification.MISTAKE]) {
        return Classification.MISTAKE;
    } else {
        return Classification.BLUNDER;
    }
}

/**
 * @description Classify using two evaluations and a move colour,
 * using expected point losses or mate losses. `currentEvaluation`
 * can be provided to override the evaluation of the current node.
 */
export function pointLossClassify(
    previous: ExtractedPreviousNode,
    current: ExtractedCurrentNode,
    currentEvaluation: Evaluation = current.evaluation
) {
    const colourMultiplier = current.playedMove.color == WHITE ? 1 : -1;

    const previousSubjectiveValue = previous.evaluation.value * colourMultiplier;
    const subjectiveValue = currentEvaluation.value * colourMultiplier;

    // Mate to mate evaluations
    if (
        previous.evaluation.type == "mate"
        && currentEvaluation.type == "mate"
    ) {
        // Winning mate to losing mate
        if (previousSubjectiveValue > 0 && subjectiveValue < 0) {
            return subjectiveValue < -3
                ? Classification.MISTAKE
                : Classification.BLUNDER;
        }

        // Losing mate to winning mate (opponent allowed a turnaround)
        if (previousSubjectiveValue < 0 && subjectiveValue > 0) {
            return Classification.BEST;
        }

        // For the losing side, making a move that keeps the mate the same
        // is best. Only the winning side expects a mate loss of -1.
        const mateLoss = (
            (currentEvaluation.value - previous.evaluation.value)
            * colourMultiplier
        );

        if (mateLoss < 0 || (mateLoss == 0 && subjectiveValue < 0)) {
            return Classification.BEST;
        } else if (mateLoss < 2) {
            return Classification.EXCELLENT;
        } else if (mateLoss < 7) {
            return Classification.OKAY;
        } else {
            return Classification.INACCURACY;
        }
    }

    // Mate to centipawn evaluations
    if (
        previous.evaluation.type == "mate"
        && currentEvaluation.type == "centipawn"
    ) {
        // Was being mated, now escaped: always good
        if (previousSubjectiveValue < 0) {
            return Classification.BEST;
        }

        if (subjectiveValue >= 800) {
            return Classification.EXCELLENT;
        } else if (subjectiveValue >= 400) {
            return Classification.OKAY;
        } else if (subjectiveValue >= 200) {
            return Classification.INACCURACY;
        } else if (subjectiveValue >= 0) {
            return Classification.MISTAKE;
        } else {
            return Classification.BLUNDER;
        }
    }

    // Centipawn to mate evaluations
    if (
        previous.evaluation.type == "centipawn"
        && currentEvaluation.type == "mate"
    ) {
        if (subjectiveValue > 0) {
            return Classification.BEST;
        }

        // Already completely lost; walking into a mate is less significant
        if (previousSubjectiveValue <= -700) {
            return subjectiveValue >= -3
                ? Classification.MISTAKE
                : Classification.INACCURACY;
        }

        if (subjectiveValue >= -2) {
            return Classification.BLUNDER;
        } else if (subjectiveValue >= -5) {
            return Classification.MISTAKE;
        } else {
            return Classification.INACCURACY;
        }
    }

    // Centipawn to centipawn evaluations
    return classifyPointLoss(getExpectedPointsLoss(
        previous.evaluation,
        currentEvaluation,
        adaptPieceColour(current.playedMove.color)
    ));
}
