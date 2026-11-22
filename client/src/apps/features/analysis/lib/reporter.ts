import AnalysisOptions from "shared/lib/reporter/types/AnalysisOptions";
import { GameAnalysis } from "shared/types/game/GameAnalysis";
import { getGameAnalysis, analyseNode as analyseSingleNode } from "shared/lib/reporter/report";
import {
    StateTreeNode,
    serializeNode,
    deserializeNode
} from "shared/types/game/position/StateTreeNode";

/**
 * @description Classifies every move in a state tree. Runs entirely in the
 * browser. Returns a new tree; the given tree is not modified.
 */
export async function analyseStateTree(
    rootNode: StateTreeNode,
    options?: AnalysisOptions
): Promise<GameAnalysis | undefined> {
    // Yield to the browser so that progress UI can render first
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
        const stateTree = deserializeNode(serializeNode(rootNode), rootNode);

        return getGameAnalysis(stateTree, options);
    } catch (err) {
        console.error(err);
    }
}

/**
 * @description Classifies a single node in place, using the engine
 * lines already held by it and its parent.
 */
export function analyseNode(
    node: StateTreeNode,
    options?: AnalysisOptions
) {
    if (!node.parent) return;

    try {
        return analyseSingleNode(node, options);
    } catch (err) {
        console.error(err);
    }
}
