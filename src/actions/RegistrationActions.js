/** @format */

import { Actions } from 'react-native-router-flux'
import { Alert, Platform } from 'react-native'
import CameraRoll from '@react-native-community/cameraroll'
import * as ImagePickerr from 'expo-image-picker'
// import { Camera } from 'expo-camera'
import * as Contacts from 'expo-contacts'
import { SubmissionError } from 'redux-form'
import { api as API } from '../redux/middleware/api'
import { tutorial as Tutorial } from '../redux/modules/auth/Tutorial'
import { DropDownHolder } from '../Main/Common/Modal/DropDownModal'
import { track, EVENT as E } from '../monitoring/segment'
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { Video } from 'react-native-compressor'
// import ImagePicker from 'react-native-image-crop-picker'
import * as FileSystem from 'expo-file-system'

import {
    REGISTRATION_BACK,
    REGISTRATION_LOGIN,
    REGISTRATION_ADDPROFILE,
    REGISTRATION_ACCOUNT_LOADING,
    REGISTRATION_ACCOUNT_SUCCESS,
    REGISTRATION_CONTACT_SKIP,
    REGISTRATION_CONTACT,
    REGISTRATION_CONTACT_SYNC,
    REGISTRATION_CONTACT_SYNC_SKIP,
    REGISTRATION_CONTACT_SYNC_DONE,
    REGISTRATION_CONTACT_SYNC_UPLOAD_DONE,
    REGISTRATION_CONTACT_SYNC_FETCH,
    REGISTRATION_CONTACT_SYNC_FETCH_DONE,
    REGISTRATION_CONTACT_SYNC_REFRESH,
    REGISTRATION_CONTACT_SYNC_REFRESH_DONE,
    REGISTRATION_INTRO,
    REGISTRATION_INTRO_FORM_CHANGE,
    REGISTRATION_INTRO_SKIP,
    REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS,
    REGISTRATION_ADDPROFILE_CAMERAROLL_LOAD_PHOTO,
    REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
    REGISTRATION_ERROR,
} from './types'

import ImageUtils from '../Utils/ImageUtils'
import {
    handleUploadContacts,
    fetchMatchedContacts,
} from '../Utils/ContactUtils'

import LiveChatService from '../socketio/services/LiveChatService'
import MessageStorageService from '../services/chat/MessageStorageService'

import {
    setVideoFromCameraUri,
    setVideoUri,
    setVoiceUri,
    setVideoPreparing,
} from '../reducers/ProfileGoalSwipeReducer'
import { async } from 'validate.js'
import { log } from 'react-native-reanimated'

const DEBUG_KEY = '[ Action Registration ]'
export const registrationLogin = () => {
    return (dispatch) => {
        dispatch({
            type: REGISTRATION_LOGIN,
        })
        Actions.pop()
    }
}

export const registrationBack = () => {
    return (dispatch) => {
        dispatch({
            type: REGISTRATION_BACK,
        })
        Actions.pop()
    }
}

/* Account actions */
const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

// Note: this method is deprecated
export const registrationNextAddProfile = (value) => {
    // TODO: verify with server if email has already existed
    // If exist, prompt user to log in
    // If there are missing fields then show red error message
    const { name, email, password, phone } = value

    // TODO: phone might not exist

    // const data = validateEmail(email) ?
    // {
    //   name, email, password, phoneNumber
    // } :
    // {
    //   name, phone: email, password
    // };
    const data = { ...value }

    track(E.REG_PROFILE)

    // TODO: refactor network request as factory function
    return async (dispatch) => {
        dispatch({
            type: REGISTRATION_ACCOUNT_LOADING,
        })

        const message = await API.post('pub/user/', { ...data }, undefined)
            .then((res) => {
                if (res.message) {
                    return res.message
                }
                dispatch({
                    type: REGISTRATION_ADDPROFILE,
                })

                // AuthReducers record user token
                const payload = {
                    token: res.token,
                    userId: res.userId,
                    name,
                }
                dispatch({
                    type: REGISTRATION_ACCOUNT_SUCCESS,
                    payload,
                })
                Actions.replace('registration')

                // set up chat listeners
                LiveChatService.mountUser({
                    userId: res.userId,
                    authToken: res.token,
                })
                MessageStorageService.mountUser({
                    userId: res.userId,
                    authToken: res.token,
                })
                // Actions.reset('auth');
            })
            // TODO: error handling
            .catch((err) => console.log(err))

        // const url = 'https://goalmogul-api-dev.herokuapp.com/api/pub/user/';
        // const headers = {
        //   method: 'POST',
        //   headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     name,
        //     email,
        //     password
        //   })
        // };
        //
        // const message = await fetch(url, headers)
        //   .then((res) => res.json())
        //   .then((res) => {
        //     if (res.message) {
        //       return res.message;
        //     }
        //     dispatch({
        //       type: REGISTRATION_ADDPROFILE
        //     });
        //     // AuthReducers record user token
        //     const payload = {
        //       token: res.token,
        //       userId: res.userId
        //     };
        //     dispatch({
        //       type: REGISTRATION_ACCOUNT_SUCCESS,
        //       payload
        //     });
        //     Actions.registrationProfile();
        //   })
        //   // TODO: error handling
        //   .catch((err) => console.log(err));

        if (message) {
            dispatch({
                type: REGISTRATION_ERROR,
                payload: {
                    error: message,
                },
            })
            throw new SubmissionError({
                _error: message,
            })
        }
    }
}

