/** @format */
import { getTimeZone } from 'react-native-localize'
import {
    setReminderGoalLoading,
    setReminderGoalError,
    setReminderGoal,
    setCompletedOrArchivedReminderLoading,
    setCompletedOrArchivedReminderError,
    setCompletedOrArchivedReminder,
    setAvailableCompleteOrArchived,
    setAvailableReminderGoal,
    setReminderTribesLoading,
    setReminderTribesAvailable,
    setReminderTribes,
    setReminderTribesError,
    setReminderSearchTribesLoading,
    setReminderSearchTribesAvailable,
    setReminderSearchTribes,
    setReminderSearchTribesError,
    setReminderForOtherLoading,
    setReminderForOtherAvailable,
    setReminderForOther,
    setReminderForOtherError,
    setReminderForOtherSearchLoading,
    setReminderForOtherSearchAvailable,
    setReminderForOtherSearch,
    setReminderForOtherSearchError,
    setReminderSearchText,
    resetReminderForOtherSearch,
    setReminderGoalSearchLoading,
    setReminderGoalSearchAvailable,
    setReminderGoalSearch,
    setReminderGoalSearchError,
    resetReminderGoalSearch,
    setReminderSelectedTabIndex,
    setReminderFriendsLoading,
    setReminderFriendsAvailable,
    setReminderFriendsError,
    setReminderFriends,
    setReminderSearchFriendsLoading,
    setReminderSearchFriendsAvailable,
    setReminderSearchFriends,
    setReminderSearchFriendsError,
    setReminderTribesDetailsLoading,
    setReminderTribesDetails,
    setReminderTribesDetailsError,
} from '../reducers/ReminderReducers'
import {
    updateNotifications,
    updateDefaultReminder,
    setSelectedReminder,
    setCustomReminderForms,
} from '../reducers/ReminderFormReducers'
import moment from 'moment'
import {
    getRandomNumber,
    IMAGE_BASE_URL,
    REMINDER_FOR,
    REMINDER_REQUEST_STATUS,
} from '../Utils/Constants'
import { api as API } from '../redux/middleware/api'
import { loadUserGoals } from '../redux/modules/goal/GoalActions'
import { is2xxRespose, queryBuilder } from '../redux/middleware/utils'
import ImageUtils from '../Utils/ImageUtils'
import VideoUtils from '../Utils/VideoUtils'
import VoiceUtils from '../Utils/VoiceUtils'
import { capitalizeFirstLetter } from '../Utils/HelperMethods'
import { debounce } from 'lodash'
import {
    CHAT_ROOM_UPDATE_REMINDER_REQUEST_STATUS_MESSAGES,
    CHAT_ROOM_UPDATE_REMINDER_STATUS_MESSAGES,
} from '../redux/modules/chat/ChatRoomReducers'
import MessageStorageService from '../services/chat/MessageStorageService'

export const updateNotificationData = (notificationData) => {
    return async (dispatch) => {
        dispatch(updateNotifications(notificationData))
    }
}

export const updateDefaultReminderData = (reminderData) => {
    return async (dispatch) => {
        dispatch(updateDefaultReminder(reminderData))
    }
}

export const checkExistingReminder = (reminders, start_time, end_time) => {
    return async (dispatch) => {
        let payload = {}
        let selectedReminders = []
        let notificationType = null
        if (Array.isArray(reminders) && reminders.length) {
            for (let i = 0; i < reminders.length; i++) {
                const reminder = reminders[i]
                if (reminder?.reminder_type === 'custom') {
                    continue
                }
                payload[reminder.reminder_type] = reminder.reminder_date
                selectedReminders.push({
                    reminder_type: reminder.reminder_type,
                    reminder_date: reminder.reminder_date,
                })
                notificationType = reminder?.notifications_type
                if (reminder?.reminder_type === 'month_before_due_date') {
                    payload.disableMonthBeforeDueDate = false
                }
                if (reminder?.reminder_type === 'week_before_due_date') {
                    payload.disableWeekBeforeDueDate = false
                }
                if (reminder?.reminder_type === 'day_before_due_date') {
                    payload.disableDayBeforeDueDate = false
                }
                if (reminder?.reminder_type === 'on_due_date') {
                    payload.disableOnDueDate = false
                }
            }
        }
        const endTime = moment(end_time)
        const checkDate = getStartDate(start_time)
        const randomMinutes = getRandomNumber(0, 59)
        if (endTime.isValid() && end_time) {
            // check month diff
            const monthBeforeDate = moment(endTime).subtract(1, 'months')
            if (
                checkDate.isSameOrBefore(monthBeforeDate) &&
                !payload.month_before_due_date
            ) {
                payload.disableMonthBeforeDueDate = false
                monthBeforeDate.set({
                    hour: 9,
                    minutes: randomMinutes,
                    second: 0,
                })
                payload.month_before_due_date = monthBeforeDate.toISOString()
            }
            // check week diff
            const weekBeforeDate = moment(endTime).subtract(1, 'week')
            if (
                checkDate.isSameOrBefore(weekBeforeDate) &&
                !payload.week_before_due_date
            ) {
                payload.disableWeekBeforeDueDate = false
                weekBeforeDate.set({
                    hour: 9,
                    minutes: randomMinutes,
                    second: 0,
                })
                payload.week_before_due_date = weekBeforeDate.toISOString()
            }
            // check day diff
            const dayBeforeDate = moment(endTime).subtract(1, 'days')
            if (
                checkDate.isSameOrBefore(dayBeforeDate) &&
                !payload.day_before_due_date
            ) {
                payload.disableDayBeforeDueDate = false
                dayBeforeDate.set({
                    hour: 9,
                    minutes: randomMinutes,
                    second: 0,
                })
                payload.day_before_due_date = dayBeforeDate.toISOString()
            }
            // on Due Date
            if (
                checkDate.isSameOrBefore(moment(endTime)) &&
                !payload.on_due_date
            ) {
                payload.disableOnDueDate = false
                endTime.set({
                    hour: 9,
                    minutes: randomMinutes,
                    second: 0,
                })
                payload.on_due_date = endTime.toISOString()
            }
        }
        if (notificationType) {
            dispatch(updateNotificationData(notificationType))
        }
        console.log('Payloadd', payload)
        dispatch(updateDefaultReminder(payload))
        dispatch(setSelectedReminder(selectedReminders))
    }
}

