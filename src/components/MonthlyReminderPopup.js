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
import { scale } from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Divider } from 'react-native-elements'
import { Picker } from '@react-native-picker/picker'
import { text } from '../styles/basic'
import global from '../../global'
import { getReminderTimeForCustom, numberSuffix } from '../Utils/HelperMethods'
import MonthlyDayView from './MonthlyDayView'
import MonthlyOnTheView from './MonthlyOnTheView'
import { useSelector } from 'react-redux'
const { width } = Dimensions.get('window')

const MonthlyReminderPopup = ({ isVisible, onClose, initialState }) => {
    const refRBSheet = useRef(null)
    const [category, setCategory] = useState({
        every: true,
        each: true,
        onThe: false,
    })
    const selectedMonthDayText = useRef('')
    const [selectedMonths, setSelectedMonths] = useState(
        initialState?.everyMonth || '1'
    )
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
    const { startDate } = useSelector(
        (state) => state.reminderForm?.customReminderForms
    )

    useEffect(() => {
        if (isVisible) {
            refRBSheet.current?.open()
        }
    }, [isVisible])

    useEffect(() => {}, [selectedMonthDay])

    const onPressCategory = useCallback(
        (key) => {
            let tempObj = {}
            if (key === 'each') {
                tempObj.onThe = false
            } else if (key === 'onThe') {
                tempObj.each = false
            }
            setCategory((prevState) => ({
                ...prevState,
                [key]: !prevState[key],
                ...tempObj,
            }))
        },
        [category]
    )

    const onCloseBottomSheet = useCallback(() => {
        onClose &&
            onClose(
                selectedMonths,
                category.onThe ? [] : selectedMonthDay,
                category.onThe ? onSelectedWeek : '',
                category.onThe ? selectedWeekDay : ''
            )
    }, [
        onClose,
        selectedMonths,
        selectedMonthDay,
        onSelectedWeek,
        selectedWeekDay,
        category,
    ])

    const reminderInfoText = getReminderTimeForCustom({
        type: 'monthly',
        startDate,
        monthlySelectedDays: selectedMonthDay,
        everyMonthWeekDay: category?.each ? '' : onSelectedWeek,
        monthlyWeekDay: category?.each ? '' : selectedWeekDay,
        everyMonth: selectedMonths,
    })

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
                <Text style={styles.title}>Repeat</Text>
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
                <TouchableOpacity
                    onPress={() => onPressCategory('every')}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: scale(20),
                        width: '100%',
                        backgroundColor: 'white',
                    }}
                >
                    <Text style={styles.repet}>Every</Text>
                    <Ionicons
                        name={
                            category?.every
                                ? 'caret-down-outline'
                                : 'caret-forward-outline'
                        }
                        style={{ marginLeft: 6 }}
                        color={category?.every ? '#828282' : '#DADADA'}
                        size={20}
                    />
                </TouchableOpacity>
                <Divider style={styles.modalDivider} />
                {category.every ? (
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
                            style={{ width: scale(100) }}
                            selectedValue={selectedMonths}
                            onValueChange={(itemValue) => {
                                setSelectedMonths(itemValue)
                            }}
                        >
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                            <Picker.Item label="7" value="7" />
                        </Picker>
                        <Text style={[styles.NOTIFICATION]}>
                            {selectedMonths === '1' ? `Month` : `Months`}
                        </Text>
                    </View>
                ) : null}
                <View
                    style={{
                        backgroundColor: '#F7F7F7',
                        paddingVertical: 16,
                        alignSelf: 'center',
                        paddingHorizontal: 16,
                        width: width,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: '400',
                            color: '#999999',
                            fontFamily: text.FONT_FAMILY.REGULAR,
                        }}
                    >
                        {`Reminder will be sent every ${reminderInfoText.replace(
                            /Every /g,
                            ''
                        )}`}
                    </Text>
                </View>
                <MonthlyDayView
                    isVisible={category.each}
                    onToggleVisible={() => onPressCategory('each')}
                    selectedMonthDay={selectedMonthDay}
                    onChangeDate={setSelectedMonthDay}
                />

                <MonthlyOnTheView
                    isVisible={category.onThe}
                    onToggleVisible={() => onPressCategory('onThe')}
                    selectedWeekDay={selectedWeekDay}
                    onChangeWeekday={setSelectedWeekDay}
                    onSelectedWeek={onSelectedWeek}
                    onChangeOnWeek={setOnSelectedWeek}
                />
            </ScrollView>
        </RBSheet>
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
    NOTIFICATION: {
        marginHorizontal: 16,
        fontSize: 16,
        fontWeight: '500',
        color: '#777777',
        textAlignVertical: 'center',
        fontFamily: text.FONT_FAMILY.MEDIUM,
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
})
export default MonthlyReminderPopup
