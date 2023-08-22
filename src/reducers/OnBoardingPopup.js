/** @format */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading: false,
    inviterData: {},
    error: '',
}

const slice = createSlice({
    name: 'onBoardingPopup',
    initialState,
    reducers: {
        loadInviterData: (state, action) => {
            state.loading = action.payload
        },
        getInviterData: (state, action) => {
            state.inviterData = action.payload
        },
        errorInviterData: (state, action) => {
            state.loading = action.payload
        },

        clearInviterData: () => initialState,
    },
})

export default slice.reducer
export const {
    loadInviterData,
    getInviterData,
    errorInviterData,
    clearInviterData,
} = slice.actions
