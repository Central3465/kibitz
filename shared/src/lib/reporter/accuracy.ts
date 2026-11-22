import { clamp, mean } from "lodash-es";

import { getNodeChain, StateTreeNode } from "@/types/game/position/StateTreeNode";
import Evaluation from "@/types/game/position/Evaluation";
import PieceColour from "@/constants/PieceColour";
import { getExpectedPointsLoss } from "./expectedPoints";

function harmonicMean(values: number[]) {
    if (values.length == 0) return NaN;

    // Floor values so that a single 0% move does not zero the mean
    const reciprocalSum = values.reduce(
        (sum, value) => sum + 1 / Math.max(value, 1), 0
    );

    return values.length / reciprocalSum;
}

/**
 * @description Aggregates move accuracies into a game accuracy. Blends the
 * arithmetic mean with the harmonic mean, so that a few big mistakes weigh
 * more than they would in a plain average, without dominating it.
 */
function aggregateAccuracy(accuracies: number[]) {
    if (accuracies.length == 0) return NaN;

    return clamp(
        (mean(accuracies) + harmonicMean(accuracies)) / 2,
        0, 100
    );
}

export function getGameAccuracy(rootNode: StateTreeNode) {
    const accuracyHolders = getNodeChain(rootNode).filter(
        node => node.state.accuracy != undefined
    );

    const accuraciesOf = (colour: PieceColour) => accuracyHolders
        .filter(node => node.state.moveColour == colour)
        .map(node => node.state.accuracy!);

    return {
        white: aggregateAccuracy(accuraciesOf(PieceColour.WHITE)),
        black: aggregateAccuracy(accuraciesOf(PieceColour.BLACK))
    };
}

export function getMoveAccuracy(
    previousEvaluation: Evaluation,
    currentEvaluation: Evaluation,
    moveColour: PieceColour
) {
    const pointLoss = getExpectedPointsLoss(
        previousEvaluation,
        currentEvaluation,
        moveColour
    );

    return clamp(
        103.1668 * Math.exp(-4.354 * pointLoss) - 3.1669,
        0, 100
    );
}
