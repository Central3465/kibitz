import { StatusCodes } from "http-status-codes";
import { omit } from "lodash-es";

import { AnalysedGame, SerializedAnalysedGame } from "shared/types/game/AnalysedGame";
import { ArchivedGameMetadata, GameArchive } from "shared/types/game/ArchivedGame";
import { deserializeNode, serializeNode } from "shared/types/game/position/StateTreeNode";
import APIResponse from "@/types/APIResponse";

/**
 * Saved games are stored locally in the browser with IndexedDB,
 * so no account or server-side database is required.
 */

const databaseName = "kibitz";
const storeName = "savedGames";

export const maximumArchiveSize = 200;

interface StoredGame {
    id: string;
    savedAt: number;
    game: SerializedAnalysedGame;
}

function openDatabase() {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(databaseName, 1);

        request.onupgradeneeded = () => {
            const database = request.result;

            if (!database.objectStoreNames.contains(storeName)) {
                database.createObjectStore(storeName, { keyPath: "id" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function transact<T>(
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
) {
    const database = await openDatabase();

    return new Promise<T>((resolve, reject) => {
        const transaction = database.transaction(storeName, mode);
        const request = operation(transaction.objectStore(storeName));

        transaction.oncomplete = () => {
            database.close();
            resolve(request.result);
        };

        transaction.onerror = () => {
            database.close();
            reject(transaction.error);
        };
    });
}

function generateId() {
    if (typeof crypto?.randomUUID == "function") {
        return crypto.randomUUID();
    }

    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getMetadata(game: SerializedAnalysedGame): ArchivedGameMetadata {
    return omit(game, ["stateTree", "pgn"]);
}

export async function getArchivedGames(): APIResponse<{ games: GameArchive }> {
    try {
        const storedGames = await transact<StoredGame[]>(
            "readonly", store => store.getAll()
        );

        storedGames.sort((a, b) => b.savedAt - a.savedAt);

        return {
            status: StatusCodes.OK,
            games: Object.fromEntries(storedGames.map(stored => [
                stored.id, getMetadata(stored.game)
            ]))
        };
    } catch {
        return { status: StatusCodes.INTERNAL_SERVER_ERROR };
    }
}

export async function getArchivedGame(
    gameId: string
): APIResponse<{ game: AnalysedGame }> {
    try {
        const stored = await transact<StoredGame | undefined>(
            "readonly", store => store.get(gameId)
        );

        if (!stored) return { status: StatusCodes.NOT_FOUND };

        return {
            status: StatusCodes.OK,
            game: {
                ...stored.game,
                stateTree: deserializeNode(stored.game.stateTree)
            }
        };
    } catch {
        return { status: StatusCodes.INTERNAL_SERVER_ERROR };
    }
}

export async function archiveGame(
    game: AnalysedGame,
    gameId?: string
): APIResponse<{ id: string }> {
    try {
        const existing = gameId
            ? await transact<StoredGame | undefined>(
                "readonly", store => store.get(gameId)
            )
            : undefined;

        if (!existing) {
            const count = await transact<number>(
                "readonly", store => store.count()
            );

            if (count >= maximumArchiveSize) {
                return { status: StatusCodes.INSUFFICIENT_STORAGE };
            }
        }

        const stored: StoredGame = {
            id: existing?.id || generateId(),
            savedAt: Date.now(),
            game: {
                ...game,
                stateTree: serializeNode(game.stateTree)
            }
        };

        await transact("readwrite", store => store.put(stored));

        return { status: StatusCodes.OK, id: stored.id };
    } catch {
        return { status: StatusCodes.INTERNAL_SERVER_ERROR };
    }
}

export async function deleteArchivedGames(
    gameIds: string[]
): APIResponse {
    try {
        const database = await openDatabase();

        await new Promise<void>((resolve, reject) => {
            const transaction = database.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);

            for (const gameId of gameIds) store.delete(gameId);

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });

        database.close();

        return { status: StatusCodes.OK };
    } catch {
        return { status: StatusCodes.INTERNAL_SERVER_ERROR };
    }
}
