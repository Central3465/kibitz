import useSettingsStore from "@/stores/SettingsStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useAnalysisProgressStore from "@analysis/stores/AnalysisProgressStore";
import { analyseNode } from "@analysis/lib/reporter";

function useRealtimeAnalyser() {
    const settings = useSettingsStore(state => state.settings.analysis);

    const {
        currentStateTreeNode,
        dispatchCurrentNodeUpdate
    } = useAnalysisBoardStore();

    const setRealtimeClassifyError = useAnalysisProgressStore(
        state => state.setRealtimeClassifyError
    );

    async function considerRealtimeAnalyse() {
        if (!currentStateTreeNode.parent) return;

        // If there is not enough data for a centipawn comparison
        const parentState = currentStateTreeNode.parent.state;

        if (parentState.engineLines.length == 0) {
            if (!currentStateTreeNode.state.classification) return;

            return setRealtimeClassifyError(
                "classifiedMoveCard.insufficientLines"
            );
        }

        const analysedNode = analyseNode(currentStateTreeNode, {
            includeBrilliant: settings.classifications.included.brilliant,
            includeCritical: settings.classifications.included.critical,
            includeTheory: settings.classifications.included.theory,
            includeMiss: settings.classifications.included.miss
        });

        if (!analysedNode?.state.classification)
            return setRealtimeClassifyError("classifiedMoveCard.unknownError");

        setRealtimeClassifyError();
        dispatchCurrentNodeUpdate();
    }

    return considerRealtimeAnalyse;
}

export default useRealtimeAnalyser;
