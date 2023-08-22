/** @format */

import { createSlice } from '@reduxjs/toolkit'

const initialReminderGoals = {
    reminderTab: {
        index: 0,
        routes: [
            { key: 'forme', title: 'For Me' },
            { key: 'forother', title: 'For Others' },
        ],
    },
    reminderSearchText: '',
    reminderGoals: [],
    isAvailableReminderGoals: true,
    reminderGoalLoading: false,
    reminderGoalError: null,
    completedOrArchivedReminder: [],
    completedOrArchivedReminderLoading: false,
    completedOrArchivedReminderError: null,
    isAvailableToFetchCompletedOrArchived: true,
    reminderTribes: [],
    reminderTribesAvailable: true,
    reminderTribesLoading: false,
    reminderTribesError: null,
    reminderFriends: [],
    reminderFriendsAvailable: true,
    reminderFriendsLoading: false,
    reminderFriendsError: null,
    reminderSearchFriends: [],
    reminderSearchFriendsAvailable: true,
    reminderSearchFriendsLoading: false,
    reminderSearchFriendsError: null,
    reminderSearchTribes: [],
    reminderSearchTribesAvailable: true,
    reminderSearchTribesLoading: false,
    reminderSearchTribesError: null,
    reminderForOther: [],
    reminderForOtherAvailable: true,
    reminderForOtherLoading: false,
    reminderForOtherError: null,
    reminderForOtherSearch: [],
    reminderForOtherSearchAvailable: true,
    reminderForOtherSearchLoading: false,
    reminderForOtherSearchError: null,
    reminderGoalSearch: [],
    reminderGoalSearchAvailable: true,
    reminderGoalSearchLoading: false,
    reminderGoalSearchError: null,
    reminderTribeDetails: null,
    reminderTribeDetailsLoading: false,
    reminderTribeDetailsError: null,
}

const initialState = {
    ...initialReminderGoals,
}

