/** @format */

import React from 'react'
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import R from 'ramda'
import timeago from 'timeago.js'
import { connect } from 'react-redux'
import _ from 'lodash'

// Component
import {
    actionSheet,
    switchByButtonIndex,
} from '../../Common/ActionSheetFactory'
import ProfileImage from '../../Common/ProfileImage'
import Timestamp from '../../Goal/Common/Timestamp'
import DelayedButton from '../../Common/Button/DelayedButton'
import BottomButtonsSheet from '../../Common/Modal/BottomButtonsSheet'
import { getButtonBottomSheetHeight } from '../../../styles'
import OnboardingStyles from '../../../styles/Onboarding'

// Actions
import {
    openNotificationDetail,
    removeNotification,
} from '../../../redux/modules/notification/NotificationActions'
import { Logger } from '../../../redux/middleware/utils/Logger'
import { Icon } from '@ui-kitten/components'
import { color, text, default_style } from '../../../styles/basic'
import { UI_SCALE } from '../../../styles'
import { GM_BLUE } from '../../../styles/basic/color'
import UnfriendPopup from '../../Journey/UnfriendPopup'
import { DropDownHolder } from '../../Common/Modal/DropDownModal'
import { createOrGetDirectMessage, updateFriendship } from '../../../actions'
import { getUserData } from '../../../redux/modules/User/Selector'
import { Actions } from 'react-native-router-flux'

// Constants
const DEBUG_KEY = '[ UI NotificationCard ]'

const { button: buttonStyle, text: textStyle } = OnboardingStyles
class NotificationCard extends React.PureComponent {
    state = {
        showFriendModal: false,
    }

    handleNotificationCardOnPress = (item) => {
        const { parsedNoti, _id } = item
        if (!parsedNoti || !parsedNoti.path) {
            console.warn(
                `${DEBUG_KEY}: no parsedNoti or path is in notification:`,
                item
            )
            return
        }

        if (!_id) {
            console.warn(
                `${DEBUG_KEY}: missing notification id for item:`,
                item
            )
            return
        }

        // TODO: open detail based on the path;
        Logger.log(`${DEBUG_KEY}: open notification detail for item: `, item, 2)
        this.props.openNotificationDetail(item)
    }

    handleDotPress() {}

    handleOptionsOnPress() {
        // const { item } = this.props
        // const { _id } = item
        // const options = switchByButtonIndex([
        //     [
        //         R.equals(0),
        //         () => {
        //             console.log(
        //                 `${DEBUG_KEY} User chooses to remove notification`
        //             )
        //             return this.props.removeNotification(_id)
        //         },
        //     ],
        // ])
        // const requestOptions = ['Remove this notification', 'Cancel']
        // const cancelIndex = 1
        // const adminActionSheet = actionSheet(
        //     requestOptions,
        //     cancelIndex,
        //     options
        // )
        // adminActionSheet()
    }

    renderProfileImage(item) {
        const { parsedNoti } = item
        const imageUrl =
            parsedNoti && parsedNoti.icon ? parsedNoti.icon : undefined
        return (
            <ProfileImage
                imageStyle={{ height: 50, width: 50 }}
                imageUrl={imageUrl}
            />
        )
    }

