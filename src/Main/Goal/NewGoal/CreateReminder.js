import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    SafeAreaView,
    StyleSheet,
    ActivityIndicator,
    Platform,
} from 'react-native'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { scale } from 'react-native-size-matters'
const windowWidth = Dimensions.get('screen').width
import global from '../../../../global'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Divider, Overlay } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment/moment'
import { Picker } from '@react-native-picker/picker'
import AudioModal from '../../../components/AudioModal'
import DropdownAlert from 'react-native-dropdownalert-jia'
import { color, text } from '../../../styles/basic'
import EmojiPicker from 'rn-emoji-keyboard'
import AudioPlayerComponent from '../../../components/AudioPlayer'
import Video from 'react-native-video'

import ReminderNotificationView from '../../../components/ReminderNotificationView'
import MonthlyReminderPopup from '../../../components/MonthlyReminderPopup'
import CustomReminderPopup from '../../../components/CustomReminderPopup'
import DueDateReminderPopup from '../../../components/DueDateReminderPopup'
import SoundPopup from '../../../components/SoundPopup'
import ReminderEndRepeatModal from '../../../components/ReminderEndRepeatModal'
import ImagePickerPopup from '../../../components/ImagePickerPopup'
import CustomReminderTextInput from '../../../components/CustomReminderTextInput'
import Global from '../../../../global'
import {
    getReminderTimeForCustom,
    getSelectedYearlyText,
    millisToMinutesAndSeconds,
    numberSuffix,
} from '../../../Utils/HelperMethods'
import { useDispatch, useSelector } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
    resetCustomReminderForms,
    setCustomReminderForms,
} from '../../../reducers/ReminderFormReducers'
import {
    createNewReminder,
    updateCustomReminder,
} from '../../../actions/ReminderActions'
import ReminderSuccessView from '../../../components/ReminderSuccessView'
import ReminderErrorView from '../../../components/ReminderErrorView'
import WeeklyDays from '../../../components/WeeklyDays'
import { Actions } from 'react-native-router-flux'
import ReminderForModal from '../../../components/ReminderForModal'
import ReminderMemberProfiles from '../../../components/ReminderMemberProfiles'
import { REMINDER_FOR } from '../../../Utils/Constants'
import ReminderContactList from '../../../components/ReminderContactList'
const SCREEN_WIDTH = Dimensions.get('window').width

let allowChangeText = true

const dayNames = {
    '0': 'Sunday',
    '1': 'Monday',
    '2': 'Tuesday',
    '3': 'Wednesday',
    '4': 'Thursday',
    '5': 'Friday',
    '6': 'Saturday',
}

const initialError = {
    weeklyError: '',
    messageError: '',
    contactError: '',
    friendsError: '',
}

