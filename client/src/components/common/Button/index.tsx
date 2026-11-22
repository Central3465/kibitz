import React from "react";

import ButtonProps from "./ButtonProps";
import ButtonColour from "./Colour";
import * as styles from "./Button.module.css";

function Button({
    className,
    style,
    children,
    icon,
    iconSize,
    highlighted,
    tooltipId,
    disabled,
    accent,
    onClick
}: ButtonProps) {
    // Buttons on a coloured background keep white text and icons
    const accentColours: unknown[] = [
        ButtonColour.BLUE, ButtonColour.RED, ButtonColour.GREEN
    ];

    const isAccent = accent || accentColours.includes(style?.backgroundColor);

    return <button
        className={`${styles.button} ${isAccent ? styles.accent : ""} ${
            className || ""
        }`}
        style={{
            filter: disabled
                ? "brightness(0.55)"
                : (highlighted ? "brightness(1.15)" : undefined),
            cursor: disabled ? "default" : undefined,
            ...style
        }}
        disabled={disabled}
        onClick={onClick}
        data-tooltip-id={tooltipId}
        data-accent={isAccent || undefined}
    >
        {icon && <img
            src={icon}
            height={iconSize || "22px"}
        />}

        {children}
    </button>;
}

export default Button;