export const checkReminderDateValid = (start_time, end_time) => {
    return async (dispatch) => {
        const endTime = moment(end_time)
        const checkDate = getStartDate(start_time)
        const selectedReminders = []
        if (endTime.isValid() && end_time) {
            let payload = {}
            const randomMinutes = getRandomNumber(0, 59)

            // check month diff
            const monthBeforeDate = moment(endTime).subtract(1, 'months')
            if (checkDate.isSameOrBefore(monthBeforeDate)) {
                payload.disableMonthBeforeDueDate = false
                monthBeforeDate.set({
                    hour: 9,
                    minutes: randomMinutes,
                    second: 0,
                })
                payload.month_before_due_date = monthBeforeDate.toISOString()
                selectedReminders.push({
                    reminder_type: 'month_before_due_date',
                    reminder_date: monthBeforeDate.toISOString(),
                })
            }
            // check week diff
            const weekBeforeDate = moment(endTime).subtract(1, 'week')
            if (checkDate.isSameOrBefore(weekBeforeDate)) {
                payload.disableWeekBeforeDueDate = false
                weekBeforeDate.set({
                    hour: 9,
                    minutes: randomMinutes,
                    second: 0,
                })
                payload.week_before_due_date = weekBeforeDate.toISOString()
                selectedReminders.push({
                    reminder_type: 'week_before_due_date',
                    reminder_date: weekBeforeDate.toISOString(),
                })
            }
            // check day diff
            const dayBeforeDate = moment(endTime).subtract(1, 'days')
            if (checkDate.isSameOrBefore(dayBeforeDate)) {
                payload.disableDayBeforeDueDate = false
                dayBeforeDate.set({
                    hour: 9,
                    minutes: randomMinutes,
                    second: 0,
                })
                payload.day_before_due_date = dayBeforeDate.toISOString()
                selectedReminders.push({
                    reminder_type: 'day_before_due_date',
                    reminder_date: dayBeforeDate.toISOString(),
                })
            }
            // on Due Date
            if (checkDate.isSameOrBefore(moment(endTime))) {
                payload.disableOnDueDate = false
                endTime.set({
                    hour: 9,
                    minutes: randomMinutes,
                    second: 0,
                })
                payload.on_due_date = endTime.toISOString()
                selectedReminders.push({
                    reminder_type: 'on_due_date',
                    reminder_date: endTime.toISOString(),
                })
            }
            dispatch(updateDefaultReminder(payload))
            dispatch(setSelectedReminder(selectedReminders))
        }
    }
}
export const prefillCustomReminderForm = (reminderData) => {
    return async (dispatch) => {
        const {
            notifications_type,
            start_date,
            repeat_type,
            end_repeat_type,
            vibration,
            end_repeat_date,
            reminder_audios,
            reminder_videos,
            reminder_images,
            message,
            notification_sound,
            weeklyRepeatType,
            yearlyRepeatType,
            monthlyRepeatType,
            customRepeatType,
            reminder_for,
            recipient_users,
            recipient_contacts,
        } = reminderData

        const allVideos = Array.isArray(reminder_videos)
            ? reminder_videos.map((item) => {
                  return {
                      id: item,
                      uri: IMAGE_BASE_URL + item,
                      mime: 'video/mp4',
                  }
              })
            : []

        const allImages = Array.isArray(reminder_images)
            ? reminder_images.map((item) => {
                  return {
                      id: item,
                      uri: IMAGE_BASE_URL + item,
                      mime: 'image/jpeg',
                  }
              })
            : []

        const allAudios = Array.isArray(reminder_audios)
            ? reminder_audios.map((item) => IMAGE_BASE_URL + item)
            : []
        const recipientUserDetails = Array.isArray(recipient_users)
            ? recipient_users.map((item) => item.userRef)
            : []
        const payload = {
            startDate: start_date ? new Date(start_date) : new Date(),
            repeatType: repeat_type || 'never',
            repeatTypeText:
                repeat_type === 'on_the'
                    ? 'As Due Date Approaches'
                    : capitalizeFirstLetter(repeat_type),
            endRepeat: end_repeat_type,
            vibration: vibration,
            reminderAudios: allAudios,
            reminderMedia: [...allVideos, ...allImages],
            message: message || '',
            endRepeatDate: end_repeat_date ? new Date(end_repeat_date) : null,
            sound: notification_sound
                ? notification_sound?.replace(/\.mp3|\.aiff/gi, '')
                : 'Default',
            reminder_for: reminder_for || REMINDER_FOR.SELF,
            recipient_contacts: recipient_contacts || [],
            recipient_users_details: recipientUserDetails || [],
            recipient_users: recipientUserDetails.map((item) => item._id) || [],
        }

        if (weeklyRepeatType && typeof weeklyRepeatType === 'object') {
            const { every_week, weekly_selected_days } = weeklyRepeatType
            payload.everyWeek = every_week
            payload.weeklySelectedDays = weekly_selected_days
        }
        if (monthlyRepeatType && typeof monthlyRepeatType === 'object') {
            const {
                every_month,
                monthly_selected_day,
                every_month_week_day,
                monthly_week_day,
            } = monthlyRepeatType

            payload.everyMonth = every_month
            payload.monthlySelectedDays = monthly_selected_day
            payload.everyMonthWeekDay = every_month_week_day || ''
            payload.monthlyWeekDay = monthly_week_day || ''
        }
        if (yearlyRepeatType && typeof yearlyRepeatType === 'object') {
            const {
                every_year,
                yearly_week,
                yearly_day,
                yearly_month,
            } = yearlyRepeatType
            payload.everyYear = every_year || '1'
            payload.yearlyWeek = yearly_week || '1'
            payload.yearlyDay = yearly_day || '1'
            payload.yearlyMonth = yearly_month || '1'
        }
        if (customRepeatType && typeof customRepeatType === 'object') {
            const {
                custom_every,
                custom_every_unit,
                exception_dates,
                exception_times,
            } = customRepeatType
            payload.customEvery = custom_every || '1'
            payload.customEveryUnit = custom_every_unit || 'day'
            payload.exceptionDates = exception_dates || []
            payload.exceptionTimes = exception_times || []
        }
        dispatch(setCustomReminderForms(payload))
        if (notifications_type) {
            dispatch(updateNotificationData(notifications_type))
        }
    }
}

export const createNewCustomReminder = (goalId) => {
    return async (dispatch, getState) => {
        try {
            const {
                notifications,
                customReminderForms,
            } = getState().reminderForm
            const { reminder_for } = customReminderForms

            const { token } = getState().user

            const payload = await prepareCustomReminderPayload(
                goalId,
                notifications,
                customReminderForms,
                token
            )
            if (payload) {
                const resp = await API.post('secure/reminder/', payload, token)
                if (resp.status !== 200) {
                    throw 'internal error'
                }
                if (reminder_for === REMINDER_FOR.SELF) {
                    await dispatch(fetchReminderGoals(0, 10))
                    dispatch(setReminderSelectedTabIndex(0))
                } else {
                    await dispatch(fetchReminderForOther(0, 10))
                    dispatch(setReminderSelectedTabIndex(1))
                }
            }
        } catch (e) {
            console.error('Error in create custom reminder', e)
            throw e
        }
    }
}

