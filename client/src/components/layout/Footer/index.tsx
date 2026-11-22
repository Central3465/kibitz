import React, { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

import Dialog from "@/components/common/Dialog";
import LoadingPlaceholder from "../LoadingPlaceholder";

import FooterProps from "./FooterProps";
import * as styles from "./Footer.module.css";

const LanguagesDialog = lazy(() => import(
    "@/components/settings/LanguagesDialog"
));

function LoadingDialog() {
    return <Dialog>
        <LoadingPlaceholder/>
    </Dialog>;
}

function Footer({ className, style }: FooterProps) {
    const { t } = useTranslation(["common", "helpCenter"]);

    const [ languagesOpen, setLanguagesOpen ] = useState(false);

    return <footer
        className={`${styles.wrapper} ${className || ""}`}
        style={style}
    >
        <span className={styles.brand}>
            WintrChess
        </span>

        <nav className={styles.links}>
            <a href="/help">
                {t("title", { ns: "helpCenter" })}
            </a>

            <button
                className={styles.linkButton}
                onClick={() => setLanguagesOpen(true)}
            >
                {t("footer.language")}
            </button>

            <a href="/terms">
                {t("footer.termsOfService")}
            </a>

            <a href="/privacy">
                {t("footer.privacyPolicy")}
            </a>

            <a href="https://github.com/WintrCat/wintrchess" target="_blank">
                {t("footer.openSource")}
            </a>
        </nav>

        <Suspense fallback={<LoadingDialog/>}>
            {languagesOpen && <LanguagesDialog
                onClose={() => setLanguagesOpen(false)}
            />}
        </Suspense>
    </footer>;
}

export default Footer;
