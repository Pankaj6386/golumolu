import React, { useCallback } from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native'
import { color, text } from '../styles/basic'
import global from '../../global'
import { useDispatch, useSelector } from 'react-redux'
import { updateNotificationData } from '../actions/ReminderActions'

const ReminderNotificationView = () => {
    const { notifications } = useSelector((state) => state?.reminderForm)
    const dispatch = useDispatch()

    const onUpdateNotification = useCallback(
        (data) => {
            dispatch(updateNotificationData(data))
        },
        [dispatch]
    )

    return (
        <View>
            <View style={styles.bellallview}>
                <TouchableOpacity
                    onPress={() => {
                        onUpdateNotification({
                            push_notification: !notifications?.push_notification,
                        })
                    }}
                    style={[
                        styles.imgbag,
                        {
                            backgroundColor: notifications?.push_notification
                                ? color.GM_BLUE_DEEP
                                : '#E5E5E5',
                        },
                    ]}
                >
                    <Image
                        style={[
                            styles.img1,
                            {
                                tintColor: notifications?.push_notification
                                    ? '#FFFFFF'
                                    : '#BDBDBD',
                            },
                        ]}
                        source={global.ASSETS.BELL}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        onUpdateNotification({
                            email: !notifications?.email,
                        })
                    }}
                    style={[
                        styles.imgbag,
                        {
                            backgroundColor: notifications?.email
                                ? color.GM_BLUE_DEEP
                                : '#E5E5E5',
                        },
                    ]}
                >
                    <Image
                        style={[
                            styles.img1,
                            {
                                tintColor: notifications?.email
                                    ? '#FFFFFF'
                                    : '#BDBDBD',
                            },
                        ]}
                        source={global.ASSETS.DRFT}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        onUpdateNotification({
                            sms: !notifications?.sms,
                        })
                    }}
                    style={[
                        styles.imgbag,
                        {
                            backgroundColor: notifications?.sms
                                ? color.GM_BLUE_DEEP
                                : '#E5E5E5',
                        },
                    ]}
                >
                    <Image
                        style={[
                            styles.img1,
                            {
                                tintColor: notifications?.sms
                                    ? '#FFFFFF'
                                    : '#BDBDBD',
                            },
                        ]}
                        source={global.ASSETS.MSG}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.textallview}>
                <Text
                    style={[
                        styles.text,
                        notifications?.push_notification && styles.selectedText,
                    ]}
                >
                    Push
                </Text>

                <Text
                    style={[
                        styles.text,
                        notifications?.email && styles.selectedText,
                    ]}
                >
                    Email
                </Text>
                <Text
                    style={[
                        styles.text,
                        notifications?.sms && styles.selectedText,
                    ]}
                >
                    SMS
                </Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    imgbag: {
        width: 40,
        height: 40,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    img1: {
        width: 18,
        height: 16,
        alignSelf: 'center',
    },
    bellallview: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    textallview: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 20,
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
        color: '#828282',
        fontFamily: text.FONT_FAMILY.REGULAR,
    },
    selectedText: {
        color: '#000',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
    },
})
export default ReminderNotificationView
