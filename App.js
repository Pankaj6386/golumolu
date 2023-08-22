/** @format */

import React from 'react'

import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    Platform,
    AppState,
} from 'react-native'
import DropdownAlert from 'react-native-dropdownalert-jia'
import { enableScreens } from 'react-native-screens'

import 'react-native-reanimated'

import ReactMoE from 'react-native-moengage'

import moment from 'moment'
// State management
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'

// import { PersistGate } from 'redux-persist/lib/integration/react'

// Reducers
import { persistor, store } from './src/store'

// Components
import { DropDownHolder } from './src//Main/Common/Modal/DropDownModal'

// Router
import Router from './src/Router'

import SocketIOManager from './src/socketio/SocketIOManager'
import LiveChatService from './src/socketio/services/LiveChatService'
import MessageStorageService from './src/services/chat/MessageStorageService'
import { initSegment, EVENT as E } from './src/monitoring/segment'

import { initSentry } from './src/monitoring/sentry'
import SocketIO from './src/socketio/services/Socket'

import { setJSExceptionHandler } from 'react-native-exception-handler' // If an error occurs or app crashes these functions are called we used them to send sengments

// UI theme provider
import ThemeProvider from './theme/ThemeProvider'
import codePush from 'react-native-code-push'
import AutoUpdateScreen from './src/AutoUpdateScreen'

Text.defaultProps = Text.defaultProps || {}
Text.defaultProps.allowFontScaling = false

const DEBUG_KEY = '[APP ROOT]'
const MIN_BACKGROUND_DURATION_IN_MIN = 5

if (!__DEV__) {
    enableScreens()
}

if (!__DEV__) {
    console.log = () => {}
}

// Initialize Segment
initSegment()

// Initialize Sentry
if (!__DEV__) {
    initSentry()
}

setJSExceptionHandler((error, isFatal) => {
    console.log(`${DEBUG_KEY} Error while doing the action`, error)
    // if (isFatal) {
    //     trackWithProperties(E.ERROR_OCCURED, {
    //         error_name: error,
    //     })
    // }
}, true)

class App extends React.Component {
    constructor(props) {
        super(props)
        // this.handleOpenURL = this.handleOpenURL.bind(this)
        this.state = {
            appReady: false,
            image: null,
            data: null,
            lastBackgroundedTime: 0,
            appState: AppState.currentState,
            progress: '',
            syncMessage: '',
        }

        // must be initialized in this order as each depends on the previous
        SocketIOManager.initialize()
        LiveChatService.initialize()
        MessageStorageService.initialize()
        StatusBar.setBarStyle('light-content')
    }

    // _handleNotification = notification => {
    //     console.log(notification);
    //   };

    // _handleNotificationResponse = response => {
    //     console.log(response);
    // };

    async componentDidMount() {
        SocketIO.initialize()

        // codePush.sync()

        // let version = DeviceInfo.getVersion()
        // inAppUpdates
        //     .checkNeedsUpdate({ curVersion: version })
        //     .then((result) => {
        //         if (result.shouldUpdate) {
        //             let updateOptions = {}
        //             if (Platform.OS === 'android') {
        //                 // android only, on iOS the user will be promped to go to your app store page
        //                 updateOptions = {
        //                     updateType: IAUUpdateKind.FLEXIBLE,
        //                 }
        //             }
        //             setTimeout(() => {
        //                 inAppUpdates.startUpdate(updateOptions)
        //             }, 5000)
        //             // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
        //         }
        //     })

        AppState.addEventListener('change', this.handleAppStateChange)

        // Siren.promptUser(defaultOptions, versionSpecificRules)

        // Siren.performCheck().then(({ updateIsAvailable }) => {
        //     console.log('UPDATE AVAILABLEEE', updateIsAvailable)
        //     // if (updateIsAvailable) {
        //     //     showCustomUpdateModal()
        //     // }
        // })

        // initFireBase()
        // Notifications.addNotificationReceivedListener(this._handleNotification);
        // Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);
        // Linking.getInitialURL()
        //     .then((ev) => {
        //         if (ev) {
        //             console.log('SUPPORTED 5', ev)
        //             this.handleUrl(ev)
        //         }
        //     })
        //     .catch((err) => {
        //         console.warn('An error occurred', err)
        //     })
        // Linking.addEventListener('url', this.handleUrl)
        // Linking.getInitialURL()
        //     .then((url) => {
        //         if (url) {
        //             Linking.openURL(url)
        //         }
        //     })
        //     .catch((err) => console.error('An error occurred', err))
        // Linking.getInitialURL()
        //     .then((url) => {
        //         Alert.alert(JSON.stringify(url))
        //         if (url) {
        //             Linking.openURL(url)
        //         }
        //     })
        //     .catch((err) => console.error('An error occurred', err))
        ReactMoE.initialize()
    }

