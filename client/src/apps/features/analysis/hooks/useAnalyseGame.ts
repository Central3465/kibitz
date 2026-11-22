import { useTranslation } from "react-i18next";

import { findNodeRecursively } from "shared/types/game/position/StateTreeNode";
import AnalysisStatus from "@analysis/constants/AnalysisStatus";
import useSettingsStore from "@/stores/SettingsStore";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useAnalysisProgressStore from "@analysis/stores/AnalysisProgressStore";
import { analyseStateTree } from "@analysis/lib/reporter";

function useAnalyseGame(
    onAnalysisError?: (message: string) => void
) {
    const { t } = useTranslation("analysis");

    const settings = useSettingsStore(state => state.settings.analysis);

    const setCurrentStateTreeNode = useAnalysisBoardStore(
        state => state.setCurrentStateTreeNode
    );

    const setAnalysisStatus = useAnalysisProgressStore(
        state => state.setAnalysisStatus
    );

    return async () => {
        const { analysisGame, setAnalysisGame } = useAnalysisGameStore.getState();

        const gameAnalysis = await analyseStateTree(analysisGame.stateTree, {
            includeBrilliant: settings.classifications.included.brilliant,
            includeCritical: settings.classifications.included.critical,
            includeTheory: settings.classifications.included.theory,
            includeMiss: settings.classifications.included.miss
        });

        if (!gameAnalysis) {
            setAnalysisStatus(AnalysisStatus.INACTIVE);
            return onAnalysisError?.(t("progressReporter.reportFailed"));
        }

        // Update analysed game with new analysis object
        setAnalysisGame({
            ...analysisGame,
            ...gameAnalysis
        });

        // Set current state tree node to equivalent in new tree
        setCurrentStateTreeNode(prev => findNodeRecursively(
            gameAnalysis.stateTree,
            node => node.id == prev.id
        ) || prev);

        setAnalysisStatus(AnalysisStatus.INACTIVE);
    };
}

export default useAnalyseGame;
