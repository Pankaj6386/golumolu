/** @format */

import React, { useCallback, useEffect, useRef } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import { color, text } from '../styles/basic'
import ImagePicker from 'react-native-image-crop-picker'

const MonthlyReminderPopup = ({ isVisible, onClose, onImagesSelected }) => {
    const onCloseBottomSheet = useCallback(() => {
        onClose && onClose()
    }, [onClose])
    const refRBSheet = useRef(null)

    useEffect(() => {
        if (isVisible) {
            refRBSheet.current?.open()
        }
    }, [isVisible])

    const handleImagePicker = useCallback(() => {
        ImagePicker.openPicker({
            multiple: true,
            mediaType: 'any',
        })
            .then((images) => {
                refRBSheet.current?.close()
                onImagesSelected && onImagesSelected(images)
            })
            .catch((error) => {
                console.error('Image in handle gallery', error)
            })
    }, [])
    const handleCamera = () => {
        Alert.alert(
            'Select Media',
            'Would you like to take a picture or record a video?',
            [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Image',
                    onPress: () => {
                        ImagePicker.openCamera({
                            mediaType: 'photo',
                        })
                            .then((images) => {
                                refRBSheet.current?.close()
                                onImagesSelected && onImagesSelected([images])
                            })

                            .catch((error) => {
                                console.error('Image in handle camera', error)
                            })
                    },
                },
                {
                    text: 'Video',
                    onPress: () => {
                        ImagePicker.openCamera({
                            mediaType: 'video',
                        })
                            .then((videos) => {
                                refRBSheet.current?.close()
                                onImagesSelected && onImagesSelected([videos])
                            })

                            .catch((error) => {
                                console.error('Image in handle camera', error)
                            })
                    },
                },
            ]
        )
    }

    return (
        <RBSheet
            ref={(ref) => (refRBSheet.current = ref)}
            closeOnDragDown={true}
            dragFromTopOnly={true}
            closeOnPressMask={true}
            customStyles={{
                container: {
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                    height: 160,
                },
            }}
            animationType={'slide'}
            onClose={onCloseBottomSheet}
        >
            <View style={{ alignItems: 'center', paddingTop: 16 }}>
                <TouchableOpacity
                    onPress={handleCamera}
                    style={styles.buttonStyle}
                >
                    <Text style={styles.imagePickTextStyle}>Open Camera</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity
                    onPress={handleImagePicker}
                    style={styles.buttonStyle}
                >
                    <Text style={styles.imagePickTextStyle}>
                        Select Photo/Video
                    </Text>
                </TouchableOpacity>
            </View>
        </RBSheet>
    )
}
const styles = StyleSheet.create({
    imagePickTextStyle: {
        fontSize: 20,
        fontWeight: '400',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        color: color.GM_BLUE_DEEP,
    },
    buttonStyle: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: color.GM_DOT_GRAY,
        marginVertical: 8,
    },
})
export default MonthlyReminderPopup
