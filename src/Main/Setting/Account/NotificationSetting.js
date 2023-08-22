/**
 * This page is used in user account setting for notification preferenes
 *
 * Enable push notification
 * Enable email notification
 *
 * Header right action is Save
 * Header left action is back button
 *
 * @format
 */
import React, { useCallback, useEffect, useState } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
} from 'react-native'
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import {
    NOFICATION_PREF as notificationData,
    INITIAL_DATA,
} from '../../../Utils/NotificationsUtils'
import { color, text } from '../../../styles/basic'
import NOTIFICATION_LEFT_ICON from '../../../asset/image/notificationLeft.png'
import { Actions } from 'react-native-router-flux'
import AwesomeAlert from 'react-native-awesome-alerts'
import { api as API } from '../../../redux/middleware/api'

export default function NotificationSetting() {
    const [showAlert, setShowAlert] = React.useState()
    const [mergedArray, setMergedArray] = useState([])
    const hideAlert = () => setShowAlert(false)

    const getNotificationResult = useCallback(async () => {
        try {
            const response = await API.get('secure/notification/settings/')

            const mergedData = mergeData(
                notificationData,
                response.notificationData
            )
            // Update the state with the merged array
            if (response.status) {
                setMergedArray(mergedData)
            }
            console.log('response of get', response)
        } catch (err) {}
    }, [])

    const updatedToDefault = useCallback(async () => {
        try {
            hideAlert()
            const updatedDoc = {}

            INITIAL_DATA.forEach((category) => {
                updatedDoc[category.key] = {}

                category.data.forEach((notification) => {
                    updatedDoc[category.key][notification.key] = {
                        email: notification.email,
                        pushNotification: notification.pushNotification,
                        sms: notification.sms,
                    }
                })
            })
            const response = await API.put('secure/notification/settings/', {
                updatedDoc,
            })
            // Update the state with the merged array
            if (response.status) {
                if (response.status === 200) {
                    Alert.alert(
                        'Updated!',
                        'Notification settings has been set to default',
                        [{ text: 'OK', onPress: () => Actions.pop() }],
                        { cancelable: false }
                    )
                }
            }
            console.log('response of get', response)
        } catch (err) {}
    }, [])

    const mergeData = (existingArray, apiData) => {
        const mergedArray = [...existingArray]

        for (const item of mergedArray) {
            if (item.key in apiData) {
                const apiItem = apiData[item.key]

                item.data = item.data.map((dataItem) => {
                    if (dataItem.key in apiItem) {
                        return {
                            ...dataItem,
                            pushNotification:
                                apiItem[dataItem.key].pushNotification,
                            email: apiItem[dataItem.key].email,
                            sms: apiItem[dataItem.key].sms,
                        }
                    }
                    return dataItem
                })
            }
        }

        return mergedArray
    }

    useEffect(() => {
        getNotificationResult()
    }, [])

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}
        >
            <SearchBarHeader
                backButton
                rightIcon="empty"
                title="Notifications"
                onBackPress={() => Actions.pop()}
            />
            <FlatList
                data={notificationData}
                renderItem={({ item }) => {
                    return (
                        <>
                            <TouchableOpacity
                                style={styles.container}
                                onPress={() =>
                                    Actions.push('notification_toogle', {
                                        item,
                                    })
                                }
                            >
                                <Text style={styles.containerText}>
                                    {item.title}
                                </Text>
                                <Image
                                    source={NOTIFICATION_LEFT_ICON}
                                    style={styles.notificationImage}
                                />
                            </TouchableOpacity>
                        </>
                    )
                }}
                keyExtractor={(item) => item.id}
                onEndReachedThreshold={0}
                ItemSeparatorComponent={() => (
                    <View style={styles.itemSeperatorStyle}></View>
                )}
                ListFooterComponent={() => {
                    return (
                        <>
                            <TouchableOpacity
                                style={styles.footerContainer}
                                onPress={() => setShowAlert(true)}
                            >
                                <Text style={styles.footerText}>
                                    Reset to Default Settings
                                </Text>
                            </TouchableOpacity>
                        </>
                    )
                }}
            />
            <AwesomeAlert
                show={showAlert}
                title="Notifications settings reset!"
                titleStyle={{
                    fontWeight: 'bold',
                    fontSize: 20,
                }}
                contentContainerStyle={{
                    width: '100%',
                }}
                messageStyle={{
                    fontSize: 15,
                    fontWeight: '500',
                }}
                message={
                    'Are you sure you’d like to reset the Notification Settings to Default? This action cannot be undone.'
                }
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                confirmText="Yes"
                cancelText="No"
                confirmButtonColor={color.GM_BLUE}
                onCancelPressed={() => hideAlert()}
                onConfirmPressed={updatedToDefault}
                confirmButtonStyle={{
                    width: 100,
                }}
                cancelButtonStyle={{
                    width: 70,
                }}
                confirmButtonTextStyle={{
                    textAlign: 'center',
                }}
                cancelButtonTextStyle={{
                    textAlign: 'center',
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        marginTop: 10,
        marginHorizontal: 10,
        justifyContent: 'center',
    },
    containerText: {
        fontSize: 15,
        color: 'black',
        fontFamily: text.FONT_FAMILY.REGULAR,
    },
    itemSeperatorStyle: {
        borderWidth: 0.8,
        borderColor: '#F1EEEE',
    },
    notificationImage: {
        resizeMode: 'contain',
        height: 10,
        width: 10,
        position: 'absolute',
        right: 0,
    },
    footerContainer: {
        padding: 12,
        marginTop: 20,
        marginHorizontal: 10,
        borderWidth: 0.8,
        borderColor: '#F1EEEE',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },
    footerText: {
        fontSize: 15,
        color: '#B63050',
        fontFamily: text.FONT_FAMILY.REGULAR,
    },
})
