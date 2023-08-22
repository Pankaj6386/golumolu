import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { color, text } from '../styles/basic'

const allDays = [
    { key: '0', value: 'Sun' },
    { key: '1', value: 'Mon' },
    { key: '2', value: 'Tue' },
    { key: '3', value: 'Wed' },
    { key: '4', value: 'Thu' },
    { key: '5', value: 'Fri' },
    { key: '6', value: 'Sat' },
]
const WeeklyDays = ({ selectedWeekDay, onSelectDay }) => {
    return (
        <View style={styles.daysMainContainer}>
            {allDays.map((item) => {
                const isSelected = selectedWeekDay.includes(item.key)
                return (
                    <TouchableOpacity
                        key={item.key + ''}
                        onPress={() => {
                            onSelectDay && onSelectDay(item.key)
                        }}
                        style={[
                            styles.daysContainer,
                            {
                                backgroundColor: isSelected
                                    ? color.GM_BLUE_DEEP
                                    : null,
                                borderColor: isSelected
                                    ? color.GM_BLUE_DEEP
                                    : '#828282',
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.daysTextStyle,
                                {
                                    color: isSelected ? '#fff' : '#000',
                                },
                            ]}
                        >
                            {item.value}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}
const styles = StyleSheet.create({
    daysMainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 20,
    },
    daysContainer: {
        borderWidth: 1,
        borderRadius: 13,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#828282',
        // backgroundColor: 'red',
    },
    daysTextStyle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#828282',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
})
export default WeeklyDays
