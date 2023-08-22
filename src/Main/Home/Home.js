/** @format */
import React, { Component } from 'react'
import {
    View,
    AppState,
    FlatList,
    Image,
    TouchableOpacity,
    Platform,
    StatusBar,
    RefreshControl,
    Linking,
} from 'react-native'
import { connect } from 'react-redux'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'
import * as Notifications from 'expo-notifications'
import { copilot } from 'react-native-copilot-gm'
import messaging from '@react-native-firebase/messaging'
import PushNotificationIOS from '@react-native-community/push-notification-ios'

/* Components */
import SearchBarHeader from '../Common/Header/SearchBarHeader'
import {
    openCamera,
    openCameraRoll,
    openProfile,
    showInviterPopup,
    uploadPopupData,
} from '../../actions'
import Mastermind from './Mastermind'
import ActivityFeed from './ActivityFeed'
import CreatePostModal from '../Post/CreatePostModal'
import CreateContentButtons from '../Common/Button/CreateContentButtons'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'
import { track, EVENT as E } from '../../monitoring/segment'
import { getToastsData } from '../../actions/ToastActions'
import BottomButtonsSheet from '../Common/Modal/BottomButtonsSheet'
//video stroyline
import { getAppstoreAppMetadata } from 'react-native-appstore-version-checker'
import AwesomeAlert from 'react-native-awesome-alerts'

// Actions
import {
    homeSwitchTab,
    fetchAppUserProfile,
    fetchProfile,
    checkIfNewlyCreated,
    getUserVisitedNumber,
    refreshProfileData,
} from '../../actions'
import { lastActive } from '../../actions/HomeActions'

import {
    openCreateOverlay,
    refreshGoalFeed,
    closeCreateOverlay,
} from '../../redux/modules/home/mastermind/actions'
import Popup from '../Journey/Popup'

import { refreshActivityFeed } from '../../redux/modules/home/feed/actions'

import {
    saveUnreadNotification,
    handlePushNotification,
} from '../../redux/modules/notification/NotificationActions'
import DeviceInfo from 'react-native-device-info'
import { getGomoPlannerRoomRef } from '../../redux/modules/chat/ChatActions'

import {
    showNextTutorialPage,
    startTutorial,
    saveTutorialState,
    updateNextStepNumber,
    pauseTutorial,
    markUserAsOnboarded,
    resetTutorial,
} from '../../redux/modules/User/TutorialActions'
import { saveRemoteMatches } from '../../actions/MeetActions'

// Styles
import { color } from '../../styles/basic'
import video_icon from '../../asset/icons/video_icon.png'
import { getButtonBottomSheetHeight } from '../../styles'
import moment from 'moment'

// Utils
import { CreateGoalTooltip } from '../Tutorial/Tooltip'
import {
    fetchUnreadCount,
    refreshNotificationTab,
} from '../../redux/modules/notification/NotificationTabActions'
import { trackWithProperties } from 'expo-analytics-segment'
import { getAllNudges } from '../../actions/NudgeActions'
import ReactMoE from 'react-native-moengage'
import { TEXT_COLOR } from '../../styles/basic/color'
import Socket from '../../socketio/services/Socket'
import { setVideoTranscoding } from '../../reducers/ProfileGoalSwipeReducer'

const MIN_BACKGROUND_DURATION_IN_MIN = 10

let pageAb

