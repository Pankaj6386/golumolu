import React, { useState, useCallback } from 'react'
import { View, StyleSheet, FlatList, Text, Alert } from 'react-native'
import SearchBarHeader from '../../../Common/Header/SearchBarHeader'
import ToogleComponent from './ToogleComponent'
import { text } from '../../../../styles/basic'
import DelayedButton from '../../../Common/Button/DelayedButton'
import OnboardingStyles from '../../../../styles/Onboarding'
import { api as API } from '../../../../redux/middleware/api'
import { Actions } from 'react-native-router-flux'

function NotificationToogle({ item }) {
    const { button: buttonStyle } = OnboardingStyles
    const lastItem = item.data[item.data.length - 1]
    const [toggleData, setToogleData] = useState(item.data)
    const onItemSelectItem = []

    const handleOptionSelect = useCallback(
        (selectedItem, key) => {
            setToogleData((prevData) =>
                prevData.map((item) => {
                    if (item.id === selectedItem.id) {
                        if (key === 'notification') {
                            return {
                                ...item,
                                pushNotification: !selectedItem.pushNotification,
                            }
                        } else if (key === 'email') {
                            return {
                                ...item,
                                email: !selectedItem.email,
                            }
                        } else if (key === 'sms') {
                            return {
                                ...item,
                                sms: !selectedItem.sms,
                            }
                        }
                    }
                    return item
                })
            )
        },
        [toggleData, item]
    )

    const renderItem = ({ item }) => {
        return (
            <>
                <View style={styles.itemContainer}>
                    <Text style={styles.containerText}>{item.title}</Text>
                    <View style={styles.greyLine} />
                    <ToogleComponent
                        item={item}
                        onItemPress={handleOptionSelect}
                    />
                    {item.id === lastItem.id && (
                        <View style={styles.greyLine} />
                    )}
                </View>
            </>
        )
    }

    const handleOkPress = useCallback(() => {
        Actions.push('setting')
    }, [])

    const handleConfirmPress = useCallback(async () => {
        const extractedData = {}

        toggleData.forEach((item) => {
            extractedData[item.key] = {
                email: item.email,
                sms: item.sms,
                pushNotification: item.pushNotification,
            }
        })

        const notificationData = {
            [item.key]: extractedData,
        }

        try {
            const response = await API.put('secure/notification/settings/', {
                updatedDoc: notificationData,
            })
            console.log('response', response)
            if (response.status === 200) {
                Alert.alert(
                    'Updated!',
                    'Notification settings has been updated successfully',
                    [{ text: 'OK', onPress: handleOkPress }],
                    { cancelable: false }
                )
            }
        } catch (err) {}
    }, [toggleData, item])

    return (
        <View style={styles.container}>
            <SearchBarHeader backButton rightIcon="empty" title={item.title} />

            <FlatList
                data={toggleData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                onEndReachedThreshold={0}
                ItemSeparatorComponent={() => (
                    <View style={styles.itemSeperatorStyle}></View>
                )}
                ListFooterComponent={() => {
                    return (
                        <>
                            <View style={styles.footerComponent}>
                                <DelayedButton
                                    onPress={handleConfirmPress}
                                    style={{
                                        ...buttonStyle
                                            .GM_BLUE_BG_WHITE_BOLD_TEXT
                                            .containerStyle,
                                        borderRadius: 10,
                                    }}
                                >
                                    <Text
                                        style={
                                            buttonStyle
                                                .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                .textStyle
                                        }
                                    >
                                        Confirm
                                    </Text>
                                </DelayedButton>
                            </View>
                        </>
                    )
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    itemSeperatorStyle: {
        borderWidth: 0.8,
        borderColor: '#F1EEEE',
    },
    containerText: {
        fontSize: 15,
        color: 'black',
        fontFamily: text.FONT_FAMILY.REGULAR,
        marginTop: 10,
        marginHorizontal: 5,
    },
    itemContainer: {
        padding: 10,
        justifyContent: 'center',
    },
    greyLine: {
        width: '100%',
        borderWidth: 0.8,
        borderColor: '#F1EEEE',
        marginTop: 15,
    },
    footerComponent: {
        width: '90%',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
})

export default NotificationToogle
