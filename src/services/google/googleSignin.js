/** @format */

import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { Platform } from 'react-native'

export const signinWithGoogle = async () => {
    if (Platform.OS === 'ios') {
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/userinfo.profile'],
        })
    } else {
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/userinfo.profile'],
            webClientId:
                '528421087287-19nu327o1822pl9rsvdvvb26cph97biq.apps.googleusercontent.com',
        })
    }
    const hasPlayService = await GoogleSignin.hasPlayServices()
    await GoogleSignin.signOut()
    if (!hasPlayService) {
        throw new Error('No google play service available')
    }
    const userInfo = await GoogleSignin.signIn()
    return userInfo.idToken
}

export const logOutWithGoogle = async () => {
    try {
        await GoogleSignin.signOut()
        // Remember to remove the user from your app's state as well
    } catch (error) {
        console.error('Error in google signout', error)
    }
}
