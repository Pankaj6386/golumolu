/** @format */

import React from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from '@ui-kitten/components'

/* Actions */
import { updateChatCount } from '../../redux/modules/navigation/TabIconActions'
import { fetchUnreadCount } from '../../redux/modules/notification/NotificationTabActions'

/* Utils */
import { color as COLOR } from '../../styles/basic'
import LottieView from 'lottie-react-native'
import NOTIFICATION_LOTTIE from '../../asset/toast_popup_lotties/notification_icon/Notification.json'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

import TRIBES from '../../asset/icons/tribes.png'

const CHAT_COUNT_UPDATE_INTERVAL = 1000
const NOTIFICATION_COUNT_UPDATE_INTERVAL = 10000
// const DEBUG_KEY = '[ UI TabIcon ]'
// const TUTORIAL_KEY = 'meet_tab_icon'

class TabIcon extends React.PureComponent {
    componentDidUpdate(prevProps) {
        // Tutorial logics
        // componentDidUpdate receive this new props {@showTutorial} for tutorial reducers
        // And it’s navigation.state.key is meet tab, then start tutorial on this guy
        const { token } = prevProps
        if (
            token !== undefined &&
            token.trim().length &&
            (!this.props.token || !this.props.token.length)
        ) {
            this.clearRefreshChatInterval()
            this.clearRefreshNotificationInterval()
        }

        if (
            (!token || !token.trim().length) &&
            this.props.token &&
            this.props.token.length
        ) {
            this.createRefreshChatInterval()
            this.createRefreshNotificationInterval()
        }
    }

    componentDidMount() {
        const { navigation } = this.props
        if (navigation.state.key == 'chatTab') {
            // chat count updater
            this.props.updateChatCount()
            this.createRefreshChatInterval()
        }

        if (navigation.state.key === 'notificationTab') {
            // notification count updater

            this.props.fetchUnreadCount()
            this.createRefreshNotificationInterval()
        }
    }

    componentWillUnmount() {
        this.clearRefreshChatInterval()
        this.clearRefreshNotificationInterval()
    }

    clearRefreshChatInterval = () => {
        if (this.refreshChatInterval) {
            clearInterval(this.refreshChatInterval)
        }
    }

    clearRefreshNotificationInterval = () => {
        if (this.refreshNotificationInterval) {
            clearInterval(this.refreshNotificationInterval)
        }
    }

    createRefreshChatInterval = () => {
        this.clearRefreshChatInterval()
        this.refreshChatInterval = setInterval(() => {
            this.props.updateChatCount()
        }, CHAT_COUNT_UPDATE_INTERVAL)
    }

    createRefreshNotificationInterval = () => {
        this.clearRefreshNotificationInterval()
        this.refreshNotificationInterval = setInterval(() => {
            this.props.fetchUnreadCount()
        }, NOTIFICATION_COUNT_UPDATE_INTERVAL)
    }
    startLottieAnim(anim) {
        console.log('THIS IS ANIMM', anim)
        this.lottieAnim = anim
        if (anim) {
            this.lottieAnim.play()
        }
    }

