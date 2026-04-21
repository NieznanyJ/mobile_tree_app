import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View } from "react-native";

import WidgetsModal from "../modals/WidgetsModal";


const Header = ({
    onPress,
    icon,
    pathname,
}: {
    isGuest: boolean;
    username: string;
    onPress: () => void;
    icon: React.ReactNode;
    pathname: string;
}) => {
    const [widgetsModalVisible, setWidgetsModalVisible] = useState(false);

    const isStartRoute = pathname === "/";
    return (
        <View className={`w-full p-2 pt-16 flex-row items-center  bg-background` + (isStartRoute ? " justify-between" : " justify-end")}>
            {pathname === "/" && (
                <Pressable className="bg-secondary p-2 rounded-full" onPress={() => setWidgetsModalVisible(true)} >
                    <MaterialIcons name="widgets" size={24} color="#fff" />
                </Pressable>
            )}

            <Pressable onPress={() => onPress()}>{icon}</Pressable>

            <WidgetsModal
                visible={widgetsModalVisible}
                onClose={() => setWidgetsModalVisible(false)}
            />
        </View>
    );
};

export default Header;