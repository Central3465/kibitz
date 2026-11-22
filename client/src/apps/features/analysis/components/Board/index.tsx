import React, { useMemo, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Piece, Square } from "react-chessboard/dist/chessboard/types";
import { Chess, Move, PieceSymbol } from "chess.js";

import { defaultRootNode } from "shared/constants/utils";
import { PieceColour } from "shared/constants/PieceColour";
import { isMovePromotion } from "shared/lib/utils/chess";
import useResizeObserver from "@/hooks/useResizeObserver";
import useMediaQuery from "@/hooks/useMediaQuery";
import EvaluationBar from "../EvaluationBar";

import { useSquares } from "./squares/useSquares";
import createSquareRenderer from "./squares/SquareRenderer";
import { SquaresContext } from "./squares/SquaresContext";
import { getMaterialAdvantage, getTurnColour } from "./material";
import PlayerBar from "./PlayerBar";

import BoardProps from "./BoardProps";
import * as styles from "./Board.module.css";

type ClickMove = Pick<Move, "from" | "to">;

// Must match the sizes defined in Board.module.css
const playerBarHeight = 44;
const evaluationBarWidth = 24;
const evaluationBarGap = 8;

function getPieceType(piece: Piece) {
    return piece.at(1)?.toLowerCase() as PieceSymbol;
}

function Board({
    className,
    style,
    whiteProfile,
    blackProfile,
    theme,
    piecesDraggable = true,
    node = defaultRootNode,
    flipped,
    evaluation,
    arrows,
    enableClassifications = true,
    onAddMove
}: BoardProps) {
    const squares = useSquares();

    const squareRenderer = useMemo(() => (
        createSquareRenderer(node, enableClassifications)
    ), [node, enableClassifications]);

    const [ heldPromotion, setHeldPromotion ] = useState<ClickMove>();

    // Fit the largest square board into the available space
    const containerRef = useRef<HTMLDivElement | null>(null);

    const {
        innerWidth: containerWidth,
        innerHeight: containerHeight
    } = useResizeObserver(containerRef, 0);

    const horizontalSpace = containerWidth - (evaluation
        ? evaluationBarWidth + evaluationBarGap : 0
    );

    // On narrow screens the board takes the full width and the page
    // scrolls; on wider screens it must also fit the available height
    const fitHeight = useMediaQuery("(min-width: 901px)");

    const verticalSpace = containerHeight - playerBarHeight * 2;

    const boardWidth = Math.max(
        Math.floor(fitHeight && verticalSpace > 0
            ? Math.min(horizontalSpace, verticalSpace)
            : horizontalSpace
        ),
        120
    );

    // Player bars
    const turnColour = getTurnColour(node.state.fen);

    const topColour = flipped ? PieceColour.WHITE : PieceColour.BLACK;
    const bottomColour = flipped ? PieceColour.BLACK : PieceColour.WHITE;

    const profileOf = (colour: PieceColour) => (
        colour == PieceColour.WHITE ? whiteProfile : blackProfile
    );

    function renderPlayerBar(colour: PieceColour) {
        return <PlayerBar
            profile={profileOf(colour)}
            colour={colour}
            materialAdvantage={getMaterialAdvantage(node.state.fen, colour)}
            toMove={turnColour == colour}
        />;
    }

    function onSquareClick(square: Square, piece?: Piece) {
        squares.setHighlighted([]);

        if (!piece || square == squares.selected) {
            squares.setSelected(undefined);
            squares.clearPlayable();
        } else {
            squares.setSelected(square);
            squares.loadPlayable(node.state.fen, square);
        }

        if (!squares.selected) return;
        if (
            !squares.playable.includes(square)
            && !squares.capturable.includes(square)
        ) return;

        const selectedPiece = new Chess(node.state.fen)
            .get(squares.selected);

        if (selectedPiece && isMovePromotion(selectedPiece.type, square)) {
            setHeldPromotion({
                from: squares.selected,
                to: square
            });

            return;
        }

        squares.setSelected(undefined);
        squares.clearPlayable();

        addMove(squares.selected, square);
    }

    function onPromotionPieceSelect(
        piece?: Piece, from?: Square, to?: Square
    ) {
        setHeldPromotion(undefined);
        squares.setSelected(undefined);
        squares.clearPlayable();

        if (!piece || !to) return false;

        const fromSquare = heldPromotion?.from || from;
        if (!fromSquare) return false;

        return addMove(fromSquare, to, getPieceType(piece));
    }

    function addMove(
        from: Square, to: Square, promotion?: PieceSymbol,
        drop?: boolean
    ) {
        try {
            const move = new Chess(node.state.fen)
                .move({ from, to, promotion });

            squares.setPieceDropFlag(drop || false);

            return onAddMove?.(move) || true;
        } catch {
            return false;
        }
    }

    return <div
        className={`${styles.wrapper} ${className || ""}`}
        style={style}
        ref={containerRef}
    >
        <div
            className={styles.boardColumn}
            style={{
                width: boardWidth + (evaluation
                    ? evaluationBarWidth + evaluationBarGap : 0
                )
            }}
        >
            <div className={styles.playerRow} style={{
                paddingLeft: evaluation
                    ? evaluationBarWidth + evaluationBarGap : 0
            }}>
                {renderPlayerBar(topColour)}
            </div>

            <div className={styles.boardRow}>
                {evaluation && <EvaluationBar
                    className={styles.evaluationBar}
                    style={{ height: boardWidth }}
                    evaluation={evaluation}
                    moveColour={node.state.moveColour}
                    flipped={flipped}
                />}

                <div
                    className={styles.board}
                    style={{ width: boardWidth, height: boardWidth }}
                >
                    <SquaresContext.Provider value={squares}>
                        <Chessboard
                            position={node.state.fen}
                            boardOrientation={flipped ? "black" : "white"}
                            onSquareClick={onSquareClick}
                            onSquareRightClick={squares.toggleHighlight}
                            onPieceDragBegin={(piece, square) => {
                                squares.setSelected(square);
                                squares.loadPlayable(node.state.fen, square);
                            }}
                            onPieceDrop={(from, to, piece) => {
                                squares.setSelected(undefined);
                                squares.clearPlayable();

                                return addMove(
                                    from, to, getPieceType(piece), true
                                );
                            }}
                            onPromotionPieceSelect={onPromotionPieceSelect}
                            customSquare={squareRenderer}
                            customArrows={arrows}
                            customArrowColor="rgba(255, 170, 0, 0.85)"
                            arePiecesDraggable={piecesDraggable}
                            customNotationStyle={{
                                fontSize: `${Math.max(9, boardWidth / 48)}px`,
                                fontWeight: "600"
                            }}
                            customLightSquareStyle={theme?.lightSquareColour
                                ? { backgroundColor: theme.lightSquareColour }
                                : undefined
                            }
                            customDarkSquareStyle={theme?.darkSquareColour
                                ? { backgroundColor: theme.darkSquareColour }
                                : undefined
                            }
                            customDropSquareStyle={{
                                boxShadow: "inset 0 0 0 4px rgba(255, 255, 255, 0.6)"
                            }}
                            animationDuration={180}
                            showPromotionDialog={!!heldPromotion}
                            promotionToSquare={heldPromotion?.to}
                            promotionDialogVariant="vertical"
                            boardWidth={boardWidth}
                        />
                    </SquaresContext.Provider>
                </div>
            </div>

            <div className={styles.playerRow} style={{
                paddingLeft: evaluation
                    ? evaluationBarWidth + evaluationBarGap : 0
            }}>
                {renderPlayerBar(bottomColour)}
            </div>
        </div>
    </div>;
}

export default Board;