class Home extends Component {
    constructor(props) {
        super(props)
        this.reminderNotificationGoalRef = null
        this.state = {
            navigationState: {
                index: 0,
                routes: [
                    { key: 'activity', title: 'All Posts' },
                    { key: 'goals', title: 'Just Goals' },
                ],
            },
            appState: AppState.currentState,
            showWelcomeScreen: false,
            showBadgeEarnModal: false,
            shouldRenderBadgeModal: false,
            pickedImage: null,
            shareModal: false,
            isVisible: false,
            isVisibleA: this.props.lateGoal.show,
            isVisibleB: false,
            showOnboadingPopUp: null,
            shouldShowOnboadingPopUp: false,
            showUpdateAlert: false,
            lastBackgroundedTime: 0,
            isSocketEventTranscoding: false,
            isSocketEventUploading: false,
            invitedUser: '',
        }
        this.scrollToTop = this.scrollToTop.bind(this)
        this._renderScene = this._renderScene.bind(this)
        this.setTimer = this.setTimer.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this._handleNotification = this._handleNotification.bind(this)
        this._notificationSubscription = undefined
        this.setMastermindRef = this.setMastermindRef.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(prevProps.lateGoal, this.props.lateGoal)) {
            this.setState({ isVisibleA: this.props.lateGoal.show })
        }

        if (
            !_.isEqual(
                prevProps.handleDueDateNotification,
                this.props.handleDueDateNotification
            )
        ) {
            if (this.props.handleDueDateNotification) {
                this.reminderNotificationGoalRef?.open()
            }
        }
        if (
            !_.isEqual(prevProps.user, this.props.user) &&
            !prevProps.user &&
            !this.props.user.isOnBoarded
        ) {
            // console.log(
            //     `${DEBUG_KEY}: [ componentDidUpdate ]: prev user: `,
            //     prevProps.user
            // )
            setTimeout(() => {
                // console.log('[Home UI] [componentDidUpdate] start tutorial')
                this.props.start()
            }, 200)
        }

        if (
            !_.isEqual(prevProps.user, this.props.user) &&
            !this.props.user.isOnBoarded
        ) {
            // Tutorial will be started by on welcome screen closed
            this.setState({
                showWelcomeScreen: true,
            })
            return
        }

