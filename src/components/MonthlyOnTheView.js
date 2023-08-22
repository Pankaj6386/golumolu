import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { scale } from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Divider } from 'react-native-elements'
import { text } from '../styles/basic'

const MonthlyOnTheView = ({
    isVisible,
    onToggleVisible,
    onSelectedWeek,
    onChangeOnWeek,
    selectedWeekDay,
    onChangeWeekday,
}) => {
    return (
        <View>
            <TouchableOpacity
                onPress={() => onToggleVisible && onToggleVisible()}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 16,
                    width: '100%',
                }}
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
                        height: 205,
                        // marginHorizontal: scale(40),
                        alignSelf: 'center',
                        overflow: 'hidden',
                    }}
                >
                    <Picker
                        style={{ width: scale(160) }}
                        selectedValue={onSelectedWeek}
                        onValueChange={(itemValue) => {
                            onChangeOnWeek(itemValue)
                        }}
                    >
                        <Picker.Item label="first" value="1" />
                        <Picker.Item label="second" value="2" />
                        <Picker.Item label="third" value="3" />
                        <Picker.Item label="fourth" value="4" />
                        <Picker.Item label="fifth" value="5" />
                        {/* <Picker.Item label="six" value="six" />
                                <Picker.Item label="seventh" value="seventh" /> */}
                    </Picker>
                    <Picker
                        style={{ width: scale(160) }}
                        selectedValue={selectedWeekDay}
                        onValueChange={(itemValue) => {
                            onChangeWeekday(itemValue)
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
export default MonthlyOnTheView