    render() {
        const {
            navigation,
            focused,

            notificationCount,
            chatCount,
            chatConversationOpen,
        } = this.props
        // if (chatConversationOpen) return null;

        // console.log('NOTIFIFCATION COUNT', notificationCount)
        // console.log('NOTIFIFCATION COUNT 1', nudgesCount)

        const tintColor = focused ? COLOR.GM_BLUE : '#BDBDBD'
        const color = focused ? COLOR.GM_BLUE : '#BDBDBD'

        const style = {
            tintColor,
            height: 22,
            width: 32,
        }
        const textStyle = {
            color,
            fontFamily: 'SFProDisplay-Regular',
            fontSize: 12,
            marginRight: 7,
        }

        switch (navigation.state.key) {
            case 'homeTab':
                return (
                    <>
                        {/* {focused && (
                            <View
                                style={{
                                    width: 35,
                                    backgroundColor: COLOR.GM_BLUE,
                                    height: 2,
                                    position: 'absolute',
                                    top: 0,
                                    left: 22,
                                }}
                            />
                        )} */}
                        <View
                            style={{
                                ...styles.iconContainerStyle,
                                marginLeft: 14,
                            }}
                        >
                            <Icon
                                name="home"
                                pack="material-community"
                                style={style}
                            />
                            <Text style={textStyle}>Home</Text>
                        </View>
                    </>
                )
            case 'profileTab':
                return (
                    <>
                        {/* {focused && (
                            <View
                                style={{
                                    width: 35,
                                    backgroundColor: COLOR.GM_BLUE,
                                    height: 2,
                                    position: 'absolute',
                                    top: 0,
                                    left: 11,
                                }}
                            />
                        )} */}
                        <View
                            style={{
                                ...styles.iconContainerStyle,
                                marginRight: 12,
                                bottom: 1,
                            }}
                        >
                            <Icon
                                name="account"
                                pack="material-community"
                                style={{ ...style, height: 26, width: 36 }}
                            />
                            <Text style={textStyle}>Profile</Text>
                        </View>
                    </>
                )
            case 'notificationTab':
                return (
                    <>
                        {/* {focused && (
                            <View
                                style={{
                                    width: 60,
                                    backgroundColor: COLOR.GM_BLUE,
                                    height: 2,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                }}
                            />
                        )} */}
                        <View
                            style={{
                                ...styles.iconContainerStyle,
                                marginRight: 10,
                                marginTop: 24,
                            }}
                        >
                            {notificationCount && notificationCount > 0 ? (
                                // {notificationCount == 0 ? (
                                <View
                                    style={{
                                        ...styles.notificationCountContainerStyle,
                                        top: -5,
                                    }}
                                    zIndex={1}
                                >
                                    <Text
                                        style={{
                                            ...styles.notificationCountTextStyle,
                                        }}
                                    >
                                        {notificationCount}
                                    </Text>
                                </View>
                            ) : null}
                            {notificationCount && notificationCount > 0 ? (
                                // {notificationCount == 0 ? (
                                <LottieView
                                    style={{
                                        height: hp(3.5),
                                        right: 2,
                                        top: notificationCount > 0 ? 0 : 4,
                                    }}
                                    loop={false}
                                    autoPlay
                                    autoSize
                                    source={NOTIFICATION_LOTTIE}
                                />
                            ) : (
                                <Icon
                                    name="bell"
                                    pack="material-community"
                                    style={{ ...style, bottom: 1 }}
                                    zIndex={1}
                                />
                            )}
                            <View style={{}}>
                                <Text
                                    style={{
                                        ...textStyle,
                                        width: '100%',
                                        bottom: notificationCount > 0 ? 3 : 0,
                                    }}
                                >
                                    Notifications
                                </Text>
                            </View>
                        </View>
                    </>
                )
            case 'chatTab':
                return (
                    <>
                        {/* {focused && (
                            <View
                                style={{
                                    width: 60,
                                    backgroundColor: COLOR.GM_BLUE,
                                    height: 2,
                                    position: 'absolute',
                                    top: 0,
                                    left: 3,
                                }}
                            />
                        )} */}
                        <View
                            style={{
                                ...styles.iconContainerStyle,
                                marginRight: 8,
                                marginTop: 24,
                                bottom: 1,
                            }}
                        >
                            {chatCount && chatCount > 0 ? (
                                <View
                                    style={{
                                        ...styles.notificationCountContainerStyle,
                                        top: -5,
                                    }}
                                    zIndex={2}
                                >
                                    <Text
                                        style={
                                            styles.notificationCountTextStyle
                                        }
                                    >
                                        {chatCount}
                                    </Text>
                                </View>
                            ) : null}
                            <Icon
                                name="chat-processing"
                                pack="material-community"
                                style={style}
                                zIndex={1}
                            />
                            <View style={{}}>
                                <Text
                                    style={{
                                        ...textStyle,
                                        width: '100%',
                                    }}
                                >
                                    Messages
                                </Text>
                            </View>
                        </View>
                    </>
                )
            case 'exploreTab':
                return (
                    <>
                        {/* {focused && (
                            <View
                                style={{
                                    width: 35,
                                    backgroundColor: COLOR.GM_BLUE,
                                    height: 2,
                                    position: 'absolute',
                                    top: 0,
                                    left: 14,
                                }}
                            />
                        )} */}
                        <View
                            style={{
                                ...styles.iconContainerStyle,
                                marginRight: 5,
                            }}
                        >
                            <Image
                                source={TRIBES}
                                style={{
                                    ...style,
                                    resizeMode: 'contain',
                                    height: 23,
                                    width: 23,
                                    marginRight: 8,
                                }}
                            />
                            <Text style={textStyle}>Tribes</Text>
                        </View>
                    </>
                )
            default:
                return (
                    <Icon name="home" pack="material-community" style={style} />
                )
        }
    }
}

const styles = {
    iconContainerStyle: {
        height: 48,
        width: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    notificationCountContainerStyle: {
        backgroundColor: '#FF2B2C',
        height: 16,
        minWidth: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 6,
        right: 8,
    },
    notificationCountTextStyle: {
        fontSize: 10,
        color: 'white',
        marginLeft: 4,
        marginRight: 3,
        alignSelf: 'center',
    },
}

const mapStateToProps = (state) => {
    const { unreadCount } = state.notification.unread

    const { nudgesData } = state.nudges
    const { chatCount } = state.navigationTabBadging

    const { activeChatRoomId } = state.chatRoom
    const { token } = state.user

    // TODO: @Jia Tutorial get showTutorial from tutorial reducer for this TUTORIAL_KEY
    return {
        notificationCount: unreadCount,
        // == undefined
        // ? state.notification.unread.data.length
        // : unreadCount,
        chatCount,
        chatConversationOpen: activeChatRoomId,
        token,
        nudgesCount: nudgesData?.length,
    }
}

export default connect(mapStateToProps, {
    updateChatCount,
    fetchUnreadCount,
})(TabIcon)