export const createNewReminder = (
    goalId,
    isCustom,
    isNotCreateDueDateReminder
) => {
    return async (dispatch, getState) => {
        const { notifications, selected_reminders } = getState().reminderForm
        const { token } = getState().user

        const timezone = getTimeZone()
        if (!isNotCreateDueDateReminder) {
            const allReminder = selected_reminders.map((item) => {
                const payload = {
                    reminder_for: REMINDER_FOR.SELF,
                    notifications_type: notifications,
                    goalId,
                    timezone,
                    is_repeat: false,
                    reminder_type: item.reminder_type,
                    reminder_date: item.reminder_date,
                }
                return API.post('secure/reminder/', payload, token)
            })
            console.log('all remidners', allReminder)
            await Promise.all(allReminder)
        }
        if (isCustom) {
            await dispatch(createNewCustomReminder(goalId))
        }
    }
}

export const updateReminderNotification = (
    reminderId,
    goalId,
    notification
) => {
    return async (dispatch, getState) => {
        try {
            const reminderGoals = getState()?.reminder?.reminderGoals || []
            const filterGoal = updateReminderForGoal(
                reminderGoals,
                reminderId,
                goalId,
                notification
            )
            if (filterGoal?.length) {
                dispatch(setReminderGoal(filterGoal))
            }
            const { token } = getState().user
            const payload = {
                notifications_type: notification,
            }
            API.put(`secure/reminder/${reminderId}/`, payload, token)
        } catch (e) {
            console.error('error in reminder notifications', e)
        }
    }
}

export const updateCustomReminder = (reminderId, goalId) => {
    return async (dispatch, getState) => {
        try {
            const {
                notifications,
                customReminderForms,
            } = getState().reminderForm
            const { reminder_for } = customReminderForms
            const { token } = getState().user

            const payload = await prepareCustomReminderPayload(
                goalId,
                notifications,
                customReminderForms,
                token
            )
            if (payload) {
                console.log('updated PAyloaddd', JSON.stringify(payload))
                const resp = await API.put(
                    `secure/reminder/custom-reminder/${reminderId}`,
                    payload,
                    token
                )
                if (resp.status !== 200) {
                    throw 'API error'
                }
                if (reminder_for === REMINDER_FOR.SELF) {
                    await dispatch(fetchReminderGoals(0, 10))
                } else {
                    await dispatch(fetchReminderForOther(0, 10))
                }
            }
        } catch (e) {
            console.error('error in update custom reminder', e)
            throw e
        }
    }
}

export const updateReminderOrders = (goalId, reminderData) => {
    return async (dispatch, getState) => {
        try {
            const { token } = getState().user
            const payload = {
                active_reminders: reminderData,
            }
            if (payload) {
                await API.put(
                    `secure/reminder/updateReminderOrders/${goalId}`,
                    payload,
                    token
                )
                await dispatch(fetchReminderGoals(0, 10))
            }
        } catch (e) {
            console.error('error in update custom reminder', e)
        }
    }
}

export const updateReminder = (reminders, goal) => {
    return async (dispatch, getState) => {
        try {
            const {
                notifications,
                selected_reminders: selectedReminders,
            } = getState().reminderForm
            const { token } = getState().user
            const deleteReminder = []
            const existedReminderId = []
            const createReminders = []
            const updateReminders = []
            if (Array.isArray(reminders) && reminders.length) {
                for (let i = 0; i < reminders.length; i++) {
                    const reminder = reminders[i]
                    const foundIndex = selectedReminders.findIndex(
                        (item) => item.reminder_type === reminder.reminder_type
                    )
                    if (
                        foundIndex === -1 &&
                        reminder.reminder_type !== 'custom'
                    ) {
                        deleteReminder.push(reminder._id)
                    } else if (reminder.reminder_type !== 'custom') {
                        existedReminderId.push(reminder._id)
                    }
                }
            }
            if (deleteReminder.length) {
                const payload = {
                    reminderIds: deleteReminder,
                }
                await deleteReminderAPI(payload, token)
            }
            if (Array.isArray(existedReminderId) && existedReminderId.length) {
                for (let i = 0; i < existedReminderId.length; i++) {
                    const reminderId = existedReminderId[i]
                    const payload = {
                        notifications_type: notifications,
                    }
                    updateReminders.push(
                        API.put(
                            `secure/reminder/${reminderId}/`,
                            payload,
                            token
                        )
                    )
                }
            }
            const timezone = getTimeZone()
            if (Array.isArray(selectedReminders) && selectedReminders.length) {
                for (let i = 0; i < selectedReminders.length; i++) {
                    const reminder = selectedReminders[i]
                    const foundIndex = reminders.findIndex(
                        (item) => item.reminder_type === reminder.reminder_type
                    )
                    if (foundIndex === -1) {
                        const payload = {
                            reminder_for: REMINDER_FOR.SELF,
                            notifications_type: notifications,
                            goalId: goal._id,
                            timezone,
                            is_repeat: false,
                            reminder_type: reminder.reminder_type,
                            reminder_date: reminder.reminder_date,
                        }
                        createReminders.push(
                            API.post('secure/reminder/', payload, token)
                        )
                    }
                }
            }
            if (createReminders.length) {
                await Promise.all(createReminders)
            }
            if (updateReminders.length) {
                await Promise.all(updateReminders)
            }
        } catch (e) {
            console.error('Error in update reminder', e)
            throw e
        }
    }
}

export const fetchReminderGoals = (skip, limit) => {
    return async (dispatch, getState) => {
        dispatch(setReminderGoalLoading(true))
        let reminderGoals = []
        const { token, user } = getState().user
        const userId = user._id
        const withActiveReminders = 'true'

        if (skip) {
            reminderGoals = getState()?.reminder?.reminderGoals || []
        } else {
            dispatch(setAvailableReminderGoal(true))
        }
        const onSuccess = (data) => {
            if (Array.isArray(data)) {
                dispatch(setReminderGoal([...reminderGoals, ...data]))
                if (skip && !data.length) {
                    dispatch(setAvailableReminderGoal(false))
                }
            } else {
                setReminderGoalError('Reminder goal data is not an array')
            }
        }
        const onError = (error) => {
            dispatch(
                setReminderGoalError(
                    error?.message || 'Error in fetching goals with reminder'
                )
            )
        }
        loadUserGoals(
            skip,
            limit,
            {
                userId,
                withActiveReminders,
                sortBy: 'updated',
                sortOrder: 'desc',
            },
            token,
            onSuccess,
            onError
        )
    }
}

