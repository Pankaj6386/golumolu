import React, { useCallback } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import successCloseIcon from '../../assets/successCloseIcon.png'
import { text } from '../styles/basic'

const ReminderSuccessView = ({ onClose, message }) => {
    const onPressClose = useCallback(() => {
        onClose && onClose()
    }, [onClose])

    return (
        <View style={styles.mainView}>
            <Text style={styles.textView}>
                {message || `Reminder(s) Saved.`}
            </Text>
            <TouchableOpacity onPress={onPressClose}>
                <Image style={styles.imageStyle} source={successCloseIcon} />
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    mainView: {
        top: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        height: 60,
        padding: 16,
        zIndex: 9999,
        backgroundColor: '#F5980C',
        flexDirection: 'row',
    },
    textView: {
        fontSize: 16,
        color: '#fff',
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontWeight: '500',
        marginRight: 16,
        flex: 1,
    },
    imageStyle: {
        height: 16,
        width: 16,
        resizeMode: 'contain',
    },
})
export default ReminderSuccessView
