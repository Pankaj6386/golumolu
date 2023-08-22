/** @format */

import { firebase } from '@react-native-firebase/messaging'

// Firebase setup for google analytics
// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyDT4bc8uUI5TCIqXbAh1S0SC_nIYMUGgus',
    authDomain: 'goalmogul-ios.firebaseapp.com',
    databaseURL: 'https://goalmogul-app.firebaseio.com',
    projectId: 'goalmogul-app',
    storageBucket: 'goalmogul-app.appspot.com',
    messagingSenderId: '528421087287',
    appId: '1:528421087287:ios:96331a69610ec7ab5eb7b2',
    measurementId: 'G-BZ5HMXJQ9K',
}

export const initFireBase = async () => {
    // if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
    // }
    // firebase.analytics()
    // firebase.analytics().logEvent('App Started')
}
