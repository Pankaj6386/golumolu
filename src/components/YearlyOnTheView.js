import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { scale } from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Divider } from 'react-native-elements'
import { text } from '../styles/basic'

const YearlyOnTheView = ({
    isVisible,
    onToggleVisible,
    selectedWeek,
    onSelectedWeek,
    selectedDay,
    onSelectedDay,
    selectedMonth,
    onSelectedMonth,
}) => {
    return (
        <View>
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 16,
                }}
                onPress={() => onToggleVisible()}
            >
                <Text style={styles.repet}>On the</Text>
                <Ionicons
                    name={
                        isVisible
                            ? 'caret-down-outline'
                            : 'caret-forward-outline'
                    }
                    color={isVisible ? '#828282' : '#DADADA'}
                    style={{ marginLeft: 6 }}
                    size={20}
                />
            </TouchableOpacity>
            <Divider style={styles.modalDivider} />
            {isVisible ? (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        height: 235,
                        alignSelf: 'center',
                        overflow: 'hidden',
                    }}
                >
                    <Picker
                        style={{ width: scale(120) }}
                        selectedValue={selectedWeek}
                        onValueChange={(itemValue) => {
                            onSelectedWeek(itemValue)
                        }}
                    >
                        <Picker.Item label="first" value="1" />
                        <Picker.Item label="second" value="2" />
                        <Picker.Item label="third" value="3" />
                        <Picker.Item label="fourth" value="4" />
                        <Picker.Item label="fifth" value="5" />
                    </Picker>
                    <Picker
                        style={{ width: scale(140) }}
                        selectedValue={selectedDay}
                        onValueChange={(itemValue) => {
                            onSelectedDay(itemValue)
                        }}
                    >
                        <Picker.Item label="Monday" value="1" />
                        <Picker.Item label="Tuesday" value="2" />
                        <Picker.Item label="Wednesday" value="3" />
                        <Picker.Item label="Thursday" value="4" />
                        <Picker.Item label="Friday" value="5" />
                        <Picker.Item label="Saturday" value="6" />
                        <Picker.Item label="Sunday" value="7" />
                    </Picker>
                    <Picker
                        style={{ width: scale(130) }}
                        selectedValue={selectedMonth}
                        onValueChange={(itemValue) => {
                            onSelectedMonth(itemValue)
                        }}
                    >
                        <Picker.Item label="January" value="1" />
                        <Picker.Item label="February" value="2" />
                        <Picker.Item label="March" value="3" />
                        <Picker.Item label="April" value="4" />
                        <Picker.Item label="May" value="5" />
                        <Picker.Item label="June" value="6" />
                        <Picker.Item label="July" value="7" />
                        <Picker.Item label="August" value="8" />
                        <Picker.Item label="September" value="9" />
                        <Picker.Item label="October" value="10" />
                        <Picker.Item label="November" value="11" />
                        <Picker.Item label="December" value="12" />
                    </Picker>
                </View>
            ) : null}
        </View>
    )
}
const styles = StyleSheet.create({
    repet: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    modalDivider: {
        width: '150%',
        marginTop: 16,
        alignSelf: 'center',
    },
})
export default YearlyOnTheView
