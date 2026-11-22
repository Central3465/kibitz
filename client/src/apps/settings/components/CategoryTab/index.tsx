import React from "react";

import CategoryTabProps from "./CategoryTabProps";
import * as styles from "./CategoryTab.module.css";

function CategoryTab({
    children,
    className,
    style,
    active,
    onClick
}: CategoryTabProps) {
    return <div
        className={`${styles.wrapper} ${active ? styles.active : ""} ${
            className || ""
        }`}
        style={style}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={event => {
            if (event.key == "Enter") onClick?.();
        }}
    >
        {children}
    </div>;
}

export default CategoryTab;