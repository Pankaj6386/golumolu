import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    SafeAreaView,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    ScrollView,
} from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import { text } from '../styles/basic'

const AboutTextInput = ({ isVisible, onClose, about }) => {
    const refRBSheet = useRef(null)
    const textInputRef = useRef(null)
    const saveButtonClicked = useRef(false)
    const [text, setText] = useState(about || '')

    useEffect(() => {
        setText(about)
    }, [about])

    useEffect(() => {
        if (isVisible) {
            saveButtonClicked.current = false
            refRBSheet.current?.open()
        }
    }, [isVisible])

    const onCloseBottomSheet = useCallback(() => {
        onClose && onClose(text, saveButtonClicked.current)
    }, [onClose, text])

    const onOpen = useCallback(() => {
        setTimeout(() => {
            textInputRef.current?.focus()
        }, 200)
    }, [])

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
                            placeholder={`Tell us about yourself and your past achievements. What’s your story?`}
                            multiline
                            value={text}
                            onChangeText={setText}
                        />
                    </View>

                    <View style={styles.imgess}>
                        <TouchableOpacity
                            onPress={() => {
                                saveButtonClicked.current = false
                                refRBSheet.current.close()
                            }}
                        >
                            <Text style={styles.save}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                saveButtonClicked.current = true
                                refRBSheet.current.close()
                            }}
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
        alignSelf: 'center',
        marginBottom: 10,
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
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
export default AboutTextInput
