import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import { color, text } from '../styles/basic'
import global from '../../global'
import { ScaledSheet } from 'react-native-size-matters'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSelectReminder } from '../reducers/ReminderFormReducers'
import CustomReminderPicker from './CustomReminderPicker'

const DueDateReminderPopup = ({ isVisible, onClose, endDate }) => {
    const { defaultReminder, selected_reminders } = useSelector(
        (state) => state.reminderForm
    )
    const [isPickerVisible, setPickerVisible] = useState(false)
    const [pickerValue, setPickerValue] = useState({
        selectedNumber: '1',
        selectedUnit: 'day',
    })
    const refRBSheet = useRef(null)
    const beforeDate = useRef(null)

    const dispatch = useDispatch()

    const onCloseBottomSheet = useCallback(() => {
        onClose && onClose(beforeDate.current)
    }, [onClose])

    useEffect(() => {
        if (isVisible) {
            refRBSheet.current?.open()
        }
    }, [isVisible])

    const onUpdateDefaultReminder = useCallback(
        (data) => {
            dispatch(toggleSelectReminder(data))
        },
        [onClose]
    )

    const onTogglePicker = useCallback(() => {
        setPickerVisible((prevState) => !prevState)
    }, [])

    const onChangePickerValue = useCallback(
        (selectedNumber, selectedUnit, localBeforeDate) => {
            setPickerValue({
                selectedNumber,
                selectedUnit,
            })
            beforeDate.current = localBeforeDate
        },
        []
    )

    const isMonthBeforeDueDateSelected = !!selected_reminders.filter(
        (item) => item.reminder_type === 'month_before_due_date'
    ).length
    const isWeekBeforeDueDateSelected = !!selected_reminders.filter(
        (item) => item.reminder_type === 'week_before_due_date'
    ).length
    const isDayBeforeDueDateSelected = !!selected_reminders.filter(
        (item) => item.reminder_type === 'day_before_due_date'
    ).length
    const isOnDueDateSelected = !!selected_reminders.filter(
        (item) => item.reminder_type === 'on_due_date'
    ).length

    const infoText = selected_reminders
        .map((item) => {
            switch (item.reminder_type) {
                case 'month_before_due_date':
                    return '1 month'
                case 'week_before_due_date':
                    return '1 week'
                case 'day_before_due_date':
                    return '1 day'
                case 'on_due_date':
                    return 'on date'
                default:
                    return ''
            }
        })
        .join(', ')

    const isConfirmButtonDisabled =
        !isMonthBeforeDueDateSelected &&
        !isWeekBeforeDueDateSelected &&
        !isDayBeforeDueDateSelected &&
        !isOnDueDateSelected

    const { selectedNumber, selectedUnit } = pickerValue

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
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 16,
                    paddingBottom: 20,
                }}
                bounces={false}
            >
                <View style={styles.mainView}>
                    <TouchableOpacity
                        onPress={() => {
                            refRBSheet.current?.close()
                        }}
                    >
                        <Image
                            style={styles.CROSSBAG}
                            source={global.ASSETS.CROSSBAG}
                        />
                    </TouchableOpacity>

                    <Text style={styles.setReminderstext}>
                        {'Reminder as Due Date Approaches'}
                    </Text>
                    <View style={styles.infoView}>
                        <Text
                            style={styles.infoText}
                        >{`Reminder will be sent ${infoText} ${
                            selectedNumber ? `, ${selectedNumber}` : ''
                        } ${selectedUnit ? selectedUnit : ''}${
                            selectedNumber !== '1' ? 's' : ''
                        }  before`}</Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.checkboxsirsview,
                            defaultReminder?.disableMonthBeforeDueDate &&
                                styles.disabledColor,
                        ]}
                        onPress={() => {
                            onUpdateDefaultReminder({
                                reminder_type: 'month_before_due_date',
                                reminder_date:
                                    defaultReminder.month_before_due_date,
                            })
                        }}
                        disabled={defaultReminder?.disableMonthBeforeDueDate}
                    >
                        <Image
                            style={styles.box}
                            source={
                                isMonthBeforeDueDateSelected
                                    ? global.ASSETS.RIGHTCLICK
                                    : global.ASSETS.BOX
                            }
                        />
                        <Text style={styles.onemonth}>
                            1 month before Due Date
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.borderline} />

                    <TouchableOpacity
                        style={[
                            styles.checkboxsirsview,
                            defaultReminder?.disableWeekBeforeDueDate &&
                                styles.disabledColor,
                        ]}
                        disabled={defaultReminder?.disableWeekBeforeDueDate}
                        onPress={() => {
                            onUpdateDefaultReminder({
                                reminder_type: 'week_before_due_date',
                                reminder_date:
                                    defaultReminder.week_before_due_date,
                            })
                        }}
                    >
                        <Image
                            style={styles.box}
                            source={
                                isWeekBeforeDueDateSelected
                                    ? global.ASSETS.RIGHTCLICK
                                    : global.ASSETS.BOX
                            }
                        />
                        <Text style={styles.onemonth}>
                            1 week before Due Date
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.borderline} />

                    <TouchableOpacity
                        style={[
                            styles.checkboxsirsview,
                            defaultReminder?.disableDayBeforeDueDate &&
                                styles.disabledColor,
                        ]}
                        disabled={defaultReminder?.disableDayBeforeDueDate}
                        onPress={() => {
                            onUpdateDefaultReminder({
                                reminder_type: 'day_before_due_date',
                                reminder_date:
                                    defaultReminder.day_before_due_date,
                            })
                        }}
                    >
                        <Image
                            style={styles.box}
                            source={
                                isDayBeforeDueDateSelected
                                    ? global.ASSETS.RIGHTCLICK
                                    : global.ASSETS.BOX
                            }
                        />
                        <Text style={styles.onemonth}>
                            1 day before Due Date
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.borderline} />

                    <TouchableOpacity
                        style={[
                            styles.checkboxsirsview,
                            defaultReminder?.disableOnDueDate &&
                                styles.disabledColor,
                        ]}
                        disabled={defaultReminder?.disableOnDueDate}
                        onPress={() => {
                            onUpdateDefaultReminder({
                                reminder_type: 'on_due_date',
                                reminder_date: defaultReminder.on_due_date,
                            })
                        }}
                    >
                        <Image
                            style={styles.box}
                            source={
                                isOnDueDateSelected
                                    ? global.ASSETS.RIGHTCLICK
                                    : global.ASSETS.BOX
                            }
                        />
                        <Text style={styles.onemonth}>On Due Date</Text>
                    </TouchableOpacity>

                    <View style={styles.borderline} />

                    <TouchableOpacity
                        style={[
                            styles.checkboxsirsview,
                            !endDate && styles.disabledColor,
                        ]}
                        onPress={onTogglePicker}
                        disabled={!endDate}
                    >
                        <Image
                            style={styles.box}
                            source={
                                isPickerVisible
                                    ? global.ASSETS.RIGHTCLICK
                                    : global.ASSETS.BOX
                            }
                        />
                        <Text style={styles.onemonth}>Custom</Text>
                    </TouchableOpacity>

                    <View style={styles.borderline} />
                    {isPickerVisible && endDate && (
                        <CustomReminderPicker
                            onChangePickerValue={onChangePickerValue}
                            endDate={endDate}
                        />
                    )}
                    <TouchableOpacity
                        disabled={isConfirmButtonDisabled}
                        onPress={() => {
                            refRBSheet.current?.close()
                        }}
                        style={[
                            styles.BUTTONVIEW1,
                            isConfirmButtonDisabled && styles.disabledColor,
                        ]}
                    >
                        <Text style={styles.BUTTONTEXT1}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </RBSheet>
    )
}
const styles = ScaledSheet.create({
    mainView: {
        flex: 1,
    },
    UPBORDER: {
        borderWidth: '2@s',
        marginTop: '10@s',
        alignSelf: 'center',
        borderColor: '#C4C4C4',
        width: '40@s',
        borderRadius: '32@s',
    },
    CROSSBAG: {
        alignSelf: 'flex-end',
        width: '21@s',
        height: '21@s',
        marginHorizontal: '20@s',
        bottom: '5@s',
    },
    setReminderstext: {
        textAlign: 'center',
        fontSize: '18@s',
        fontWeight: '700',
        color: '#000000',
        fontFamily: text.FONT_FAMILY.BOLD,
        marginBottom: 30,
    },
    borderline: {
        borderWidth: '1@s',
        borderColor: '#E0E0E0',
        width: '120%',
        alignSelf: 'center',
    },
    checkboxsirsview: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 55,
        paddingHorizontal: '30@s',
        width: '110%',
        alignSelf: 'center',
    },
    box: {
        width: '19@s',
        height: '19@s',
    },
    onemonth: {
        fontSize: '17@s',
        fontWeight: '600',
        color: '#777777',
        marginHorizontal: '10@s',
        width: '90%',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    BUTTONVIEW1: {
        marginTop: '30@s',
        backgroundColor: color.GM_BLUE_DEEP,
        width: '310@s',
        height: '38@s',
        borderRadius: '3@s',
        alignSelf: 'center',
        justifyContent: 'center',
    },

    BUTTONTEXT1: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    overlymain: {
        backgroundColor: 'red',
        width: '100%@s',
        height: '486@s',
        borderTopLeftRadius: '16@s',
        borderTopRightRadius: '16@s',
    },
    overlayStyle: {
        position: 'absolute',
        bottom: 0,
        borderRadius: '16@s',
    },
    overlyconteinar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    bellmain: {
        width: '90@s',
        height: '100@s',
        backgroundColor: '#FFFFFF',
        marginHorizontal: '10@s',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    imgbag: {
        width: '40@s',
        height: '40@s',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    img1: {
        width: '18@s',
        height: '16@s',
        alignSelf: 'center',
    },
    bellallview: {
        marginTop: '20@s',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    textallview: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: '10@s',
        marginBottom: '20@s',
    },
    text: {
        fontSize: '14@s',
        fontWeight: '500',
        color: '#828282',
        fontFamily: text.FONT_FAMILY.REGULAR,
    },
    botton: {
        backgroundColor: '#FFFFFF',
        width: '315@s',
        height: '63@s',
        marginHorizontal: '10@s',
        marginTop: '10@s',
        borderRadius: 10,
        justifyContent: 'center',
    },
    shareandimg: {
        flexDirection: 'row',
    },
    share: {
        width: '21.28@s',
        height: '23.17@s',
        marginHorizontal: '20@s',
    },
    shereupdatetext: {
        fontSize: '15@s',
        fontWeight: '600',
        color: '#828282',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    hand: {
        width: '16.21@s',
        height: '23.57@s',
        marginHorizontal: '20@s',
    },
    bellimg: {
        width: '22@s',
        height: '21@s',
        tintColor: '#B5B4B4',
    },
    msgimg: {
        width: '21@s',
        height: '18.75@s',
    },
    drftimg: {
        width: '20.73@s',
        height: '17.42@s',
    },
    borderup: {
        borderWidth: 2,
        width: 50,
        height: 0,
        alignSelf: 'center',
        marginBottom: 10,
        borderRadius: 20,
        borderColor: '#ccc',
    },
    disabledColor: {
        backgroundColor: '#F2F2F2',
    },
    infoView: {
        paddingVertical: 16,
        paddingHorizontal: '10%',
        width: '120%',
        minHeight: 70,
        backgroundColor: '#f7f7f7',
        alignSelf: 'center',
    },
    infoText: {
        fontSize: 15,
        color: '#999999',
        fontFamily: 'SFProDisplay-Regular',
    },
})

export default DueDateReminderPopup
