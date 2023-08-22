/**
 * This modal is to display the user list that like a goal / post / comment
 * NOTE: before entering a profile, modal is closed first or not
 *
 * @format
 */

import React from 'react'
import { Dimensions, View, FlatList, Image, Text, Alert } from 'react-native'
import { connect } from 'react-redux'
import UserCard from '../Card/UserCard'
import { getLikeList } from '../../../redux/modules/like/LikeActions'
import cancel from '../../../asset/utils/cancel_no_background.png'
import Modal from 'react-native-modalbox'
import { updateFriendship } from '../../../actions'
import { getUserData } from '../../../redux/modules/User/Selector'
import Constants from 'expo-constants'
import { text, color, default_style } from '../../../styles/basic'
import UserTopGoals from '../Card/CardComponent/UserTopGoals'
import DelayedButton from '../Button/DelayedButton'
import { ModalHeaderStyle } from './Styles'
import FriendTabCardView from '../../MeetTab/V2/FriendTab/FriendTabCardView'

const DEBUG_KEY = '[ UI LikeListModal ]'
const MODAL_TRANSITION_TIME = 300
const INITIAL_STATE = {
    data: [], // User like list
    refreshing: false,
}
const screenHeight = Math.round(Dimensions.get('window').height)
class LikeListModal extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            ...INITIAL_STATE,
            isVisible: this.props.isVisible,
            invited: false,
            invitedPersons: [],
        }
    }

    closeModal() {
        this.props.closeModal && this.props.closeModal()
        if (this.props.clearDataOnHide) {
            this.setState({ ...INITIAL_STATE })
        }
    }

    refreshLikeList = () => {
        this.setState({ ...this.state, refreshing: true })
        const callback = (data) => {
            this.setState({ ...this.state, data })
        }

        this.props.getLikeList(
            this.props.parentId,
            this.props.parentType,
            callback
        )
    }

    renderButton = (userId) => {
        let button
        if (this.state.invited && this.state.invitedPersons.includes(userId)) {
            button = this.renderInvitedButton(userId)
        } else {
            button = this.renderInviteButton(userId)
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

    renderInvitedButton = (userId) => {
        const text = 'Request Sent'
        return (
            <DelayedButton
                style={[
                    styles.buttonTextContainerStyle,
                    { backgroundColor: '#BDBDBD' },
                ]}
                onPress={() => {
                    Alert.alert(
                        'Are you sure you want to withdraw friend request?',
                        '',
                        [
                            {
                                text: 'Confirm',
                                onPress: () => {
                                    let updatedInvitedPersons = this.state
                                        .invitedPersons
                                    if (
                                        updatedInvitedPersons.includes(userId)
                                    ) {
                                        updatedInvitedPersons.splice(
                                            updatedInvitedPersons.indexOf(
                                                userId
                                            ),
                                            1
                                        )
                                    }
                                    let check =
                                        updatedInvitedPersons.length !== 0
                                    this.setState({
                                        ...this.state,
                                        invited: check,
                                        invitedPersons: updatedInvitedPersons,
                                    })

                                    const userObject = getUserData(
                                        this.props.storeCopy,
                                        userId,
                                        ''
                                    )
                                    const { friendship } = userObject

                                    this.props.updateFriendship(
                                        userId,
                                        friendship._id,
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
                    this.setState(
                        {
                            ...this.state,
                            invited: true,
                            invitedPersons: [
                                ...this.state.invitedPersons,
                                userId,
                            ],
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

    onModalShow = () => {
        this.refreshLikeList()
    }

    onScrollFlatList(offset) {
        if (offset < -0.1 * screenHeight) {
            this.closeModal()
        }
    }

    onScrollFlatList(offset) {
        if (offset < -0.1 * screenHeight) {
            this.closeModal()
        }
    }

    _keyExtractor = (item) => item._id

    renderItem = ({ item }) => {
        console.log('LIKEEEE', item)
        if (!item || !item.creator) {
            console.warn(`${DEBUG_KEY}: creator doesn't exist for item:`, item)
            return null
        }

        const callback = (openProfileCallBack) => {
            this.closeModal()
            // Wait till animation finished. Default for react native modal is 300
            setTimeout(() => {
                openProfileCallBack()
            }, MODAL_TRANSITION_TIME)
        }
        return (
            <View>
                <UserCard item={item.creator} callback={callback} />
                <UserTopGoals user={item.creator} />
                {this.renderButton(item.creator._id)}
            </View>
        )
        // return <FriendTabCardView item={item.creator} callback={callback} />
    }

    renderHeader() {
        return (
            <View style={ModalHeaderStyle.headerContainerStyle}>
                <DelayedButton
                    testID="like-list-modal-close-button"
                    activeOpacity={0.6}
                    onPress={() => this.closeModal()}
                    style={{
                        position: 'absolute',
                        top: 5,
                        left: 5,
                        padding: 12,
                    }}
                >
                    <Image
                        source={cancel}
                        style={{
                            ...ModalHeaderStyle.cancelIconStyle,
                            tintColor: '#21364C',
                        }}
                    />
                </DelayedButton>
                <View
                    style={{
                        marginHorizontal: 17,
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}
                >
                    <Text style={ModalHeaderStyle.headerTextStyle}>Likes</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <Modal
                swipeToClose={true}
                swipeThreshold={50}
                isOpen={this.props.isVisible}
                backdropOpacity={0.5}
                onOpened={() => this.onModalShow()}
                onClosed={() => this.closeModal()}
                coverScreen={true}
                // See https://github.com/maxs15/react-native-modalbox/issues/239
                // Trading slight performance hit for no visible flashing
                useNativeDriver={false}
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
                    marginBottom: 0,
                    marginHorizontal: 0,
                    marginTop: Constants.statusBarHeight + 15,
                }}
            >
                {this.renderHeader()}
                <FlatList
                    testID="like-list-modal-list"
                    keyExtractor={this._keyExtractor}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    contentContainerStyle={{ marginTop: 10 }}
                    refreshing={this.state.refreshing}
                    onScroll={(e) => {
                        this.onScrollFlatList(e.nativeEvent.contentOffset.y)
                    }}
                />
            </Modal>
        )
    }
}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 20,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F2',
    },
    bodyContainerStyle: {
        flex: 1,
        marginLeft: 8,
    },
    infoContainerStyle: {
        flexDirection: 'row',
    },
    buttonContainerStyle: {
        marginLeft: 8,
        flexDirection: 'row',
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
    },
}

const mapStateToProps = (state, props) => {
    return {
        storeCopy: state,
    }
}

export default connect(mapStateToProps, {
    updateFriendship,
    getLikeList,
})(LikeListModal)
