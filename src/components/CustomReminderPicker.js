import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { text } from '../styles/basic'
import { createArray, getReminderMinutes } from '../Utils/HelperMethods'
import moment from 'moment'

const CustomReminderPicker = ({
    onChangePickerValue,
    endDate,
    initialValue,
}) => {
    const [selectedNumber, setSelectedNumber] = useState(
        initialValue?.selectedNumber || '1'
    )
    const [selectedUnit, setSelectedUnit] = useState(
        initialValue?.selectedUnit || ''
    )

    const mapItem =
        selectedUnit === 'minute'
            ? getReminderMinutes()
            : createArray(
                  selectedUnit === 'day'
                      ? 31
                      : selectedUnit === 'hour'
                      ? 24
                      : selectedUnit === 'week'
                      ? 52
                      : selectedUnit === 'year'
                      ? 99
                      : 12,
                  1
              )

    return (
        <View style={styles.pickermain}>
            <View style={styles.numberdaypicker}>
                <Picker
                    selectedValue={selectedNumber}
                    onValueChange={(itemValue) => {
                        const validEndDate = moment(endDate)
                        if (validEndDate.isValid() && endDate) {
                            validEndDate.subtract(itemValue, selectedUnit + 's')

                            if (validEndDate.isAfter(moment(), 'day')) {
                                setSelectedNumber(itemValue)
                                onChangePickerValue &&
                                    onChangePickerValue(
                                        itemValue,
                                        selectedUnit,
                                        validEndDate
                                    )
                            }
                        } else {
                            setSelectedNumber(itemValue)
                            onChangePickerValue &&
                                onChangePickerValue(itemValue, selectedUnit)
                        }
                    }}
                >
                    {mapItem.map((item) => (
                        <Picker.Item
                            key={`day_key_${item}`}
                            label={item}
                            value={item}
                        />
                    ))}
                </Picker>
            </View>

            <View style={styles.numberdaypicker}>
                <Picker
                    selectedValue={selectedUnit}
                    onValueChange={(itemValue) => {
                        const validEndDate = moment(endDate)
                        if (validEndDate.isValid() && endDate) {
                            validEndDate.subtract(
                                selectedNumber,
                                itemValue + 's'
                            )
                            if (validEndDate.isAfter(moment(), 'day')) {
                                onChangePickerValue &&
                                    onChangePickerValue(
                                        selectedNumber,
                                        itemValue,
                                        validEndDate
                                    )
                                setSelectedUnit(itemValue)
                            }
                        } else {
                            const isMinuteLessThen5 =
                                itemValue === 'minute' &&
                                Number(selectedNumber) < 5
                            onChangePickerValue &&
                                onChangePickerValue(
                                    isMinuteLessThen5 ? '5' : selectedNumber,
                                    itemValue
                                )
                            setSelectedUnit(itemValue)
                            if (isMinuteLessThen5) {
                                setSelectedNumber('5')
                            }
                        }
                    }}
                >
                    <Picker.Item
                        label={selectedNumber === '1' ? `day` : 'days'}
                        value={'day'}
                    />
                    <Picker.Item
                        label={selectedNumber === '1' ? `week` : 'weeks'}
                        value={'week'}
                    />
                    <Picker.Item
                        label={selectedNumber === '1' ? 'month' : 'months'}
                        value={'month'}
                    />
                    <Picker.Item
                        label={selectedNumber === '1' ? 'year' : 'years'}
                        value={'year'}
                    />
                    <Picker.Item
                        label={selectedNumber === '1' ? 'minute' : 'minutes'}
                        value={'minute'}
                    />
                    <Picker.Item
                        label={selectedNumber === '1' ? 'hour' : 'hours'}
                        value={'hour'}
                    />
                </Picker>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    pickermain: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50,
    },
    numberdaypicker: {
        width: 150,
    },
    Reminderwillbetext: {
        width: 330,
        fontSize: 15,
        fontWeight: '400',
        color: '#999999',
        fontFamily: text.FONT_FAMILY.REGULAR,
    },
})
export default CustomReminderPicker
