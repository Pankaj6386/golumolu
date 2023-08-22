import { createSlice } from '@reduxjs/toolkit'
import {REMINDER_FOR} from "../Utils/Constants";

const initialFieldState = {
    notifications: {
        email: false,
        sms: false,
        push_notification: true,
    },
    defaultReminder: {
        month_before_due_date: null,
        week_before_due_date: null,
        day_before_due_date: null,
        on_due_date: null,
        custom: true,
        disableMonthBeforeDueDate: true,
        disableWeekBeforeDueDate: true,
        disableDayBeforeDueDate: true,
        disableOnDueDate: true,
    },
    selected_reminders: [],
}

const initialCustomReminderForms = {
    customReminderForms: {
        reminderAudios: [],
        reminderMedia: [],
        message: '',
        startDate: new Date(new Date().setHours(9, 0)),
        repeatType: 'never',
        repeatTypeText: 'Never',
        endRepeat: 'never',
        endRepeatDate: null,
        weeklySelectedDays: [new Date().getDay() + ''],
        everyWeek: '1',
        sound: 'Default',
        vibration: true,
        everyMonth: '1',
        monthlySelectedDays: [],
        monthlyWeekDay: '',
        everyMonthWeekDay: '',
        everyYear: '1',
        yearlyWeek: '1',
        yearlyDay: '1',
        yearlyMonth: '1',
        customEvery: '1',
        customEveryUnit: 'day',
        exceptionDates: [],
        exceptionTimes: [],
        custom_before_due_date: null,
        isCustomReminderSave: false,
        reminder_for: REMINDER_FOR.SELF,
        recipient_users: [],
        recipient_contacts: [],
        recipient_users_details: [],
    },
}

const initialReminderGoals = {
    handleDueDateNotification: false,
    notificationExtraData: {},
}

const initialState = {
    ...initialFieldState,
    ...initialReminderGoals,
    ...initialCustomReminderForms,
    selectedGoal: null,
}

const slice = createSlice({
    name: 'reminderForm',
    initialState,
    reducers: {
        updateNotifications: (state, action) => {
            state.notifications = { ...state.notifications, ...action.payload }
        },
        updateDefaultReminder: (state, action) => {
            state.defaultReminder = {
                ...state.defaultReminder,
                ...action.payload,
            }
        },
        setSelectedReminder: (state, action) => {
            state.selected_reminders = action.payload
        },
        toggleSelectReminder: (state, action) => {
            const payload = action.payload
            const filterReminders = state.selected_reminders.filter(
                (item) => item.reminder_type !== payload.reminder_type
            )
            if (filterReminders.length === state.selected_reminders.length) {
                state.selected_reminders = [
                    ...state.selected_reminders,
                    action.payload,
                ]
            } else {
                state.selected_reminders = filterReminders
            }
        },
        setHandleDueDateNotification: (state, action) => {
            state.handleDueDateNotification = true
            state.notificationExtraData = action.payload
        },
        resetHandleDueDateNotification: (state) => {
            state.handleDueDateNotification = false
            state.notificationExtraData = {}
        },
        setCustomReminderForms: (state, action) => {
            state.customReminderForms = {
                ...state.customReminderForms,
                ...action.payload,
            }
        },
        setSelectedGoal: (state, action) => {
            state.selectedGoal = action.payload
        },
        resetReminderField: (state) => ({
            ...state,
            ...initialFieldState,
        }),
        resetCustomReminderForms: (state) => ({
            ...state,
            ...initialCustomReminderForms,
        }),
        resetReminderReducer: () => ({
            ...initialState,
        }),
    },
})

export default slice.reducer
export const {
    updateNotifications,
    resetReminderField,
    updateDefaultReminder,
    toggleSelectReminder,
    setSelectedReminder,
    resetReminderReducer,
    setHandleDueDateNotification,
    resetHandleDueDateNotification,
    setCustomReminderForms,
    resetCustomReminderForms,
    setSelectedGoal,
} = slice.actions