export const acceptReminderRequest = (reminderId) => {
    return async (dispatch, getState) => {
        try {
            const state = getState()
            const { token, user } = state.user
            const userId = user?._id
            const resp = await acceptReminderRequestAPI(reminderId, token)
            if (resp?.status === 200) {
                MessageStorageService.updateReminderRequestStatus(
                    reminderId,
                    userId,
                    REMINDER_REQUEST_STATUS.ACCEPTED,
                    (err, updated) => {
                        if (!err) {
                            dispatch({
                                type: CHAT_ROOM_UPDATE_REMINDER_REQUEST_STATUS_MESSAGES,
                                payload: {
                                    reminderId,
                                    userId,
                                    status: REMINDER_REQUEST_STATUS.ACCEPTED,
                                },
                            })
                        }
                        console.log('Update docs', updated)
                    }
                )
            }
        } catch (e) {
            console.error('Error in move accept reminder request', e)
        }
    }
}

export const markedAsCompleteReminderForOther = (reminderId) => {
    return async (dispatch, getState) => {
        try {
            const state = getState()
            const { token, user } = state.user
            const userId = user?._id
            const resp = await reminderCompletedForOtherAPI(reminderId, token)
            if (resp?.status === 200) {
                MessageStorageService.updateReminderRequestStatus(
                    reminderId,
                    userId,
                    REMINDER_REQUEST_STATUS.MARK_AS_COMPLETED,
                    (err, updated) => {
                        if (!err) {
                            dispatch({
                                type: CHAT_ROOM_UPDATE_REMINDER_REQUEST_STATUS_MESSAGES,
                                payload: {
                                    reminderId,
                                    userId,
                                    status:
                                        REMINDER_REQUEST_STATUS.MARK_AS_COMPLETED,
                                },
                            })
                        }
                        console.log('Update docs', updated)
                    }
                )
            }
        } catch (e) {
            console.error(
                'Error in move marked as complete reminder for other',
                e
            )
        }
    }
}

export const moveToCompleteReminder = (reminderId, isChatBot) => {
    return async (dispatch, getState) => {
        try {
            const state = getState()
            const { token } = state.user
            const {
                reminderTab,
                reminderSearchText,
                reminderGoalSearch,
                reminderForOtherSearch,
            } = state.reminder
            const reminderTabIndex = reminderTab?.index
            const resp = await completeReminderAPI(reminderId, token, isChatBot)
            if (resp?.status === 200) {
                MessageStorageService.updateReminderStatus(
                    reminderId,
                    (err, updated) => {
                        if (!err) {
                            dispatch({
                                type: CHAT_ROOM_UPDATE_REMINDER_STATUS_MESSAGES,
                                payload: reminderId,
                            })
                        }
                        console.log('Update docs', updated)
                    }
                )
            }
            if (reminderSearchText) {
                const reminderLength =
                    reminderTabIndex === 0
                        ? reminderGoalSearch.length
                        : reminderForOtherSearch.length
                const skip = Math.floor(reminderLength / 10) * 10
                dispatch(searchReminder(skip, 10, reminderSearchText))
            }
            if (reminderTabIndex === 0) {
                dispatch(fetchReminderGoals(0, 10))
            } else if (reminderTabIndex === 1) {
                dispatch(fetchReminderForOther(0, 10))
            }
        } catch (e) {
            console.error('Error in move to compete', e)
        }
    }
}

export const moveToArchiveReminder = (reminderId) => {
    return async (dispatch, getState) => {
        try {
            const state = getState()
            const { token } = state.user
            const {
                reminderTab,
                reminderSearchText,
                reminderGoalSearch,
                reminderForOtherSearch,
            } = state.reminder
            const reminderTabIndex = reminderTab?.index
            await archivedReminderAPI(reminderId, token)
            if (reminderSearchText) {
                const reminderLength =
                    reminderTabIndex === 0
                        ? reminderGoalSearch.length
                        : reminderForOtherSearch.length
                const skip = Math.floor(reminderLength / 10) * 10
                dispatch(searchReminder(skip, 10, reminderSearchText))
            }
            if (reminderTabIndex === 0) {
                dispatch(fetchReminderGoals(0, 10))
            } else if (reminderTabIndex === 1) {
                dispatch(fetchReminderForOther(0, 10))
            }
        } catch (e) {
            console.error('Error in move to archive', e)
        }
    }
}

export const moveToRestoreReminders = (payload) => {
    return async (dispatch, getState) => {
        try {
            const { token } = getState().user
            await restoreReminderAPI(payload, token)
            dispatch(fetchReminderGoals(0, 10))
            dispatch(fetchArchiveOrCompletedReminder(0, 10))
        } catch (e) {
            console.error('Error in move to restore', e)
        }
    }
}

export const sendReminderRequestAgain = (reminderId, requestedUserId) => {
    return async (dispatch, getState) => {
        try {
            const state = getState()
            const { token } = state.user
            const payload = {
                requestedUserId,
            }
            await reminderRequestAgainAPI(reminderId, payload, token)
            await dispatch(fetchReminderForOther(0, 10))
        } catch (e) {
            console.error('Error in send reminder request again', e)
            throw e
        }
    }
}

export const moveToDeleteReminders = (payload) => {
    return async (dispatch, getState) => {
        try {
            const { token } = getState().user
            await deleteReminderAPI(payload, token)
            dispatch(fetchReminderGoals(0, 10))
            dispatch(fetchArchiveOrCompletedReminder(0, 10))
        } catch (e) {
            console.error('Error in delete', e)
        }
    }
}

export const fetchArchiveOrCompletedReminder = (skip, limit) => {
    return async (dispatch, getState) => {
        dispatch(setCompletedOrArchivedReminderLoading(true))
        let previousReminders = []
        const { token } = getState().user
        if (skip) {
            previousReminders =
                getState()?.reminder?.completedOrArchivedReminder || []
        } else {
            dispatch(setAvailableCompleteOrArchived(true))
        }
        const onSuccess = (data) => {
            if (Array.isArray(data)) {
                dispatch(
                    setCompletedOrArchivedReminder([
                        ...previousReminders,
                        ...data,
                    ])
                )
                if (skip && !data.length) {
                    dispatch(setAvailableCompleteOrArchived(false))
                }
            } else {
                setCompletedOrArchivedReminderError(
                    'Reminder data is not an array'
                )
            }
        }
        const onError = (error) => {
            dispatch(
                setCompletedOrArchivedReminderError(
                    error?.message ||
                        'Error in fetching completed or archive reminder'
                )
            )
        }
        loadCompletedOrArchivedReminder(skip, limit, token, onSuccess, onError)
    }
}

