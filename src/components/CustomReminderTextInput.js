import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    SafeAreaView,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Text,
    ScrollView,
} from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import { Divider } from 'react-native-elements'
import global from '../../global'
import { text } from '../styles/basic'

const CustomReminderTextInput = ({
    isVisible,
    onClose,
    onPressEmoji,
    onPressImage,
    onPressVoice,
    message,
}) => {
    const refRBSheet = useRef(null)
    const textInputRef = useRef(null)
    const [text, setText] = useState(message || '')

    useEffect(() => {
        setText(message)
    }, [message])

    useEffect(() => {
        if (isVisible) {
            refRBSheet.current?.open()
        }
    }, [isVisible])

    const onCloseBottomSheet = useCallback(() => {
        onClose && onClose(text)
    }, [onClose, text])

    const onOpen = useCallback(() => {
        setTimeout(() => {
            textInputRef.current?.focus()
        }, 200)
    }, [])

    const onPressEmojiButton = useCallback(() => {
        refRBSheet.current?.close()
        onPressEmoji && onPressEmoji()
    }, [onPressEmoji])

    const onPressImageButton = useCallback(() => {
        refRBSheet.current?.close()
        onPressImage && onPressImage()
    }, [onPressImage])

    const onPressVoiceButton = useCallback(() => {
        refRBSheet.current?.close()
        onPressVoice && onPressVoice()
    }, [onPressVoice])

    return (
        <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
                container: {
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    height: '80%',
                },
            }}
            onClose={onCloseBottomSheet}
            onOpen={onOpen}
            animationType="slide"
            dragFromTopOnly={true}
        >
            <SafeAreaView style={styles.safeAreaView}>
                <ScrollView
                    contentContainerStyle={styles.contentContainerStyle}
                    keyboardShouldPersistTaps={'handled'}
                    keyboardDismissMode={'none'}
                    bounces={false}
                >
                    <View style={styles.inputview}>
                        <TextInput
                            ref={(inputRef) => {
                                textInputRef.current = inputRef
                            }}
                            style={styles.Optional}
                            placeholder="(Optional) Insert text, video, or voice clip"
                            multiline
                            value={text}
                            onChangeText={setText}
                        />
                    </View>

                    <View style={styles.imgess}>
                        <Divider />

                        <View style={styles.iconview}>
                            <TouchableOpacity onPress={onPressEmojiButton}>
                                <Image
                                    style={styles.mouth}
                                    source={global.ASSETS.EMOJI}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onPressImageButton}>
                                <Image
                                    style={styles.pic}
                                    source={global.ASSETS.PICK_IMAGE}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={onPressVoiceButton}>
                                <Image
                                    style={styles.voice}
                                    source={global.ASSETS.VOICE}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={() => refRBSheet.current.close()}
                        >
                            <Text style={styles.save}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </RBSheet>
    )
}
const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
    contentContainerStyle: {
        flexGrow: 1,
    },
    inputview: {
        marginHorizontal: 20,
        flex: 1,
    },
    imgess: {
        flexDirection: 'row',
        marginHorizontal: 20,
        alignSelf: 'center',
        marginBottom: 10,
    },
    Optional: {
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        flex: 1,
        textAlignVertical: 'top',
    },
    mouth: {
        width: 23,
        height: 21,
    },
    pic: {
        width: 21,
        height: 18,
        marginHorizontal: 15,
    },
    voice: {
        width: 18.2,
        height: 22,
        // marginHorizontal: 5,
    },
    save: {
        fontSize: 19,
        fontWeight: '500',
        color: '#42C0F5',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },

    iconview: {
        flexDirection: 'row',
        width: 300,
    },
})
export default CustomReminderTextInput
