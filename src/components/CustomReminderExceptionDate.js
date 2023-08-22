import React, { useCallback, useState } from 'react'
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    Image,
    Platform,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { color, text } from '../styles/basic'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Divider } from 'react-native-elements'
import global from '../../global'
import moment from 'moment/moment'
import { createCurrentDateWith } from '../Utils/HelperMethods'

const initialExceptSelectedDates = {
    fromDate: '',
    toDate: '',
    fromDateFinal: createCurrentDateWith(0, 0),
    toDateFinal: createCurrentDateWith(23, 59),
    fromDateVisible: false,
    toDateVisible: false,
}

let allowChangeText = [false]

const CustomReminderExceptionDate = ({
    isVisible,
    onChangeExceptionDate,
    initialValues,
}) => {
    const [exceptSelectedDates, setExceptSelectedDates] = useState(
        initialValues.length
            ? initialValues
            : [{ ...initialExceptSelectedDates }]
    )

    const exportDate = useCallback(
        (allDates) => {
            onChangeExceptionDate && onChangeExceptionDate(allDates)
        },
        [onChangeExceptionDate]
    )

    const addException = useCallback(() => {
        setExceptSelectedDates((prevState) => [
            ...prevState,
            { ...initialExceptSelectedDates },
        ])
    }, [])

    const removeException = useCallback(
        (index) => {
            const tempArray = [...exceptSelectedDates]
            tempArray.splice(index, 1)
            exportDate(tempArray)
            setExceptSelectedDates(tempArray)
        },
        [exceptSelectedDates]
    )
    const onKeyPress = useCallback(
        (nativeEvent, index, key) => {
            const tempSelectedDates = [...exceptSelectedDates]
            const tempItem = tempSelectedDates[index]
            const dateType = tempItem[key]
            if (
                nativeEvent.key === 'Backspace' &&
                (dateType.length === 3 || dateType.length === 6)
            ) {
                allowChangeText[index] = false
                if (dateType.length === 6) {
                    tempItem[key] = dateType.substring(0, 3)
                } else if (dateType.length === 3) {
                    tempItem[key] = ''
                }
                tempSelectedDates[index] = tempItem
                setExceptSelectedDates(tempSelectedDates)
            } else {
                allowChangeText[index] = true
            }
        },
        [exceptSelectedDates]
    )

    const onChangeText = useCallback(
        (text, index, key) => {
            if (!allowChangeText[index]) {
                return
            }
            const tempSelectedDates = [...exceptSelectedDates]
            const tempItem = tempSelectedDates[index]
            tempItem[key] =
                (text.length === 2 && text.indexOf('/') === -1) ||
                text.length === 5
                    ? `${text}/`
                    : text
            tempSelectedDates[index] = tempItem
            setExceptSelectedDates(tempSelectedDates)
        },
        [exceptSelectedDates]
    )

    const changeDatePickerStatus = useCallback(
        (index, key, status) => {
            const tempSelectedDates = [...exceptSelectedDates]
            const tempItem = tempSelectedDates[index]
            tempItem[key] = status
            tempSelectedDates[index] = tempItem
            setExceptSelectedDates(tempSelectedDates)
        },
        [exceptSelectedDates]
    )

    const onChangeDate = useCallback(
        (date, index, key) => {
            const newDate = moment(date).format('MM/DD/YYYY')
            const tempSelectedDates = [...exceptSelectedDates]
            const tempItem = tempSelectedDates[index]
            tempItem[key] = newDate
            tempItem[key + 'Final'] = key?.includes('from')
                ? createCurrentDateWith(0, 0, date)
                : createCurrentDateWith(23, 59, date)
            if (
                key?.includes('from') &&
                (!tempItem.toDate ||
                    moment(date).isAfter(moment(tempItem['toDateFinal'])))
            ) {
                tempItem['toDate' + 'Final'] = createCurrentDateWith(
                    23,
                    59,
                    date
                )
                tempItem['toDate'] = newDate
            }
            tempItem[key + 'Visible'] = false
            tempSelectedDates[index] = tempItem
            setExceptSelectedDates(tempSelectedDates)
            exportDate(tempSelectedDates)
        },
        [exceptSelectedDates, exportDate]
    )

    const onBlur = useCallback(
        (index, key) => {
            const tempSelectedDates = [...exceptSelectedDates]
            const tempItem = tempSelectedDates[index]
            const text = tempItem[key]
            if (text.length === 10) {
                const date = moment(text)
                if (date.isValid()) {
                    tempItem[key + 'Final'] = date
                    tempSelectedDates[index] = tempItem
                    setExceptSelectedDates(tempSelectedDates)
                    exportDate(tempSelectedDates)
                }
            }
        },
        [exportDate, exceptSelectedDates]
    )

    if (isVisible) {
        return (
            <>
                {exceptSelectedDates.map((_, index) => (
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
                            <TouchableOpacity
                                style={styles.datebox}
                                onPress={() => {
                                    changeDatePickerStatus(
                                        index,
                                        'fromDateVisible',
                                        true
                                    )
                                }}
                            >
                                <TextInput
                                    style={styles.date}
                                    placeholder="MM/DD/YYYY"
                                    maxLength={10}
                                    keyboardType="number-pad"
                                    editable={false}
                                    pointerEvents={'none'}
                                    value={exceptSelectedDates[index].fromDate}
                                    onKeyPress={({ nativeEvent }) => {
                                        onKeyPress(
                                            nativeEvent,
                                            index,
                                            'fromDate'
                                        )
                                    }}
                                    onChangeText={(text) => {
                                        onChangeText(text, index, 'fromDate')
                                    }}
                                    onBlur={() => {
                                        onBlur(index, 'fromDate')
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        changeDatePickerStatus(
                                            index,
                                            'fromDateVisible',
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
                                        exceptSelectedDates[index]
                                            .fromDateVisible
                                    }
                                    mode="date"
                                    display={
                                        Platform.OS === 'ios'
                                            ? 'inline'
                                            : 'default'
                                    }
                                    date={
                                        exceptSelectedDates[index].fromDateFinal
                                    }
                                    onConfirm={(date) => {
                                        onChangeDate(date, index, 'fromDate')
                                    }}
                                    minimumDate={new Date()}
                                    onCancel={() => {
                                        changeDatePickerStatus(
                                            index,
                                            'fromDateVisible',
                                            false
                                        )
                                    }}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.datebox}
                                onPress={() => {
                                    changeDatePickerStatus(
                                        index,
                                        'toDateVisible',
                                        true
                                    )
                                }}
                            >
                                <TextInput
                                    style={styles.date}
                                    placeholder="MM/DD/YYYY"
                                    maxLength={10}
                                    editable={false}
                                    pointerEvents={'none'}
                                    keyboardType="number-pad"
                                    value={exceptSelectedDates[index].toDate}
                                    onKeyPress={({ nativeEvent }) => {
                                        onKeyPress(nativeEvent, index, 'toDate')
                                    }}
                                    onChangeText={(text) => {
                                        onChangeText(text, index, 'toDate')
                                    }}
                                    onBlur={() => {
                                        onBlur(index, 'toDate')
                                    }}
                                />

                                <TouchableOpacity
                                    onPress={() => {
                                        changeDatePickerStatus(
                                            index,
                                            'toDateVisible',
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
                                        exceptSelectedDates[index].toDateVisible
                                    }
                                    mode="date"
                                    display={
                                        Platform.OS === 'ios'
                                            ? 'inline'
                                            : 'default'
                                    }
                                    date={
                                        exceptSelectedDates[index].toDateFinal
                                    }
                                    onConfirm={(date) => {
                                        onChangeDate(date, index, 'toDate')
                                    }}
                                    minimumDate={new Date()}
                                    onCancel={() => {
                                        changeDatePickerStatus(
                                            index,
                                            'toDateVisible',
                                            false
                                        )
                                    }}
                                />
                            </TouchableOpacity>
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
        color: 'black',
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
})
export default CustomReminderExceptionDate
