import * as React from "react";
import { Dimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
    ICarouselInstance,
    Pagination,
} from "react-native-reanimated-carousel";


const width = Dimensions.get("window").width - 16;
const MAX_FACTS = 6;

const shuffleArray = (array: React.ReactNode[]) => {
    return [...array].sort(() => Math.random() - 0.5);
};

function CarouselComponent({ content }: { content: React.ReactNode[] }) {
    const ref = React.useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);

    const shuffledContent = React.useMemo(
        () => shuffleArray(content).slice(0, MAX_FACTS),
        [content]
    );

    const data = shuffledContent.map((_, index) => index);

    const onPressPagination = (index: number) => {
        ref.current?.scrollTo({
            count: index - progress.value,
            animated: true,
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <Carousel
                ref={ref}
                width={width}
                height={width / 4}
                data={data}
                autoPlay
                autoPlayInterval={7000}
                onProgressChange={progress}
                renderItem={({ index }) => (
                    <>{shuffledContent[index]}</>
                )}
            />

            <Pagination.Basic
                progress={progress}
                data={data}
                activeDotStyle={{
                    backgroundColor: '#00964A'
                }}
                dotStyle={{
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: 50,
                }}
                containerStyle={{ gap: 5, marginTop: 10 }}
                onPress={onPressPagination}
            />
        </View>
    );
}

export default CarouselComponent;
