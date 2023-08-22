/** @format */

import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

const initialState = {
    videoUri: '',
    videoFromCameraRollUri: '',
    voiceUri: '',
    videoPreparing: 0,
    uploadPostVideo: false,
    videoProgress: [
        {
            progress: 0,
            uploaded: false,
            uploadedFor: '',
            userId: '',
            videoUploading: false,
        },
    ],
    chatVideoProgress: [
        {
            progress: 0,
            uploaded: false,
            uploadedFor: '',
            userId: '',
            videoUploading: false,
        },
    ],
    feedPostVideoProgress: [
        {
            progress: 0,
            uploaded: false,
            uploadedFor: '',
            userId: '',
            videoUploading: false,
        },
    ],
}

const slice = createSlice({
    name: 'profileSwiper',
    initialState,
    reducers: {
        setVideoUri: (state, action) => {
            state.videoUri = action.payload
        },
        setVideoPreparing: (state, action) => {
            state.videoPreparing = action.payload
        },
        setVideoFromCameraUri: (state, action) => {
            state.videoFromCameraRollUri = action.payload
        },
        setVideoProgress: (state, action) => {
            const {
                progress,
                uploaded,
                uploadedFor,
                userId,
                videoUploading,
            } = action.payload
            const videoIndex = state.videoProgress.findIndex(
                (video) => video.uploadedFor === uploadedFor
            )
            if (videoIndex !== -1) {
                state.videoProgress[videoIndex].progress = progress
                state.videoProgress[videoIndex].uploaded = uploaded
                state.videoProgress[videoIndex].userId = userId
                state.videoProgress[videoIndex].videoUploading = videoUploading
            } else {
                state.videoProgress.push({
                    progress,
                    uploaded,
                    uploadedFor,
                    userId,
                    videoUploading,
                })
            }
        },
        setChatVideoProgress: (state, action) => {
            const {
                progress,
                uploaded,
                uploadedFor,
                userId,
                videoUploading,
            } = action.payload
            const videoIndex = state.chatVideoProgress.findIndex(
                (video) => video.uploadedFor === uploadedFor
            )
            if (videoIndex !== -1) {
                state.chatVideoProgress[videoIndex].progress = progress
                state.chatVideoProgress[videoIndex].uploaded = uploaded
                state.chatVideoProgress[videoIndex].userId = userId
                state.chatVideoProgress[
                    videoIndex
                ].videoUploading = videoUploading
            } else {
                state.chatVideoProgress.push({
                    progress,
                    uploaded,
                    uploadedFor,
                    userId,
                    videoUploading,
                })
            }
        },
        setFeedVideoProgress: (state, action) => {
            const {
                progress,
                uploaded,
                uploadedFor,
                userId,
                videoUploading,
            } = action.payload
            const videoIndex = state.feedPostVideoProgress.findIndex(
                (video) => video.uploadedFor === uploadedFor
            )
            if (videoIndex !== -1) {
                state.feedPostVideoProgress[videoIndex].progress = progress
                state.feedPostVideoProgress[videoIndex].uploaded = uploaded
                state.feedPostVideoProgress[videoIndex].userId = userId
                state.feedPostVideoProgress[
                    videoIndex
                ].videoUploading = videoUploading
            } else {
                state.feedPostVideoProgress.push({
                    progress,
                    uploaded,
                    uploadedFor,
                    userId,
                    videoUploading,
                })
            }
        },
        setVoiceUri: (state, action) => {
            state.voiceUri = action.payload
        },
        isPostVideoTranscoded: (state, action) => {
            state.uploadPostVideo = action.payload
        },
        setVideoTranscoding: () => initialState,
        backToInitialStateForVideo: (state, action) => {
            const { uploadedFor } = action.payload
            const videoIndex = state.videoProgress.findIndex(
                (video) => video.uploadedFor === uploadedFor
            )
            if (videoIndex !== -1) {
                state.videoProgress.splice(videoIndex, 1)
            }
        },
        backToInitialStateForChatVideo: (state, action) => {
            const { uploadedFor } = action.payload
            const videoIndex = state.chatVideoProgress.findIndex(
                (video) => video.uploadedFor === uploadedFor
            )
            if (videoIndex !== -1) {
                state.chatVideoProgress.splice(videoIndex, 1)
            }
        },
        backToInitialStateForFeedVideo: (state, action) => {
            const { uploadedFor } = action.payload
            const videoIndex = state.feedPostVideoProgress.findIndex(
                (video) => video.uploadedFor === uploadedFor
            )
            if (videoIndex !== -1) {
                state.feedPostVideoProgress.splice(videoIndex, 1)
            }
        },
        backToInitialState: (state) => {
            return (
                state.videoUri === '',
                state.videoFromCameraRollUri === '',
                state.videoPreparing === ''
            )
        },
    },
})

export default slice.reducer
export const {
    setVideoUri,
    setVoiceUri,
    setVideoFromCameraUri,
    setVideoPreparing,
    setVideoProgress,
    backToInitialState,
    setChatVideoProgress,
    backToInitialStateForChatVideo,
    backToInitialStateForVideo,
    setVideoTranscoding,
    backToInitialStateForFeedVideo,
    isPostVideoTranscoded,
    setFeedVideoProgress,
} = slice.actions
