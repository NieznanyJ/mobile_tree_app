import { Link, useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import { IMAGES } from "@/constants/images";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 flex-col justify-between items-center bg-background ">
      <View className="size-[500px] bg-secondary absolute rounded-full z-0 top-[-30%] "></View>

      <View className="flex flex-col items-center gap-10">
        <View className="flex flex-col items-center justify-center relative">
          <Image
            source={IMAGES.tree}
            resizeMethod="resize"
            className="relative size-[20em] top-[10%] z-0"
          ></Image>
          <Text className="text-3xl  text-secondary absolute bottom-0 font-bold">
            SMART TREE
          </Text>
        </View>
        <Text className="text-2xl font-bold text-secondary text-center ">
          Aplikacja do rozpoznawania drzew
        </Text>
      </View>
      <View className=" flex-col justify-center items-center gap-4  w-full  ">
        <Button
          title="Kontynuuj jako gość"
          onPress={() => router.push("/(tabs)")}
        ></Button>
        <Button
          title="Zaloguj się"
          onPress={() => router.push("/(auth)/login")}
        ></Button>

        <Text className="mt-10 text-xl text-textPrimary text-center ">
          Nie masz konta?{" "}
          <Link href="/(auth)/register" className="text-secondary font-bold">
            Zarejestruj się
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}
