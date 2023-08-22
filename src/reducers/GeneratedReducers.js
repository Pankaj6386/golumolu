/** @format */

import { createSlice } from '@reduxjs/toolkit'
import { current } from '@reduxjs/toolkit'

import _ from 'lodash'

const initialState = {
    loadingSteps: false,
    generatedSteps: [],
    errorGeneratingSteps: '',
    loadingNeeds: false,
    generatedNeeds: [],
    errorGeneratingNeeds: '',
    loadingReplies: false,
    generatedReplies: [],
    errorGeneratingReplies: '',
    loadingSavedReplies: false,
    generatedSavedReplies: [],
    errorGeneratingSavedReplies: '',
    loadingSaveMessage: false,
    loadingChatReplies: false,
    generatedChatReplies: [],
    errorGeneratingChatReplies: '',
}

const slice = createSlice({
    name: 'generatedAi',
    initialState,
    reducers: {
        loadingSteps: (state, action) => {
            state.loadingSteps = action.payload
        },
        generatedSteps: (state, action) => {
            state.generatedSteps = action.payload
        },
        selectedSteps: (state, action) => {
            state.generatedSteps.map((step) => {
                if (step.id == action.payload) {
                    step.isSelected =
                        step.isSelected == null ? true : !step.isSelected
                }
            })
        },
        errorGeneratingSteps: (state, action) => {
            state.errorGeneratingSteps = action.payload
        },
        loadingNeeds: (state, action) => {
            state.loadingNeeds = action.payload
        },
        generatedNeeds: (state, action) => {
            state.generatedNeeds = action.payload
        },
        selectedNeeds: (state, action) => {
            state.selectedNeeds.map((need) => {
                if (need.id == action.payload) {
                    need.isSelected =
                        need.isSelected == null ? true : !need.isSelected
                }
            })
        },
        errorGeneratingNeeds: (state, action) => {
            state.errorGeneratingNeeds = action.payload
        },
        loadingReplies: (state, action) => {
            state.loadingReplies = action.payload
        },
        generatedReplies: (state, action) => {
            state.generatedReplies = action.payload
        },

        errorGeneratingReplies: (state, action) => {
            state.errorGeneratingReplies = action.payload
        },
        loadingSavedReplies: (state, action) => {
            state.loadingSavedReplies = action.payload
        },
        generatedSavedReplies: (state, action) => {
            state.generatedSavedReplies = action.payload
        },

        errorGeneratingSavedReplies: (state, action) => {
            state.errorGeneratingSavedReplies = action.payload
        },
        loadingSaveMessage: (state, action) => {
            state.loadingSaveMessage = action.payload
        },
        loadingChatReplies: (state, action) => {
            state.loadingChatReplies = action.payload
        },
        generatedChatReplies: (state, action) => {
            state.generatedChatReplies = action.payload
        },

        errorGeneratingChatReplies: (state, action) => {
            state.errorGeneratingChatReplies = action.payload
        },
        clearGeneratedData: () => initialState,
    },
})

export default slice.reducer
export const {
    loadingSteps,
    generatedSteps,
    selectedSteps,
    errorGeneratingSteps,
    loadingNeeds, //Added state variables for needs in export object
    generatedNeeds,
    selectedNeeds,
    errorGeneratingNeeds,
    loadingReplies,
    generatedReplies,
    errorGeneratingReplies,
    clearGeneratedData,
    loadingSavedReplies,
    generatedSavedReplies,
    errorGeneratingSavedReplies,
    loadingSaveMessage,
    loadingChatReplies,
    generatedChatReplies,
    errorGeneratingChatReplies,
} = slice.actions
