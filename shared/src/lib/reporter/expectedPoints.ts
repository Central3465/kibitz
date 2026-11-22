import Evaluation from "@/types/game/position/Evaluation";
import { PieceColour, flipPieceColour } from "@/constants/PieceColour";

interface ExpectedPointsOptions {
    moveColour: PieceColour;
    centipawnGradient?: number;
}

/**
 * Logistic gradient mapping centipawns to win probability. Calibrated
 * against large game databases (approximately the curve used by Lichess).
 */
export const defaultCentipawnGradient = 0.00368208;

/**
 * @description Returns the expected points (win probability) for White
 * of a given evaluation. `moveColour` is the colour that just moved, used
 * to resolve evaluations of mate in 0 (checkmate on the board).
 */
export function getExpectedPoints(
    evaluation: Evaluation,
    options?: ExpectedPointsOptions
) {
    const opts = {
        centipawnGradient: defaultCentipawnGradient,
        ...options
    };

    if (evaluation.type == "mate") {
        if (evaluation.value == 0) {
            return Number(opts.moveColour == PieceColour.WHITE);
        }

        return Number(evaluation.value > 0);
    } else {
        return 1 / (1 + Math.exp(
            -opts.centipawnGradient * evaluation.value
        ));
    }
}

/**
 * @description Returns the expected points of an evaluation from the
 * perspective of the given colour.
 */
export function getSubjectiveExpectedPoints(
    evaluation: Evaluation,
    colour: PieceColour,
    moveColour = colour
) {
    const points = getExpectedPoints(evaluation, { moveColour });

    return colour == PieceColour.WHITE ? points : 1 - points;
}

export function getExpectedPointsLoss(
    previousEvaluation: Evaluation,
    currentEvaluation: Evaluation,
    moveColour: PieceColour
) {
    return Math.max(0,
        (
            getExpectedPoints(previousEvaluation, {
                moveColour: flipPieceColour(moveColour)
            })
            - getExpectedPoints(currentEvaluation, { moveColour })
        )
        * (moveColour == PieceColour.WHITE ? 1 : -1)
    );
}