const CreateReminder = ({ navigation, selectedReminder }) => {
    const [startDateText, setStartDateText] = useState(
        moment(selectedReminder?.start_date).format('MM-DD-yyyy')
    )
    const [startTime, setStartTime] = useState(
        selectedReminder?.start_date
            ? new Date(selectedReminder?.start_date)
            : moment().set({ hour: 9, minute: 0 }).toDate()
    )
    const [startTimeText, setStartTimeText] = useState(
        selectedReminder?.start_date
            ? moment(selectedReminder?.start_date).format('hh:mm A')
            : '9:00 AM'
    )

    const [imagePickerPopupVisible, setImagePickerPopupVisible] = useState(
        false
    )
    const [
        soundAndNotificationPopupVisible,
        setSoundAndNotificationPopupVisible,
    ] = useState(false)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false)
    const [repeatModalVisible, setRepeatModalVisible] = useState(false)
    const [successPopup, setSuccessPopup] = useState(false)
    const [errorPopup, setErrorPopup] = useState(false)
    const [isEndRepeatPopupVisible, setIsEndRepeatPopupVisible] = useState(
        false
    )
    const [isReminderForPopupVisible, setIsReminderForPopupVisible] = useState(
        false
    )
    const [weeklyOrYearlyExtent, setWeeklyOrYearlyExtent] = useState(false)
    const [monthModal, setMonthModal] = useState(false)
    const [customPopupVisible, setCustomPopupVisible] = useState(false)
    const [dueDatePopupVisible, setDueDatePopupVisible] = useState(false)
    const [error, setError] = useState(initialError)

    const [emojiModalVisible, setEmojiModalVisible] = useState(false)
    const [reminderTextModal, setReminderTextModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [contactCounter, setContactCounter] = useState({
        recipientTotalEmail: 0,
        recipientTotalNumber: 0,
    })
    const {
        startDate,
        repeatType,
        repeatTypeText,
        weeklySelectedDays,
        everyWeek,
        endRepeat,
        message,
        reminderMedia,
        reminderAudios,
        customEveryUnit,
        customEvery,
        sound,
        monthlySelectedDays,
        yearlyMonth,
        yearlyDay,
        yearlyWeek,
        everyYear,
        everyMonth,
        exceptionDates,
        exceptionTimes,
        everyMonthWeekDay,
        monthlyWeekDay,
        endRepeatDate,
        reminder_for,
        recipient_users_details,
        recipient_contacts,
    } = useSelector((state) => state.reminderForm?.customReminderForms)
    const goalDetails = useSelector((state) => state.reminderForm?.selectedGoal)

    const dispatch = useDispatch()
    const numberOfReminderCreated = useRef(
        goalDetails?.active_reminders?.length ? 1 : 0
    )

    const handlePick = (emoji) => {
        dispatch(
            setCustomReminderForms({
                message: message + emoji?.emoji,
            })
        )
        setEmojiModalVisible((prev) => !prev)
    }

    const [voiceModalVisible, setVoiceModalVisible] = useState(false)

    const endRepeatDateText = useRef('')
    const exceptionDateText = useRef('')
    const exceptionTimeText = useRef('')
    const reminder_for_ref = useRef(reminder_for)
    const recipientUserRef = useRef(recipient_users_details)
    const recipientContactRef = useRef(recipient_contacts)

    useEffect(() => {
        reminder_for_ref.current = reminder_for
        recipientContactRef.current = recipient_contacts
        recipientUserRef.current = recipient_users_details
    }, [reminder_for, recipient_users_details, recipient_contacts])

    useEffect(() => {
        if (Array.isArray(recipient_contacts)) {
            let emailCounter = 0
            let numberCounter = 0
            recipient_contacts.forEach((item) => {
                if (item?.email) {
                    emailCounter += 1
                }
                if (item?.phone_number) {
                    numberCounter += 1
                }
            })
            setContactCounter({
                recipientTotalEmail: emailCounter,
                recipientTotalNumber: numberCounter,
            })
        }
    }, [recipient_contacts])

    const showDatePicker = () => {
        setDatePickerVisibility(true)
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false)
    }

    useEffect(() => {
        const unSubscribe = navigation.addListener('didFocus', () => {
            if (
                reminder_for_ref.current === REMINDER_FOR.FRIENDS &&
                recipientUserRef.current.length
            ) {
                setError((prevState) => ({ ...prevState, friendsError: '' }))
            }
            if (
                reminder_for_ref.current === REMINDER_FOR.CONTACTS &&
                recipientContactRef.current.length
            ) {
                setError((prevState) => ({ ...prevState, contactError: '' }))
            }
        })
        return () =>
            unSubscribe && typeof unSubscribe === 'function' && unSubscribe()
    }, [])

    const handleConfirm = useCallback(
        (date) => {
            const time = startTime
            const hours = time.getHours()
            const minutes = time.getMinutes()
            const tempDate = new Date(date)
            tempDate.setHours(hours, minutes)
            dispatch(
                setCustomReminderForms({
                    startDate: tempDate,
                    endRepeat: 'never',
                    repeatType: 'never',
                    repeatTypeText: 'Never',
                })
            )
            const newDate = moment(date).format('MM/DD/YYYY')
            setStartDateText(newDate)
            hideDatePicker()
        },
        [dispatch, startTime]
    )

    const showTimePicker = () => {
        setTimePickerVisibility(true)
    }

    const hideTimePicker = () => {
        setTimePickerVisibility(false)
    }

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
                setError((prevState) => ({ ...prevState, weeklyError: '' }))
                dispatch(
                    setCustomReminderForms({
                        weeklySelectedDays: [...weeklySelectedDays, key],
                    })
                )
            }
        },
        [weeklySelectedDays]
    )
    const handleConfirm2 = useCallback(
        (time) => {
            setStartTime(time)
            const startTime = moment(time).format('LT')
            setStartTimeText(startTime)
            hideTimePicker()
            const date = startDate
            const hours = time.getHours()
            const minutes = time.getMinutes()
            date.setHours(hours, minutes)
            dispatch(
                setCustomReminderForms({
                    startDate: date,
                })
            )
        },
        [dispatch, startDate]
    )

    const updateDuration = useCallback(
        (duration, index) => {
            const tempAllMedia = [...reminderMedia]
            const particularVideo = { ...tempAllMedia[index] }
            particularVideo.duration = Math.round(duration * 1000)
            tempAllMedia[index] = particularVideo
            dispatch(
                setCustomReminderForms({
                    reminderMedia: tempAllMedia,
                })
            )
        },
        [reminderMedia]
    )

    const deleteImage = useCallback(
        (id) => {
            dispatch(
                setCustomReminderForms({
                    reminderMedia: reminderMedia.filter((t) => t.id !== id),
                })
            )
        },
        [reminderMedia]
    )
    let dropDownAlertRef = useRef()

    const onCloseSuccessPopup = useCallback(() => {
        Actions.pop()
        setSuccessPopup(false)
    }, [])

    const onCloseErrorPopup = useCallback(() => {
        setErrorPopup(false)
    }, [])

    const checkError = useCallback(() => {
        let errorDescription = {}
        if (!weeklySelectedDays.length && repeatType === 'weekly') {
            errorDescription.weeklyError = 'Please select any day from above'
        }
        if (
            reminder_for === REMINDER_FOR.FRIENDS &&
            !recipient_users_details.length
        ) {
            errorDescription.friendsError = 'Please select at least one friend'
        }
        if (
            reminder_for === REMINDER_FOR.CONTACTS &&
            !recipient_contacts.length
        ) {
            errorDescription.contactError =
                'Please select at least one contacts'
        }
        if (reminder_for !== REMINDER_FOR.SELF && !message) {
            errorDescription.messageError = 'Message can not be empty'
        }
        setError((prevState) => ({ ...prevState, ...errorDescription }))
        return Object.keys(errorDescription).length > 0
    }, [
        weeklySelectedDays,
        repeatType,
        monthlySelectedDays,
        reminder_for,
        recipient_users_details,
        recipient_contacts,
        message,
    ])

    const onSubmit = useCallback(async () => {
        if (!checkError()) {
            try {
                setIsSubmitting(true)
                if (selectedReminder?._id) {
                    await dispatch(
                        updateCustomReminder(
                            selectedReminder?._id,
                            goalDetails?._id
                        )
                    )
                    Actions.pop()
                } else {
                    await dispatch(
                        createNewReminder(
                            goalDetails?._id,
                            true,
                            numberOfReminderCreated.current
                        )
                    )
                    numberOfReminderCreated.current += 1
                    setSuccessPopup(true)
                    setWeeklyOrYearlyExtent(false)
                    setStartTimeText('9:00 AM')
                    setStartDateText(moment().format('MM-DD-yyyy'))
                    setError(initialError)
                    setStartTime(moment().set({ hour: 9, minute: 0 }).toDate())
                }
                dispatch(resetCustomReminderForms())
                setIsSubmitting(false)
            } catch (e) {
                setErrorPopup(true)
                setIsSubmitting(false)
                console.error('Error in save rmineder', e)
            }
        }
    }, [goalDetails?._id, checkError])

    const isMonthlyOrYearly =
        customEveryUnit === 'month' || customEveryUnit === 'year'

    const monthText =
        customEveryUnit === 'month'
            ? [...monthlySelectedDays]
                  .sort((a, b) => {
                      return a - b
                  })
                  .map((item) => numberSuffix(item))
                  .join(', ')
            : ''

    const yearText =
        customEveryUnit === 'year'
            ? ` on the ${getSelectedYearlyText(
                  yearlyWeek,
                  yearlyDay,
                  yearlyMonth
              )}`
            : ''

    const onText =
        repeatType === 'weekly'
            ? weeklySelectedDays.map((day) => dayNames[day]).join(', ')
            : moment(startDate).format('MMMM DD')

    exceptionDateText.current = exceptionDates
        .map((item) => {
            if (
                moment(item.fromDate).isValid() &&
                moment(item.toDate).isValid()
            ) {
                const fromDate = moment(item.fromDate).format('MMM DD, YYYY')
                const toDate = moment(item.toDate).format('MMM DD, YYYY')
                return `${fromDate} to ${toDate}`
            }
            return ''
        })
        .join('; ')
    exceptionTimeText.current = exceptionTimes
        .map((item) => {
            if (
                moment(item.fromTime).isValid() &&
                moment(item.toTime).isValid()
            ) {
                const fromTime = moment(item.fromTime).format('hh:mma')
                const toTime = moment(item.toTime).format('hh:mma')
                return `${fromTime} to ${toTime}`
            }
            return ''
        })
        .join('; ')

    endRepeatDateText.current = moment(endRepeatDate).format('MM/DD/YYYY')

    const reminderInfoText = getReminderTimeForCustom({
        type: repeatType,
        startDate,
        everyWeek,
        weeklySelectedDays,
        monthlySelectedDays,
        everyMonthWeekDay,
        monthlyWeekDay,
        everyMonth,
        customEvery,
        customEveryUnit,
        exceptionDates,
        exceptionTimes,
        yearlyDay,
        yearlyWeek,
        yearlyMonth,
        everyYear,
    })

    const isContactSelected =
        reminder_for === REMINDER_FOR.CONTACTS && recipient_contacts.length

    return (
        <>
            <SafeAreaView style={{ backgroundColor: color.GM_BLUE }} />
            <SafeAreaView style={styles.safeAreaView}>
                <View
                    style={{ flex: 1 }}
                    key={'mainView' + numberOfReminderCreated.current}
                >
                    <View style={styles.headerview}>
                        <View style={styles.hedertextview}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.cancle}>Cancel</Text>
                            </TouchableOpacity>

                            <Text style={styles.Create}>Create Reminder</Text>
                            <TouchableOpacity
                                onPress={onSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color={'#fff' + ''} />
                                ) : (
                                    <Text style={styles.cancle}>
                                        {!selectedReminder?._id
                                            ? 'Save'
                                            : 'Update'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                        <DropdownAlert
                            warnImageSrc=""
                            warnColor="#F5980C"
                            ref={(ref) => {
                                if (ref) {
                                    dropDownAlertRef = ref
                                }
                            }}
                            tapToCloseEnabled={false}
                            showCancel={true}
                            messageStyle={{
                                fontSize: scale(16),
                                // textAlign: 'left',
                                right: scale(20),
                                fontWeight: '500',
                                color: 'white',
                                backgroundColor: 'transparent',
                            }}
                            defaultContainer={{
                                padding: 8,
                                height: 70,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                            // onCancel={_onCancel}
                            // closeInterval={false}
                            // onTap={_onTap}
                            titleNumOfLines={2}
                            messageNumOfLines={0}

                            // onClose={_onClose}
                        />
                    </View>
                    {successPopup && (
                        <ReminderSuccessView onClose={onCloseSuccessPopup} />
                    )}

                    {errorPopup && (
                        <ReminderErrorView onClose={onCloseErrorPopup} />
                    )}
                    <KeyboardAwareScrollView
                        style={styles.maincontenar}
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        <View style={styles.allview}>
                            {reminder_for === REMINDER_FOR.SELF && (
                                <Text style={styles.finesh}>
                                    {goalDetails?.title || 'none'}
                                </Text>
                            )}
                            {goalDetails?.end &&
                            reminder_for === REMINDER_FOR.SELF ? (
                                <Text style={styles.bydec}>
                                    {`By ${moment(goalDetails?.end).format(
                                        'll'
                                    )}`}
                                </Text>
                            ) : null}
                        </View>

                        {reminder_for === REMINDER_FOR.SELF && (
                            <Divider style={styles.lineborder} />
                        )}

                        <View style={styles.allview}>
                            <View style={styles.datetimeview}>
                                <Text style={styles.Starts}>Starts</Text>
                                <View style={styles.dateContainer}>
                                    <TouchableOpacity
                                        style={styles.datebox}
                                        onPress={showDatePicker}
                                    >
                                        <TextInput
                                            pointerEvents={'none'}
                                            style={styles.date}
                                            placeholder="MM/DD/YYYY"
                                            maxLength={10}
                                            editable={false}
                                            keyboardType="number-pad"
                                            // value={!date ? moment(date).format('MM/DD/YYYY') : null}
                                            value={startDateText}
                                            onKeyPress={({ nativeEvent }) => {
                                                if (
                                                    nativeEvent.key ===
                                                        'Backspace' &&
                                                    (startDateText.length ===
                                                        3 ||
                                                        startDateText.length ===
                                                            6)
                                                ) {
                                                    allowChangeText = false
                                                    if (
                                                        startDateText.length ===
                                                        6
                                                    ) {
                                                        setStartDateText(
                                                            startDateText.substring(
                                                                0,
                                                                3
                                                            )
                                                        )
                                                    } else if (
                                                        startDateText.length ===
                                                        3
                                                    ) {
                                                        setStartDateText('')
                                                    }
                                                } else {
                                                    allowChangeText = true
                                                }
                                            }}
                                            onChangeText={(text) => {
                                                if (allowChangeText) {
                                                    setStartDateText(
                                                        (text.length === 2 &&
                                                            text.indexOf(
                                                                '/'
                                                            ) === -1) ||
                                                            text.length === 5
                                                            ? `${text}/`
                                                            : text
                                                    )
                                                }
                                            }}
                                        />
                                        <View>
                                            <Image
                                                style={styles.CALENDAR}
                                                source={global.ASSETS.CALENDAR}
                                            />
                                        </View>
                                        <DateTimePickerModal
                                            isVisible={isDatePickerVisible}
                                            mode="date"
                                            display={
                                                Platform.OS === 'ios'
                                                    ? 'inline'
                                                    : 'default'
                                            }
                                            minimumDate={new Date()}
                                            date={startDate}
                                            onConfirm={handleConfirm}
                                            onCancel={hideDatePicker}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={showTimePicker}
                                        style={styles.datebox1}
                                    >
                                        <>
                                            <Text style={styles.time}>
                                                {startTimeText}
                                            </Text>

                                            <Ionicons
                                                name="chevron-down-outline"
                                                size={20}
                                                style={styles.SKEY}
                                                color={color.GM_BLUE_DEEP}
                                            />
                                            <DateTimePickerModal
                                                isVisible={isTimePickerVisible}
                                                mode="time"
                                                date={startTime}
                                                onConfirm={handleConfirm2}
                                                onCancel={hideTimePicker}
                                            />
                                        </>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <Divider style={styles.lineborder} />

                        <View style={styles.repetneverview}>
                            <Text style={styles.repet}>Repeat</Text>

                            <TouchableOpacity
                                onPress={() => setRepeatModalVisible(true)}
                                style={styles.neverview}
                            >
                                <Text style={styles.never}>
                                    {repeatType === 'never' ||
                                    repeatType === 'due_date'
                                        ? repeatTypeText
                                        : reminderInfoText}
                                </Text>
                                <View>
                                    <Ionicons
                                        name="chevron-down-outline"
                                        size={20}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {repeatType === 'weekly' || repeatType === 'yearly' ? (
                            <>
                                <Divider style={styles.lineborder} />
                                <View style={styles.repetneverview}>
                                    <Text style={styles.repet}>Every</Text>

                                    <TouchableOpacity
                                        // onPress={() => setNever(false)}

                                        onPress={() => {
                                            setWeeklyOrYearlyExtent(
                                                (prevState) => !prevState
                                            )
                                        }}
                                        style={[
                                            styles.neverview,
                                            {
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            },
                                        ]}
                                    >
                                        <Text style={styles.never}>
                                            {repeatType === 'weekly' &&
                                            everyWeek === '1'
                                                ? `${everyWeek} week`
                                                : repeatType === 'weekly'
                                                ? `${everyWeek} weeks`
                                                : repeatType === 'yearly' &&
                                                  everyYear === '1'
                                                ? `${everyYear} year`
                                                : `${everyYear} years`}
                                        </Text>

                                        <View>
                                            <Ionicons
                                                name="chevron-down-outline"
                                                size={20}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {weeklyOrYearlyExtent ? (
                                    <>
                                        <View
                                            style={{
                                                backgroundColor: '#F7F7F7',
                                                marginTop: 20,
                                                paddingVertical: 16,
                                                alignSelf: 'center',
                                                paddingHorizontal: 16,
                                                width: '100%',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    fontWeight: '400',
                                                    color: '#999999',
                                                    fontFamily:
                                                        text.FONT_FAMILY
                                                            .REGULAR,
                                                }}
                                            >
                                                {`Reminder will be sent every ${reminderInfoText.replace(
                                                    /Every /g,
                                                    ''
                                                )}`}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-evenly',
                                                height: scale(150),
                                                // marginHorizontal: scale(40),
                                                alignSelf: 'center',
                                            }}
                                        >
                                            <Picker
                                                style={{ width: 100 }}
                                                selectedValue={
                                                    repeatType === 'weekly'
                                                        ? everyWeek
                                                        : everyYear
                                                }
                                                onValueChange={(itemValue) => {
                                                    const tempObj = {}
                                                    if (
                                                        repeatType === 'weekly'
                                                    ) {
                                                        tempObj.everyWeek = itemValue
                                                    } else {
                                                        tempObj.everyYear = itemValue
                                                    }

                                                    dispatch(
                                                        setCustomReminderForms({
                                                            ...tempObj,
                                                        })
                                                    )
                                                    setWeeklyOrYearlyExtent(
                                                        false
                                                    )
                                                }}
                                            >
                                                <Picker.Item
                                                    label="1"
                                                    value="1"
                                                />
                                                <Picker.Item
                                                    label="2"
                                                    value="2"
                                                />
                                                <Picker.Item
                                                    label="3"
                                                    value="3"
                                                />
                                                <Picker.Item
                                                    label="4"
                                                    value="4"
                                                />
                                                <Picker.Item
                                                    label="5"
                                                    value="5"
                                                />
                                                <Picker.Item
                                                    label="6"
                                                    value="6"
                                                />
                                                <Picker.Item
                                                    label="7"
                                                    value="7"
                                                />
                                            </Picker>
                                            <Divider />
                                            <Text style={[styles.NOTIFICATION]}>
                                                {repeatType === 'weekly' &&
                                                everyWeek === '1'
                                                    ? `week`
                                                    : repeatType === 'weekly'
                                                    ? `weeks`
                                                    : everyYear === '1'
                                                    ? 'year'
                                                    : 'years'}
                                            </Text>
                                            <Divider />
                                        </View>
                                    </>
                                ) : null}
                                {repeatType === 'weekly' ? (
                                    <>
                                        <Divider style={styles.lineborder} />
                                        <WeeklyDays
                                            selectedWeekDay={weeklySelectedDays}
                                            onSelectDay={onPressSelectedDay}
                                        />
                                    </>
                                ) : null}
                            </>
                        ) : null}

                        {!!error.weeklyError && (
                            <Text style={styles.errorStyle}>
                                {error.weeklyError}
                            </Text>
                        )}
                        {repeatType !== 'never' && (
                            <Divider style={styles.lineborder} />
                        )}
                        {repeatType !== 'never' ? (
                            <View
                                style={[
                                    styles.repetneverview,
                                    { marginTop: 16 },
                                ]}
                            >
                                <Text style={styles.repet}>End Repeat</Text>

                                <TouchableOpacity
                                    onPress={() =>
                                        setIsEndRepeatPopupVisible(true)
                                    }
                                    style={styles.neverview}
                                >
                                    <Text style={styles.never}>
                                        {endRepeat === 'never'
                                            ? 'Never'
                                            : endRepeat === 'on_done'
                                            ? 'When Marked as Done'
                                            : endRepeatDateText.current}
                                    </Text>
                                    <View>
                                        <Ionicons
                                            name="chevron-down-outline"
                                            size={20}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ) : null}
                        {reminder_for !== REMINDER_FOR.SELF ? (
                            <>
                                <Divider style={styles.lineborder} />
                                <View
                                    style={[
                                        styles.repetneverview,
                                        { marginTop: 16 },
                                    ]}
                                >
                                    <Text style={styles.repet}>For</Text>
                                    <View style={styles.FriendContainer}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                setIsReminderForPopupVisible(
                                                    true
                                                )
                                            }
                                            style={styles.neverview}
                                        >
                                            {reminder_for ===
                                                REMINDER_FOR.FRIENDS &&
                                            recipient_users_details.length ? (
                                                <ReminderMemberProfiles
                                                    userDetails={
                                                        recipient_users_details
                                                    }
                                                />
                                            ) : reminder_for ===
                                              REMINDER_FOR.FRIENDS ? (
                                                <Text style={styles.never}>
                                                    {'Friend(s)'}
                                                </Text>
                                            ) : null}
                                            {reminder_for ===
                                            REMINDER_FOR.CONTACTS ? (
                                                <Text style={styles.never}>
                                                    {isContactSelected
                                                        ? `${
                                                              contactCounter.recipientTotalNumber
                                                                  ? contactCounter?.recipientTotalNumber +
                                                                    ' SMS'
                                                                  : ''
                                                          }${
                                                              contactCounter?.recipientTotalEmail &&
                                                              contactCounter?.recipientTotalNumber
                                                                  ? ' & '
                                                                  : ''
                                                          }${
                                                              contactCounter?.recipientTotalEmail
                                                                  ? contactCounter?.recipientTotalEmail +
                                                                    ' Email'
                                                                  : ''
                                                          }${
                                                              contactCounter?.recipientTotalEmail >
                                                              1
                                                                  ? 's'
                                                                  : ''
                                                          }`
                                                        : 'Phone Contact(s)'}
                                                </Text>
                                            ) : null}
                                            <View>
                                                <Ionicons
                                                    name="chevron-down-outline"
                                                    size={20}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        {(reminder_for ===
                                            REMINDER_FOR.FRIENDS &&
                                            error.friendsError) ||
                                        (reminder_for ===
                                            REMINDER_FOR.CONTACTS &&
                                            error.contactError) ? (
                                            <Text
                                                style={[
                                                    styles.errorStyle,
                                                    { marginLeft: 0 },
                                                ]}
                                            >
                                                {REMINDER_FOR.FRIENDS ===
                                                reminder_for
                                                    ? error.friendsError
                                                    : error.contactError}
                                            </Text>
                                        ) : null}
                                    </View>
                                </View>
                            </>
                        ) : null}
                        <ReminderContactList />
                        <MonthlyReminderPopup
                            isVisible={monthModal}
                            initialState={{
                                everyMonth,
                                monthlySelectedDays,
                                everyMonthWeekDay,
                                monthlyWeekDay,
                            }}
                            onClose={(
                                localEveryMonth,
                                localMonthlySelectedDays,
                                localEveryWeekDay,
                                localWeekDay
                            ) => {
                                setMonthModal(false)
                                dispatch(
                                    setCustomReminderForms({
                                        everyMonth: localEveryMonth,
                                        monthlySelectedDays: localMonthlySelectedDays,
                                        monthlyWeekDay: localWeekDay,
                                        everyMonthWeekDay: localEveryWeekDay,
                                    })
                                )
                            }}
                        />

                        <CustomReminderPopup
                            isVisible={customPopupVisible}
                            startDate={startDate}
                            initialState={{
                                customEvery,
                                customEveryUnit,
                                exceptionDates,
                                exceptionTimes,
                                yearlyMonth,
                                yearlyDay,
                                yearlyWeek,
                                monthlySelectedDays,
                                everyMonthWeekDay,
                                monthlyWeekDay,
                            }}
                            onClose={(
                                localCustomEvery,
                                localCustomUnit,
                                localExceptionDates,
                                localExceptionTimes,
                                localMonthlySelectedDays,
                                localWeekDay,
                                localEveryWeekDay,
                                localYearlyWeekDay,
                                localEveryDay,
                                localEveryMonth
                            ) => {
                                let tempObj = {}
                                if (localCustomUnit === 'month') {
                                    tempObj.monthlySelectedDays = localMonthlySelectedDays
                                    tempObj.monthlyWeekDay = localWeekDay
                                    tempObj.everyMonthWeekDay = localEveryWeekDay
                                }
                                if (localCustomUnit === 'year') {
                                    tempObj.yearlyWeek = localYearlyWeekDay
                                    tempObj.yearlyDay = localEveryDay
                                    tempObj.yearlyMonth = localEveryMonth
                                }
                                dispatch(
                                    setCustomReminderForms({
                                        customEvery: localCustomEvery,
                                        customEveryUnit: localCustomUnit,
                                        exceptionDates: localExceptionDates,
                                        exceptionTimes: localExceptionTimes,
                                        ...tempObj,
                                    })
                                )
                                setCustomPopupVisible(false)
                            }}
                        />
                        {reminder_for !== REMINDER_FOR.CONTACTS && (
                            <>
                                <View style={styles.notificationview}>
                                    <Text style={styles.NOTIFICATION}>
                                        NOTIFICATIONS
                                    </Text>
                                </View>
                                <ReminderNotificationView />
                                <Divider />
                                <View style={styles.repetneverview}>
                                    <Text style={styles.repet}>Sounds</Text>

                                    <TouchableOpacity
                                        onPress={() =>
                                            setSoundAndNotificationPopupVisible(
                                                true
                                            )
                                        }
                                        style={styles.neverview}
                                    >
                                        <Text style={styles.never}>
                                            {sound || `None`}
                                        </Text>
                                        <View>
                                            <Ionicons
                                                name="chevron-down-outline"
                                                size={20}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        <View style={styles.notificationview1}>
                            <Text style={styles.NOTIFICATION}>
                                REMINDER MESSAGE
                            </Text>
                        </View>
                        {reminderAudios?.length
                            ? reminderAudios.map((item) => (
                                  <View
                                      style={styles.voiceContainer}
                                      key={'reminder_audio' + item}
                                  >
                                      <AudioPlayerComponent
                                          audio={{ uri: item }}
                                          width={SCREEN_WIDTH - 100}
                                      />
                                      <Ionicons
                                          onPress={() => {
                                              dispatch(
                                                  setCustomReminderForms({
                                                      reminderAudios: [],
                                                  })
                                              )
                                          }}
                                          name="close-circle-sharp"
                                          size={25}
                                          color="#E0E0E0"
                                      />
                                  </View>
                              ))
                            : null}
                        {!!reminderMedia?.length && (
                            <ScrollView
                                showsHorizontalScrollIndicator={false}
                                horizontal
                                style={styles.imageScrollView}
                                bounces={false}
                            >
                                {reminderMedia.map((t, mediaIndex) => (
                                    <View
                                        style={styles.imageContainer}
                                        key={t.id}
                                    >
                                        <View
                                            style={styles.pickImageContainer}
                                            key={t.uri}
                                        >
                                            {t.mime?.includes('image') ? (
                                                <Image
                                                    source={t}
                                                    style={styles.imageStyle}
                                                />
                                            ) : (
                                                <View style={styles.imageStyle}>
                                                    <Video
                                                        source={{
                                                            uri: t.uri,
                                                        }}
                                                        style={
                                                            styles.videoStyle
                                                        }
                                                        resizeMode="cover"
                                                        paused={true}
                                                        onLoad={(
                                                            videoDetails
                                                        ) => {
                                                            if (!t?.duration) {
                                                                updateDuration(
                                                                    videoDetails?.duration,
                                                                    mediaIndex
                                                                )
                                                            }
                                                        }}
                                                    />
                                                    <View
                                                        style={
                                                            styles.videoOverView
                                                        }
                                                    >
                                                        <Image
                                                            source={
                                                                Global.ASSETS
                                                                    .VIDEO_ICON
                                                            }
                                                            style={
                                                                styles.videoIconStyle
                                                            }
                                                        />
                                                        <Text
                                                            style={
                                                                styles.durationStyle
                                                            }
                                                        >
                                                            {millisToMinutesAndSeconds(
                                                                t?.duration || 0
                                                            )}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}

                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    right: scale(12),
                                                    top: scale(5),
                                                    backgroundColor: '#828282',
                                                    borderRadius: 60,
                                                    width: scale(18),
                                                    height: scale(18),
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Ionicons
                                                    onPress={() => {
                                                        deleteImage(t.id)
                                                    }}
                                                    name="close"
                                                    size={18}
                                                    color="#ffff"
                                                />
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                        <TouchableOpacity
                            onPress={() => setReminderTextModal(true)}
                            style={styles.inputContainer}
                        >
                            <View style={styles.inputview}>
                                <Text
                                    style={[
                                        styles.Optional,
                                        !message && { color: '#777' },
                                    ]}
                                >
                                    {message
                                        ? message
                                        : `${
                                              reminder_for === REMINDER_FOR.SELF
                                                  ? '(Optional) '
                                                  : ''
                                          }Insert text, video, or voice clip`}
                                </Text>
                                {error.messageError ? (
                                    <Text
                                        style={[
                                            styles.errorStyle,
                                            { marginLeft: 0 },
                                        ]}
                                    >
                                        {error?.messageError}
                                    </Text>
                                ) : null}
                            </View>
                            <EmojiPicker
                                enableSearchBar
                                onEmojiSelected={handlePick}
                                open={emojiModalVisible}
                                onClose={() => setEmojiModalVisible(false)}
                            />
                        </TouchableOpacity>

                        {/* =================== voice modal ==================== */}
                        <Overlay
                            overlayStyle={{
                                width: '100%',
                                position: 'absolute',
                                bottom: 0,
                                // height: scale(200),
                                borderTopLeftRadius: 14,
                                borderTopRightRadius: 14,
                                backgroundColor: '#e0e0e0',
                            }}
                            isVisible={voiceModalVisible}
                            onRequestClose={() => {
                                setVoiceModalVisible(false)
                            }}
                            // onBackdropPress={() => {
                            //     setVoiceModal(false)
                            // }}
                        >
                            <AudioModal
                                data="data"
                                setVoiceData={(item) => {
                                    dispatch(
                                        setCustomReminderForms({
                                            reminderAudios: [item],
                                        })
                                    )
                                }}
                                setVoiceTime={() => {}}
                                Close={() => {
                                    setVoiceModalVisible(false)
                                }}
                            />
                        </Overlay>

                        <ImagePickerPopup
                            isVisible={imagePickerPopupVisible}
                            onClose={() => {
                                setImagePickerPopupVisible(false)
                            }}
                            onImagesSelected={(images) => {
                                const previousImages = [
                                    ...reminderMedia,
                                    ...images,
                                ]
                                const filterImages = previousImages.map(
                                    (i, index) => {
                                        return {
                                            uri: i.path,
                                            ...i,
                                            id: 'rem_media' + (index + 1),
                                        }
                                    }
                                )
                                if (filterImages.length > 5) {
                                    filterImages.length = 5
                                }
                                dispatch(
                                    setCustomReminderForms({
                                        reminderMedia: filterImages,
                                    })
                                )
                            }}
                        />

                        <SoundPopup
                            isVisible={soundAndNotificationPopupVisible}
                            onClose={(selectedSound) => {
                                setSoundAndNotificationPopupVisible(false)
                                let temp = {}
                                if (selectedSound) {
                                    temp['sound'] = selectedSound
                                }
                                if (Object.keys(temp).length) {
                                    dispatch(
                                        setCustomReminderForms({
                                            ...temp,
                                        })
                                    )
                                }
                            }}
                            selectedState={{ sound }}
                        />

                        <Overlay
                            onBackdropPress={() =>
                                setRepeatModalVisible(!repeatModalVisible)
                            }
                            isVisible={repeatModalVisible}
                            overlayStyle={styles.overlycontinar}
                        >
                            <View style={{ paddingBottom: 8 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch(
                                            setCustomReminderForms({
                                                repeatType: 'never',
                                                repeatTypeText: 'Never',
                                            })
                                        )
                                        setRepeatModalVisible(
                                            !repeatModalVisible
                                        )
                                    }}
                                    style={styles.noneandimgview}
                                >
                                    {repeatType === 'never' ? (
                                        <Ionicons
                                            name="ios-checkmark-outline"
                                            size={25}
                                            color={color.GM_BLUE_DEEP}
                                        />
                                    ) : null}

                                    <Text style={styles.none}>Never</Text>
                                </TouchableOpacity>

                                <Divider style={styles.divedersortline1} />

                                <TouchableOpacity
                                    onPress={() => {
                                        setRepeatModalVisible(
                                            !repeatModalVisible
                                        )
                                        dispatch(
                                            setCustomReminderForms({
                                                repeatType: 'daily',
                                                repeatTypeText: 'Daily',
                                            })
                                        )
                                    }}
                                    style={styles.noneandimgview}
                                >
                                    {repeatType === 'daily' ? (
                                        <Ionicons
                                            name="ios-checkmark-outline"
                                            size={25}
                                            color={color.GM_BLUE_DEEP}
                                        />
                                    ) : null}
                                    <Text style={styles.none}>Daily</Text>
                                </TouchableOpacity>

                                <Divider style={styles.divedersortline1} />

                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch(
                                            setCustomReminderForms({
                                                repeatType: 'weekly',
                                                repeatTypeText: 'Weekly',
                                            })
                                        )
                                        setRepeatModalVisible(
                                            !repeatModalVisible
                                        )
                                    }}
                                    style={styles.noneandimgview}
                                >
                                    {repeatType === 'weekly' ? (
                                        <Ionicons
                                            name="ios-checkmark-outline"
                                            size={25}
                                            color={color.GM_BLUE_DEEP}
                                        />
                                    ) : null}
                                    <Text style={styles.none}>Weekly</Text>
                                </TouchableOpacity>

                                <Divider style={styles.divedersortline1} />
                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch(
                                            setCustomReminderForms({
                                                repeatType: 'monthly',
                                                repeatTypeText: 'Monthly',
                                            })
                                        )
                                        setRepeatModalVisible(
                                            !repeatModalVisible
                                        )
                                        setMonthModal(true)
                                    }}
                                    style={styles.noneandimgview}
                                >
                                    {repeatType === 'monthly' ? (
                                        <Ionicons
                                            name="ios-checkmark-outline"
                                            size={25}
                                            color={color.GM_BLUE_DEEP}
                                        />
                                    ) : null}
                                    <Text style={styles.none}>Monthly</Text>
                                </TouchableOpacity>

                                <Divider style={styles.divedersortline1} />
                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch(
                                            setCustomReminderForms({
                                                repeatType: 'yearly',
                                                repeatTypeText: 'Yearly',
                                            })
                                        )
                                        setRepeatModalVisible(
                                            !repeatModalVisible
                                        )
                                    }}
                                    style={styles.noneandimgview}
                                >
                                    {repeatType === 'yearly' ? (
                                        <Ionicons
                                            name="ios-checkmark-outline"
                                            size={25}
                                            color={color.GM_BLUE_DEEP}
                                        />
                                    ) : null}
                                    <Text style={styles.none}>Yearly</Text>
                                </TouchableOpacity>

                                <Divider style={styles.divedersortline1} />

                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch(
                                            setCustomReminderForms({
                                                repeatType: 'custom',
                                            })
                                        )
                                        setCustomPopupVisible(true)
                                        setRepeatModalVisible(false)
                                    }}
                                    style={styles.customview}
                                >
                                    {repeatType === 'custom' ? (
                                        <Ionicons
                                            name="ios-checkmark-outline"
                                            size={25}
                                            color={color.GM_BLUE_DEEP}
                                        />
                                    ) : null}
                                    <Text style={styles.Custom}>Custom</Text>
                                    <Image
                                        style={styles.rigtkeyimg}
                                        source={global.ASSETS.RIGHTKEY}
                                    />
                                </TouchableOpacity>

                                {goalDetails?.end ? (
                                    <>
                                        <Divider
                                            style={styles.divedersortline1}
                                        />
                                        <TouchableOpacity
                                            onPress={() => {
                                                dispatch(
                                                    setCustomReminderForms({
                                                        repeatType: 'due_date',
                                                        repeatTypeText:
                                                            'As Due Date Approaches',
                                                    })
                                                )
                                                setDueDatePopupVisible(true)
                                                setRepeatModalVisible(false)
                                            }}
                                            style={[styles.customview]}
                                        >
                                            {repeatType === 'due_date' ? (
                                                <Ionicons
                                                    name="ios-checkmark-outline"
                                                    size={25}
                                                    color={color.GM_BLUE_DEEP}
                                                />
                                            ) : null}
                                            <Text style={styles.Custom}>
                                                As Due Date Approaches
                                            </Text>
                                            <Image
                                                style={styles.rigtkeyimg}
                                                source={global.ASSETS.RIGHTKEY}
                                            />
                                        </TouchableOpacity>
                                    </>
                                ) : null}
                            </View>
                        </Overlay>

                        <ReminderEndRepeatModal
                            isVisible={isEndRepeatPopupVisible}
                            onClose={(localRepeatText, localEndRepeatDate) => {
                                setIsEndRepeatPopupVisible(false)
                                dispatch(
                                    setCustomReminderForms({
                                        endRepeatDate: localEndRepeatDate,
                                        endRepeat: localRepeatText,
                                    })
                                )
                            }}
                            startDate={startDate}
                            endRepeatProps={endRepeat}
                            initialEndRepeatDate={endRepeatDate}
                        />
                        <ReminderForModal
                            isVisible={isReminderForPopupVisible}
                            onClose={(reminderFor) => {
                                setIsReminderForPopupVisible(false)
                            }}
                            onPressReminderFor={(reminderFor) => {
                                setIsReminderForPopupVisible(false)
                                dispatch(
                                    setCustomReminderForms({
                                        reminder_for: reminderFor,
                                    })
                                )
                                if (reminderFor === 2) {
                                    Actions.push('ReminderFriends')
                                }
                                if (reminderFor === 3) {
                                    Actions.push('ReminderContacts')
                                }
                            }}
                            reminderFor={reminder_for}
                        />
                        <DueDateReminderPopup
                            isVisible={dueDatePopupVisible}
                            onClose={(localBeforeDueDate) => {
                                setDueDatePopupVisible(false)
                                if (localBeforeDueDate) {
                                    dispatch(
                                        setCustomReminderForms({
                                            custom_before_due_date: localBeforeDueDate,
                                        })
                                    )
                                }
                            }}
                            endDate={goalDetails?.end}
                        />
                    </KeyboardAwareScrollView>
                    <CustomReminderTextInput
                        onClose={(text) => {
                            dispatch(
                                setCustomReminderForms({
                                    message: text,
                                })
                            )
                            if (text) {
                                setError((prevState) => ({
                                    ...prevState,
                                    messageError: false,
                                }))
                            }
                            setReminderTextModal(false)
                        }}
                        message={message}
                        isVisible={reminderTextModal}
                        onPressEmoji={() => {
                            setReminderTextModal(false)
                            setTimeout(() => {
                                setEmojiModalVisible(true)
                            }, 500)
                        }}
                        onPressImage={() => {
                            setReminderTextModal(false)
                            setTimeout(() => {
                                setImagePickerPopupVisible(true)
                            }, 500)
                        }}
                        onPressVoice={() => {
                            setReminderTextModal(false)
                            setTimeout(() => {
                                setVoiceModalVisible(true)
                            }, 500)
                        }}
                    />
                </View>
            </SafeAreaView>
        </>
    )
}

