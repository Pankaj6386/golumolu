import React, { useCallback, useEffect, useState } from 'react'
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    Image,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { color, text } from '../styles/basic'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Divider } from 'react-native-elements'
import global from '../../global'
import moment from 'moment/moment'
import {
    convertDateToAmOrPm,
    createCurrentDateWith,
} from '../Utils/HelperMethods'

const initialExceptSelectedTime = {
    fromTime: createCurrentDateWith(9, 0),
    toTime: createCurrentDateWith(10, 0),
    fromTimeText: '9:00',
    toTimeText: '10:00',
    fromTimeAm: true,
    toTimeAm: true,
    fromTimeVisible: false,
    toTimeVisible: false,
}
let allowChangeText = [false]

const CustomReminderExceptionTime = ({
    isVisible,
    onChangeExceptionTime,
    initialValues,
}) => {
    const [exceptSelectedTimes, setExceptSelectedTimes] = useState(
        initialValues.length
            ? initialValues
            : [{ ...initialExceptSelectedTime }]
    )

    const exportTime = useCallback(
        (allTimes) => {
            onChangeExceptionTime && onChangeExceptionTime(allTimes)
        },
        [onChangeExceptionTime]
    )

    useEffect(() => {
        exportTime(exceptSelectedTimes)
    }, [])

    useEffect(() => {
        exportTime(exceptSelectedTimes)
    }, [exceptSelectedTimes.length])

    const addException = useCallback(() => {
        setExceptSelectedTimes((prevState) => [
            ...prevState,
            { ...initialExceptSelectedTime },
        ])
    }, [])

    const removeException = useCallback(
        (index) => {
            const tempArray = [...exceptSelectedTimes]
            tempArray.splice(index, 1)
            setExceptSelectedTimes(tempArray)
        },
        [exceptSelectedTimes]
    )
    const onKeyPress = useCallback(
        (nativeEvent, index, key) => {
            const tempSelectedTimes = [...exceptSelectedTimes]
            const tempItem = tempSelectedTimes[index]
            const timeType = tempItem[key]
            if (nativeEvent.key === 'Backspace' && timeType.length === 3) {
                allowChangeText[index] = false
                tempItem[key] = ''
                tempSelectedTimes[index] = tempItem
                setExceptSelectedTimes(tempSelectedTimes)
            } else {
                allowChangeText[index] = true
            }
        },
        [exceptSelectedTimes]
    )

    const onChangeText = useCallback(
        (text, index, key) => {
            if (!allowChangeText[index]) {
                return
            }
            const tempSelectedTimes = [...exceptSelectedTimes]
            const tempItem = tempSelectedTimes[index]
            tempItem[key] =
                text.length === 2 && text.indexOf(':') === -1
                    ? `${text}:`
                    : text
            tempSelectedTimes[index] = tempItem
            setExceptSelectedTimes(tempSelectedTimes)
        },
        [exceptSelectedTimes]
    )

    const changeTimePickerStatus = useCallback(
        (index, key, status) => {
            const tempSelectedTimes = [...exceptSelectedTimes]
            const tempItem = tempSelectedTimes[index]
            tempItem[key] = status
            if (key === 'fromTimeAm') {
                const fromTime = tempItem.fromTime
                tempItem.fromTime = convertDateToAmOrPm(fromTime, status)
            } else if (key === 'toTimeAm') {
                const toTime = tempItem.toTime
                tempItem.toTime = convertDateToAmOrPm(toTime, status)
            }
            tempSelectedTimes[index] = tempItem
            setExceptSelectedTimes(tempSelectedTimes)
            exportTime(tempSelectedTimes)
        },
        [exceptSelectedTimes]
    )

    const onChangeTime = useCallback(
        (time, index, key) => {
            const startTime = moment(time).format('hh:mm')
            const amPm = moment(time).format('a')
            const tempSelectedTimes = [...exceptSelectedTimes]
            const tempItem = tempSelectedTimes[index]
            tempItem[key] = time
            tempItem[key + 'Am'] = amPm === 'am'
            tempItem[key + 'Text'] = startTime
            tempItem[key + 'Visible'] = false
            tempSelectedTimes[index] = tempItem
            setExceptSelectedTimes(tempSelectedTimes)
            exportTime(tempSelectedTimes)
        },
        [exceptSelectedTimes, exportTime]
    )

    const onBlur = useCallback(
        (index, key) => {
            const tempSelectedDates = [...exceptSelectedTimes]
            const tempItem = tempSelectedDates[index]
            const text = tempItem[key]
            if (text.length === 10) {
                // const date = moment(text)
                // if (date.isValid()) {
                //     tempItem[key + 'Final'] = date
                //     tempSelectedDates[index] = tempItem
                //     setExceptSelectedTimes(tempSelectedDates)
                //     exportTime(tempSelectedDates)
                // }
            }
        },
        [exportTime, exceptSelectedTimes]
    )

    if (isVisible) {
        return (
            <>
                {exceptSelectedTimes.map((_, index) => (
                    <View
                        key={'exceptDate_' + index + ''}
                        style={{ width: '100%' }}
                    >
                        <Divider style={styles.modalDivider} />
                        <TouchableOpacity
                            style={styles.closeIconView}
                            onPress={() => {
                                removeException(index)
                            }}
                        >
                            <Image
                                source={global.ASSETS.CROSSBAG}
                                style={styles.closeIcon}
                            />
                        </TouchableOpacity>
                        <View style={styles.fromtomain}>
                            <Text style={styles.fromto}>From</Text>
                            <Text style={styles.fromto}>To</Text>
                        </View>
                        <View style={styles.doubledatebox}>
                            <View style={[styles.datebox, { borderWidth: 0 }]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        changeTimePickerStatus(
                                            index,
                                            'fromTimeVisible',
                                            true
                                        )
                                    }}
                                    style={styles.timeInputView}
                                >
                                    <TextInput
                                        style={styles.time}
                                        // placeholder="9:00"
                                        placeholderTextColor={'#000000'}
                                        maxLength={5}
                                        editable={false}
                                        pointerEvents={'none'}
                                        keyboardType="number-pad"
                                        value={
                                            exceptSelectedTimes[index]
                                                .fromTimeText
                                        }
                                        onKeyPress={({ nativeEvent }) => {
                                            onKeyPress(
                                                nativeEvent,
                                                index,
                                                'fromTime'
                                            )
                                        }}
                                        onChangeText={(text) => {
                                            onChangeText(
                                                text,
                                                index,
                                                'fromTime'
                                            )
                                        }}
                                    />

                                    <TouchableOpacity
                                        onPress={() => {
                                            changeTimePickerStatus(
                                                index,
                                                'fromTimeVisible',
                                                true
                                            )
                                        }}
                                    >
                                        <Ionicons
                                            name="chevron-down-outline"
                                            size={20}
                                            color={color.GM_BLUE_DEEP}
                                        />
                                    </TouchableOpacity>

                                    <DateTimePickerModal
                                        isVisible={
                                            exceptSelectedTimes[index]
                                                .fromTimeVisible
                                        }
                                        mode="time"
                                        date={
                                            exceptSelectedTimes[index].fromTime
                                        }
                                        onConfirm={(time) => {
                                            onChangeTime(
                                                time,
                                                index,
                                                'fromTime'
                                            )
                                        }}
                                        onCancel={() => {
                                            changeTimePickerStatus(
                                                index,
                                                'fromTimeVisible',
                                                false
                                            )
                                        }}
                                    />
                                </TouchableOpacity>

                                <View style={styles.amPmView}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            changeTimePickerStatus(
                                                index,
                                                'fromTimeAm',
                                                true
                                            )
                                        }}
                                        style={[
                                            styles.selectedAmButtonStyle,
                                            {
                                                backgroundColor: exceptSelectedTimes[
                                                    index
                                                ].fromTimeAm
                                                    ? '#FFFFFF'
                                                    : '#F5F5F5',
                                            },
                                        ]}
                                    >
                                        <Text style={styles.amTextStyle}>
                                            AM
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            changeTimePickerStatus(
                                                index,
                                                'fromTimeAm',
                                                false
                                            )
                                        }}
                                        style={[
                                            styles.selectedAmButtonStyle,
                                            {
                                                backgroundColor: !exceptSelectedTimes[
                                                    index
                                                ].fromTimeAm
                                                    ? '#FFFFFF'
                                                    : '#F5F5F5',
                                            },
                                        ]}
                                    >
                                        <Text style={styles.amTextStyle}>
                                            PM
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={[styles.datebox, { borderWidth: 0 }]}>
                                <TouchableOpacity
                                    style={styles.timeInputView}
                                    onPress={() => {
                                        changeTimePickerStatus(
                                            index,
                                            'toTimeVisible',
                                            true
                                        )
                                    }}
                                >
                                    <TextInput
                                        style={styles.time}
                                        // placeholder="9:00"
                                        keyboardType="number-pad"
                                        maxLength={5}
                                        editable={false}
                                        pointerEvents={'none'}
                                        placeholderTextColor={'#000000'}
                                        value={
                                            exceptSelectedTimes[index]
                                                .toTimeText
                                        }
                                        onKeyPress={({ nativeEvent }) => {
                                            onKeyPress(
                                                nativeEvent,
                                                index,
                                                'toTime'
                                            )
                                        }}
                                        onChangeText={(text) => {
                                            onChangeText(text, index, 'toTime')
                                        }}
                                    />

                                    <TouchableOpacity
                                        onPress={() => {
                                            changeTimePickerStatus(
                                                index,
                                                'toTimeVisible',
                                                true
                                            )
                                        }}
                                    >
                                        <Ionicons
                                            name="chevron-down-outline"
                                            size={20}
                                            color={color.GM_BLUE_DEEP}
                                        />
                                    </TouchableOpacity>
                                    <DateTimePickerModal
                                        isVisible={
                                            exceptSelectedTimes[index]
                                                .toTimeVisible
                                        }
                                        mode="time"
                                        date={exceptSelectedTimes[index].toTime}
                                        onConfirm={(time) => {
                                            onChangeTime(time, index, 'toTime')
                                        }}
                                        onCancel={() => {
                                            changeTimePickerStatus(
                                                index,
                                                'toTimeVisible',
                                                false
                                            )
                                        }}
                                    />
                                </TouchableOpacity>

                                <View style={styles.amPmView}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            changeTimePickerStatus(
                                                index,
                                                'toTimeAm',
                                                true
                                            )
                                        }
                                        style={[
                                            styles.selectedAmButtonStyle,
                                            {
                                                backgroundColor: exceptSelectedTimes[
                                                    index
                                                ].toTimeAm
                                                    ? '#FFFFFF'
                                                    : '#F5F5F5',
                                            },
                                        ]}
                                    >
                                        <Text style={styles.amTextStyle}>
                                            AM
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            changeTimePickerStatus(
                                                index,
                                                'toTimeAm',
                                                false
                                            )
                                        }}
                                        style={[
                                            styles.selectedAmButtonStyle,
                                            {
                                                backgroundColor: !exceptSelectedTimes[
                                                    index
                                                ].toTimeAm
                                                    ? '#FFFFFF'
                                                    : '#F5F5F5',
                                            },
                                        ]}
                                    >
                                        <Text style={styles.amTextStyle}>
                                            PM
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
                <Divider style={styles.modalDivider} />
                <TouchableOpacity
                    onPress={addException}
                    style={styles.plusmoremain}
                >
                    <Image
                        source={global.ASSETS.GOALPLUS}
                        style={styles.goalplus}
                    />
                    <Text style={styles.MoreExceptionstext}>
                        More Exceptions
                    </Text>
                </TouchableOpacity>
            </>
        )
    }
    return null
}
const styles = StyleSheet.create({
    excepttext: {
        fontSize: 16,
        fontWeight: '500',
        color: '#777777',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    doubledatebox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        width: '100%',
        justifyContent: 'space-between',
    },
    fromtomain: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
        width: '100%',
    },
    fromto: {
        color: '#B2AFAF',
        fontSize: 14,
        fontWeight: '400',
        fontFamily: text.FONT_FAMILY.REGULAR,
        flex: 1,
    },
    datebox: {
        borderWidth: 1.5,
        borderColor: '#ccc',
        width: '49%',
        height: 42,
        borderRadius: 7,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    },
    date: {
        fontSize: 18,
        fontWeight: '400',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        paddingHorizontal: 10,
    },

    closeIconView: {
        height: 32,
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 16,
        right: 0,
        zIndex: 999,
    },
    closeIcon: {
        height: 24,
        width: 24,
        resizeMode: 'contain',
    },
    plusmoremain: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 16,
    },
    goalplus: {
        width: 20,
        height: 20,
    },
    MoreExceptionstext: {
        marginHorizontal: 10,
        fontSize: 16,
        fontWeight: '500',
        color: '#595959',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    modalDivider: {
        width: '150%',
        marginTop: 16,
        alignSelf: 'center',
    },
    timeInputView: {
        borderWidth: 1.5,
        borderColor: '#ccc',
        width: '48%',
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 8,
        paddingRight: 5,
    },
    amPmView: {
        backgroundColor: '#F5F5F5',
        width: '49%',
        height: 42,
        borderRadius: 8,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    selectedAmButtonStyle: {
        width: 40,
        height: 36,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    time: {
        fontSize: 18,
        fontWeight: '400',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        paddingLeft: 5,
        color: 'black',
    },
    amTextStyle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#828282',
    },
})
export default CustomReminderExceptionTime