export const fetchReminderTribes = (skip, limit) => {
    return async (dispatch, getState) => {
        try {
            dispatch(setReminderTribesLoading(true))
            let reminderTribes = []
            const { token, user } = getState().user
            const userId = user?._id

            if (skip) {
                reminderTribes = getState()?.reminder?.reminderTribes || []
            } else {
                dispatch(setReminderTribesAvailable(true))
            }
            const queryPayload = {
                skip,
                limit,
            }
            const data = await reminderTribeAPI(queryPayload, token)
            const tribes = data.tribes
            if (Array.isArray(tribes)) {
                const finalData = formatReminderTribe(tribes, userId)
                dispatch(setReminderTribes([...reminderTribes, ...finalData]))
                if (skip && !tribes.length) {
                    dispatch(setReminderTribesAvailable(false))
                }
            } else {
                dispatch(
                    setReminderTribesError('Reminder goal data is not an array')
                )
            }
        } catch (e) {
            console.error('Error in fetching tribes data', e)
            dispatch(
                setReminderTribesError(e.message || 'Something went wrong')
            )
        }
    }
}

export const fetchReminderTribeDetails = (tribeId) => {
    return async (dispatch, getState) => {
        try {
            dispatch(setReminderTribesDetailsLoading(true))
            const { token, user } = getState().user
            const userId = user?._id
            const queryPayload = {
                tribeId,
            }
            const data = await reminderTribeByIdAPI(queryPayload, token)
            const foundTribe = data.tribe
            if (foundTribe) {
                const finalData = formatReminderTribe([foundTribe], userId)
                dispatch(setReminderTribesDetails(finalData[0]))
            } else {
                dispatch(
                    setReminderTribesDetailsError('Reminder tribe not found')
                )
            }
        } catch (e) {
            console.error(`Error in fetching tribe details for: ${tribeId}`, e)
            dispatch(setReminderTribesDetailsError('Reminder tribe not found'))
        }
    }
}

export const fetchReminderFriends = (skip, limit) => {
    return async (dispatch, getState) => {
        try {
            dispatch(setReminderFriendsLoading(true))
            let reminderFriends = []
            const { token } = getState().user

            if (skip) {
                reminderFriends = getState()?.reminder?.reminderFriends || []
            } else {
                dispatch(setReminderFriendsAvailable(true))
            }
            const queryPayload = {
                skip,
                limit,
            }
            const data = await reminderFriendsAPI(queryPayload, token)
            const friends = data?.data
            if (Array.isArray(friends)) {
                dispatch(setReminderFriends([...reminderFriends, ...friends]))
                if (skip && !friends.length) {
                    dispatch(setReminderFriendsAvailable(false))
                }
            } else {
                dispatch(
                    setReminderFriendsError(
                        'Reminder goal data is not an array'
                    )
                )
            }
        } catch (e) {
            console.error('Error in fetching reminder friends data', e)
            dispatch(
                setReminderFriendsError(e.message || 'Something went wrong')
            )
        }
    }
}

export const searchReminderFriends = (skip, limit, searchString) => {
    return async (dispatch, getState) => {
        try {
            dispatch(setReminderSearchFriendsLoading(true))
            let reminderSearchTribes = []
            const { token } = getState().user

            if (skip) {
                reminderSearchTribes =
                    getState()?.reminder?.reminderSearchFriends || []
            } else {
                dispatch(setReminderSearchFriendsAvailable(true))
            }
            const queryPayload = {
                skip,
                limit,
                search: searchString,
            }
            const data = await reminderFriendsAPI(queryPayload, token)
            const friends = data.data
            if (Array.isArray(friends)) {
                dispatch(
                    setReminderSearchFriends([
                        ...reminderSearchTribes,
                        ...friends,
                    ])
                )
                if (skip && !friends.length) {
                    dispatch(setReminderSearchFriendsAvailable(false))
                }
            } else {
                dispatch(
                    setReminderSearchFriendsError(
                        'Reminder search friends is not an array'
                    )
                )
            }
        } catch (e) {
            console.error('Error in fetching search friends data', e)
            dispatch(
                setReminderSearchFriendsError(
                    e.message || 'Something went wrong'
                )
            )
        }
    }
}

export const fetchReminderForOther = (skip, limit) => {
    return async (dispatch, getState) => {
        try {
            dispatch(setReminderForOtherLoading(true))
            let reminderForOther = []
            const { token } = getState().user

            if (skip) {
                reminderForOther = getState()?.reminder?.reminderForOther || []
            } else {
                dispatch(setReminderForOtherAvailable(true))
            }
            const queryPayload = {
                skip,
                limit,
            }
            const data = await reminderForOtherAPI(queryPayload, token)
            const reminderForOtherData = data.reminderForOther
            if (Array.isArray(reminderForOtherData)) {
                dispatch(
                    setReminderForOther([
                        ...reminderForOther,
                        ...reminderForOtherData,
                    ])
                )
                if (skip && !reminderForOtherData.length) {
                    dispatch(setReminderForOtherAvailable(false))
                }
            } else {
                dispatch(
                    setReminderForOtherError(
                        'Reminder for other data is not an array'
                    )
                )
            }
        } catch (e) {
            console.error('Error in fetching reminder for other data', e)
            dispatch(
                setReminderForOtherError(e.message || 'Something went wrong')
            )
        }
    }
}

export const searchReminderTribes = (skip, limit, searchString) => {
    return async (dispatch, getState) => {
        try {
            dispatch(setReminderSearchTribesLoading(true))
            let reminderSearchTribes = []
            const { token, user } = getState().user
            const userId = user?._id

            if (skip) {
                reminderSearchTribes =
                    getState()?.reminder?.reminderSearchTribes || []
            } else {
                dispatch(setReminderSearchTribesAvailable(true))
            }
            const queryPayload = {
                skip,
                limit,
                search: searchString,
            }
            const data = await reminderTribeAPI(queryPayload, token)
            const tribes = data.tribes
            if (Array.isArray(tribes)) {
                const finalData = formatReminderTribe(tribes, userId)
                dispatch(
                    setReminderSearchTribes([
                        ...reminderSearchTribes,
                        ...finalData,
                    ])
                )
                if (skip && !tribes.length) {
                    dispatch(setReminderSearchTribesAvailable(false))
                }
            } else {
                dispatch(
                    setReminderSearchTribesError(
                        'Reminder search  tribes is not an array'
                    )
                )
            }
        } catch (e) {
            console.error('Error in fetching search tribes data', e)
            dispatch(
                setReminderSearchTribesError(
                    e.message || 'Something went wrong'
                )
            )
        }
    }
}

const debounceReminderForOtherSearch = debounce(
    (skip, limit, searchText, dispatch) => {
        dispatch(searchReminderForOther(skip, limit, searchText))
    },
    500
)

