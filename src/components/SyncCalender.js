/** @format */

import React from 'react'
import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking,
} from 'react-native'
import { Overlay } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { color, text } from '../styles/basic'

const SyncCalender = ({ isVisible, onClose, calendar }) => {
    return (
        <Overlay
            visible={isVisible}
            onBackdropPress={onClose}
            overlayStyle={{
                borderRadius: 10,
                backgroundColor: '#fff',
                width: 250,
                height: 250,
            }}
        >
            <View>
                <Ionicons
                    onPress={onClose}
                    name="close"
                    size={25}
                    style={styles.closeIconStyle}
                />
                <View style={styles.modalContainer}>
                    {calendar ? (
                        <Text style={styles.modalText}>Default Calendar:</Text>
                    ) : (
                        <Text style={styles.modalText}>Sync Reminders to:</Text>
                    )}
                </View>
                <TouchableOpacity style={styles.buttonStyle}>
                    <Text style={styles.buttonTextStyle}>iCalendar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        // this.setState({ visible: false })
                        // Linking.openURL(
                        //     'content://com.android.calendar/time/'
                        // )
                    }}
                    style={styles.buttonStyle}
                >
                    <Text style={styles.buttonTextStyle}>Google Calendar</Text>
                </TouchableOpacity>
            </View>
        </Overlay>
    )
}
const styles = StyleSheet.create({
    buttonStyle: {
        width: 230,
        height: 46,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    buttonTextStyle: {
        color: color.GM_BLUE_DEEP,
        fontSize: 18,
        fontWeight: '500',
        fontFamily: text.FONT_FAMILY.BOLD,
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 10,
    },
    closeIconStyle: {
        alignSelf: 'flex-end',
    },
    modalText: {
        fontSize: 16,
        fontWeight: '600',
        alignSelf: 'center',
        marginBottom: 24,
    },
})
export default SyncCalender
