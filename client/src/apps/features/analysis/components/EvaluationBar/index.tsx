import React, { useMemo } from "react";
import { clamp } from "lodash-es";

import PieceColour from "shared/constants/PieceColour";
import { stringifyEvaluation } from "shared/lib/utils/chess";
import { getExpectedPoints } from "shared/lib/reporter/expectedPoints";

import EvaluationBarProps from "./EvaluationBarProps";
import * as styles from "./EvaluationBar.module.css";

function EvaluationBar({
    className,
    style,
    evaluation,
    moveColour,
    flipped = false
}: EvaluationBarProps) {
    const evaluationText = useMemo(() => (
        stringifyEvaluation({
            ...evaluation,
            value: Math.abs(evaluation.value)
        }, false, 1)
    ), [evaluation]);

    // Percentage of the bar filled by White
    const whiteShare = useMemo(() => {
        const points = getExpectedPoints(evaluation, {
            moveColour: moveColour || PieceColour.WHITE
        });

        return evaluation.type == "mate"
            ? points * 100
            : clamp(points * 100, 4, 96);
    }, [evaluation, moveColour]);

    const whiteWinning = whiteShare >= 50;

    return <div
        className={`${styles.evaluationBar} ${className || ""}`}
        style={style}
        title={evaluationText}
    >
        <div
            className={styles.whiteFill}
            style={{
                height: `${whiteShare}%`,
                [flipped ? "top" : "bottom"]: 0
            }}
        />

        <span
            className={styles.evaluationText}
            style={{
                [(whiteWinning != flipped) ? "bottom" : "top"]: "6px",
                color: whiteWinning ? "#1a1a1a" : "#f2f2f2"
            }}
        >
            {evaluationText}
        </span>
    </div>;
}

export default EvaluationBar;
