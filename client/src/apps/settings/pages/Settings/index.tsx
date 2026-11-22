import React, { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import LoadingPlaceholder from "@/components/layout/LoadingPlaceholder";
import CategoryTab from "@/apps/settings/components/CategoryTab";

import * as styles from "./Settings.module.css";

function Settings() {
    const { t } = useTranslation(["settings", "common", "helpCenter"]);

    const navigate = useNavigate();
    const location = useLocation();

    const categories = [
        { path: "/settings/appearance", label: t("theme.title", { ns: "common" }) },
        { path: "/settings/theme", label: t("boardAndPieces.title") },
        { path: "/settings/bugs", label: t("bugReporting.title") }
    ];

    return <div className={styles.wrapper}>
        <h1 className={styles.title}>
            {t("settings", { ns: "common" })}
        </h1>

        <div className={styles.settingsContainer}>
            <nav className={styles.categories}>
                {categories.map(category => <CategoryTab
                    key={category.path}
                    active={location.pathname.includes(category.path)}
                    onClick={() => navigate(category.path)}
                >
                    {category.label}
                </CategoryTab>)}

                <CategoryTab onClick={() => {
                    window.location.href = "/help";
                }}>
                    {t("title", { ns: "helpCenter" })}
                </CategoryTab>
            </nav>

            <div className={styles.settings}>
                <Suspense fallback={<LoadingPlaceholder/>}>
                    <Outlet/>
                </Suspense>
            </div>
        </div>
    </div>;
}

export default Settings;