    // componentWillUnmount() {
    //     Linking.removeEventListener('url', this.handleUrl)
    // }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange)
    }

    codePushStatusDidChange(syncStatus) {
        switch (syncStatus) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                this.setState({ syncMessage: 'Checking for update.' })
                break
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                this.setState({ syncMessage: 'Downloading package.' })
                break
            case codePush.SyncStatus.AWAITING_USER_ACTION:
                this.setState({ syncMessage: 'Awaiting user action.' })
                break
            case codePush.SyncStatus.INSTALLING_UPDATE:
                this.setState({ syncMessage: 'Installing update.' })
                break
            case codePush.SyncStatus.UP_TO_DATE:
                this.setState({
                    syncMessage: 'App up to date.',
                    progress: false,
                })
                break
            case codePush.SyncStatus.UPDATE_IGNORED:
                this.setState({
                    syncMessage: 'Update cancelled by user.',
                    progress: false,
                })
                break
            case codePush.SyncStatus.UPDATE_INSTALLED:
                this.setState({
                    syncMessage:
                        'Update installed and will be applied on restart.',
                    progress: false,
                })
                break
            case codePush.SyncStatus.UNKNOWN_ERROR:
                console.log('Hey 6')

                this.setState({
                    syncMessage: 'An unknown error occurred.',
                    progress: false,
                })
                break
        }
    }

    codePushDownloadDidProgress(progress) {
        console.log('PROGRESSSS', progress)
        this.setState({ progress })
    }

    handleAppStateChange = async (nextAppState) => {
        const { appState, lastBackgroundedTime } = this.state

        // Try to run the CodePush sync whenever app comes to foreground
        if (
            appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            // Only run the sync if app has been in the background for a certain amount of time
            if (
                moment
                    .duration(moment().diff(lastBackgroundedTime))
                    .asMinutes() > MIN_BACKGROUND_DURATION_IN_MIN
            ) {
                // Please show the user some feedback while running this
                // This might take some time, especially if an update is available

                await codePush.sync(
                    {
                        installMode: codePush.InstallMode.IMMEDIATE,
                    },
                    this.codePushStatusDidChange.bind(this),
                    this.codePushDownloadDidProgress.bind(this)
                )
            }
        }

        if (nextAppState.match(/inactive|background/)) {
            this.setState({
                lastBackgroundedTime: moment(),
            })
        }

        if (appState !== nextAppState)
            this.setState({
                appState: nextAppState,
            })
    }

    onMessageReceived = async (message) => {
        console.log('A FCM MESSAGE WAS RECIEVED', message)
        if (Platform.OS === 'android') {
            ReactMoE.passFcmPushPayload(message.data)
        }
    }

    // componentWillUnmount() {
    //     Linking.removeEventListener('url', this.handleOpenURL)
    // }

    // handleOpenURL(event) {
    //     Alert.alert(JSON.stringify(event))
    //     if (event === null) {
    //         return
    //     }
    //     if (event.includes('chat')) {
    //         Alert.alert(JSON.stringify(event))
    //         Actions.replace('questions')
    //     }
    // }

    render() {
        // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        //     console.log('Message handled in the background!', remoteMessage)
        // })

        ReactMoE.setEventListener('pushClicked', (notificationPayload) => {
            console.log('pushClicked', notificationPayload)
        })
        console.disableYellowBox = true
        enableScreens(false)
        // if (Platform.OS === 'android') {
        //     // messaging().onMessage(this.onMessageReceived)
        //     // messaging().setBackgroundMessageHandler(this.onMessageReceived)
        // }
        return (
            <ReduxProvider store={store}>
                <ThemeProvider>
                    <PersistGate persistor={persistor}>
                        <View style={styles.container}>
                            {this.state.syncMessage ===
                            'Downloading package.' ? (
                                <AutoUpdateScreen />
                            ) : (
                                <Router />
                            )}
                            {/* <FingerPrint /> */}
                        </View>
                        <DropdownAlert
                            ref={(ref) => DropDownHolder.setDropDown(ref)}
                            closeInterval={7500}
                            containerStyle={styles.toastCustomContainerStyle}
                        />
                    </PersistGate>
                </ThemeProvider>
            </ReduxProvider>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toastCustomContainerStyle: {
        backgroundColor: '#2B73B6',
    },
    // cancel button is currently not used
    cancelBtnImageStyle: {
        padding: 6,
        width: 30,
        height: 30,
        alignSelf: 'center',
    },
})
const codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL }
export default codePush(codePushOptions)(App)
