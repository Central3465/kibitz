import React from "react";
import { useTranslation } from "react-i18next";

import useThemeStore, { ThemePreference } from "@/stores/ThemeStore";
import Icon, { IconName } from "@/components/common/Icon";

import * as categoryStyles from "../Category.module.css";
import * as styles from "./Appearance.module.css";

const options: { value: ThemePreference; icon?: IconName }[] = [
    { value: "system" },
    { value: "light", icon: "sun" },
    { value: "dark", icon: "moon" }
];

function Appearance() {
    const { t } = useTranslation("common");

    const { preference, setPreference } = useThemeStore();

    return <div className={categoryStyles.wrapper}>
        <b className={categoryStyles.header}>
            {t("theme.title")}
        </b>

        <span className={styles.description}>
            {t("theme.description")}
        </span>

        <div className={styles.options} role="radiogroup">
            {options.map(option => <button
                key={option.value}
                className={`${styles.option} ${
                    preference == option.value ? styles.selected : ""
                }`}
                role="radio"
                aria-checked={preference == option.value}
                onClick={() => setPreference(option.value)}
            >
                <div
                    className={styles.preview}
                    data-preview={option.value}
                >
                    <div className={styles.previewBar} />
                    <div className={styles.previewCard} />
                </div>

                <span className={styles.label}>
                    {option.icon && <Icon name={option.icon} size={16} />}
                    {t(`theme.${option.value}`)}
                </span>
            </button>)}
        </div>
    </div>;
}

export default Appearance;
