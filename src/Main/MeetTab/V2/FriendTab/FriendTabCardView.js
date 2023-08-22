/**
 * This component allows user to manage the relationship with this current friend
 *
 * @format
 */

/**
 * This View is the Friend Card View
 */
import React from 'react'
import { Alert, Text, View } from 'react-native'
import { connect } from 'react-redux'
import DelayedButton from '../../../Common/Button/DelayedButton'
import { updateFriendship, blockUser, openProfile } from '../../../../actions'
import UserCardHeader from '../../Common/UserCardHeader'
import UserTopGoals from '../../../Common/Card/CardComponent/UserTopGoals'
import Icons from '../../../../asset/base64/Icons'
import BottomButtonsSheet from '../../../Common/Modal/BottomButtonsSheet'
import AnimatedCardWrapper from '../../../Common/Card/AnimatedCardWrapper'
import { getFriendUserId } from '../../../../redux/middleware/utils'
import { getButtonBottomSheetHeight } from '../../../../styles'
import { Actions } from 'react-native-router-flux'
import { color, default_style } from '../../../../styles/basic'

const TAB_KEY = 'friends'

class FriendTabCardView extends React.PureComponent {
    state = {
        requested: false,
        accepted: false,
    }

    // This is no longer used. Replaced by separate handler functions
    // handleUpdateFriendship = (item) => {
    //     const { maybeFriendshipRef } = item

    //     const friendUserId = getFriendUserId(
    //         maybeFriendshipRef,
    //         this.props.userId
    //     )
    //     const friendshipId = maybeFriendshipRef._id
    //     ActionSheetIOS.showActionSheetWithOptions(
    //         {
    //             options: FRIENDSHIP_BUTTONS,
    //             cancelButtonIndex: CANCEL_INDEX,
    //         },
    //         (buttonIndex) => {
    //             console.log('button clicked', FRIENDSHIP_BUTTONS[buttonIndex])
    //             switch (buttonIndex) {
    //                 case BLOCK_INDEX:
    //                     // User chose to block user with id: _id
    //                     console.log(`${DEBUG_KEY}: User blocks friend with id ${friendUserId},
    //                 friendshipId: ${friendshipId}`)
    //                     this.props.blockUser(friendUserId)
    //                     break

    //                 case UNFRIEND_INDEX:
    //                     // User chose to unfriend
    //                     this.props.updateFriendship(
    //                         '',
    //                         friendshipId,
    //                         'deleteFriend',
    //                         TAB_KEY,
    //                         () => {
    //                             console.log(
    //                                 'Successfully delete friend with friendshipId: ',
    //                                 friendshipId
    //                             )
    //                             this.setState({ requested: false })
    //                         }
    //                     )
    //                     break
    //                 default:
    //                     return
    //             }
    //         }
    //     )
    // }

    handleDeleteFriend = (friendshipId) => {
        this.props.updateFriendship(
            '',
            friendshipId,
            'deleteFriend',
            TAB_KEY,
            () => {
                console.log(
                    'Successfully delete friend with friendshipId: ',
                    friendshipId
                )
                this.setState({ requested: false })
            }
        )
    }

    handleOnOpenProfile = () => {
        const { _id } = this.props.item
        if (_id) {
            return this.props.openProfile(_id)
        }
    }

    closeOptionModal = () => this.bottomSheetRef.close()

    openOptionModal = () => this.bottomSheetRef.open()

    openFriendshipTypeModal = () => this.friendshipTypeBottomSheetRef.open()
    closeFriendshipTypeModal = () => this.friendshipTypeBottomSheetRef.close()

    makeFriendCardOptions = (item) => {
        const { maybeFriendshipRef } = item

        const friendUserId = getFriendUserId(
            maybeFriendshipRef,
            this.props.userId
        )
        const friendshipId = maybeFriendshipRef._id

        return [
            {
                text: 'Edit Friend Type',
                textStyle: { color: 'black' },
                icon: { name: 'account-heart', pack: 'material-community' },
                onPress: () => {
                    this.closeOptionModal()
                    setTimeout(() => {
                        this.openFriendshipTypeModal()
                    }, 500)
                },
            },
            {
                text: 'Unfriend',
                image: Icons.AccountRemove,
                imageStyle: { tintColor: 'black' },
                onPress: () => {
                    this.handleDeleteFriend(friendshipId)
                    this.closeOptionModal()
                },
            },
            {
                text: 'Block',
                textStyle: { color: 'black' },
                image: Icons.AccountCancel,
                imageStyle: { tintColor: 'black' },
                onPress: () => {
                    // Close bottom sheet
                    this.closeOptionModal()

                    // Wait for bottom sheet to close
                    // before showing confirmation alert
                    setTimeout(() => {
                        this.props.blockUser(friendUserId, undefined, item)
                    }, 500)
                },
            },
        ]
    }

    renderButton = (item) => {
        const { maybeFriendshipRef } = item
        const friendshipId = maybeFriendshipRef._id
        let button
        if (this.state.invited) {
            button = this.renderInvitedButton(friendshipId)
        } else {
            button = this.renderInviteButton()
        }

        return (
            <View
                style={{ flexDirection: 'row', marginLeft: 49, marginTop: 10 }}
            >
                {button}
                <View style={{ flex: 1 }} />
            </View>
        )
    }

