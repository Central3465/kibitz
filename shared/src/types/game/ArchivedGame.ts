import AnalysedGame from "./AnalysedGame";

export type ArchivedGameMetadata = (
    Omit<AnalysedGame, "stateTree" | "pgn">
);

export type GameArchive = Record<string, ArchivedGameMetadata>;
