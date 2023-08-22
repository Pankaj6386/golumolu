/** @format */

import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

const initialState = {
    loading: false,
    allUser: [],
    allTribes: [],
    allChats: [],
    allPosts: [],
    error: '',

    userSkip: 0,
    tribeSkip: 0,
    chatSkip: 0,
    postSkip: 0,
    limit: 10,
}

const slice = createSlice({
    name: 'allAccounts',
    initialState,
    reducers: {
        loadAllData: (state, action) => {
            state.loading = action.payload
        },
        getAllUsers: (state, action) => {
            state.userSkip = 0
            state.tribeSkip = 0
            state.chatSkip = 0
            state.postSkip = 0
            state.allUser = action.payload
        },
        getLoadedUsers: (state, action) => {
            state.userSkip += 10

            state.allUser = [...state.allUser, ...action.payload]
        },

        getAllTribes: (state, action) => {
            state.tribeSkip = 0
            state.allTribes = action.payload
        },
        getLoadedTribes: (state, action) => {
            state.tribeSkip += 10
            state.allTribes = [...state.allTribes, ...action.payload]
        },
        getAllChats: (state, action) => {
            state.chatSkip = 0
            state.allChats = action.payload
        },
        getLoadedChats: (state, action) => {
            state.chatSkip += 10

            state.allChats = [...state.allChats, ...action.payload]
        },

        getAllPosts: (state, action) => {
            state.postSkip = 0

            state.allPosts = action.payload
        },
        getLoadedPosts: (state, action) => {
            state.postSkip += 10

            state.allPosts = [...state.allPosts, ...action.payload]
        },
        clearExistingSearched: (state) => initialState,
    },
})

export default slice.reducer
export const {
    loadAllData,
    getAllUsers,
    getAllTribes,
    getAllChats,
    getLoadedTribes,
    errorGettingData,
    getLoadedChats,
    getLoadedUsers,
    getAllPosts,
    getLoadedPosts,
    clearExistingSearched,
} = slice.actions
