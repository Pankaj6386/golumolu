import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import { color, text } from '../styles/basic'
import global from '../../global'
import { ScaledSheet } from 'react-native-size-matters'
import RBSheet from 'react-native-raw-bottom-sheet'
import { Divider } from 'react-native-elements'

const ReminderForPopup = ({ onClose, isVisible }) => {
    const refRBSheet = useRef()
    const [selectedReminderFor, setSelectedReminderFor] = useState(1)
    const isButtonPress = useRef(false)

    useEffect(() => {
        if (isVisible) {
            isButtonPress.current = false
            refRBSheet.current?.open()
            setSelectedReminderFor(1)
        }
    }, [isVisible])

    const onCloseModal = useCallback(
        (callback) => {
            callback && callback()
            onClose && onClose(isButtonPress.current, selectedReminderFor)
        },
        [onClose, selectedReminderFor]
    )

    const onSelectReminderFor = useCallback((value) => {
        setSelectedReminderFor(value)
    }, [])

    const onPressConfirm = useCallback(() => {
        isButtonPress.current = true
        refRBSheet.current?.close()
    }, [])

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
                    height: 400,
                    paddingBottom: 20,
                },
            }}
            animationType={'slide'}
            onClose={onCloseModal}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            refRBSheet.current?.close()
                        }}
                    >
                        <Image
                            style={styles.CROSSBAG}
                            source={global.ASSETS.CROSSBAG}
                        />
                    </TouchableOpacity>

                    <Text style={styles.setReminderstext}>
                        Create Reminder For
                    </Text>

                    <TouchableOpacity
                        style={styles.checkboxsirsview}
                        onPress={() => {
                            onSelectReminderFor(1)
                        }}
                    >
                        <CircleView isSelected={selectedReminderFor === 1} />

                        <Text style={styles.onemonth}>Me</Text>
                    </TouchableOpacity>

                    <Divider />
                    <TouchableOpacity
                        style={styles.checkboxsirsview}
                        onPress={() => {
                            onSelectReminderFor(2)
                        }}
                    >
                        <CircleView isSelected={selectedReminderFor === 2} />

                        <Text style={styles.onemonth}>Friend(s)</Text>
                    </TouchableOpacity>

                    <Divider />
                    <TouchableOpacity
                        style={styles.checkboxsirsview}
                        onPress={() => {
                            onSelectReminderFor(3)
                        }}
                    >
                        <CircleView isSelected={selectedReminderFor === 3} />
                        <Text style={styles.onemonth}>Phone Contact(s)</Text>
                    </TouchableOpacity>

                    <Divider />

                    <TouchableOpacity
                        onPress={onPressConfirm}
                        style={[styles.BUTTONVIEW1]}
                    >
                        <Text style={styles.BUTTONTEXT1}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </RBSheet>
    )
}
const styles = ScaledSheet.create({
    CROSSBAG: {
        alignSelf: 'flex-end',
        width: 24,
        height: 24,
        marginHorizontal: 16,
        bottom: 2,
        resizeMode: 'contain',
    },
    setReminderstext: {
        textAlign: 'center',
        fontSize: '18@s',
        fontWeight: '700',
        color: '#000000',
        fontFamily: text.FONT_FAMILY.BOLD,
        marginBottom: 30,
    },

    checkboxsirsview: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 55,
        paddingHorizontal: '30@s',
    },

    onemonth: {
        fontSize: '17@s',
        fontWeight: '600',
        color: '#777777',
        marginHorizontal: '10@s',
        width: '90%',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    BUTTONVIEW1: {
        marginTop: '30@s',
        backgroundColor: color.GM_BLUE_DEEP,
        width: '310@s',
        height: '38@s',
        borderRadius: '3@s',
        alignSelf: 'center',
        justifyContent: 'center',
    },

    BUTTONTEXT1: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    circleView: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#B4BFC9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedCircleView: {
        borderColor: color.GM_BLUE_DEEP,
    },

    innerCircleView: {
        backgroundColor: color.GM_BLUE_DEEP,
        height: 10,
        width: 10,
        borderRadius: 10,
    },
})

const CircleView = ({ isSelected }) => {
    return (
        <View
            style={[styles.circleView, isSelected && styles.selectedCircleView]}
        >
            {isSelected && <View style={styles.innerCircleView} />}
        </View>
    )
}

export default ReminderForPopup