export * from './AccountActions'

/* Profile Picture actions */

export const registrationNextIntro = (skip) => {
    const type = skip ? REGISTRATION_INTRO_SKIP : REGISTRATION_INTRO
    track(skip ? E.REG_INTRO_SKIP : E.REG_INTRO)
    return (dispatch, getState) => {
        if (skip) {
            dispatch({
                type,
            })
            return Actions.registrationIntro()
        }
        // Obtain pre-signed url
        const imageUri = getState().registration.profilePic
        const token = getState().user.token

        if (imageUri) {
            ImageUtils.getImageSize(imageUri)
                .then(({ width, height }) => {
                    // Resize image
                    console.log('width, height are: ', width, height)
                    return ImageUtils.resizeImage(imageUri, width, height)
                })
                .then((image) => {
                    // Upload image to S3 server
                    console.log('image to upload is: ', image)
                    return ImageUtils.getPresignedUrl(
                        image.uri,
                        token,
                        (objectKey) => {
                            dispatch({
                                type: REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS,
                                payload: objectKey,
                            })
                        }
                    )
                })
                .then(({ signedRequest, file }) => {
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
                    return getState().user.profile.imageObjectId
                })
                .then((image) => {
                    // Update profile imageId to the latest uploaded one
                    return API.put(
                        'secure/user/profile',
                        {
                            image,
                        },
                        token
                    )
                        .then((res) => {
                            console.log(
                                'update profile picture Id with res: ',
                                res
                            )
                        })
                        .catch((err) => {
                            console.log('error updating record: ', err)
                        })

                    // const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/profile';
                    // const headers = {
                    //   method: 'PUT',
                    //   headers: {
                    //     Accept: 'application/json',
                    //     'Content-Type': 'application/json'
                    //   },
                    //   body: JSON.stringify({
                    //     image,
                    //     token
                    //   })
                    // };
                    // return fetch(url, headers)
                    //   .then((res) => res.json())
                    //   .then((res) => {
                    //     console.log('update profile picture Id with res: ', res);
                    //   })
                    //   .catch((err) => {
                    //     console.log('error updating record: ', err);
                    //   });
                })
                .catch((err) => {
                    // TODO: error handling for different kinds of errors.
                    /*
          Error Type:
            image getSize
            image Resize
            image upload to S3
            update profile image Id
          */
                    console.log('profile picture error: ', err)
                })
        }
        Actions.registrationIntro()
    }
}

