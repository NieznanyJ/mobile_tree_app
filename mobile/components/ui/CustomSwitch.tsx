import React from "react";
import { Switch } from "react-native";

import { useSettingsStore } from "@/lib/store/settingsStore";

interface CustomSwitchProps {
    widgetId: string;
}

const CustomSwitch = ({ widgetId }: CustomSwitchProps) => {
    const { activeWidgets, toggleWidget } = useSettingsStore();

    return (
        <Switch
            trackColor={{ false: "#767577", true: "#5CE7A0" }}
            thumbColor={activeWidgets[widgetId] ? "#5CE7A0" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleWidget(widgetId)}
            value={activeWidgets[widgetId] ?? false}
        />
    );
};

export default CustomSwitch;