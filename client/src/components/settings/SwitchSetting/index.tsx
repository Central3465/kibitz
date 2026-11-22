import React, { useState } from "react";
import Switch from "react-switch";

import useThemeStore from "@/stores/ThemeStore";

import SwitchSettingProps from "./SwitchSettingProps";

function SwitchSetting({
    defaultChecked,
    disabled,
    onChange
}: SwitchSettingProps) {
    const [ checked, setChecked ] = useState(defaultChecked);

    const theme = useThemeStore(state => state.theme);

    return <Switch
        checked={checked}
        onChange={newChecked => {
            setChecked(newChecked);
            onChange(newChecked);
        }}
        height={25}
        onColor={theme == "light" ? "#2f6fe4" : "#4c8dff"}
        offColor={theme == "light" ? "#c9ced8" : "#353c47"}
        uncheckedIcon={false}
        checkedIcon={false}
        disabled={disabled}
    />;
}

export default SwitchSetting;