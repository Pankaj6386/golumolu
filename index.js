/** @format */

import 'react-native-gesture-handler'
import { registerRootComponent } from 'expo'
import messaging from '@react-native-firebase/messaging'
import App from './App'
import { Platform } from 'react-native'

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
// if (Platform.OS == 'ios') {
//     messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//         console.log('Message handled in the background!', remoteMessage)
//     })
//     messaging().onMessage(async (remoteMessage) => {
//         console.log('onMessage!', remoteMessage)
//     })

//     messaging().onNotificationOpenedApp(async (remoteMessage) => {
//         console.log('onNotificationOpenedApp', remoteMessage)
//     })
// }

registerRootComponent(App)
