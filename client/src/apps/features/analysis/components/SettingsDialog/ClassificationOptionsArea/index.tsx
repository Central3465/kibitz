import React from "react";
import { useTranslation } from "react-i18next";

import { Classification } from "shared/constants/Classification";
import {
    classificationImages,
    classificationNames
} from "@analysis/constants/classifications";
import useSettingsStore from "@/stores/SettingsStore";
import SwitchSetting from "@/components/settings/SwitchSetting";

import * as styles from "../SettingsDialog.module.css";

type OptionalClassification = "brilliant" | "critical" | "theory" | "miss";

const optionalClassifications: {
    key: OptionalClassification;
    classification: Classification;
    label?: string;
}[] = [
    { key: "brilliant", classification: Classification.BRILLIANT },
    { key: "critical", classification: Classification.CRITICAL },
    { key: "miss", classification: Classification.MISS },
    {
        key: "theory",
        classification: Classification.THEORY,
        label: "settings.classifications.theory"
    }
];

function ClassificationOptionsArea() {
    const { t } = useTranslation("analysis");

    const { settings, setSettings } = useSettingsStore();

    return <>
        <span className={styles.header}>
            {t("settings.classifications.title")}
        </span>

        <div className={styles.setting}>
            <span>{t("settings.classifications.hide")}</span>

            <SwitchSetting
                defaultChecked={settings.analysis.classifications.hide}
                onChange={checked => (
                    setSettings(draft => {
                        draft.analysis.classifications.hide = checked;
                        return draft;
                    })
                )}
            />
        </div>

        {optionalClassifications.map(option => (
            <div className={styles.setting} key={option.key}>
                <div className={styles.subsetting}>
                    <img
                        className={styles.settingIcon}
                        src={classificationImages[option.classification]}
                    />

                    <span>
                        {t(option.label
                            || classificationNames[option.classification]
                        )}
                    </span>
                </div>

                <SwitchSetting
                    defaultChecked={
                        settings.analysis.classifications.included[option.key]
                    }
                    disabled={option.key == "critical"
                        && settings.analysis.engine.lines < 2
                    }
                    onChange={checked => (
                        setSettings(draft => {
                            draft.analysis.classifications
                                .included[option.key] = checked;
                            return draft;
                        })
                    )}
                />
            </div>
        ))}
    </>;
}

export default ClassificationOptionsArea;
