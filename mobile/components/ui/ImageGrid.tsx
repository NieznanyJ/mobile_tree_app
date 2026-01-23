import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { ImageAsset } from '@/lib/store/assetsStore'

const EmptyImage = ({ index }: { index: number }) => {
    return (
        <View className='flex items-center justify-center w-full h-full bg-gray-200 rounded-lg'>
            <Text className='text-center text-gray-400'>{index + 1}</Text>
        </View>
    )
}

const ImageGrid = ({ images }: { images: ImageAsset[] }) => {
    const GRID_SIZE = 2 // 2x2 grid
    const TOTAL_SLOTS = GRID_SIZE * GRID_SIZE // 16 slotów

    const checkImageExists = (image: ImageAsset | undefined) => {
        return image && image.uri
    }

    const renderImageItem = (image: ImageAsset | undefined, index: number) => {
        return (
            <View key={index} className='flex-1 rounded-lg' style={{ width: '50%', height: '100%' }}>
                {!checkImageExists(image) ? (
                    <EmptyImage index={index} />
                ) : (
                    <Image
                        source={{ uri: image?.uri }}
                        className='w-full h-full rounded-lg'
                        resizeMode="cover"
                    />
                )}
            </View>
        )
    }

    const renderRows = () => {
        const rows = []
        const paddedImages = [...images]

        // Uzupełnij do 16 slotów
        while (paddedImages.length < TOTAL_SLOTS) {
            paddedImages.push(undefined as any)
        }

        for (let i = 0; i < TOTAL_SLOTS; i += GRID_SIZE) {
            rows.push(
                <View
                    key={`row-${i}`}
                    className='flex-1 flex-row items-center justify-between gap-2 w-full'
                    style={{ height: '50%' }}
                >
                    {paddedImages.slice(i, i + GRID_SIZE).map((image, colIndex) =>
                        renderImageItem(image, i + colIndex)
                    )}
                </View>
            )
        }

        return rows
    }

    return (
        <View className='w-full h-full flex flex-col items-center justify-between gap-2'>
            {renderRows()}
        </View>
    )
}

export default ImageGrid

const styles = StyleSheet.create({})