// Actions to Open Camera to take photos
export const openCamera = (
    callback,
    maybeTrackCameraOpen,
    maybeTrackImageSelected,
    mayBeVideoOpen,
    callback2,
    showModalV2,
    callback3,
    isCaptureVideo
) => async (dispatch, getState) => {
    let result

    const permissionGranted = await ImagePickerr.requestCameraPermissionsAsync()
    console.log(`${DEBUG_KEY}: permissionGranted is: ${permissionGranted}`)

    if (permissionGranted.status !== 'granted') {
        return Alert.alert('Please grant access to photos and camera.')
    }

    if (maybeTrackCameraOpen) {
        maybeTrackCameraOpen()
    }

    if (mayBeVideoOpen) {
        // ImagePicker.openCamera({
        //     mediaType: 'any',
        //     width: 848,
        //     height: 500,
        //     cropping: true,
        //     includeExif: true,
        //     // multiple: true,
        // }).then((vid) => {
        //     console.log('camera HYE HA', vid)
        //     if (vid !== undefined || vid === undefined)
        //         if (callback) {
        //             return callback(vid)
        //         }
        //     if (maybeTrackImageSelected) {
        //         maybeTrackImageSelected()
        //     }
        //     return dispatch({
        //         type: REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
        //         payload: vid.path,
        //     })
        // })

        const pickerOptions = {
            mediaTypes: isCaptureVideo
                ? ImagePickerr.MediaTypeOptions.Videos
                : ImagePickerr.MediaTypeOptions.Images,
            videoMaxDuration: 120,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.6,
            videoExportPreset: ImagePickerr.VideoExportPreset.LowQuality,
        }

        // if (
        //     Platform.OS === 'android' &&
        //     pickerOptions.mediaTypes === ImagePickerr.MediaTypeOptions.All
        // ) {
        //     //On android, we can't select both images and videos in the camera.
        //     Alert.alert(
        //         'Select Media',
        //         'Would you like to take a picture or record a video?',
        //         [
        //             {
        //                 text: 'Cancel',
        //             },
        //             {
        //                 text: 'Image',
        //                 onPress: () => {
        //                     pickerOptions.mediaTypes =
        //                         ImagePickerr.MediaTypeOptions.Images
        //                     setTimeout(async () => {
        //                         result = await ImagePickerr.launchCameraAsync(
        //                             pickerOptions
        //                         ).catch((error) =>
        //                             console.log('THIS IS ERROR OF IMAGE', error)
        //                         )
        //                     }, 500)
        //                 },
        //             },
        //             {
        //                 text: 'Video',
        //                 onPress: () => {
        //                     pickerOptions.mediaTypes =
        //                         ImagePickerr.MediaTypeOptions.Videos
        //                     setTimeout(async () => {
        //                         result = await ImagePickerr.launchCameraAsync(
        //                             pickerOptions
        //                         ).catch((error) =>
        //                             console.log('THIS IS ERROR OF IMAGE', error)
        //                         )
        //                     }, 500)
        //                 },
        //             },
        //         ]
        //     )
        // } else {
        result = await ImagePickerr.launchCameraAsync(
            pickerOptions
        ).catch((error) => console.log('THIS IS ERROR OF IMAGE', error))
        // }
    } else {
        // ImagePicker.openCamera({
        //     width: 848,
        //     height: 500,
        //     cropping: true,
        //     includeExif: true,
        //     // multiple: true,
        // }).then((img) => {
        //     console.log('IMAGE HYE HA', img)
        //     if (img !== undefined || img === undefined)
        //         if (callback) {
        //             return callback(img)
        //         }
        //     if (maybeTrackImageSelected) {
        //         maybeTrackImageSelected()
        //     }
        //     return dispatch({
        //         type: REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
        //         payload: img.path,
        //     })
        // })
        result = await ImagePickerr.launchCameraAsync({
            mediaTypes: 'Images',
        }).catch((error) => console.log('THIS IS ERROR OF IMAGE', error))
    }

    if (!result.cancelled || result.cancelled) {
        if (result.type === 'video') {
            const fileInfo = await FileSystem.getInfoAsync(result.uri)
            const videoInMB = fileInfo.size / 1024 / 1024
            const isOk = videoInMB < 150
            if (!isOk) {
                return callback2()
            }
            if (videoInMB > 16) {
                showModalV2()
                const compressResult = await Video.compress(
                    result.uri,
                    {
                        compressionMethod: 'auto',
                    },
                    (progress) => {
                        console.log(
                            'Compression Progress background: ',
                            progress
                        )
                        dispatch(setVideoPreparing(Math.round(progress * 100)))
                        if (progress > 0.97) {
                            callback3()
                            dispatch(setVideoPreparing(0))
                        }
                    }
                )
                let str = compressResult
                let newVideoUrl = str?.replace('file://', 'file:///')

                if (callback) {
                    return callback(
                        'video',
                        Platform.OS === 'ios' ? compressResult : newVideoUrl
                    )
                }
                if (maybeTrackImageSelected) {
                    maybeTrackImageSelected()
                }
                setTimeout(() => {
                    return dispatch({
                        type: REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
                        payload:
                            Platform.OS === 'ios'
                                ? compressResult
                                : newVideoUrl,
                    })
                }, 500)
            } else {
                if (callback) {
                    return callback('video', result.uri)
                }
                if (maybeTrackImageSelected) {
                    maybeTrackImageSelected()
                }
                return dispatch({
                    type: REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
                    payload: result.uri,
                })
            }
        } else {
            if (callback) {
                return callback('image', result)
            }
            if (maybeTrackImageSelected) {
                maybeTrackImageSelected()
            }
            return dispatch({
                type: REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
                payload: result.uri,
            })
        }
    }

    console.log('user took image fail with result: ', result)
}

