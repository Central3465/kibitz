import React from "react";

import PlayerProfile from "shared/types/game/PlayerProfile";
import { PieceColour } from "shared/constants/PieceColour";

import * as styles from "./Board.module.css";

import iconDefaultProfileImage from "@assets/img/defaultprofileimage.png";

interface PlayerBarProps {
    profile?: PlayerProfile;
    colour: PieceColour;
    materialAdvantage: number;
    toMove: boolean;
}

function PlayerBar({
    profile,
    colour,
    materialAdvantage,
    toMove
}: PlayerBarProps) {
    const defaultName = colour == PieceColour.WHITE ? "White" : "Black";

    return <div className={styles.playerBar}>
        <div className={styles.playerAvatar} data-colour={colour}>
            {profile?.image && <img
                src={profile.image}
                alt=""
                onError={event => {
                    event.currentTarget.src = iconDefaultProfileImage;
                }}
            />}
        </div>

        <div className={styles.playerDetails}>
            {profile?.title && <span className={styles.playerTitle}>
                {profile.title}
            </span>}

            <span className={styles.playerName}>
                {profile?.username || defaultName}
            </span>

            {profile?.rating != undefined && <span
                className={styles.playerRating}
            >
                {profile.rating}
            </span>}

            {materialAdvantage > 0 && <span className={styles.material}>
                +{materialAdvantage}
            </span>}
        </div>

        <div
            className={`${styles.turnIndicator} ${toMove ? styles.toMove : ""}`}
            data-colour={colour}
            title={toMove ? `${defaultName} to move` : undefined}
        />
    </div>;
}

export default PlayerBar;
