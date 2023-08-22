import React, { useCallback } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { color } from '../styles/basic'
import { useDispatch, useSelector } from 'react-redux'
import { setReminderSelectedTabIndex } from '../reducers/ReminderReducers'
import { searchReminder } from '../actions/ReminderActions'

const ReminderTabButton = ({ props }) => {
    const reminderSelectedTabIndex = useSelector(
        (state) => state.reminder?.reminderTab?.index
    )
    const reminderSearchText = useSelector(
        (state) => state.reminder?.reminderSearchText
    )
    const dispatch = useDispatch()

    const onPressTabIndex = useCallback(
        (key, index) => {
            if (props.jumpTo) {
                props.jumpTo(key)
            } else if (props.jumpToIndex) {
                props.jumpToIndex(index)
            }
            dispatch(setReminderSelectedTabIndex(index))
            if (reminderSearchText.trim()) {
                dispatch(searchReminder(0, 10, reminderSearchText))
            }
        },
        [dispatch, props.jumpTo, props.jumpToIndex, reminderSearchText]
    )

    return (
        <View style={styles.mainView}>
            {props?.navigationState?.routes.map((item, index) => {
                const isSelected = reminderSelectedTabIndex === index
                return (
                    <TouchableOpacity
                        style={[
                            styles.buttonView,
                            isSelected && styles.selectedButtonView,
                        ]}
                        activeOpacity={0.6}
                        onPress={() => {
                            onPressTabIndex(item.key, index)
                        }}
                    >
                        <Text
                            style={[
                                styles.text,
                                isSelected && styles.selectedText,
                            ]}
                        >
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}
const styles = StyleSheet.create({
    mainView: {
        height: 46,
        width: '100%',
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    buttonView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#D4D4D4',
    },
    selectedButtonView: {
        borderBottomWidth: 2.5,
        borderBottomColor: color.GM_BLUE,
    },
    text: {
        fontWeight: '500',
        fontSize: 14,
        color: '#707070',
    },
    selectedText: {
        fontWeight: '700',
        color: '#000',
    },
})
export default ReminderTabButton