// Action to open camera roll modal
export const openCameraRoll = (
    callback,
    maybeOptions,
    maybeTrackCamRollOpen,
    maybeTrackImageSelected,
    callback2,
    showModalV2,
    callback3
) => async (dispatch) => {
    const permissionGranted = await ImagePickerr.requestMediaLibraryPermissionsAsync()

    if (permissionGranted.status !== 'granted') {
        return Alert.alert('Please grant access to photos and camera.')
    }

    if (maybeTrackCamRollOpen) {
        maybeTrackCamRollOpen()
    }

    const disableEditing = maybeOptions && maybeOptions.disableEditing

    const videoResult = await ImagePickerr.launchImageLibraryAsync(
        disableEditing
            ? {
                  mediaTypes: 'All',
                  allowsEditing: true,
                  aspect: [4, 3],
                  videoMaxDuration: 180,
                  quality: 0.5,
                  //   videoExportPreset: ImagePickerr.VideoExportPreset.LowQuality,
              }
            : {
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 0.9,
                  exif: true,
              }
    )

    if (!videoResult.cancelled || videoResult.cancelled) {
        if (videoResult.type === 'video') {
            const fileInfo = await FileSystem.getInfoAsync(videoResult.uri)
            const videoInMB = fileInfo.size / 1024 / 1024
            const isOk = videoInMB < 150
            if (!isOk) {
                return callback2()
            }
            if (videoInMB > 16) {
                showModalV2()
                const result = await Video.compress(
                    videoResult.uri,
                    {
                        compressionMethod: 'auto',
                    },
                    (progress) => {
                        console.log(
                            'Compression Progress background: ',
                            progress
                        )
                        dispatch(setVideoPreparing(Math.round(progress * 100)))
                        if (progress > 0.97) {
                            callback3()
                        }
                    }
                )
                console.log('RESUKTTT', result)
                if (callback) {
                    let str = result
                    let newVideoUrl = str?.replace('file://', 'file:///')

                    return callback(
                        'video',
                        Platform.OS === 'ios' ? result : newVideoUrl
                    )
                }
                if (maybeTrackImageSelected) {
                    maybeTrackImageSelected()
                }
                setTimeout(() => {
                    return dispatch({
                        type: REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
                        payload: Platform.OS === 'ios' ? result : newVideoUrl,
                    })
                }, 500)
            } else {
                if (callback) {
                    return callback('video', videoResult.uri)
                }
                if (maybeTrackImageSelected) {
                    maybeTrackImageSelected()
                }
                return dispatch({
                    type: REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
                    payload: videoResult.uri,
                })
            }
        } else {
            if (callback) {
                return callback('image', videoResult)
            }
            if (maybeTrackImageSelected) {
                maybeTrackImageSelected()
            }
            return dispatch({
                type: REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
                payload: videoResult.uri,
            })
        }
    }
}

export const openCameraForVideo = (
    showModal,
    showModalV2,
    callback,
    callback2
) => async (dispatch) => {
    var result

    const permissionGranted = await ImagePickerr.requestCameraPermissionsAsync()
    console.log(`${DEBUG_KEY}: permissionGranted is: ${permissionGranted}`)

    if (permissionGranted.status !== 'granted') {
        return Alert.alert('Please grant access to photos and camera.')
    }

    try {
        const videoResult = await ImagePickerr.launchCameraAsync({
            mediaTypes: 'Videos',
            allowsEditing: true,
            aspect: [4, 3],
            videoMaxDuration: 180,
            quality: 1,
        })

        console.log('RESULTTT', videoResult)
        if (!videoResult.cancelled) {
            const fileInfo = await FileSystem.getInfoAsync(videoResult.uri)
            const videoInMB = fileInfo.size / 1024 / 1024
            const isOk = videoInMB < 150
            if (!isOk) {
                return callback2()
            }
            if (videoInMB > 16) {
                showModalV2()

                const result = await Video.compress(
                    videoResult.uri,
                    {
                        compressionMethod: 'auto',
                    },
                    (progress) => {
                        console.log(
                            'Compression Progress background: ',
                            progress
                        )
                        dispatch(setVideoPreparing(Math.round(progress * 100)))
                        if (progress > 0.97) {
                            callback()
                            dispatch(setVideoPreparing(Math.round(0)))
                        }
                    }
                )

                let str = result
                let newVideoUrl = str?.replace('file://', 'file:///')

                return (
                    dispatch(
                        setVideoUri(
                            Platform.OS === 'ios' ? result : newVideoUrl
                        )
                    ),
                    setTimeout(() => {
                        showModal()
                    }, 500)
                )
            } else {
                dispatch(setVideoUri(videoResult.uri)),
                    setTimeout(() => {
                        showModal()
                    }, 500)
            }
        }
    } catch (error) {
        console.log(
            'user choosing from camera roll fail with result: ',
            error.message
        )
    }
}

