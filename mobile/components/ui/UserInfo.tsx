import React from "react";
import { Text, View } from "react-native";

interface User {
    username: string;
    email: string;
}

interface UserInfoProps {
    user: User;
}

export const UserInfo = ({ user }: UserInfoProps) => {
    console.log("Rendering UserInfo with user:", user);
    return (
        <View className="w-full bg-background rounded-lg p-6 shadow-md">
            <View className="mb-4">
                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Nazwa użytkownika
                </Text>
                <Text className="text-lg font-semibold text-textPrimary">
                    {user.username}
                </Text>
            </View>

            <View className="mb-4">
                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Email
                </Text>
                <Text className="text-lg font-semibold text-textPrimary">
                    {user.email}
                </Text>
            </View>

            <View className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Status konta
                </Text>
                <View className="flex-row items-center gap-2">
                    <View className="w-2 h-2 rounded-full bg-green-500" />
                    <Text className="text-lg font-semibold text-green-600">
                        Aktywne
                    </Text>
                </View>
            </View>
        </View>
    );
};