        if (
            !this.state.showBadgeEarnModal &&
            !_.get(
                this.props.user,
                'profile.badges.milestoneBadge.currentMilestone',
                0
            ) > 0 &&
            !_.get(
                this.props.user,
                'profile.badges.milestoneBadge.isAwardAlertShown',
                true
            )
        ) {
            // Showing modal to congrats user earning a new badge
            this.setState({
                showBadgeEarnModal: true,
            })
            return
        }
    }

    _handleNotification(notification) {
        if (notification._category) {
            let notificationData = {}
            notificationData.data = {
                path: notification._category,
                notificationId: notification._notificationId,
            }
            this.props.handlePushNotification(notificationData)
        } else {
            this.props.handlePushNotification(notification)
        }
    }

    async componentDidMount() {
        const socket = Socket.getSocket()
        socket.on(
            'Comment Video Transcoding' ||
                'Chat Video Transcoding' ||
                'Feed Video Transcoding',
            async () => {
                this.setState({ isSocketEventTranscoding: true })
            }
        )
        socket.on(
            'Comment Video Uploading' ||
                'Chat Video Uploading' ||
                'Feed Video Uploading',
            async () => {
                this.setState({ isSocketEventUploading: true })
            }
        )

        if (
            !this.state.isSocketEventTranscoding &&
            !this.state.isSocketEventUploading
        ) {
            this.props.setVideoTranscoding()
        }
        let version = DeviceInfo.getVersion()
        if (Platform.OS === 'ios') {
            getAppstoreAppMetadata('1441503669') //put any apps id here
                .then((appVersion) => {
                    if (appVersion.version > version) {
                        setTimeout(() => {
                            this.setState({ showUpdateAlert: true })
                        }, 3000)
                    }
                })
                .catch((err) => {
                    // console.log('error occurred', err)
                })
        }

        this.setState({ isVisibleA: this.props.lateGoal.show })
        const pageId = this.props.refreshProfileData(this.props.userId)

        pageAb = pageId

        setTimeout(() => {
            this.handleEarnBadgeModal()
        }, 2000)

        this.props.getGomoPlannerRoomRef()
        this.props.refreshNotificationTab()
        setTimeout(() => {
            if (Platform.OS === 'ios') {
                // console.log('REGISTER FOR IOS MOENGAGE')
                ReactMoE.registerForPush()
            }
        }, 500)

        setTimeout(() => {
            this.handlePopup()
        }, 500)

        this.props.refreshActivityFeed()
        AppState.addEventListener('change', this.handleAppStateChange)
        this._notificationSubscription = Notifications.addNotificationReceivedListener(
            this._handleNotification
        )

        // Set timer to fetch profile again if previously failed
        this.setTimer()

        this.props.getUserVisitedNumber()

        const { user } = this.props
        if (user && !user.isOnBoarded) {
            setTimeout(() => {
                // console.log('[Home UI] [componentDidMount] start tutorial')
                this.props.start()
            }, 300)
        }

        this.props.copilotEvents.on('stop', () => {
            // console.log(
            //     `${DEBUG_KEY}: [ componentDidMount ]: [ copilotEvents ] tutorial stop. show next page. Next step number is: `,
            //     this.props.nextStepNumber
            // )

            if (this.props.nextStepNumber === 1) {
                Actions.createGoalModal({ isFirstTimeCreateGoal: true })
                this.props.pauseTutorial('create_goal', 'home', 1)
                setTimeout(() => {
                    this.props.showNextTutorialPage('create_goal', 'home')
                }, 400)
                return
            }
        })

        this.props.copilotEvents.on('stepChange', (step) => {
            const { order, name } = step
            // console.log(
            //     `${DEBUG_KEY}: [ onStepChange ]: step order: ${order}, step visible: ${name}, current next step is: ${this.props.nextStepNumber}`
            // )

            // TODO: if later we have more steps in between, change here
            // This is called before changing to a new step
            this.props.updateNextStepNumber('create_goal', 'home', order + 1)
        })
        try {
            await messaging().registerDeviceForRemoteMessages()

            if (Platform.OS === 'ios') {
                let res = await PushNotificationIOS.getInitialNotification()
                if (res) {
                    this._handleNotification(res)
                    res = undefined
                }

                PushNotificationIOS.addEventListener(
                    'registrationError',
                    (registrationError) => {
                        // console.log(
                        //     registrationError,
                        //     '-- *********************'
                        // )
                    }
                )

                PushNotificationIOS.addEventListener(
                    'notification',
                    this._handleNotification
                )

                messaging().getIsHeadless().then(this._handleNotification)
            }

            // messaging().onMessage(this._handleNotification)
            messaging().setBackgroundMessageHandler(this._handleNotification)

            messaging().getInitialNotification().then(this._handleNotification)

            messaging().onNotificationOpenedApp(this._handleNotification)

            // Check whether an initial notification is available
        } catch (error) {
            // console.log('PUSH NOTIFICATION HANDLER ERROR---->', error)
        }
    }

    componentWillUnmount() {
        // console.log(`${DEBUG_KEY}: [ componentWillUnmount ]`)

        // Remove tutorial listener
        this.props.copilotEvents.off('stop')
        this.props.copilotEvents.off('stepChange')

        AppState.removeEventListener('change', this.handleAppStateChange)
        // this._notificationSubscription.remove()
        // Remove timer in case app crash
        this.stopTimer()
    }

    setMastermindRef(mastermindRef) {
        this.mastermindRef = mastermindRef
    }

    setTimer() {
        this.stopTimer() // Clear the previous timer if there is one

        // console.log(
        //     `${DEBUG_KEY}: [ Setting New Timer ] for fetching profile after 1s`
        // )
        this.timer = setTimeout(() => {
            // console.log(
            //     `${DEBUG_KEY}: [ Timer firing ] fetching profile again.`
            // )
            this.props.fetchProfile(this.props.userId)
        }, 1000)
    }

    stopTimer() {
        if (this.timer !== undefined) {
            // console.log(
            //     `${DEBUG_KEY}: [ Timer clearing ] for fetching profile 5s after mounted`
            // )
            clearInterval(this.timer)
        }
    }

    scrollToTop = () => {
        if (this.flatList)
            this.flatList.scrollToIndex({
                animated: true,
                index: 0,
                viewOffset: this.topTabBarHeight || 80,
            })
    }

    // pickImage = async () => {
    //     if (Platform.OS !== 'web') {
    //         const {
    //             status,
    //         } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    //         if (status !== 'granted') {
    //             return alert(
    //                 'Sorry, we need camera roll permissions to make this work!'
    //             )
    //         } else {
    //             let result = await ImagePicker.launchImageLibraryAsync({
    //                 mediaTypes: ImagePicker.MediaTypeOptions.All,
    //                 allowsEditing: true,
    //                 aspect: [4, 3],
    //                 quality: 0.3,
    //             })

    //             console.log(result)

    //             if (!result.cancelled) {
    //                 this.setState({ pickedImage: result })
    //             }
    //         }
    //     }
    // }

    handleAppStateChange = async (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            // console.log(
            //     `${DEBUG_KEY}: [handleAppStateChange] App has become active!`
            // )

            trackWithProperties(E.APP_ACTIVE, {
                source: 'direct',
            })

            if (
                moment
                    .duration(moment().diff(this.state.lastBackgroundedTime))
                    .asMinutes() > MIN_BACKGROUND_DURATION_IN_MIN
            ) {
                // Please show the user some feedback while running this
                // This might take some time, especially if an update is available

                this.props.refreshActivityFeed()
            }

            const {
                needRefreshActivity,
                needRefreshMastermind,
                user,
            } = this.props
            if (user === undefined || _.isEmpty(user) || !user.profile) {
                this.props.fetchAppUserProfile({ navigate: false })
            }

            if (needRefreshMastermind) {
                this.props.refreshGoalFeed()
            }

            if (needRefreshActivity) {
                this.props.refreshActivityFeed()
            }
        }

        if (this.state.appState === 'active' && nextAppState !== 'active') {
            // console.log(
            //     `${DEBUG_KEY}: [handleAppStateChange] App has become inactive!`
            // )
            // track(E.APP_INACTIVE)
            await this.props.saveUnreadNotification()
            await this.props.saveTutorialState()
        }

        if (nextAppState.match(/inactive|background/)) {
            this.setState({
                lastBackgroundedTime: moment(),
            })
        }
        this.setState({
            appState: nextAppState,
        })
    }

    _handleIndexChange = (index) => {
        this.setState({
            navigationState: {
                ...this.state.navigationState,
                index,
            },
        })
        this.props.homeSwitchTab(index)
    }

    _renderHeader = (props) => {
        return (
            <View
                onLayout={(e) =>
                    (this.topTabBarHeight = e.nativeEvent.layout.height)
                }
            >
                <CreateContentButtons
                    onCreateUpdatePress={
                        () =>
                            this.createPostModal && this.createPostModal.open()
                        // this.setState({ shareModal: true })
                    }
                    onCreateGoalPress={
                        () =>
                            Actions.push('createGoalModal', {
                                pageId: pageAb,
                            })
                        // this.sheetref.current.snapTo(1)
                    }
                />
                {/* Hid switching tabs to clean up the main view to just friend's Goals and Updates */}
                {/* <View style={styles.tabContainer}>
                    <TabButtonGroup buttons={props} />
                </View> */}
            </View>
        )
    }

    handleOnRefresh = () => {
        const { routes, index } = this.state.navigationState
        const { token } = this.props
        routes[index].key === 'activity'
            ? this.props.refreshActivityFeed()
            : this.props.refreshGoalFeed()
        this.props.getAllNudges(token)
    }

    _renderScene() {
        const { routes, index } = this.state.navigationState

        switch (routes[index].key) {
            case 'goals':
                return (
                    <Mastermind
                        tutorialText={this.props.tutorialText[0]}
                        nextStepNumber={this.props.nextStepNumber}
                        order={0}
                        name="create_goal_home_0"
                        setMastermindRef={this.setMastermindRef}
                    />
                )
            case 'activity':
                return <ActivityFeed />
            default:
                return null
        }
    }

    _storyLineHeader = (props) => {
        const options = [
            {
                text: 'Open Gallery',
                onPress: this.handleOpenCameraRoll,
            },
            {
                text: 'Open Camera',
                onPress: this.handleOpenCamera,
            },
        ]
        return (
            <>
                <TouchableOpacity onPress={this.handleImageIconOnClick}>
                    <View
                        style={{
                            width: 70,
                            height: 70,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: color.GM_LIGHT_GRAY,
                            borderRadius: 35,
                            marginTop: 5,
                        }}
                    >
                        <Image
                            source={video_icon}
                            resizeMode="contain"
                            style={{
                                height: 20,
                                width: 20,
                            }}
                        />
                    </View>
                </TouchableOpacity>
                <BottomButtonsSheet
                    ref={(r) => (this.bottomSheetRef = r)}
                    buttons={options}
                    height={getButtonBottomSheetHeight(options.length)}
                />
            </>
        )
    }
    handleImageIconOnClick = () => {
        this.bottomSheetRef && this.bottomSheetRef.open()
    }

    handleEarnBadgeModal = () => {
        this.setState({ shouldRenderBadgeModal: true })
    }

    handleOpenCameraRoll = () => {
        this.bottomSheetRef.close()
        setTimeout(() => {
            this.props.openCameraRoll((result) => console.log(result), {
                disableEditing: true,
            })
        }, 500)
    }

    handleOpenCamera = () => {
        this.bottomSheetRef.close()

        setTimeout(() => {
            this.props.openCamera(
                (result) => console.log(result),
                null,
                null,
                true
            )
        }, 500)
    }

    hideAlert = () => {
        this.setState({
            showUpdateAlert: false,
        })
    }

    render() {
        const { user, refreshing, notificationExtraData } = this.props

        // NOTE: this has to compare with true otherwise it might be undefine
        const showRefreshing = refreshing === true && user.isOnBoarded === true
        const tutorialOn =
            this.props.nextStepNumber >= 2
                ? {
                      rightIcon: {
                          iconType: 'menu',
                          tutorialText: this.props.tutorialText[1],
                          order: 1,
                          name: 'create_goal_home_menu',
                      },
                  }
                : undefined

        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <StatusBar
                    animated={true}
                    backgroundColor={color.GM_BLUE}
                    // barStyle={statusBarStyle}
                    // showHideTransition={statusBarTransition}
                />
                <CreatePostModal
                    onRef={(r) => (this.reminderNotificationGoalRef = r)}
                    initializeFromGoal
                    initialPost={{
                        belongsToGoalStoryline: {
                            goalRef: notificationExtraData?.goalRef,
                            title: notificationExtraData?.title,
                            owner: notificationExtraData?.owner,
                            category: notificationExtraData?.category,
                            priority: isNaN(
                                Number(notificationExtraData?.priority)
                            )
                                ? 0
                                : Number(notificationExtraData?.priority),
                        },
                        privacy: notificationExtraData?.privacy,
                    }}
                />
                <CreatePostModal
                    attachGoalRequired
                    // onModal={() => this.setState({ shareModal: true })}
                    onRef={(r) => (this.createPostModal = r)}
                />
                {/* <GOAL_ENDDATE_2_WEEKS
                    isVisible={this.state.isVisible}
                    closeModal={() => this.setState({ isVisible: false })}
                />
                <GOAL_UPDATE_POPUP_A
                    pageId={this.props.pageId}
                    isVisible={this.state.isVisibleA}
                    closeModal={() => this.setState({ isVisibleA: false })}
                    data={this.props.lateGoal}
                    makeVisibleB={() => this.setState({ isVisibleB: true })}
                />
                <GOAL_UPDATE_POPUP_B
                    data={this.props.lateGoal}
                    pageId={this.props.pageId}
                    isVisible={this.state.isVisibleB}
                    closeModal={() => this.setState({ isVisibleB: false })}
                /> */}
                <View style={styles.homeContainerStyle}>
                    <SearchBarHeader rightIcon="menu" tutorialOn={tutorialOn} />

                    {/* <View
                        style={{
                            width: '100%',
                            height: 150,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            paddingVertical: 2,
                            marginBottom: 10,
                            paddingLeft: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: TEXT_FONT_SIZE.FONT_1,
                                fontFamily: FONT_FAMILY.SEMI_BOLD,
                                marginBottom: 12,
                            }}
                        >
                            Trending Stories
                        </Text>
                        <FlatList
                            keyExtractor={(index) => index.toString()}
                            horizontal={true}
                            ListHeaderComponent={this._storyLineHeader}
                            data={stories}
                            renderItem={({ item }) => {
                                return (
                                    <VideoStoryLineCircle
                                        image={item.story[0].uri}
                                        profileImage={item.profileImage}
                                        name={item.name}
                                        arrayStory={item.story}
                                        stories={stories}
                                    />
                                )
                            }}
                        />
                    </View> */}
                    {/* <BottomSheet
                        ref={this.sheetref}
                        snapPoints={[0, 300, '85%']}
                        renderContent={this.renderContent}
                    /> */}

                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        keyboardShouldPersistTaps="handled"
                        refreshControl={
                            <RefreshControl
                                refreshing={showRefreshing}
                                onRefresh={this.handleOnRefresh}
                                tintColor={TEXT_COLOR.PLACEHOLDER_COLOR}
                                size="large"
                            />
                        }
                        ref={(ref) => (this.flatList = ref)}
                        ListHeaderComponent={this._renderHeader({
                            jumpToIndex: this._handleIndexChange,
                            navigationState: this.state.navigationState,
                        })}
                        data={[{}]}
                        renderItem={this._renderScene}
                        // refreshing={}
                        // onRefresh={this.handleOnRefresh}
                    />

                    <AwesomeAlert
                        show={this.state.showUpdateAlert}
                        animatedValue={0.05}
                        useNativeDriver={true}
                        title="Update Availble!"
                        titleStyle={{
                            fontWeight: 'bold',
                            fontSize: 20,
                        }}
                        contentContainerStyle={{
                            height: 160,
                            width: '80%',
                        }}
                        messageStyle={{
                            fontSize: 15,
                            fontWeight: '500',
                        }}
                        message={
                            'Update your application to get latest features of application.'
                        }
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showCancelButton={true}
                        showConfirmButton={true}
                        confirmText="UPDATE"
                        confirmButtonColor={color.GM_BLUE}
                        onCancelPressed={() => {
                            this.hideAlert()
                        }}
                        onConfirmPressed={() => {
                            this.hideAlert()
                            setTimeout(() => {
                                Linking.openURL(
                                    'https://apps.apple.com/us/app/goalmogul/id1441503669'
                                )
                            }, 500)
                        }}
                        confirmButtonStyle={{
                            width: 100,
                        }}
                        confirmButtonTextStyle={{
                            textAlign: 'center',
                        }}
                    />
                    {/* <OnboardingToast
                        isVisible={this.state.showOnboadingPopUp}
                        onPressOk={async () => {
                            this.setState({ showOnboadingPopUp: false })

                            // await SecureStore.setItemAsync(
                            //     `${this.props.user._id}_${NEWLY_CREATED_KEY}`,
                            //     'false',
                            //     {}
                            // )
                            // await AsyncStorage.setItem(
                            //     `${this.props.user._id}_${NEWLY_CREATED_KEY}`,
                            //     'false'
                            // )

                            setTimeout(() => {
                                Linking.openURL(this.state.appInfo.url)
                            }, 500)
                        }}
                        onPressNotNow={() => {
                            this.setState({ showOnboadingPopUp: false })
                        }}
                    /> */}

                    {/* {this.state.shouldRenderBadgeModal ? (
                        <EarnBadgeModal
                            isVisible={this.state.showBadgeEarnModal}
                            closeModal={() => {
                                this.setState({
                                    showBadgeEarnModal: false,
                                })
                            }}
                            user={this.props.user}
                        />
                    ) : null} */}
                </View>
            </MenuProvider>
        )
    }
}