    renderOptions() {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => this.openNotificationBottomSheet()}
                style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    padding: 5,
                    // paddingTop: 0,
                    // paddingBottom: 20,
                    paddingBottom: 50,
                }}
            >
                <Icon
                    name="dots-horizontal"
                    pack="material-community"
                    style={[
                        {
                            tintColor: '#828282',
                            width: 18,
                            height: 18,
                        },
                    ]}
                />
            </TouchableOpacity>
        )
    }

    openNotificationBottomSheet = () =>
        this.notificationRefBottomSheetRef.open()
    closeNotificationBottomSheet = () =>
        this.notificationRefBottomSheetRef.close()

    makeNotificationRefOptions = () => {
        return [
            {
                text: 'Remove Notification',
                onPress: () => {
                    this.closeNotificationBottomSheet()
                    setTimeout(() => {
                        const { item } = this.props
                        const { _id } = item
                        this.props.removeNotification(_id)
                    }, 500)
                },
            },
            {
                text: 'Cancel',
                onPress: () => this.closeNotificationBottomSheet(),
            },
        ]
    }

    renderNotificationRefBottomSheet = () => {
        const options = this.makeNotificationRefOptions()

        const sheetHeight = getButtonBottomSheetHeight(options.length)

        return (
            <BottomButtonsSheet
                ref={(r) => (this.notificationRefBottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
            />
        )
    }

    renderContent(item, isInvalidCommentNotif) {
        const { created, parsedNoti, __t } = item
        let textToDisplay =
            parsedNoti && parsedNoti.notificationMessage
                ? parsedNoti.notificationMessage
                : ''
        // console.log('TEXT TO DISPLAYY', parsedNoti)
        let actorName = _.get(item, 'parsedNoti.actorName', undefined)
        let startWithName = textToDisplay.startsWith(actorName)
        if (actorName && startWithName) {
            textToDisplay = textToDisplay.replace(`${actorName}`, '')
        }
        let goalMogulReminder
        if (textToDisplay === '' && isInvalidCommentNotif) {
            textToDisplay = 'Comment was removed by the owner'
            actorName = undefined
        }
        if (__t === 'ReminderNotification') {
            textToDisplay = `${item?.goalRef?.title || ''}\n`
            goalMogulReminder = 'GoalMogul Reminder: '
            switch (item?.notificationType) {
                case 'month_before_due_date':
                    textToDisplay +=
                        'Your goal is due IN 1 MONTH! Tap here to update your goal'
                    break
                case 'week_before_due_date':
                    textToDisplay +=
                        'Your goal is due IN 1 WEEK! Tap here to update your goal'
                    break
                case 'day_before_due_date':
                    textToDisplay +=
                        'Your goal is due TOMORROW! Tap here to update your goal'
                    break
                case 'on_due_date':
                    textToDisplay +=
                        'Your goal is due TODAY! Tap here to update your goal'
                    break
                default:
                    textToDisplay += item?.message || ''
                    break
            }
        }

        // if (item.notificationType === 'FriendshipWithInviter') {
        //     console.log('ITEM', item)
        // }

        return (
            <View style={{ flex: 1, marginLeft: 10, marginRight: 18 }}>
                <Text
                    style={{
                        flexWrap: 'wrap',
                        color: color.TEXT_COLOR.OFF_DARK,
                        fontSize: 14 * UI_SCALE,
                        fontFamily: text.FONT_FAMILY.REGULAR,
                        marginBottom: 4,
                        lineHeight: 20,
                    }}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                >
                    {actorName && startWithName ? (
                        <Text
                            style={[
                                default_style.titleText_2,
                                { color: color.TEXT_COLOR.OFF_DARK },
                            ]}
                        >
                            {actorName}
                        </Text>
                    ) : goalMogulReminder ? (
                        <Text
                            style={[
                                default_style.titleText_2,
                                { color: color.TEXT_COLOR.OFF_DARK },
                            ]}
                        >
                            {goalMogulReminder}
                        </Text>
                    ) : null}
                    {textToDisplay}
                </Text>
                {item.notificationType === 'FriendshipWithInviter'
                    ? this.renderOnboardingInvite(item)
                    : null}
                {/* {this.renderOnboardingInvite(item)} */}
                <View style={{ marginTop: 10 }}>
                    <Timestamp time={timeago().format(created)} />
                </View>
            </View>
        )
    }

    renderOnboardingInvite = (item) => {
        let notificationSender = item?.friendshipRef?.participants.find(
            (friend) => {
                if (friend.users_id != this.props.userId) {
                    return friend
                }
            }
        )

        // console.log('notificationSender', notificationSender)

        return (
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <DelayedButton
                    style={{
                        height: 36,
                        width: 190,
                        backgroundColor: GM_BLUE,
                        borderRadius: 3,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onPress={() => {
                        return notificationSender
                            ? this.props.createOrGetDirectMessage(
                                  notificationSender.users_id,
                                  (err, chatRoom) => {
                                      console.log(
                                          'createOrGetDirectMessage',
                                          err,
                                          chatRoom
                                      )
                                      if (err || !chatRoom) {
                                          return Alert.alert(
                                              'Error',
                                              'Could not start the conversation. Please try again later.'
                                          )
                                      }
                                      Actions.push('chatRoomConversation', {
                                          chatRoomId: chatRoom._id,
                                      })
                                  }
                              )
                            : setTimeout(() => {
                                  DropDownHolder.alert(
                                      'info',
                                      '',
                                      `You have unfriended ${item?.notifierRef?.name}.`
                                  )
                              }, 500)
                    }}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 12,
                            fontFamily: 'SFProDisplay-Semibold',
                            fontWeight: '800',
                        }}
                    >
                        Thank them for joining you
                    </Text>
                </DelayedButton>
                <View style={{ width: 15 }} />
                <DelayedButton
                    style={{
                        height: 35,
                        width: 90,
                        backgroundColor: 'transparent',
                        borderRadius: 3,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: GM_BLUE,
                        borderWidth: 1,
                    }}
                    onPress={() => this.setState({ showFriendModal: true })}
                >
                    <Text
                        style={{
                            color: GM_BLUE,
                            fontSize: 12,
                            fontFamily: 'SFProDisplay-Semibold',
                            fontWeight: '800',
                        }}
                    >
                        Unfriend
                    </Text>
                </DelayedButton>
            </View>
        )
    }

    render() {
        const { item } = this.props

        // console.log('THIS IS NOTIFICATION ITEM', item)

        if (!item) return null
        if (!item.parsedNoti) return null

        // Right now we do a hack to go around invalid commentRef
        const isInvalidCommentNotif = item.commentRef === null

        if (item.parsedNoti.error && !isInvalidCommentNotif) {
            // console.warn(
            //     `${DEBUG_KEY}: invalid notification with error: `,
            //     item.parsedNoti.error
            // )
            return null
        }
        // If read, backgroundColor is: '#eef8fb'
        const read = this.props.read
        const cardContainerStyle = read
            ? { ...styles.cardContainerStyle }
            : { ...styles.cardContainerStyle, backgroundColor: '#eef8fb' }
        return (
            <>
                <DelayedButton
                    delay={600}
                    activeOpacity={0.6}
                    style={cardContainerStyle}
                    onPress={() => this.handleNotificationCardOnPress(item)}
                >
                    {this.renderProfileImage(item)}
                    {this.renderContent(item, isInvalidCommentNotif)}
                    {this.renderOptions(item)}
                </DelayedButton>
                {this.renderNotificationRefBottomSheet()}
                <UnfriendPopup
                    friendName={item?.notifierRef?.name}
                    isVisible={this.state.showFriendModal}
                    onClose={() => this.setState({ showFriendModal: false })}
                    onPressYes={() => {
                        this.setState({ showFriendModal: false })
                        this.props.updateFriendship(
                            this.props.userId,
                            item?.friendshipRef?._id,
                            'deleteFriend',
                            'friends',
                            undefined
                        )
                        setTimeout(() => {
                            DropDownHolder.alert(
                                'success',
                                '',
                                'You are no longer friends with this user.'
                            )
                        }, 500)
                    }}
                />
            </>
        )
    }
}

const styles = {
    cardContainerStyle: {
        flexDirection: 'row',
        padding: 12,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        marginBottom: 1,
        backgroundColor: color.GM_CARD_BACKGROUND,
    },
}

const mapStateToProps = (state, props) => {
    const { data } = state.notification.unread
    const { item } = props
    const { userId } = state.user

    const userObject = getUserData(state, userId, '')
    // console.log('CURRENT MILESTORE', userObject)
    const { user, mutualFriends, friendship } = userObject
    let read = true
    if (item && item._id) {
        read = !data.some((a) => a._id === item._id)
    }

    return {
        read,
        friendship,
        userId,
    }
}

export default connect(mapStateToProps, {
    removeNotification,
    openNotificationDetail,
    createOrGetDirectMessage,
    updateFriendship,
})(NotificationCard)