const slice = createSlice({
    name: 'reminder',
    initialState,
    reducers: {
        setReminderGoalLoading: (state, action) => {
            state.reminderGoalLoading = action.payload
        },
        setReminderGoal: (state, action) => {
            state.reminderGoalLoading = false
            state.reminderGoalError = null
            state.reminderGoals = action.payload
        },
        setReminderGoalError: (state, action) => {
            state.reminderGoalError = action.payload
            state.reminderGoalLoading = false
        },
        setAvailableReminderGoal: (state, action) => {
            state.isAvailableReminderGoals = action.payload
        },
        setCompletedOrArchivedReminderLoading: (state, action) => {
            state.completedOrArchivedReminderLoading = action.payload
        },
        setCompletedOrArchivedReminder: (state, action) => {
            state.completedOrArchivedReminderLoading = false
            state.completedOrArchivedReminderError = null
            state.completedOrArchivedReminder = action.payload
        },
        setCompletedOrArchivedReminderError: (state, action) => {
            state.completedOrArchivedReminderLoading = false
            state.completedOrArchivedReminderError = action.payload
        },
        setAvailableCompleteOrArchived: (state, action) => {
            state.isAvailableToFetchCompletedOrArchived = action.payload
        },
        resetReminderReducer: () => initialState,

        setReminderTribesLoading: (state, action) => {
            state.reminderTribesLoading = action.payload
        },
        setReminderTribes: (state, action) => {
            state.reminderTribesLoading = false
            state.reminderTribesError = null
            state.reminderTribes = action.payload
        },
        setReminderTribesError: (state, action) => {
            state.reminderTribesError = action.payload
            state.reminderTribesLoading = false
        },
        setReminderTribesAvailable: (state, action) => {
            state.reminderTribesAvailable = action.payload
        },
        setReminderSearchTribesLoading: (state, action) => {
            state.reminderSearchTribesLoading = action.payload
        },
        setReminderSearchTribes: (state, action) => {
            state.reminderSearchTribesLoading = false
            state.reminderSearchTribesError = null
            state.reminderSearchTribes = action.payload
        },
        setReminderSearchTribesError: (state, action) => {
            state.reminderSearchTribesError = action.payload
            state.reminderSearchTribesLoading = false
        },
        setReminderSearchTribesAvailable: (state, action) => {
            state.reminderSearchTribesAvailable = action.payload
        },
        resetReminderSearchTribes: (state, action) => {
            state.reminderSearchTribesLoading = false
            state.reminderSearchTribesError = null
            state.reminderSearchTribes = []
            state.reminderSearchTribesAvailable = true
        },
        setReminderSelectedTabIndex: (state, action) => {
            state.reminderTab.index = action.payload
        },
        setReminderForOtherSearchLoading: (state, action) => {
            state.reminderForOtherSearchLoading = action.payload
        },
        setReminderForOtherSearch: (state, action) => {
            state.reminderForOtherSearchLoading = false
            state.reminderForOtherSearchError = null
            state.reminderForOtherSearch = action.payload
        },
        setReminderForOtherSearchError: (state, action) => {
            state.reminderForOtherSearchError = action.payload
            state.reminderForOtherSearchLoading = false
        },
        setReminderForOtherSearchAvailable: (state, action) => {
            state.reminderForOtherSearchAvailable = action.payload
        },
        resetReminderForOtherSearch: (state, action) => {
            state.reminderForOtherSearchLoading = false
            state.reminderForOtherSearchError = null
            state.reminderForOtherSearch = []
            state.reminderForOtherSearchAvailable = true
        },
        setReminderForOtherLoading: (state, action) => {
            state.reminderForOtherLoading = action.payload
        },
        setReminderForOther: (state, action) => {
            state.reminderForOtherLoading = false
            state.reminderForOtherError = null
            state.reminderForOther = action.payload
        },
        setReminderForOtherError: (state, action) => {
            state.reminderForOtherError = action.payload
            state.reminderForOtherLoading = false
        },
        setReminderForOtherAvailable: (state, action) => {
            state.reminderForOtherAvailable = action.payload
        },
        setReminderSearchText: (state, action) => {
            state.reminderSearchText = action.payload
        },
        setReminderGoalSearchLoading: (state, action) => {
            state.reminderGoalSearchLoading = action.payload
        },
        setReminderGoalSearch: (state, action) => {
            state.reminderGoalSearchLoading = false
            state.reminderGoalSearchError = null
            state.reminderGoalSearch = action.payload
        },
        setReminderGoalSearchError: (state, action) => {
            state.reminderGoalSearchError = action.payload
            state.reminderGoalSearchLoading = false
        },
        setReminderGoalSearchAvailable: (state, action) => {
            state.reminderGoalSearchAvailable = action.payload
        },
        resetReminderGoalSearch: (state, action) => {
            state.reminderGoalSearch = []
            state.reminderGoalSearchError = null
            state.reminderGoalSearchLoading = false
            state.reminderGoalSearchAvailable = true
        },
        setReminderFriendsLoading: (state, action) => {
            state.reminderFriendsLoading = action.payload
        },
        setReminderFriends: (state, action) => {
            state.reminderFriendsLoading = false
            state.reminderFriendsError = null
            state.reminderFriends = action.payload
        },
        setReminderFriendsError: (state, action) => {
            state.reminderFriendsError = action.payload
            state.reminderFriendsLoading = false
        },
        setReminderFriendsAvailable: (state, action) => {
            state.reminderFriendsAvailable = action.payload
        },
        setReminderSearchFriendsLoading: (state, action) => {
            state.reminderSearchFriendsLoading = action.payload
        },
        setReminderSearchFriends: (state, action) => {
            state.reminderSearchFriendsLoading = false
            state.reminderSearchFriendsError = null
            state.reminderSearchFriends = action.payload
        },
        setReminderSearchFriendsError: (state, action) => {
            state.reminderSearchFriendsError = action.payload
            state.reminderSearchFriendsLoading = false
        },
        setReminderSearchFriendsAvailable: (state, action) => {
            state.reminderSearchFriendsAvailable = action.payload
        },
        resetReminderSearchFriends: (state) => {
            state.reminderSearchFriendsAvailable = true
            state.reminderSearchFriendsLoading = false
            state.reminderSearchFriendsError = null
            state.reminderSearchFriends = []
        },
        setReminderTribesDetails: (state, action) => {
            state.reminderTribeDetailsLoading = false
            state.reminderTribeDetailsError = null
            state.reminderTribeDetails = action.payload
        },
        setReminderTribesDetailsError: (state, action) => {
            state.reminderTribeDetailsError = action.payload
            state.reminderTribeDetailsLoading = false
        },
        setReminderTribesDetailsLoading: (state, action) => {
            state.reminderTribeDetailsLoading = action.payload
        },
        resetReminderTribesDetails: (state) => {
            state.reminderTribeDetails = null
        },
    },
})

export default slice.reducer
export const {
    setReminderGoal,
    setReminderGoalError,
    setReminderGoalLoading,
    setCompletedOrArchivedReminderError,
    setCompletedOrArchivedReminder,
    setCompletedOrArchivedReminderLoading,
    setAvailableCompleteOrArchived,
    setAvailableReminderGoal,
    resetReminderReducer,
    setReminderTribes,
    setReminderTribesError,
    setReminderTribesLoading,
    setReminderTribesAvailable,
    setReminderSearchTribesAvailable,
    setReminderSearchTribesLoading,
    setReminderSearchTribesError,
    setReminderSearchTribes,
    resetReminderSearchTribes,
    setReminderSelectedTabIndex,
    setReminderForOtherAvailable,
    setReminderForOtherError,
    setReminderForOther,
    setReminderForOtherLoading,
    setReminderForOtherSearch,
    setReminderForOtherSearchAvailable,
    setReminderForOtherSearchError,
    setReminderForOtherSearchLoading,
    resetReminderForOtherSearch,
    setReminderSearchText,
    resetReminderGoalSearch,
    setReminderGoalSearchAvailable,
    setReminderGoalSearchError,
    setReminderGoalSearchLoading,
    setReminderGoalSearch,
    setReminderFriends,
    setReminderFriendsAvailable,
    setReminderFriendsError,
    setReminderFriendsLoading,
    setReminderSearchFriendsAvailable,
    setReminderSearchFriendsLoading,
    setReminderSearchFriends,
    setReminderSearchFriendsError,
    resetReminderSearchFriends,
    setReminderTribesDetails,
    setReminderTribesDetailsError,
    setReminderTribesDetailsLoading,
    resetReminderTribesDetails,
} = slice.actions