const debounceReminderForSelfSearch = debounce(
    (skip, limit, searchText, dispatch) => {
        dispatch(searchReminderForMe(skip, limit, searchText))
    },
    500
)

export const searchReminder = (skip, limit, searchText) => {
    return async (dispatch, getState) => {
        dispatch(setReminderSearchText(searchText))
        const state = getState()
        const reminderSelectedTabIndex = state.reminder.reminderTab.index
        const searchValue = searchText.trim()
        if (searchValue) {
            if (reminderSelectedTabIndex === 0) {
                dispatch(setReminderGoalSearchLoading(true))
                debounceReminderForSelfSearch(
                    skip,
                    limit,
                    searchValue,
                    dispatch
                )
            } else if (reminderSelectedTabIndex === 1) {
                dispatch(setReminderForOtherSearchLoading(true))
                debounceReminderForOtherSearch(
                    skip,
                    limit,
                    searchValue,
                    dispatch
                )
            }
        } else {
            dispatch(resetReminderForOtherSearch())
            dispatch(resetReminderGoalSearch())
        }
    }
}

export const searchReminderForOther = (skip, limit, searchString) => {
    return async (dispatch, getState) => {
        try {
            dispatch(setReminderForOtherSearchLoading(true))
            let reminderSearchForOther = []
            const { token, user } = getState().user
            const userId = user?._id

            if (skip) {
                reminderSearchForOther =
                    getState()?.reminder?.reminderForOtherSearch || []
            } else {
                dispatch(setReminderForOtherSearchAvailable(true))
            }
            const queryPayload = {
                skip,
                limit,
                search: searchString,
            }
            const data = await reminderForOtherAPI(queryPayload, token)
            const reminderForOtherSearch = data.reminderForOther
            if (Array.isArray(reminderForOtherSearch)) {
                dispatch(
                    setReminderForOtherSearch([
                        ...reminderSearchForOther,
                        ...reminderForOtherSearch,
                    ])
                )
                if (skip && !reminderForOtherSearch.length) {
                    dispatch(setReminderForOtherSearchAvailable(false))
                }
            } else {
                dispatch(
                    setReminderForOtherSearchError(
                        'Reminder for other is not an array'
                    )
                )
            }
        } catch (e) {
            console.error('Error in fetching search reminder other  data', e)
            dispatch(
                setReminderForOtherSearchError(
                    e.message || 'Something went wrong'
                )
            )
        }
    }
}

export const searchReminderForMe = (skip, limit, searchString) => {
    return async (dispatch, getState) => {
        try {
            dispatch(setReminderGoalSearchLoading(true))
            let reminderGoalSearchData = []
            const { token, user } = getState().user
            const userId = user?._id

            if (skip) {
                reminderGoalSearchData =
                    getState()?.reminder?.reminderGoalSearch || []
            } else {
                dispatch(setReminderGoalSearchAvailable(true))
            }
            const queryPayload = {
                skip,
                limit,
                search: searchString,
            }
            const data = await reminderForGoalSearchAPI(queryPayload, token)
            const reminderForGoalSearch = data.searchGoals
            if (Array.isArray(reminderForGoalSearch)) {
                dispatch(
                    setReminderGoalSearch([
                        ...reminderGoalSearchData,
                        ...reminderForGoalSearch,
                    ])
                )
                if (skip && !reminderForGoalSearch.length) {
                    dispatch(setReminderGoalSearchAvailable(false))
                }
            } else {
                dispatch(
                    setReminderGoalSearchError(
                        'Reminder goal search is not an array'
                    )
                )
            }
        } catch (e) {
            console.error('Error in fetching reminder goal search data', e)
            dispatch(
                setReminderGoalSearchError(e.message || 'Something went wrong')
            )
        }
    }
}

const getStartDate = (startDate) => {
    let checkDate = moment(startDate)
    let currentDate = moment()
    if (checkDate.isValid()) {
        if (checkDate.isSameOrAfter(currentDate, 'day')) {
            if (currentDate.get('hour') > 10) {
                // set tomorrow date 10 am
                currentDate = moment()
                    .add(1, 'days')
                    .set({ hour: 9, minutes: 0, second: 0 })
                return currentDate
            } else {
                return currentDate
            }
        } else {
            return currentDate
        }
    } else {
        if (currentDate.get('hour') > 10) {
            // set tomorrow date 10 am
            currentDate = moment()
                .add(1, 'days')
                .set({ hour: 10, minutes: 0, second: 0 })
        }
        return currentDate
    }
}

const updateReminderForGoal = (
    reminderGoals,
    reminderId,
    goalId,
    notificationData
) => {
    if (Array.isArray(reminderGoals)) {
        const finalGoals = [...reminderGoals]
        const foundIndex = reminderGoals.findIndex(
            (item) => item._id === goalId
        )
        if (foundIndex !== -1) {
            const foundGoal = reminderGoals[foundIndex]
            const foundReminders = foundGoal?.active_reminders || []
            const foundReminderIndex = foundReminders.findIndex(
                (item) => item._id === reminderId
            )
            if (foundReminderIndex !== -1) {
                const reminder = foundReminders[foundReminderIndex]
                reminder.notifications_type = notificationData
                foundReminders[foundReminderIndex] = reminder
                finalGoals[foundIndex].active_reminders = foundReminders
            }
        }
        return finalGoals
    }
}

