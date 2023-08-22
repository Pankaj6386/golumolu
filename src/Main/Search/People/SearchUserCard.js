/** @format */

import { Button } from '@ui-kitten/components'
import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
// Actions
import { openProfile, updateFriendship, UserBanner } from '../../../actions'
// Components
import { default_style, color } from '../../../styles/basic'

// Assets
import next from '../../../asset/utils/next.png'
import { EVENT, trackWithProperties } from '../../../monitoring/segment'
import DelayedButton from '../../Common/Button/DelayedButton'
import ProfileImage from '../../Common/ProfileImage'
import { getProfileImageOrDefaultFromUser } from '../../../redux/middleware/utils'
import UserTopGoals from '../../Common/Card/CardComponent/UserTopGoals'
import UserCardHeader from '../../MeetTab/Common/UserCardHeader'
import FriendRequestCardView from '../../MeetTab/V2/FriendRequestCardView'
import MemberListCard from '../../Tribe/MemberListCard'

// '../Common/Card/CardComponent/UserTopGoals
const DEBUG_KEY = '[ Component SearchUserCard ]'

class SearchUserCard extends Component {
    constructor(props) {
        super(props)
        this.handleSelectClick = this.handleSelectClick.bind(this)
        this.handleRemoveClick = this.handleRemoveClick.bind(this)
        this.state = {
            isLoggedIn: false,
            invited:
                this.props.isRequested !== undefined
                    ? this.props.isRequested
                    : false,
        }
    }

    handleSelectClick() {
        this.setState({ isLoggedIn: true })
    }

    handleRemoveClick() {
        this.setState({ isLoggedIn: false })
    }

    onButtonClicked = (_id, itemIsSelected) => {
        console.log(`${DEBUG_KEY} open profile with id: `, _id)
        // trackWithProperties(EVENT.SEARCH_RESULT_CLICKED, {
        //     Type: 'people',
        //     Id: _id,
        // })
        if (this.props.onSelect && this.props.onSelect instanceof Function) {
            return this.props.onSelect(_id, this.props.item)
        }
        this.props.openProfile(_id)
        if (itemIsSelected) {
            this.handleSelectClick()
        } else {
            this.handleRemoveClick()
        }
    }

    renderProfileImage() {
        const { item } = this.props
        return (
            <ProfileImage
                imageStyle={{ height: 48, width: 48 }}
                imageUrl={getProfileImageOrDefaultFromUser(item)}
                rounded
                imageContainerStyle={styles.imageContainerStyle}
            />
        )
    }