export const openCameraRollForVideo = (
    showModal,
    showModalV2,
    callback,
    callback2
) => async (dispatch) => {
    const permissionGranted = await ImagePickerr.requestMediaLibraryPermissionsAsync()

    if (permissionGranted.status !== 'granted') {
        return Alert.alert('Please grant access to photos and camera.')
    }

    try {
        const videoResult = await ImagePickerr.launchImageLibraryAsync({
            mediaTypes: 'Videos',
            allowsEditing: true,
            aspect: [4, 3],
            videoMaxDuration: 180,
            quality: 0.5,
        })

        if (!videoResult.cancelled) {
            const fileInfo = await FileSystem.getInfoAsync(videoResult.uri)
            const videoInMB = fileInfo.size / 1024 / 1024
            const isOk = videoInMB < 150
            if (!isOk) {
                return callback2()
            }
            if (videoInMB > 16) {
                showModalV2()
                try {
                    const result = await Video.compress(
                        videoResult.uri,
                        {
                            compressionMethod: 'auto',
                        },
                        (progress) => {
                            console.log(
                                'Compression Progress background: ',
                                progress
                            )
                            dispatch(
                                setVideoPreparing(Math.round(progress * 100))
                            )
                            if (progress > 0.97) {
                                callback()
                                setVideoPreparing(0)
                            }
                        }
                    )

                    let str = result
                    let newVideoUrl = str.replace('file://', 'file:///')

                    return (
                        dispatch(
                            setVideoUri(
                                Platform.OS === 'ios' ? result : newVideoUrl
                            )
                        ),
                        setTimeout(() => {
                            showModal()
                        }, 500)
                    )
                } catch (error) {
                    console.log('ERRRRR', error)
                }
            } else {
                console.log('videoResult', videoResult)
                dispatch(setVideoUri(videoResult.uri)),
                    setTimeout(() => {
                        showModal()
                    }, 500)
            }
        }
    } catch (error) {
        console.log(
            'user choosing from camera roll fail with result: ',
            error.message
        )
    }
}

export const getPhotosAsync = async () => {
    const permissionGranted = await ImagePickerr.requestMediaLibraryPermissionsAsync()

    if (permissionGranted.status !== 'granted') {
        return alert('Please grant access to photos and camera.')
    }

    return await CameraRoll.getPhotos({ first: 10 })
        .then((data) => {
            const assets = data.edges
            const photos = assets.map((asset) => asset.node.image)
            return photos
        })
        .catch((err) => {})
}

// TODO: deprecate this action
export const registrationCameraRollLoadPhoto = () => {
    return (dispatch) => {
        CameraRoll.getPhotos({
            first: 20,
            assetType: 'All',
        }).then((r) => {
            console.log('loading photos with r: ', r)
            dispatch({
                type: REGISTRATION_ADDPROFILE_CAMERAROLL_LOAD_PHOTO,
                payload: r.edges,
            })
        })
    }
}

// TODO: deprecate this action
export const registrationCameraRollOnImageChoosen = (uri) => {
    return (dispatch) => {
        Actions.pop()
        dispatch({
            type: REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
            payload: uri,
        })
    }
}

/* IntroForm actions */