const mapStateToProps = (state) => {
    // console.log("STATE",state);
    const popup = state?.popup
    const token = state?.auth?.user?.token
    const { profile } = state?.user?.user
    const { myGoals } = state?.goals
    const { userId } = state?.user
    const refreshing = state?.home?.activityfeed?.refreshing
    const {
        notificationExtraData,
        handleDueDateNotification,
    } = state?.reminderForm
    const lateGoal = state?.profile?.lateGoal

    // || state.home.mastermind.refreshing
    const needRefreshMastermind = _.isEmpty(state.home.mastermind.data)
    const needRefreshActivity = _.isEmpty(state.home.activityfeed.data)
    const { user } = state.user
    const onBoardingPopupdata = state.onBoardingPopup

    // console.log('onBoardingPopupdata', onBoardingPopupdata)
    const userVisiter = state.usersVisited

    // Tutorial related
    const { create_goal } = state.tutorials
    const { home } = create_goal
    const { hasShown, showTutorial, tutorialText, nextStepNumber } = home

    return {
        refreshing,
        token,
        profile,
        user,
        needRefreshActivity,
        needRefreshMastermind,
        userId,
        myGoals,
        // Tutorial related
        hasShown,
        showTutorial,
        tutorialText,
        nextStepNumber,
        popup,
        lateGoal,
        onBoardingPopupdata,
        userVisiter,
        handleDueDateNotification,
        notificationExtraData,
    }
}