    renderButton(_id) {
        const { cardIconSource, cardIconStyle } = this.props
        const iconSource = cardIconSource || next
        const iconStyle = {
            ...styles.iconStyle,
            opacity: 0.8,
            ...cardIconStyle,
        }
        return (
            <View style={styles.iconContainerStyle}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this.onButtonClicked.bind(this, _id)}
                    style={{ padding: 15 }}
                >
                    <Image source={iconSource} style={iconStyle} />
                </TouchableOpacity>
            </View>
        )
    }

    renderTitle(item) {
        let title = item.name

        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 2,
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{ color: 'black', fontSize: 18, fontWeight: '600' }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
                <UserBanner
                    user={item}
                    iconStyle={{ marginLeft: 3, height: 16, width: 14 }}
                />
            </View>
        )
    }

    renderCardContent(item) {
        let content
        if (item.headline) {
            content = item.headline
        } else if (item.occupation) {
            content = item.occupation
        }

        return (
            <View
                style={{
                    justifyContent: 'flex-start',
                    flex: 1,
                    marginLeft: 10,
                    marginTop: 13,
                }}
            >
                {this.renderTitle(item)}
            </View>
        )
    }

    renderStatusButton(text, _id) {
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 0,
                    width: 95,
                }}
            >
                <Button
                    style={styles.buttonText}
                    appearance="outline"
                    size="small"
                    activeOpacity={1}
                    onPress={() => {
                        this.onButtonClicked(_id, itemIsSelected)
                    }}
                >
                    <Text>{text}</Text>
                </Button>
            </View>
        )
    }

    renderTopGoals(item) {
        return (
            <View>
                <UserTopGoals user={item}></UserTopGoals>
            </View>
        )
    }

    renderInviteButton = (userId) => {
        const text = 'Add Friend'

        const { index } = this.props

        return (
            <DelayedButton
                style={[
                    styles.buttonTextContainerStyle,
                    { backgroundColor: color.GM_BLUE },
                ]}
                onPress={() => {
                    this.handleRequestFriend(userId)
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
    renderInvitedButton = (userId) => {
        const text = 'Friends'
        // const text = 'Request Sent'
        return (
            <DelayedButton
                style={[
                    styles.buttonTextContainerStyle,
                    { backgroundColor: '#BDBDBD' },
                ]}
                // onPress={() => {
                //     Alert.alert(
                //         'Are you sure you want to withdraw friend request?',
                //         '',
                //         [
                //             {
                //                 text: 'Confirm',
                //                 onPress: () => {
                //                     this.props.updateFriendship(
                //                         userId,
                //                         this.props.friendship._id,
                //                         'deleteFriend',
                //                         'requests.outgoing',
                //                         undefined
                //                     )
                //                 },
                //             },
                //             {
                //                 text: 'Cancel',
                //             },
                //         ]
                //     )
                // }}
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
    handleRequestFriend = (userId) => {
        this.setState(
            {
                ...this.state,
                invited: true,
            },
            () =>
                this.props.updateFriendship(
                    userId,
                    '',
                    'requestFriend',
                    'requests.outgoing',
                    undefined
                )
        )
    }
    renderAddFriendButton = (userId) => {
        let button
        button = this.renderInviteButton(userId)
        if (!this.state.invited) {
            button = this.renderInvitedButton(userId)
        } else {
            button = this.renderInviteButton(userId)
        }

        return (
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                {button}
                <View style={{ flex: 1 }} />
            </View>
        )
    }
    render() {
        const { item, itemIsSelected } = this.props
        if (!item) return null

        const { _id } = item
        let { cardContainerStyles } = this.props
        if (!cardContainerStyles) {
            cardContainerStyles = {}
        }
        if (item?.suggested) {
            return (
                <View>
                    <DelayedButton
                        activeOpacity={0.8}
                        style={[styles.containerStyle, styles.shadow]}
                        onPress={() => {
                            this.onButtonClicked(_id, itemIsSelected)
                        }}
                    >
                        <UserCardHeader
                            user={item}
                            optionsOnPress={
                                item?.ignoreOptions
                                    ? null
                                    : this.openOptionModal
                            }
                        />
                        <UserTopGoals user={item} title={'Top Goal'} />
                        {this.renderAddFriendButton(item._id)}
                        {/* {this.renderBottomSheet(item.user)} */}
                    </DelayedButton>
                </View>
                // <DelayedButton
                //     activeOpacity={0.8}
                //     onPress={() => {
                //         this.onButtonClicked(_id, itemIsSelected)
                //     }}
                // >
                //     <View style={[styles.containerStyle, cardContainerStyles]}>
                //         <UserCardHeader
                //             user={item}
                //             optionsOnPress={this.openOptionModal}
                //         />
                //         <UserTopGoals user={item} />
                //         {/* {this.renderButton(item)} */}
                //         {/* {this.renderBottomSheet(item.user)} */}
                //         {/* {this.renderProfileImage(item)} */}
                //         {/* <View>
                //             {this.renderCardContent(item)}
                //             {this.renderTopGoals(item)}
                //         </View> */}
                //         {/*
                //         This section is commented out until we get "status" (friend, close friend, non-friend) from data,
                //         so that we can render the correct UI icon/text.
                //         {this.renderStatusButton("Add", _id)}
                //         */}
                //     </View>
                // </DelayedButton>
            )
        } else {
            return (
                <DelayedButton
                    activeOpacity={0.8}
                    onPress={() => {
                        this.onButtonClicked(_id, itemIsSelected)
                    }}
                >
                    <View
                        style={[styles.oldContainerStyle, cardContainerStyles]}
                    >
                        {/* <UserCardHeader
                            user={item}
                            optionsOnPress={this.openOptionModal}
                        /> */}
                        {/* <UserTopGoals user={item} /> */}
                        {/* {this.renderButton(item)} */}
                        {/* {this.renderBottomSheet(item.user)} */}
                        {this.renderProfileImage(item)}
                        {/* <View> */}
                        {this.renderCardContent(item)}
                        {/* {this.renderTopGoals(item)} */}
                        {/* </View> */}
                        {/*
                        This section is commented out until we get "status" (friend, close friend, non-friend) from data,
                        so that we can render the correct UI icon/text.
                        {this.renderStatusButton("Add", _id)}
                        */}
                    </View>
                </DelayedButton>
            )
        }
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    oldContainerStyle: {
        flexDirection: 'row',
        paddingLeft: 12,
        paddingRight: 12,
        marginTop: 1,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#ffffff',
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    iconContainerStyle: {
        marginLeft: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconStyle: {
        height: 25,
        width: 26,
        transform: [{ rotateY: '180deg' }],
        tintColor: '#17B3EC',
    },
    imageContainerStyle: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
    },
    buttonStyle: {
        flexGrow: 0,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#42C0F5',
        borderRadius: 3,
        borderColor: '#fff',
    },
    buttonStyleAdd: {
        flexGrow: 0,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#BDBDBD',
        borderRadius: 3,
        borderColor: '#fff',
    },
    buttonText: {
        color: 'white',
    },
    buttonContainerStyle: {
        marginLeft: 8,
        flexDirection: 'row',
    },
    buttonTextContainerStyle: {
        marginLeft: 49,
        marginRight: 8,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
}

export default connect(null, {
    updateFriendship,
    openProfile,
})(SearchUserCard)
