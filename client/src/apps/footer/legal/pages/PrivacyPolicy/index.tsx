import React from "react";

import Separator from "@/components/common/Separator";

import * as styles from "../../index.module.css";

import iconLogo from "@assets/img/logo.svg";

function PrivacyPolicy() {
    return <div className={styles.wrapper}>
        <div className={styles.content}>
            <h1 className={styles.title}>
                <img
                    src={iconLogo}
                    height={45}
                    draggable={false}
                />

                Privacy Policy
            </h1>

            <Separator/>

            <h2 style={{ margin: 0 }}>
                1. Summary
            </h2>

            <span>
                WintrChess does not have user accounts, does not show advertisements and does
                not use analytics or tracking cookies. Everything you do on the Website, including
                engine analysis and move classification, happens inside your own browser.
            </span>

            <h2 style={{ margin: 0 }}>
                2. Data stored on your device
            </h2>

            <span>
                2.1 Your settings (board theme, engine options, language etc.) are kept in your
                browser's local storage.
            </span>

            <span>
                2.2 Games that you save are kept in your browser's IndexedDB storage. They never
                leave your device unless you share them yourself, for example by copying a PGN.
            </span>

            <span>
                2.3 You can remove all of this data at any time by clearing your browser's site
                data for this Website. Saved games can also be deleted individually from the
                Saved Games page.
            </span>

            <h2 style={{ margin: 0 }}>
                3. Third-party services
            </h2>

            <span>
                3.1 When you search for games on a Chess.com or Lichess account, the username you
                enter is sent directly from your browser to the respective service. Their privacy
                policies apply to those requests.
            </span>

            <span>
                3.2 When cloud evaluations are available, positions from the game you analyse may
                be sent to the Lichess cloud evaluation API to speed up analysis.
            </span>

            <h2 style={{ margin: 0 }}>
                4. Server logs
            </h2>

            <span>
                The server that hosts the Website only serves static files. Like any web server,
                the hosting provider may keep standard access logs (such as IP addresses and
                requested URLs) for operational purposes.
            </span>
        </div>
    </div>;
}

export default PrivacyPolicy;
