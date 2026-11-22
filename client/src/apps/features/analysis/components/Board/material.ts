import { PieceColour } from "shared/constants/PieceColour";

const pieceValues: Record<string, number> = {
    p: 1, n: 3, b: 3, r: 5, q: 9, k: 0
};

/**
 * @description Returns the material balance of a position in pawns,
 * from White's perspective.
 */
export function getMaterialBalance(fen: string) {
    const placement = fen.split(" ")[0] || "";

    let balance = 0;

    for (const character of placement) {
        const value = pieceValues[character.toLowerCase()];
        if (value == undefined) continue;

        balance += character == character.toUpperCase() ? value : -value;
    }

    return balance;
}

export function getMaterialAdvantage(fen: string, colour: PieceColour) {
    const balance = getMaterialBalance(fen);

    return colour == PieceColour.WHITE ? balance : -balance;
}

export function getTurnColour(fen: string) {
    return fen.split(" ")[1] == "b" ? PieceColour.BLACK : PieceColour.WHITE;
}