export const registrationNextContact = (headline, skip) => {
    const type = skip ? REGISTRATION_CONTACT_SKIP : REGISTRATION_CONTACT
    track(skip ? E.REG_CONTACT_SKIP : E.REG_CONTACT)

    const error = {}
    if (headline === '' && !skip) {
        error.headline = true
        return {
            type: REGISTRATION_ERROR,
            payload: error,
        }
    }
    return (dispatch, getState) => {
        if (skip) {
            // User skip intro input
            dispatch({
                type,
            })
            return Actions.registrationContact()
        }
        const token = getState().user.token

        API.put('secure/user/account', { headline }, token)
            .then((res) => {
                dispatch({
                    type,
                    payload: headline,
                })
                Actions.registrationContact()
            })
            .catch((err) => {
                console.log('error is: ', err)
                error.headline = err.message
                return {
                    type: REGISTRATION_ERROR,
                    payload: error,
                }
            })

        // const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/account';
        // const headers = {
        //   method: 'PUT',
        //   headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     headline,
        //     token
        //   })
        // };
        // fetch(url, headers)
        //   .then((res) => res.json())
        //   .then((res) => {
        //     dispatch({
        //       type,
        //       payload: headline
        //     });
        //     Actions.registrationContact();
        //   })
        //   .catch((err) => {
        //     console.log('error is: ', err);
        //     error.headline = err.message;
        //     return ({
        //       type: REGISTRATION_ERROR,
        //       payload: error
        //     });
        //   });
    }
}

export const handleOnHeadlineChanged = (headline) => {
    return {
        type: REGISTRATION_INTRO_FORM_CHANGE,
        payload: headline,
    }
}

/* Contact actions */

export const registrationNextContactSync = ({ skip }) => {
    const type = skip
        ? REGISTRATION_CONTACT_SYNC_SKIP
        : REGISTRATION_CONTACT_SYNC
    // track(skip ? E.REG_CONTACT_SYNC_SKIP : E.REG_CONTACT_SYNC)

    if (skip) {
        return (dispatch, getState) => {
            const { userId } = getState().user
            const hasTutorialShown = Tutorial.getTutorialShown(userId)
            dispatch({
                type,
            })
            // Starting version 0.4.2, we replace this with step by step tutorial
            // if (!hasTutorialShown) {
            //   Actions.replace('tutorial');
            //   return;
            // }
            Actions.replace('drawer')
        }
    }

    // TODO: load contacts from iphone contacts and send to server

    return async (dispatch, getState) => {
        const permission = await Contacts.requestPermissionsAsync()
        if (permission.status !== 'granted') {
            // Permission was denied and dispatch an action
            return alert('Please give access of your Contacts')
        }
        const { token } = getState().user
        // Skip and limit for fetching matched contacts
        const { matchedContacts } = getState().registration

        // Show spinning bar
        dispatch({
            type,
            payload: {
                uploading: true,
            },
        })

        // Push UI to avoid delay
        Actions.registrationContactSync()

        handleUploadContacts(token)
            .then((res) => {
                console.log(' response is: ', res)
                // Uploading contacts done. Hide spinner
                dispatch({
                    type: REGISTRATION_CONTACT_SYNC_UPLOAD_DONE,
                    payload: {
                        uploading: false,
                    },
                })

                // Fetching matched records. Show spinner
                dispatch({
                    type: REGISTRATION_CONTACT_SYNC_FETCH,
                    payload: {
                        refreshing: true,
                        loading: false,
                    },
                })

                /* TODO: load matched contacts */
                return fetchMatchedContacts(token, 0, matchedContacts.limit)
            })
            .then((res) => {
                console.log('matched contacts are: ', res)
                if (res.data) {
                    // User finish fetching
                    dispatch({
                        type: REGISTRATION_CONTACT_SYNC_FETCH_DONE,
                        payload: {
                            data: res.data, // TODO: replaced with res
                            skip: res.data.length,
                            limit: matchedContacts.limit,
                            refreshing: true,
                        },
                    })
                    return
                }
                // TODO: error handling for fail to fetch contact cards
                // TODO: show toast for user to refresh

                console.warn(
                    `${DEBUG_KEY}: failed to fetch contact cards with res:`,
                    res
                )
                dispatch({
                    type: REGISTRATION_CONTACT_SYNC_FETCH_DONE,
                    payload: {
                        data: [], // TODO: replaced with res
                        skip: 0,
                        limit: matchedContacts.limit,
                        refreshing: true,
                    },
                })
            })
            .catch((err) => {
                console.warn('[ Action ContactSync Fail ]: ', err)
                console.log('error is:', err)
                // Error handling to clear both uploading and refreshing status
                dispatch({
                    type: REGISTRATION_CONTACT_SYNC_UPLOAD_DONE,
                    payload: {
                        uploading: false,
                    },
                })

                dispatch({
                    type: REGISTRATION_CONTACT_SYNC_FETCH_DONE,
                    payload: {
                        data: [], // TODO: replaced with res
                        skip: 0,
                        limit: matchedContacts.limit,
                        refreshing: true,
                    },
                })
                DropDownHolder.alert(
                    'error',
                    'Error',
                    "We're sorry that some error happened. Please try again later."
                )
            })
    }
}