    renderInvitedButton = (friendshipId) => {
        const text = 'Request Sent'
        return (
            <DelayedButton
                style={[
                    styles.buttonTextContainerStyle,
                    { backgroundColor: '#BDBDBD' },
                ]}
                onPress={() => {
                    this.setState(
                        {
                            ...this.state,
                            invited: false,
                        },
                        () => {
                            Alert.alert(
                                'Are you sure you want to withdraw friend request?',
                                '',
                                [
                                    {
                                        text: 'Confirm',
                                        onPress: () => {
                                            this.props.updateFriendship(
                                                this.props.userId,
                                                friendshipId,
                                                'deleteFriend',
                                                'requests.outgoing',
                                                undefined
                                            )
                                        },
                                    },
                                    {
                                        text: 'Cancel',
                                    },
                                ]
                            )
                        }
                    )
                }}
                // disabled
            >
                <Text
                    style={[
                        default_style.buttonText_1,
                        { color: 'white', fontSize: 12 },
                    ]}
                >
                    {text}
                </Text>
            </DelayedButton>
        )
    }

    renderInviteButton = () => {
        const text = 'Add Friend'
        const { index } = this.props
        return (
            <DelayedButton
                style={[
                    styles.buttonTextContainerStyle,
                    { backgroundColor: color.GM_BLUE },
                ]}
                onPress={() => {
                    this.setState(
                        {
                            ...this.state,
                            invited: true,
                        },
                        () => {
                            this.props.updateFriendship(
                                userId,
                                '',
                                'requestFriend',
                                'requests.outgoing',
                                undefined
                            )
                        }
                    )
                }}
                activeOpacity={0.6}
            >
                <Text
                    style={[
                        default_style.buttonText_1,
                        { color: 'white', fontSize: 12 },
                    ]}
                >
                    {text}
                </Text>
            </DelayedButton>
        )
    }

    renderBottomSheet = (item) => {
        const options = this.makeFriendCardOptions(item)
        // Options height + bottom space + bottom sheet handler height
        const sheetHeight = getButtonBottomSheetHeight(options.length)
        return (
            <BottomButtonsSheet
                ref={(r) => (this.bottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
            />
        )
    }

    renderHeader(item) {
        return (
            <UserCardHeader user={item} optionsOnPress={this.openOptionModal} />
        )
    }

    handleButtonOnPress = (type, item) => {
        const { maybeFriendshipRef } = item
        const friendshipId = maybeFriendshipRef._id

        if (type === 'addAsCloseFriend') {
            this.props.updateFriendship(
                this.props.userId,
                friendshipId,
                'addAsCloseFriend',
                'requests.outgoing',
                undefined
            )
            Alert.alert('Added as close friend', '')
            return
        }

        if (type === 'addAsFriend') {
            this.props.updateFriendship(
                this.props.userId,
                friendshipId,
                'addAsFriend',
                'requests.outgoing',
                undefined
            )
            Alert.alert('Removed from close friends', '')
            return
        }
    }

    makeFriendshipTypeOptions = (item) => {
        return [
            {
                text: 'Friend',
                textStyle: { color: 'black' },
                onPress: () => {
                    // close bottom sheet
                    this.closeFriendshipTypeModal()
                    setTimeout(() => {
                        this.handleButtonOnPress('addAsFriend', item)
                    }, 500)
                },
            },
            {
                text: 'Close Friend',
                textStyle: { color: 'black' },
                onPress: () => {
                    // close bottom sheet
                    this.closeFriendshipTypeModal()
                    setTimeout(() => {
                        this.handleButtonOnPress('addAsCloseFriend', item)
                    }, 500)
                },
            },
        ]
    }

    renderFriendshipTypeBottomSheet = (item) => {
        const options = this.makeFriendshipTypeOptions(item)
        // Options height + bottom space + bottom sheet handler height
        const sheetHeight = getButtonBottomSheetHeight(options.length)
        return (
            <BottomButtonsSheet
                ref={(r) => (this.friendshipTypeBottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
            />
        )
    }

    render() {
        const { item, ...otherProps } = this.props

        if (!item) return null

        return (
            <AnimatedCardWrapper {...otherProps}>
                <DelayedButton
                    style={styles.containerStyle}
                    onPress={() => {
                        this.props.isMutual && Actions.pop()
                        this.props.openProfile(item._id)
                    }}
                    activeOpacity={0.8}
                >
                    {this.renderHeader(item)}
                    <UserTopGoals user={item} />
                    {/* {this.renderButton(item)} */}
                    {this.renderBottomSheet(item)}
                    {this.renderFriendshipTypeBottomSheet(item)}
                </DelayedButton>
            </AnimatedCardWrapper>
        )
    }
}

const styles = {
    containerStyle: {
        padding: 16,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: '#F2F2F2',
    },
    // Button styles
    buttonsContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonTextContainerStyle: {
        marginRight: 8,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
}

const mapStateToProps = (state) => {
    const { userId } = state.user
    return {
        userId,
    }
}

export default connect(mapStateToProps, {
    updateFriendship,
    blockUser,
    openProfile,
})(FriendTabCardView)
