import { Classification } from "@/constants/Classification";
import { adaptPieceColour, flipPieceColour } from "@/constants/PieceColour";
import Evaluation from "@/types/game/position/Evaluation";
import {
    ExtractedCurrentNode,
    ExtractedPreviousNode
} from "../types/ExtractedNode";
import { getSubjectiveExpectedPoints } from "../expectedPoints";

const missableClassifications = [
    Classification.INACCURACY,
    Classification.MISTAKE,
    Classification.BLUNDER
];

/**
 * @description A miss is a move that fails to punish an error made by the
 * opponent on the previous move, while not throwing the game away. Returns
 * whether a miss classification is recommended.
 *
 * @param opponentPreviousEvaluation The evaluation of the position before
 * the opponent's last move.
 */
export function considerMissClassification(
    previous: ExtractedPreviousNode,
    current: ExtractedCurrentNode,
    currentEvaluation: Evaluation,
    classification: Classification,
    opponentPreviousEvaluation?: Evaluation
) {
    if (!opponentPreviousEvaluation) return false;
    if (!missableClassifications.includes(classification)) return false;

    const colour = adaptPieceColour(current.playedMove.color);
    const opponentColour = flipPieceColour(colour);

    // Expected points for the player at each step
    const beforeOpponentMove = getSubjectiveExpectedPoints(
        opponentPreviousEvaluation, colour, colour
    );

    const opportunity = getSubjectiveExpectedPoints(
        previous.evaluation, colour, opponentColour
    );

    const result = getSubjectiveExpectedPoints(
        currentEvaluation, colour, colour
    );

    // The opponent must have just made a significant error
    const opponentGift = opportunity - beforeOpponentMove;
    if (opponentGift < 0.1) return false;

    // The error must have given a clearly better position to exploit
    if (opportunity < 0.65) return false;

    // At least half of the gift must have been given back
    if (opportunity - result < opponentGift / 2) return false;

    // Moves that turn the position into a losing one are just mistakes
    return result >= 0.4;
}
