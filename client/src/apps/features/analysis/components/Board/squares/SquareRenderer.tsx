import React, {
    Children,
    ReactNode,
    useContext,
    useEffect,
    forwardRef,
    isValidElement
} from "react";
import {
    CustomSquareProps,
    CustomSquareRenderer
} from "react-chessboard/dist/chessboard/types";
import { Chess, KING, Square } from "chess.js";

import { StateTreeNode } from "shared/types/game/position/StateTreeNode";
import { parseUciMove } from "shared/lib/utils/chess";
import {
    classificationColours,
    classificationImages
} from "@analysis/constants/classifications";

import { SquaresContext } from "./SquaresContext";
import * as styles from "./Square.module.css";

const defaultHighlightColour = "#f7d84a";

function getSquareElements(children: ReactNode) {
    const squareElements = Children.toArray(children);

    const piece = squareElements.find(element => (
        isValidElement(element) && element.props.piece
    ));

    const notations = squareElements.filter(element => (
        isValidElement(element) && element.props.row != undefined
    ));

    return [ piece, ...notations ];
}

function getCheckedKingSquare(fen: string): Square | undefined {
    try {
        const board = new Chess(fen);
        if (!board.inCheck()) return;

        return board.findPiece({ type: KING, color: board.turn() }).at(0);
    } catch {
        return;
    }
}

function createSquareRenderer(
    node: StateTreeNode,
    enableClassifications: boolean
) {
    const playedMove = node.state.move?.uci
        ? parseUciMove(node.state.move.uci)
        : undefined;

    const classification = enableClassifications
        ? node.state.classification
        : undefined;

    const highlightColour = classification
        ? classificationColours[classification]
        : defaultHighlightColour;

    const checkedKingSquare = getCheckedKingSquare(node.state.fen);

    return forwardRef<HTMLDivElement, CustomSquareProps>((
        { children, style, square }, ref
    ) => {
        const squares = useContext(SquaresContext);

        useEffect(() => {
            if (!squares.pieceDropFlag) return;
            squares.setPieceDropFlag(false);
        }, [squares.pieceDropFlag]);

        const [ piece, ...notations ] = getSquareElements(children);

        const isPlayedSquare = square == playedMove?.from
            || square == playedMove?.to;

        return <div ref={ref} style={{ ...style, position: "relative" }}>
            {isPlayedSquare && <div
                className={styles.playedHighlight}
                style={{ backgroundColor: highlightColour }}
            />}

            {square == squares.selected && <div
                className={styles.selectedHighlight}
            />}

            {square == checkedKingSquare && <div
                className={styles.checkHighlight}
            />}

            {squares.highlighted.includes(square)
                && <div className={styles.highlight} />
            }

            {(!squares.pieceDropFlag || square != playedMove?.from)
                && <div className={styles.piece}>{piece}</div>
            }

            {notations}

            {squares.playable.includes(square) && <div
                className={styles.playableMoveCircle}
            />}

            {squares.capturable.includes(square) && <div
                className={styles.capturableMoveCircle}
            />}

            {classification && square == playedMove?.to && <img
                key={node.id}
                src={classificationImages[classification]}
                className={styles.classification}
                draggable={false}
                alt={classification}
            />}
        </div>;
    }) as CustomSquareRenderer;
}

export default createSquareRenderer;
