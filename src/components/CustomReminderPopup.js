/** @format */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView,
    Image,
    Dimensions,
} from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Divider } from 'react-native-elements'
import { text } from '../styles/basic'
import global from '../../global'
import moment from 'moment/moment'
import CustomReminderPicker from './CustomReminderPicker'
import CustomReminderExceptionDate from './CustomReminderExceptionDate'
import CustomReminderExceptionTime from './CustomReminderExceptionTime'
import MonthlyDayView from './MonthlyDayView'
import MonthlyOnTheView from './MonthlyOnTheView'
import { getReminderTimeForCustom } from '../Utils/HelperMethods'
import YearlyOnTheView from './YearlyOnTheView'
import WeeklyDays from './WeeklyDays'
import { useDispatch, useSelector } from 'react-redux'
import { setCustomReminderForms } from '../reducers/ReminderFormReducers'

const { width } = Dimensions.get('window')

const CustomReminderPopup = ({
    isVisible,
    onClose,
    startDate,
    initialState,
}) => {
    const refRBSheet = useRef(null)
    const dispatch = useDispatch()
    const { weeklySelectedDays } = useSelector(
        (state) => state.reminderForm?.customReminderForms
    )

    useEffect(() => {
        if (isVisible) {
            refRBSheet.current?.open()
        }
    }, [isVisible])

    const [pickerValue, setPickerValue] = useState({
        selectedNumber: initialState?.customEvery || '1',
        selectedUnit: initialState?.customEveryUnit || 'day',
    })
    const [exceptionDates, setExceptionsDates] = useState(
        Array.isArray(initialState?.exceptionDates) &&
            initialState?.exceptionDates.length
            ? initialState?.exceptionDates.map((item) => ({
                  fromDate: moment(item.fromDate).format('MM/DD/YYYY'),
                  fromDateFinal: new Date(item.fromDate),
                  fromDateVisible: false,
                  toDate: moment(item.toDate).format('MM/DD/YYYY'),
                  toDateFinal: new Date(item.toDate),
                  toDateVisible: false,
              }))
            : []
    )
    const [exceptionTimes, setExceptionTimes] = useState(
        Array.isArray(initialState?.exceptionTimes) &&
            initialState?.exceptionTimes.length
            ? initialState?.exceptionTimes.map((item) => ({
                  fromTime: new Date(item.fromTime),
                  fromTimeText: moment(item.fromTime).format('hh:mm'),
                  fromTimeVisible: false,
                  fromTimeAm: moment(item.fromTime).format('a') === 'am',
                  toTimeAm: moment(item.toTime).format('a') === 'am',
                  toTime: new Date(item.toTime),
                  toTimeText: moment(item.toTime).format('hh:mm'),
                  toTimeVisible: false,
              }))
            : []
    )
    const [isExceptionVisible, setExceptionVisible] = useState(true)
    const [category, setCategory] = useState({
        monthlyEvery: false,
        monthlyEach: false,
        monthlyOnThe: false,
        yearlyOnThe: true,
    })
    const [onSelectedWeek, setOnSelectedWeek] = useState(
        initialState?.everyMonthWeekDay || '1'
    )
    const [selectedWeekDay, setSelectedWeekDay] = useState(
        initialState?.monthlyWeekDay || '1'
    )
    const [selectedMonthDay, setSelectedMonthDay] = useState(
        Array.isArray(initialState?.monthlySelectedDays) &&
            initialState?.monthlySelectedDays.length
            ? initialState?.monthlySelectedDays?.map((item) => Number(item))
            : [new Date().getDate()]
    )
    const [selectedWeek, setSelectedWeek] = useState(
        initialState?.yearlyWeek || '1'
    )
    const [selectedDay, setSelectedDay] = useState(
        initialState?.yearlyDay || '1'
    )
    const [selectedMonth, setSelectedMonth] = useState(
        initialState?.yearlyMonth || '1'
    )

    const onPressSelectedDay = useCallback(
        (key) => {
            if (weeklySelectedDays.includes(key)) {
                if (weeklySelectedDays.length > 1) {
                    const filterData = weeklySelectedDays.filter(
                        (day) => day !== key
                    )
                    dispatch(
                        setCustomReminderForms({
                            weeklySelectedDays: filterData,
                        })
                    )
                }
            } else {
                dispatch(
                    setCustomReminderForms({
                        weeklySelectedDays: [...weeklySelectedDays, key],
                    })
                )
            }
        },
        [weeklySelectedDays]
    )

    const onCloseBottomSheet = useCallback(() => {
        onClose &&
            onClose(
                pickerValue.selectedNumber,
                pickerValue.selectedUnit,
                exceptionDates.map((item) => ({
                    fromDate: item.fromDateFinal,
                    toDate: item.toDateFinal,
                })),
                exceptionTimes.map((item) => ({
                    fromTime: item.fromTime,
                    toTime: item.toTime,
                })),
                category.monthlyOnThe ? [] : selectedMonthDay,
                category.monthlyOnThe ? selectedWeekDay : '',
                category.monthlyOnThe ? onSelectedWeek : '',
                selectedWeek,
                selectedDay,
                selectedMonth
            )
    }, [
        onClose,
        pickerValue,
        exceptionDates,
        exceptionTimes,
        selectedMonthDay,
        selectedWeekDay,
        onSelectedWeek,
        selectedWeek,
        selectedDay,
        selectedMonth,
        category,
    ])

    const onChangePickerValue = useCallback((selectedNumber, selectedUnit) => {
        setPickerValue({
            selectedNumber,
            selectedUnit,
        })
    }, [])

    const onChangeExceptionDate = useCallback((exceptionDates) => {
        setExceptionsDates(exceptionDates)
    }, [])

    const onChangeExceptionTime = useCallback((exceptionTimes) => {
        setExceptionTimes(exceptionTimes)
    }, [])
    const isMonthlyOrYearly =
        pickerValue.selectedUnit === 'month' ||
        pickerValue.selectedUnit === 'year'

    const reminderInfoText = getReminderTimeForCustom({
        type: 'custom',
        startDate,
        weeklySelectedDays,
        monthlySelectedDays: selectedMonthDay,
        everyMonthWeekDay: category?.monthlyOnThe ? onSelectedWeek : '',
        monthlyWeekDay: category?.monthlyOnThe ? selectedWeekDay : '',
        customEvery: pickerValue.selectedNumber,
        customEveryUnit: pickerValue.selectedUnit,
        exceptionDates,
        exceptionTimes,
        yearlyDay: selectedDay,
        yearlyWeek: selectedWeek,
        yearlyMonth: selectedMonth,
    })
    const { selectedUnit, selectedNumber } = pickerValue

    const isShowMinutes = selectedUnit === 'hour' || selectedUnit === 'minute'

    const onPressCategory = useCallback((key) => {
        let tempObj = {}
        if (key === 'monthlyEach') {
            tempObj.monthlyOnThe = false
        } else if (key === 'monthlyOnThe') {
            tempObj.monthlyEach = false
        }
        setCategory((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
            ...tempObj,
        }))
    }, [])

    return (
        <RBSheet
            ref={(ref) => (refRBSheet.current = ref)}
            closeOnDragDown={true}
            dragFromTopOnly={true}
            closeOnPressMask={true}
            customStyles={{
                container: {
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                    height: '90%',
                },
            }}
            animationType={'slide'}
            onClose={onCloseBottomSheet}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        refRBSheet.current?.close()
                    }}
                >
                    <Image
                        style={styles.iconStyle}
                        source={global.ASSETS.LEFTKEY}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Custom</Text>
                <View style={styles.iconStyle} />
            </View>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 16,
                    paddingBottom: 20,
                }}
                bounces={false}
            >
                <Text style={styles.repeteverytext}>Repeat every...</Text>
                <Divider style={styles.modalDivider} />
                {selectedUnit === 'minute' ? (
                    <View style={[styles.notificationview]}>
                        <Text style={styles.Reminderwillbetext}>
                            {`Reminders sent every ${selectedNumber} minutes can only be sent by Push Notification. SMS and Email reminders are unavailable for this function.`}
                        </Text>
                    </View>
                ) : null}
                <CustomReminderPicker
                    onChangePickerValue={onChangePickerValue}
                    initialValue={{
                        selectedUnit: selectedUnit,
                        selectedNumber: selectedNumber,
                    }}
                />
                <View style={[styles.notificationview]}>
                    <Text style={styles.Reminderwillbetext}>
                        {`Reminder will be sent ${
                            pickerValue.selectedUnit === 'day' &&
                            pickerValue.selectedNumber === '1'
                                ? 'daily '
                                : 'every '
                        }${reminderInfoText.replace(/Every |Daily /g, '')}`}
                    </Text>
                </View>
                {pickerValue.selectedUnit === 'week' ? (
                    <WeeklyDays
                        selectedWeekDay={weeklySelectedDays}
                        onSelectDay={onPressSelectedDay}
                    />
                ) : null}
                {!isMonthlyOrYearly ? (
                    <>
                        <TouchableOpacity
                            style={styles.exportimgmain}
                            onPress={() => {
                                setExceptionVisible((prevState) => !prevState)
                            }}
                        >
                            <Text style={styles.excepttext}>Except</Text>
                            <Ionicons
                                name={
                                    isExceptionVisible
                                        ? 'caret-down-outline'
                                        : 'caret-forward-outline'
                                }
                                color={
                                    isExceptionVisible ? '#828282' : '#DADADA'
                                }
                                size={20}
                                style={styles.exceptimg}
                                // color={global.COLOR.NORMAL}
                            />
                        </TouchableOpacity>
                        <CustomReminderExceptionTime
                            isVisible={isExceptionVisible && isShowMinutes}
                            onChangeExceptionTime={onChangeExceptionTime}
                            initialValues={exceptionTimes}
                        />
                        <CustomReminderExceptionDate
                            isVisible={isExceptionVisible && !isShowMinutes}
                            onChangeExceptionDate={onChangeExceptionDate}
                            initialValues={exceptionDates}
                        />
                    </>
                ) : null}
                {pickerValue.selectedUnit === 'month' ? (
                    <>
                        <MonthlyDayView
                            isVisible={category.monthlyEach}
                            onToggleVisible={() =>
                                onPressCategory('monthlyEach')
                            }
                            selectedMonthDay={selectedMonthDay}
                            onChangeDate={setSelectedMonthDay}
                        />

                        <MonthlyOnTheView
                            isVisible={category.monthlyOnThe}
                            onToggleVisible={() =>
                                onPressCategory('monthlyOnThe')
                            }
                            selectedWeekDay={selectedWeekDay}
                            onChangeWeekday={setSelectedWeekDay}
                            onSelectedWeek={onSelectedWeek}
                            onChangeOnWeek={setOnSelectedWeek}
                        />
                    </>
                ) : null}
                {pickerValue.selectedUnit === 'year' ? (
                    <YearlyOnTheView
                        isVisible={category.yearlyOnThe}
                        onToggleVisible={() => onPressCategory('yearlyOnThe')}
                        selectedWeek={selectedWeek}
                        onSelectedWeek={setSelectedWeek}
                        selectedDay={selectedDay}
                        onSelectedDay={setSelectedDay}
                        selectedMonth={selectedMonth}
                        onSelectedMonth={setSelectedMonth}
                    />
                ) : null}
            </ScrollView>
        </RBSheet>
    )
}
const styles = StyleSheet.create({
    modalDivider: {
        width: '150%',
        marginTop: 16,
        alignSelf: 'center',
    },
    header: {
        height: 30,
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        textAlignVertical: 'center',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    iconStyle: {
        height: 16,
        width: 16,
        resizeMode: 'contain',
    },
    repeteverytext: {
        fontSize: 16,
        fontWeight: '500',
        color: '#777777',
        marginTop: 20,
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },

    Reminderwillbetext: {
        fontSize: 15,
        fontWeight: '400',
        color: '#999999',
        fontFamily: text.FONT_FAMILY.REGULAR,
    },
    notificationview: {
        width: width,
        backgroundColor: '#F7F7F7',
        marginTop: 20,
        paddingVertical: 16,
        alignSelf: 'center',
        paddingHorizontal: 16,
    },
    exportimgmain: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },

    exceptimg: {
        marginHorizontal: 6,
        marginTop: 2,
    },
    excepttext: {
        fontSize: 16,
        fontWeight: '500',
        color: '#777777',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
})
export default CustomReminderPopup