export const loadCompletedOrArchivedReminder = (
    skip,
    limit,
    token,
    onSuccess,
    onError
) => {
    // Todo: base route depends on tab selection
    const route = `secure/reminder/CompleteOrArchive?${queryBuilder(
        skip,
        limit
    )}`
    return API.get(route, token)
        .then((res) => {
            // console.log(`${DEBUG_KEY}: res for fetching for tab: ${tab}, is: `, res);
            if (is2xxRespose(res.status) || (res && res.data)) {
                // TODO: change this
                return onSuccess(res.data)
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

export const completeReminderAPI = (reminderId, token, isChatBot) => {
    // Todo: base route depends on tab selection
    const route = `secure/reminder/${reminderId}/completed`
    return API.put(
        route,
        {
            isChatBot,
        },
        token
    )
}

export const acceptReminderRequestAPI = (reminderId, token) => {
    // Todo: base route depends on tab selection
    const route = `secure/reminder/acceptReminder/${reminderId}`
    return API.put(route, {}, token)
}

export const archivedReminderAPI = (reminderId, token) => {
    // Todo: base route depends on tab selection
    const route = `secure/reminder/${reminderId}/archived`
    return API.put(route, {}, token)
}

export const reminderRequestAgainAPI = (reminderId, payload, token) => {
    // Todo: base route depends on tab selection
    const route = `secure/reminder/reminderRequestAgain/${reminderId}`
    return API.put(route, payload, token)
}
export const reminderCompletedForOtherAPI = (reminderId, payload, token) => {
    // Todo: base route depends on tab selection
    const route = `secure/reminder/completedForOther/${reminderId}`
    return API.put(route, {}, token)
}

export const restoreReminderAPI = (payload, token) => {
    // Todo: base route depends on tab selection
    const route = `secure/reminder/multipleRestores/`
    return API.put(route, payload, token)
}

export const deleteReminderAPI = (payload, token) => {
    // Todo: base route depends on tab selection
    const route = `secure/reminder/multipleDelete`
    return API.delete(route, payload, token)
}

export const reminderTribeAPI = (payload, token) => {
    // Todo: base route depends on tab selection
    let url = `secure/tribe/reminders?limit=${payload.limit || 10}&skip=${
        payload.skip || 0
    }`
    if (payload.search) {
        url = url + `&search=${payload.search}`
    }
    return API.get(url, token)
}

export const reminderTribeByIdAPI = (payload, token) => {
    // Todo: base route depends on tab selection
    let url = `secure/tribe/reminders/${payload.tribeId}`
    return API.get(url, token)
}

export const reminderFriendsAPI = (payload, token) => {
    // Todo: base route depends on tab selection
    let url = `secure/reminder/friends?limit=${payload.limit || 10}&skip=${
        payload.skip || 0
    }`
    if (payload.search) {
        url = url + `&search=${payload.search}`
    }
    return API.get(url, token)
}
export const reminderForOtherAPI = (payload, token) => {
    // Todo: base route depends on tab selection
    let url = `secure/reminder/reminder_for_other?limit=${
        payload.limit || 10
    }&skip=${payload.skip || 0}`
    if (payload.search) {
        url = url + `&search=${payload.search}`
    }
    return API.get(url, token)
}

export const reminderForGoalSearchAPI = (payload, token) => {
    // Todo: base route depends on tab selection
    let url = `secure/goal/searchGoalReminder?limit=${
        payload.limit || 10
    }&skip=${payload.skip || 0}`
    if (payload.search) {
        url = url + `&search=${payload.search}`
    }
    return API.get(url, token)
}

export const uploadReminderImageS3 = async (images, token) => {
    const allImageObject = []
    await Promise.all(
        images.map(async (image) => {
            console.log('images', image)
            console.log(
                'images',
                image?.includes(
                    'https://s3.us-west-2.amazonaws.com/goalmogul-v1/'
                )
            )
            if (
                !image?.includes(
                    'https://s3.us-west-2.amazonaws.com/goalmogul-v1/'
                )
            ) {
                await ImageUtils.getImageSize(image)
                    .then(async ({ width, height }) => {
                        // Resize image
                        console.log('width, height are: ', width, height)
                        return await ImageUtils.resizeImage(
                            image,
                            width,
                            height
                        )
                    })
                    .then(async (resizedImage) => {
                        // Upload image to S3 server
                        console.log('file to upload is: ', resizedImage)
                        return ImageUtils.getPresignedUrl(
                            resizedImage.uri,
                            token,
                            (objectKey) => {
                                console.log(
                                    'THIS IS OBJECT KEY OF Reminder Image',
                                    objectKey
                                )
                                allImageObject.push(objectKey)
                            },
                            'ReminderImage'
                        )
                    })
                    .then(({ file, signedRequest }) => {
                        return ImageUtils.uploadImage(file, signedRequest)
                    })
                    .then((res) => {
                        if (res instanceof Error) {
                            // uploading to s3 failed
                            console.log(
                                'error uploading image to s3 with res: ',
                                res
                            )
                            throw res
                        }
                    })
                    .then((res) => {
                        if (res instanceof Error) {
                            // uploading to s3 failed
                            console.log(
                                'error uploading image to s3 with res: ',
                                res
                            )
                            throw res
                        }
                    })
            } else {
                return getFileAsyncFileName(image).then((fileName) => {
                    return allImageObject.push(fileName)
                })
            }
        })
    )
    return allImageObject
}

export const uploadReminderVideoS3 = async (videos, token) => {
    const allVideosObject = []
    await Promise.all(
        videos.map((item) => {
            if (
                !item?.includes(
                    'https://s3.us-west-2.amazonaws.com/goalmogul-v1/'
                )
            ) {
                return VideoUtils.getPresignedUrlWithoutTranscode(
                    item,
                    token,
                    (objectKey) => {
                        allVideosObject.push(objectKey)
                    },
                    'ReminderVideo'
                ).then(({ file, signedRequest }) => {
                    return VideoUtils.uploadVideo(file, signedRequest)
                })
            } else {
                return getFileAsyncFileName(item).then((fileName) => {
                    return allVideosObject.push(fileName)
                })
            }
        })
    )
    return allVideosObject
}

export const uploadReminderAudioS3 = async (audios, token) => {
    const allAudioObject = []
    await Promise.all(
        audios.map((item) => {
            if (
                !item.includes(
                    'https://s3.us-west-2.amazonaws.com/goalmogul-v1/'
                )
            ) {
                return VoiceUtils.getPresignedUrl(
                    item,
                    token,
                    (objectKey) => {
                        allAudioObject.push(objectKey)
                    },
                    'ReminderAudio'
                ).then(({ file, signedRequest }) => {
                    return VoiceUtils.uploadVoice(file, signedRequest)
                })
            } else {
                return getFileAsyncFileName(item).then((fileName) => {
                    return allAudioObject.push(fileName)
                })
            }
        })
    )
    return allAudioObject
}

export const prepareCustomReminderPayload = async (
    goalId,
    notifications,
    customReminderForms,
    token
) => {
    try {
        const {
            message,
            startDate,
            reminderMedia,
            reminderAudios,
            repeatType,
            endRepeat,
            endRepeatDate,
            weeklySelectedDays,
            vibration,
            sound,
            everyWeek,
            everyMonth,
            monthlySelectedDays,
            everyMonthWeekDay,
            monthlyWeekDay,
            everyYear,
            yearlyMonth,
            yearlyDay,
            yearlyWeek,
            customEveryUnit,
            customEvery,
            exceptionTimes,
            exceptionDates,
            custom_before_due_date,
            reminder_for,
            recipient_users,
            recipient_contacts,
        } = customReminderForms

        const isValidNotification = !!(
            notifications.sms ||
            notifications.email ||
            notifications.push_notification
        )
        if (
            (reminder_for === REMINDER_FOR.SELF &&
                goalId &&
                isValidNotification) ||
            (reminder_for === REMINDER_FOR.FRIENDS &&
                recipient_users.length &&
                isValidNotification) ||
            (reminder_for === REMINDER_FOR.CONTACTS &&
                recipient_contacts.length)
        ) {
            let reminder_images = []
            let reminder_videos = []
            let reminder_audios = []
            if (reminderMedia.length) {
                const allImagesUrl = []
                const allVideoUrl = []
                reminderMedia.forEach((item) => {
                    if (item.mime?.includes('image')) {
                        allImagesUrl.push(item?.uri)
                    } else if (item.mime?.includes('video')) {
                        allVideoUrl.push(item?.uri)
                    }
                })
                reminder_images = await uploadReminderImageS3(
                    allImagesUrl,
                    token
                )
                reminder_videos = await uploadReminderVideoS3(
                    allVideoUrl,
                    token
                )
            }

            if (reminderAudios.length) {
                reminder_audios = await uploadReminderAudioS3(reminderAudios)
            }

            const timezone = getTimeZone()
            const payload = {
                timezone,
                reminder_for: reminder_for,
                is_repeat: repeatType !== 'never',
                reminder_type: 'custom',
                repeat_type: repeatType,
                end_repeat_type: endRepeat,
                start_date: moment(startDate).set({ second: 0 }).toDate(),
                vibration: vibration,
            }
            if (reminder_for !== REMINDER_FOR.CONTACTS) {
                payload.notifications_type = notifications
            }
            if (goalId) {
                payload.goalId = goalId
            }
            if (reminder_for === REMINDER_FOR.FRIENDS) {
                payload.recipient_users = recipient_users
            }
            if (reminder_for === REMINDER_FOR.CONTACTS) {
                payload.recipient_contacts = recipient_contacts
            }
            if (endRepeat === 'on_date') {
                payload.end_repeat_date = endRepeatDate
            }
            if (message) {
                payload.message = message
            }
            if (sound) {
                payload.notification_sound = sound
            }
            if (reminder_videos.length) {
                payload.reminder_videos = reminder_videos
            }
            if (reminder_images.length) {
                payload.reminder_images = reminder_images
            }
            if (reminder_audios.length) {
                payload.reminder_audios = reminder_audios
            }

            //SET CUSTOM REMINDER BY IT REPEAT TYPE
            switch (repeatType) {
                case 'weekly':
                    const tempWeekObj = {}
                    tempWeekObj.weekly_selected_days = weeklySelectedDays
                    tempWeekObj.every_week = everyWeek
                    payload.weeklyRepeatType = tempWeekObj
                    break
                case 'monthly':
                    const tempMonthObj = {}
                    tempMonthObj.every_month = everyMonth
                    if (
                        Array.isArray(monthlySelectedDays) &&
                        monthlySelectedDays.length
                    ) {
                        tempMonthObj.monthly_selected_day = monthlySelectedDays
                    }
                    if (everyMonthWeekDay && monthlyWeekDay) {
                        tempMonthObj.every_month_week_day = everyMonthWeekDay
                        tempMonthObj.monthly_week_day = monthlyWeekDay
                    }

                    payload.monthlyRepeatType = tempMonthObj
                    break
                case 'yearly':
                    const tempYearObj = {}
                    tempYearObj.every_year = everyYear
                    // tempYearObj.yearly_week = yearlyWeek
                    // tempYearObj.yearly_day = yearlyDay
                    // tempYearObj.yearly_month = yearlyMonth
                    payload.yearlyRepeatType = tempYearObj
                    break
                case 'custom':
                    const tempCustomObj = {}
                    tempCustomObj.custom_every = customEvery
                    tempCustomObj.custom_every_unit = customEveryUnit
                    if (
                        customEveryUnit === 'hour' ||
                        customEveryUnit === 'minute'
                    ) {
                        if (exceptionTimes?.length) {
                            tempCustomObj.exception_times = exceptionTimes
                        }
                    } else if (
                        customEveryUnit !== 'month' &&
                        customEveryUnit !== 'year'
                    ) {
                        if (exceptionDates?.length) {
                            tempCustomObj.exception_dates = exceptionDates
                        }
                    } else if (customEveryUnit === 'month') {
                        const tempMonthObj = {}
                        tempMonthObj.every_month = everyMonth
                        if (
                            Array.isArray(monthlySelectedDays) &&
                            monthlySelectedDays.length
                        ) {
                            tempMonthObj.monthly_selected_day = monthlySelectedDays
                        }
                        if (everyMonthWeekDay && monthlyWeekDay) {
                            tempMonthObj.every_month_week_day = everyMonthWeekDay
                            tempMonthObj.monthly_week_day = monthlyWeekDay
                        }
                        payload.monthlyRepeatType = tempMonthObj
                    } else if (customEveryUnit === 'year') {
                        const tempYearObj = {}
                        tempYearObj.every_year = everyYear
                        tempYearObj.yearly_week = yearlyWeek
                        tempYearObj.yearly_day = yearlyDay
                        tempYearObj.yearly_month = yearlyMonth
                        payload.yearlyRepeatType = tempYearObj
                    } else if (customEveryUnit === 'week') {
                        const tempWeekObj = {}
                        tempWeekObj.weekly_selected_days = weeklySelectedDays
                        payload.weeklyRepeatType = tempWeekObj
                    }
                    payload.customRepeatType = tempCustomObj
                    break
                case 'due_date':
                    const tempDueDateObj = {}
                    if (custom_before_due_date) {
                        tempDueDateObj.custom_before_due_date = custom_before_due_date
                    }
                    payload.dueDateRepeatType = tempDueDateObj
                    break
                default:
                    break
            }
            return payload
        } else {
            console.error('some payload is missing')
            throw new Error('some payload is missing')
        }
    } catch (e) {
        console.error('Error in create custom reminder', e)
        throw e
    }
}

const getFileAsyncFileName = async (filename) => {
    return filename.replace(
        'https://s3.us-west-2.amazonaws.com/goalmogul-v1/',
        ''
    )
}

const formatReminderTribe = (tribes, userId) => {
    let finalData = []
    for (let i = 0; i < tribes.length; i++) {
        const tribe = tribes[i]
        const tribeId = tribe._id
        const members = Array.isArray(tribe.members) ? tribe.members : []
        const filterMembers = []
        for (let j = 0; j < members.length; j++) {
            const member = members[j]
            if (member.memberRef._id !== userId) {
                filterMembers.push({ ...member.memberRef, tribeId })
            }
        }
        if (filterMembers.length) {
            const sortedArray = filterMembers.sort((a, b) => {
                a = a?.name?.toLowerCase()
                b = b?.name?.toLowerCase()
                if (a === b) return 0
                return a < b ? -1 : 1
            })
            const temp = {
                title: tribe.name,
                data: sortedArray,
            }
            finalData.push(temp)
        }
    }
    return finalData
}