export default CreateReminder

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
    maincontenar: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerview: {
        backgroundColor: '#45C9F6',
        width: windowWidth,
        height: 44,
        justifyContent: 'center',
    },
    hedertextview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 16,
    },
    cancle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },

    Create: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: text.FONT_FAMILY.BOLD,
    },
    allview: {
        width: '100%',
        paddingHorizontal: 16,
    },
    finesh: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        marginTop: 16,
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    bydec: {
        fontSize: 16,
        fontWeight: '400',
        color: color.GM_MID_GREY,
        fontFamily: text.FONT_FAMILY.REGULAR,
        marginTop: 3,
    },
    borderline: {
        borderWidth: 1,
        marginTop: 20,
        borderColor: '#E0E0E0',
    },
    datetimeview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    dateContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 8,
    },
    Starts: {
        fontSize: 16,
        fontWeight: '500',
        color: '#777777',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    datebox: {
        borderWidth: 1.5,
        borderColor: '#ccc',
        flex: 1,
        height: 42,
        borderRadius: 7,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
    },
    datebox1: {
        borderWidth: 1.5,
        borderColor: '#ccc',
        width: '37%',
        marginLeft: 8,
        height: 42,
        borderRadius: 7,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    CALENDAR: {
        width: 18,
        height: 18,
    },
    date: {
        fontSize: 18,
        fontWeight: '400',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        paddingHorizontal: 10,
        color: 'black',
    },
    SKEY: {
        right: 6,
    },
    time: {
        marginHorizontal: 5,
        fontSize: 18,
        fontWeight: '400',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    repetneverview: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginTop: 16,
        paddingHorizontal: 16,
    },
    neverview: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    never: {
        marginHorizontal: 5,
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        maxWidth: 210,
    },
    repet: {
        fontSize: 16,
        fontWeight: '500',
        color: '#777777',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    FriendContainer: {
        alignItems: 'flex-end',
    },
    notificationview: {
        width: '100%',
        height: 46,
        backgroundColor: '#D1D3D9',
        marginTop: 16,
        justifyContent: 'center',
    },
    notificationview1: {
        width: '100%',
        height: 48,
        backgroundColor: '#D1D3D9',
        marginTop: 20,
        justifyContent: 'center',
    },
    NOTIFICATION: {
        marginHorizontal: 16,
        fontSize: 16,
        fontWeight: '500',
        color: '#777777',
        textAlignVertical: 'center',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },

    Optional: {
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        marginTop: 20,
        flex: 1,
    },
    inputview: {
        marginHorizontal: 20,
    },
    inputContainer: {
        paddingBottom: 30,
        flex: 1,
    },

    never1: {
        fontSize: 16,
        fontWeight: '500',
        color: '#777777',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        marginRight: 12,
        maxWidth: 210,
    },

    none: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
        marginHorizontal: 10,
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    noneandimgview: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },

    divedersortline1: {
        marginTop: 10,
        width: '110%',
    },

    customview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 5,
    },
    Custom: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    rigtkeyimg: {
        width: 7.61,
        height: 11.9,
    },

    overlayStyle: {
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

    overlycontinar: {
        width: 245,
        backgroundColor: '#fff',
        alignSelf: 'flex-end',
        borderRadius: 7,
        marginHorizontal: 16,
        marginTop: 20,
    },
    lineborder: {
        marginTop: 16,
    },

    imageContainer: {
        marginVertical: 16,
        flexDirection: 'row',
    },
    pickImageContainer: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    imageStyle: {
        width: 85,
        height: 106,
        marginHorizontal: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    videoStyle: {
        width: 85,
        height: 106,
    },

    voiceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        // backgroundColor: 'red',
        height: 65,
        justifyContent: 'space-around',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        borderRadius: 8,
        padding: 5,
        marginTop: 20,
    },
    videoOverView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    videoIconStyle: {
        width: 14,
        height: 10,
    },
    imageScrollView: {
        borderWidth: 1,
        marginHorizontal: 20,
        borderRadius: 8,
        borderColor: 'rgba(0,0,0,0.1)',
        marginTop: 20,
    },
    durationStyle: {
        fontSize: 12,
        fontWeight: '400',
        color: '#fff',
        fontFamily: text.FONT_FAMILY.REGULAR,
    },
    errorStyle: {
        fontSize: 14,
        fontWeight: '700',
        color: 'red',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        marginLeft: 20,
        marginTop: 8,
    },
})