const styles = {
    homeContainerStyle: {
        backgroundColor: color.GM_BACKGROUND,
        flex: 1,
    },
    tabContainer: {
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: color.GM_CARD_BACKGROUND,
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
}

const AnalyticsWrapped = wrapAnalytics(Home, SCREENS.HOME)

const HomeExplained = copilot({
    overlay: 'svg', // or 'view'
    animated: true, // or false
    stepNumberComponent: () => <View />,
    tooltipComponent: CreateGoalTooltip,
    verticalOffset: Platform.OS === 'android' ? 25 : 0,
    // svgMaskPath: svgMaskPath,
})(AnalyticsWrapped)

export default connect(
    mapStateToProps,
    {
        openCamera,
        openCameraRoll,
        fetchAppUserProfile,
        homeSwitchTab,
        openProfile,
        openCreateOverlay,
        showInviterPopup,
        /* Notification related */
        saveUnreadNotification,
        handlePushNotification,
        fetchUnreadCount,
        refreshNotificationTab,

        /* Feed chat room */
        getGomoPlannerRoomRef,

        /* Feed related */
        refreshGoalFeed,
        refreshActivityFeed,
        fetchProfile,
        // fetchGoalPopup27Day,
        checkIfNewlyCreated,
        closeCreateOverlay,
        refreshProfileData,
        /* Tutorial related */
        showNextTutorialPage,
        startTutorial,
        saveTutorialState,
        updateNextStepNumber,
        pauseTutorial,
        markUserAsOnboarded,
        resetTutorial,
        /* Contact sync related */
        saveRemoteMatches,
        getUserVisitedNumber,

        getToastsData,
        getAllNudges,
        uploadPopupData,
        lastActive,
        setVideoTranscoding,
    },
    null,
    { withRef: true }
)(HomeExplained)
