import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Typography from "@/components/Typography";
import Icon, { IconName } from "@/components/common/Icon";

import * as styles from "./NavigationBar.module.css";

interface NavigationLink {
    url: string;
    icon: IconName;
    label: string;
}

function isActive(url: string) {
    return location.pathname == url
        || location.pathname.startsWith(url + "/");
}

function NavigationBar() {
    const { t } = useTranslation("common");

    const [ drawerOpen, setDrawerOpen ] = useState(false);

    const links: NavigationLink[] = [
        { url: "/analysis", icon: "analysis", label: t("sidebar.analysis") },
        { url: "/archive", icon: "archive", label: t("sidebar.archive") }
    ];

    const secondaryLinks: NavigationLink[] = [
        { url: "/settings", icon: "settings", label: t("settings") },
        { url: "/help", icon: "help", label: t("navigationBar.tooltips.help") }
    ];

    // Close drawer with escape key, lock scrolling while open
    useEffect(() => {
        if (!drawerOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key == "Escape") setDrawerOpen(false);
        };

        document.body.style.overflow = "hidden";
        addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = "";
            removeEventListener("keydown", onKeyDown);
        };
    }, [drawerOpen]);

    return <header className={styles.wrapper}>
        <div className={styles.section}>
            <button
                className={`${styles.iconButton} ${styles.menuButton}`}
                aria-label="Menu"
                onClick={() => setDrawerOpen(true)}
            >
                <Icon name="menu" />
            </button>

            <a href="/analysis" className={styles.brand}>
                <Typography
                    textClassName={styles.brandText}
                    iconStyle={{ height: 30 }}
                    includeIcon
                />
            </a>

            <nav className={styles.links}>
                {links.map(link => <a
                    key={link.url}
                    href={link.url}
                    className={`${styles.link} ${
                        isActive(link.url) ? styles.activeLink : ""
                    }`}
                >
                    <Icon name={link.icon} size={18} />
                    {link.label}
                </a>)}
            </nav>
        </div>

        <div className={styles.section}>
            <a
                href="/help"
                className={`${styles.iconButton} ${styles.desktopOnly}`}
                title={t("navigationBar.tooltips.help")}
            >
                <Icon name="help" />
            </a>

            <a
                href="/settings"
                className={`${styles.iconButton} ${
                    isActive("/settings") ? styles.activeIconButton : ""
                }`}
                title={t("settings")}
            >
                <Icon name="settings" />
            </a>
        </div>

        <div
            className={`${styles.backdrop} ${drawerOpen ? styles.open : ""}`}
            onClick={() => setDrawerOpen(false)}
        />

        <aside
            className={`${styles.drawer} ${drawerOpen ? styles.open : ""}`}
            aria-hidden={!drawerOpen}
        >
            <div className={styles.drawerHeader}>
                <Typography
                    textClassName={styles.brandText}
                    iconStyle={{ height: 30 }}
                    includeIcon
                />

                <button
                    className={styles.iconButton}
                    aria-label="Close menu"
                    onClick={() => setDrawerOpen(false)}
                >
                    <Icon name="close" />
                </button>
            </div>

            <nav className={styles.drawerLinks}>
                {[ ...links, ...secondaryLinks ].map(link => <a
                    key={link.url}
                    href={link.url}
                    className={`${styles.drawerLink} ${
                        isActive(link.url) ? styles.activeLink : ""
                    }`}
                    tabIndex={drawerOpen ? 0 : -1}
                >
                    <Icon name={link.icon} size={20} />
                    {link.label}
                </a>)}
            </nav>
        </aside>
    </header>;
}

export default NavigationBar;
