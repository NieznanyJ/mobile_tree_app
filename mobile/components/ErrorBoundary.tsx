import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: "",
        };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Loguj error na console (w produkcji możesz wysłać do serwisu)
        console.error("ErrorBoundary caught an error:", error);
        console.error("Error Info:", errorInfo);

        // Update state z errorami
        this.setState({
            error,
            errorInfo: errorInfo.componentStack,
        });

        // Opcjonalnie: wyślij error do serwisu logowania
        // logErrorToService(error, errorInfo);
    }

    resetError = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: "",
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <SafeAreaView style={{ flex: 1 }} className="bg-red-50">
                    <View className="flex-1 justify-center items-center p-6">
                        {/* Error Icon */}
                        <View className="mb-6">
                            <MaterialIcons name="error-outline" size={80} color="#dc2626" />
                        </View>

                        {/* Error Title */}
                        <Text className="text-2xl font-bold text-red-900 text-center mb-3">
                            Coś poszło nie tak
                        </Text>

                        {/* Error Message */}
                        <Text className="text-base text-red-700 text-center mb-6">
                            Aplikacja napotkała nieoczekiwany błąd. Spróbuj ponownie.
                        </Text>

                        {/* Error Details (Development Only) */}
                        {__DEV__ && this.state.error && (
                            <ScrollView
                                className="w-full bg-red-100 rounded-lg p-4 mb-6 max-h-40"
                                scrollEnabled
                            >
                                <Text className="text-xs font-mono text-red-900 mb-2">
                                    <Text className="font-bold">Error:</Text>{" "}
                                    {this.state.error.toString()}
                                </Text>
                                {this.state.errorInfo && (
                                    <Text className="text-xs font-mono text-red-900">
                                        <Text className="font-bold">Stack:</Text>
                                        {"\n"}
                                        {this.state.errorInfo}
                                    </Text>
                                )}
                            </ScrollView>
                        )}

                        {/* Reset Button */}
                        <Pressable
                            onPress={this.resetError}
                            className="w-full bg-red-600 active:bg-red-700 rounded-lg py-4 flex-row items-center justify-center gap-2"
                        >
                            <MaterialIcons name="refresh" size={20} color="#fff" />
                            <Text className="text-white font-semibold text-lg">
                                Spróbuj ponownie
                            </Text>
                        </Pressable>

                        {/* Home Button */}
                        <Pressable
                            onPress={() => {
                                this.resetError();
                                // Opcjonalnie: navigate to home
                            }}
                            className="w-full mt-3 bg-gray-600 active:bg-gray-700 rounded-lg py-4 flex-row items-center justify-center gap-2"
                        >
                            <MaterialIcons name="home" size={20} color="#fff" />
                            <Text className="text-white font-semibold text-lg">
                                Wróć na początek
                            </Text>
                        </Pressable>

                        {/* Info Message */}
                        <Text className="text-xs text-gray-600 text-center mt-6">
                            Jeśli problem będzie się powtarzać, spróbuj ponownie zalogować się
                            lub zainstaluj aplikację ponownie.
                        </Text>
                    </View>
                </SafeAreaView>
            );
        }

        return this.props.children;
    }
}