// Load more matched contacts for contact sync
export const contactSyncLoadMore = () => (dispatch, getState) => {
    dispatch({
        type: REGISTRATION_CONTACT_SYNC_FETCH,
        payload: {
            loading: true,
            refreshing: false,
        },
    })

    const { token } = getState().user
    // Skip and limit for fetching matched contacts
    const {
        skip,
        limit,
        hasNextPage,
        loading,
        refreshing,
    } = getState().registration.matchedContacts

    if (refreshing || loading) return // Don't load more on refreshing already
    if (hasNextPage === undefined || hasNextPage) {
        fetchMatchedContacts(token, skip, limit)
            .then((res) => {
                if (res.data) {
                    dispatch({
                        type: REGISTRATION_CONTACT_SYNC_FETCH_DONE,
                        payload: {
                            data: res.data, // TODO: replaced with res
                            skip: skip + res.data.length,
                            limit,
                            hasNextPage: res.data.length !== 0,
                            loading: true,
                        },
                    })

                    return
                }

                // Error no data to return empty list
                dispatch({
                    type: REGISTRATION_CONTACT_SYNC_FETCH_DONE,
                    payload: {
                        data: [],
                        skip,
                        limit,
                        hasNextPage: false,
                        loading: true,
                    },
                })
            })
            .catch((err) => {
                console.warn('[ Action ContactSync Loadmore Fail ]: ', err)
                // Error no data to return empty list
                dispatch({
                    type: REGISTRATION_CONTACT_SYNC_FETCH_DONE,
                    payload: {
                        data: [],
                        skip,
                        limit,
                        hasNextPage: false,
                        loading: true,
                    },
                })
            })
    }
}

// Refresh contact sync cards
export const contactSyncRefresh = () => (dispatch, getState) => {
    // REGISTRATION_CONTACT_SYNC_REFRESH
    // REGISTRATION_CONTACT_SYNC_REFRESH_DONE
    dispatch({
        type: REGISTRATION_CONTACT_SYNC_REFRESH,
    })

    const { token } = getState().user
    // Skip and limit for fetching matched contacts
    const { limit, refreshing } = getState().registration.matchedContacts

    // Don't refresh if already refreshing
    if (refreshing) return

    fetchMatchedContacts(token, 0, limit)
        .then((res) => {
            console.log('[ Action ContactSync ]: Refresh with res: ', res)
            if (res.data) {
                dispatch({
                    type: REGISTRATION_CONTACT_SYNC_REFRESH_DONE,
                    payload: {
                        data: res.data, // TODO: replaced with res
                        skip: res.data.length,
                        hasNextPage: res.data.length !== 0,
                    },
                })
            }

            dispatch({
                type: REGISTRATION_CONTACT_SYNC_REFRESH_DONE,
                payload: {
                    data: [],
                    skip: 0,
                    hasNextPage: false,
                },
            })
        })
        .catch((err) => {
            console.warn('[ Action ContactSync Refresh Fail ]: ', err)
            dispatch({
                type: REGISTRATION_CONTACT_SYNC_REFRESH_DONE,
                payload: {
                    data: [],
                    skip: 0,
                    hasNextPage: false,
                },
            })
        })
}

/* Contact Sync actions */
export const registrationContactSyncDone = () => {
    // Passed in a list of contacts that user wants to add as friends

    return async (dispatch, getState) => {
        const { userId } = getState().user
        const hasTutorialShown = await Tutorial.getTutorialShown(userId)
        dispatch({
            type: REGISTRATION_CONTACT_SYNC_DONE,
        })

        // Starting version 0.4.2, we replace this with step by step tutorial
        // if (!hasTutorialShown) {
        //   Actions.replace('tutorial');
        //   return;
        // }
        // Actions.mainTabs();
        Actions.replace('drawer')
    }
}
