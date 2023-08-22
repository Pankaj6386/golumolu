import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Divider, Overlay } from 'react-native-elements'
import { scale } from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { color, text } from '../styles/basic'
import CalendarPicker from 'react-native-calendar-picker'
import { createCurrentDateWith } from '../Utils/HelperMethods'
import moment from 'moment'

const ReminderEndRepeatModal = ({
    isVisible,
    onClose,
    startDate,
    endRepeatProps,
    initialEndRepeatDate,
}) => {
    const [endRepeat, setEndRepeat] = useState('never')
    const [endRepeatDate, setEndRepeatDate] = useState(
        initialEndRepeatDate
            ? new Date(initialEndRepeatDate)
            : createCurrentDateWith(23, 59)
    )
    const [minimumDate, setMinimumDate] = useState(new Date())

    const endRepeatText = useRef('never')
    const endRepeatDateText = useRef(
        initialEndRepeatDate ? new Date(initialEndRepeatDate) : new Date()
    )

    const onRequestClose = useCallback(() => {
        onClose && onClose(endRepeatText.current, endRepeatDateText.current)
    }, [onClose])

    useEffect(() => {
        if (startDate && moment(endRepeatDate).isBefore(moment(startDate))) {
            const date = new Date(startDate)
            date.setHours(23, 59)
            setMinimumDate(startDate)
            setEndRepeatDate(date)
            endRepeatDateText.current = date
        }
    }, [startDate])

    useEffect(() => {
        if (endRepeatProps) {
            setEndRepeat(endRepeatProps)
        }
    }, [endRepeatProps])


    return (
        <Overlay
            onBackdropPress={onRequestClose}
            onRequestClose={onRequestClose}
            isVisible={isVisible}
            overlayStyle={[
                styles.neveroverly,
                {
                    width: endRepeat === 'on_date' ? scale(300) : scale(230),
                },
            ]}
        >
            <View>
                <TouchableOpacity
                    onPress={() => {
                        setEndRepeat('never')
                        endRepeatText.current = 'never'
                        onRequestClose()
                    }}
                    style={styles.neverconteinar}
                >
                    {endRepeat === 'never' ? (
                        <Ionicons
                            name="ios-checkmark-outline"
                            size={25}
                            color={color.GM_BLUE_DEEP}
                        />
                    ) : null}

                    <Text style={styles.neverWhenOn}>Never</Text>
                </TouchableOpacity>

                <Divider style={styles.neverline} />

                <TouchableOpacity
                    onPress={() => {
                        setEndRepeat('on_done')
                        endRepeatText.current = 'on_done'
                        onRequestClose()
                    }}
                    style={styles.neverconteinar}
                >
                    {endRepeat === 'on_done' ? (
                        <Ionicons
                            name="ios-checkmark-outline"
                            size={25}
                            color={color.GM_BLUE_DEEP}
                        />
                    ) : null}
                    <Text style={styles.neverWhenOn}>When Marked as Done</Text>
                </TouchableOpacity>

                <Divider style={styles.neverline} />

                <TouchableOpacity
                    onPress={() => {
                        endRepeatText.current = 'on_date'
                        setEndRepeat('on_date')
                    }}
                    style={styles.neverconteinar}
                >
                    {endRepeat === 'on_date' ? (
                        <Ionicons
                            name="ios-checkmark-outline"
                            size={25}
                            color={color.GM_BLUE_DEEP}
                        />
                    ) : null}

                    <Text style={styles.neverWhenOn}>On Date</Text>
                </TouchableOpacity>

                {endRepeat === 'on_date' ? (
                    <>
                        <Divider style={styles.neverline} />
                        <View style={{ marginTop: 30 }}>
                            <CalendarPicker
                                todayTextStyle={{ fontWeight: 'bold' }}
                                selectedDayStyle={{
                                    backgroundColor: color.GM_BLUE_DEEP,
                                    color: '#fff',
                                }}
                                width={330}
                                weekdays={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
                                nextComponent={
                                    <Ionicons
                                        name="chevron-forward"
                                        size={25}
                                        color={color.GM_BLUE_DEEP}
                                    />
                                }
                                selectedStartDate={endRepeatDate}
                                previousComponent={
                                    <Ionicons
                                        name="chevron-back"
                                        size={25}
                                        color={color.GM_BLUE_DEEP}
                                    />
                                }
                                monthTitleStyle={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: color.GM_BLUE_DEEP,
                                }}
                                yearTitleStyle={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: color.GM_BLUE_DEEP,
                                }}
                                initialDate={endRepeatDate}
                                onDateChange={(date) => {
                                    const dateSet = new Date(date)
                                    dateSet.setHours(23, 59)
                                    setEndRepeatDate(dateSet)
                                    endRepeatDateText.current = dateSet
                                    onRequestClose()
                                }}
                                minDate={minimumDate}
                            />
                        </View>
                    </>
                ) : null}
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    neveroverly: {
        width: 220,
        // height:'00,
        alignSelf: 'flex-end',
        marginHorizontal: 20,
        borderRadius: 7,
        marginTop: 110,
        justifyContent: 'center',
    },
    neverline: {
        marginTop: 10,
    },
    neverWhenOn: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
        marginTop: 10,
        marginHorizontal: 10,
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    neverconteinar: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor:"#828282"
    },
})

export default ReminderEndRepeatModal
