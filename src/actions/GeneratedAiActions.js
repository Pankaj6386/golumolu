/** @format */

import { api as API } from '../redux/middleware/api'
import {
    loadingSteps,
    generatedSteps,
    errorGeneratingSteps,
    loadingReplies,
    generatedReplies,
    errorGeneratingReplies,
    loadingSavedReplies,
    generatedSavedReplies,
    errorGeneratingSavedReplies,
    loadingSaveMessage,
    loadingChatReplies,
    generatedChatReplies,
    errorGeneratingChatReplies,
    loadingNeeds,
    generatedNeeds,
    errorGeneratingNeeds,
} from '../reducers/GeneratedReducers'
// import { DropDownHolder } from '../Main/Common/Modal/DropDownModal'

const DEBUG_KEY = '[ GeneratedAiActions ]'

export const getGeneratedSteps = () => {
    return async (dispatch, getState) => {
        try {
            const { title } = getState().form?.createGoalModal?.values
            dispatch(loadingSteps(true))
            let res
            res = await API.get(`ai/GPT3/steps?goal=${title}`)
            if (res.status === 200) {
                const generatedText = res.result.map((text, index) => {
                    return {
                        id: index,

                        description: text,
                        isSelected: false,
                        isCompleted: false,
                    }
                })
                dispatch(generatedSteps(generatedText))
                dispatch(loadingSteps(false))
                console.log(
                    `${DEBUG_KEY} This is the response of generated steps`,
                    res
                )
            }
        } catch (err) {
            dispatch(errorGeneratingSteps(err.message))
            console.log(
                `${DEBUG_KEY} This is the error of generated steps`,
                err.message
            )
        }
    }
}

//Added action to fetch AI generated needs from API Call to show inside the Need Suggested Modal
export const getGeneratedNeeds = () => {
    return async (dispatch, getState) => {
        try {
            const { title } = getState().form?.createGoalModal?.values
            dispatch(loadingNeeds(true))
            let res
            res = await API.get(`ai/GPT3/needs?goal=${title}`)

            const generatedText = res.result.map((text, index) => {
                return {
                    id: index,
                    description: text,
                    isSelected: false,
                    isCompleted: false,
                }
            })

            dispatch(generatedNeeds(generatedText))
            dispatch(loadingNeeds(false))
        } catch (err) {
            dispatch(errorGeneratingNeeds(err.message))
        }
    }
}

export const getGeneratedReplies = () => {
    return async (dispatch) => {
        try {
            dispatch(loadingReplies(true))
            let res
            res = await API.get(`ai/GPT3/post-replies`)
            const generatedText = res.result.map((text, index) => {
                return {
                    id: index,
                    description: text,
                }
            })
            dispatch(generatedReplies(generatedText))
            dispatch(loadingReplies(false))
            console.log(
                `${DEBUG_KEY} This is the response of generated replies`,
                res
            )
        } catch (err) {
            dispatch(errorGeneratingReplies(err.message))
            console.log(
                `${DEBUG_KEY} This is the error of generated replies`,
                err.message
            )
        }
    }
}

export const getGeneratedSavedReplies = () => {
    return async (dispatch) => {
        try {
            dispatch(loadingSavedReplies(true))
            let res
            res = await API.get(`secure/User/SavedMessagesPost/`)
            dispatch(generatedSavedReplies(res.data))
            dispatch(loadingSavedReplies(false))
            console.log(
                `${DEBUG_KEY} This is the response of generated replies`,
                res
            )
        } catch (err) {
            dispatch(errorGeneratingSavedReplies(err.message))
            console.log(
                `${DEBUG_KEY} This is the error of generated replies`,
                err.message
            )
        }
    }
}

export const saveCustomMessage = (textToSend) => {
    return async (dispatch) => {
        try {
            dispatch(loadingSaveMessage(true))
            let res
            res = await API.get(
                `secure/User/SavedMessagesPost/addMessage?text=${textToSend}`
            )

            dispatch(loadingSaveMessage(false))
            console.log(
                `${DEBUG_KEY} This is the response of save messages`,
                res
            )
        } catch (err) {
            console.log(
                `${DEBUG_KEY} This is the error of generated replies`,
                err.message
            )
        }
    }
}

export const updateMessages = (message, nMessageId, order) => {
    return async (dispatch) => {
        try {
            dispatch(loadingSaveMessage(true))
            let res
            res = await API.get(
                `secure/User/SavedMessagesPost/updateMessage?text=${message}&nmessageId=${nMessageId}&order=${order}`
            )
            dispatch(loadingSaveMessage(false))
            console.log(
                `${DEBUG_KEY} This is the response of save messages`,
                res
            )
        } catch (err) {
            console.log(
                `${DEBUG_KEY} This is the error of generated replies`,
                err.message
            )
        }
    }
}

export const paraphaseMessage = (text, nMessageId, order) => {
    return async (dispatch) => {
        try {
            dispatch(loadingSaveMessage(true))
            let res
            res = await API.get(
                `secure/User/SavedMessagesPost/altMessage?text=${text}&nmessageId=${nMessageId}&order=${order}`
            )
            dispatch(loadingSaveMessage(false))
            console.log(
                `${DEBUG_KEY} This is the response of save messages`,
                res``
            )
        } catch (err) {
            console.log(
                `${DEBUG_KEY} This is the error of generated replies`,
                err.message
            )
        }
    }
}

export const generateChatReplies = (textToSend) => {
    return async (dispatch) => {
        try {
            dispatch(loadingChatReplies(true))
            let res
            res = await API.get(
                `ai/GPT3/smart-reply?message=${
                    textToSend ? textToSend : 'Some messages'
                }`
            )
            dispatch(loadingChatReplies(false))
            const generatedText = res.result.map((text, index) => {
                return {
                    id: index,
                    description: text,
                }
            })
            dispatch(generatedChatReplies(generatedText))
            console.log(
                `${DEBUG_KEY} This is the response of chat messages`,
                res
            )
        } catch (err) {
            console.log(
                `${DEBUG_KEY} This is the error of chat replies`,
                err.message
            )
        }
    }
}
