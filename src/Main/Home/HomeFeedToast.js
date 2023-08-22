/** @format */

import React, { Component } from 'react'
import { View, Dimensions, StyleSheet } from 'react-native'

import MissingProfile from '../../asset/image/MissingProfile.png'
import GreenBadge from '../../asset/image/Green_Badge.png'
import BronzeBadge from '../../asset/image/Bronze_Badge.png'
import SilverBadge from '../../asset/image/Silver_Badge.png'
import GoldBadge from '../../asset/image/Gold_Badge.png'
import FriendsView from '../../asset/image/Friend_View.png'
import CloseFriends from '../../asset/image/CloseFriend.png'

import _ from 'lodash'

import Carousel from 'react-native-snap-carousel' // Version can be specified in package.json
import {
    openProfile,
    openProfileDetailEditForm,
    refreshProfileData,
} from '../../actions'
import { connect } from 'react-redux'
import { getToastsData } from '../../actions/ToastActions'

import { scrollInterpolator, animatedStyles } from './homeToastAnimation'

import ToastCard from '../../components/ToastCard'
import { UI_SCALE } from '../../styles'
import InviteFriendModal from '../MeetTab/Modal/InviteFriendModal'

import { refreshActivityFeed } from '../../redux/modules/home/feed/actions'

const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.95)
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 9)

let pageAb = ''

class HomeFeedToast extends Component {
    constructor(props) {
        super(props)
        this._renderItem = this._renderItem.bind(this)

        this.state = {
            index: 0,
            showInviteFriendModal: false,
            heading: '',
            refreshCarousal: false,
            toastsData: [],
            userToVisit: '',
            showFrag2: false,
        }
    }

    TOAST_DATA = [
        {
            _id: 1,
            image: MissingProfile,
            show: false,
            mainHeadingView: {
                justifyContent: 'space-between',
                flex: 1,

                width: '65%',
                height: '100%',
                margin: 0,
                padding: 0,
                marginBottom: 8,
                marginHorizontal: 10,
            },
            mainHeading: {
                fontSize: UI_SCALE * 17,
                title: 'Something’s missing…',
                lineheight: 18,
                marginTop: 10,
            },
            smallHeading: {
                fontSize: UI_SCALE * 16,
                title: 'Add a profile photo so friends recognize you!',
                lineheight: 19,
            },
            renderButton: true,
            marginButtonTop: undefined,
            thirdText: undefined,
            buttonText: 'Edit Profile',

            handleButtonPress: () =>
                this.props.openProfileDetailEditForm(this.props.userId, pageAb),
        },

        {
            _id: 2,
            image: GreenBadge,
            show: false,
            mainHeadingView: {
                justifyContent: 'space-between',
                flex: 1,
                width: '60%',
                height: '100%',
                margin: 0,
                padding: 0,
            },
            mainHeading: {
                fontSize: UI_SCALE * 18,
                title: `To earn your Green Badge, simply complete your Profile and add your 1st goal!`,
                lineheight: 21,
            },
            smallHeading: undefined,
            renderButton: true,
            marginButtonTop: 10,
            thirdText: undefined,
            buttonText: 'Edit Profile',
            handleButtonPress: () =>
                this.props.openProfileDetailEditForm(this.props.userId, pageAb),
        },

        {
            _id: 3,
            image: GreenBadge,
            show: false,
            mainHeadingView: {
                flex: 1,
                width: '65%',
                height: '100%',
                margin: 0,
                padding: 0,
            },
            mainHeading: {
                fontSize: UI_SCALE * 18,
                title: 'Get your Green Badge now',

                lineHeight: 18,
                marginTop: 20,
            },
            smallHeading: {
                fontSize: UI_SCALE * 17,
                title: 'Simply create your first goal!',
                lineHeight: 18,
                marginTop: 10,
            },
            renderButton: false,
            buttonStyle: undefined,
            marginButtonTop: undefined,
            thirdText: undefined,
            buttonText: undefined,
            handleButtonPress: undefined,
        },

        {
            _id: 4,
            image: BronzeBadge,
            show: false,
            mainHeadingView: {
                justifyContent: 'space-between',
                flex: 1,
                width: '65%',
                height: '100%',
                margin: 0,
                padding: 0,
            },

            mainHeading: {
                fontSize: UI_SCALE * 16,
                title: 'You’re 1 friend away from earning your Bronze Badge.',
                lineheight: 18,
            },
            smallHeading: {
                fontSize: UI_SCALE * 15,
                title:
                    'Invite friends so they can appreciate knowing your goals!',
                lineheight: 17,
            },
            renderButton: true,
            marginButtonTop: undefined,
            thirdText: undefined,
            buttonText: 'Invite your Friends',
            handleButtonPress: () => {
                this.openInviteFriendModal()
                // track(E.INVITE_FRIENDS_OPEN)
            },
        },
        {
            _id: 5,
            image: SilverBadge,
            show: false,
            mainHeadingView: {
                flex: 1,
                width: '65%',
                height: '100%',
                margin: 0,
                padding: 0,
            },

            mainHeading: {
                fontSize: UI_SCALE * 16,
                title: '',
                lineheight: 21,
                marginTop: 2,
            },
            smallHeading: undefined,
            renderButton: true,
            thirdText: undefined,
            marginButtonTop: 10,
            buttonText: 'Invite your Friends',
            handleButtonPress: () => this.openInviteFriendModal(),
        },

        {
            _id: 6,
            image: GoldBadge,
            show: false,
            mainHeadingView: {
                justifyContent: 'space-between',
                flex: 1,
                width: '65%',
                height: '100%',
                margin: 0,
                padding: 0,
            },

            mainHeading: {
                fontSize: UI_SCALE * 16,
                title: 'You know what would look great next to your name?',
                lineheight: 18,
            },
            smallHeading: {
                fontSize: UI_SCALE * 15,
                title: 'The shining Gold Badge!',
                lineheight: 17,
            },
            renderButton: false,
            marginButtonTop: undefined,
            thirdText: `You only need 1 more friends with Silver Badges to earn your Gold Badge.`,
            buttonText: undefined,
            handleButtonPress: undefined,
        },

        {
            _id: 7,
            image: FriendsView,
            show: false,
            mainHeadingView: {
                justifyContent: 'space-between',
                flex: 1,
                width: '65%',
                height: '100%',
                margin: 0,
                padding: 0,
            },

            mainHeading: {
                fontSize: UI_SCALE * 16,
                title: `You haven’t seen profile yet.`,
                lineheight: 18,
            },
            smallHeading: {
                fontSize: UI_SCALE * 15,
                title: 'How about leaving a memorable comment?',
                lineheight: 17,
            },
            renderButton: true,
            marginButtonTop: undefined,
            thirdText: undefined,
            buttonText: 'View Profile',
            handleButtonPress: undefined,
            // this.props.openProfile(this.props.friendsProfileToVisit[0]._id),
        },

        {
            _id: 8,
            image: CloseFriends,
            show: false,
            mainHeadingView: {
                justifyContent: 'space-between',
                flex: 1,
                width: '65%',
                height: '100%',
                margin: 0,
                padding: 0,
                marginHorizontal: 10,
            },

            mainHeading: {
                fontSize: UI_SCALE * 16,
                title: `You haven’t checked out goals in while.`,
                lineheight: 18,
            },
            smallHeading: {
                fontSize: UI_SCALE * 15,
                title:
                    'Leave a thoughtful comment to supercharge your friendship.',
                lineheight: 17,
            },
            renderButton: true,
            marginButtonTop: undefined,
            thirdText: undefined,
            buttonText: 'View profile',
            handleButtonPress: undefined,
            // this.props.openProfile(this.props.friendToVisitWhile[0]._id),
        },
    ]

    handleToastCarousel = () => {
        let updatedData = this.TOAST_DATA.filter((toast) => {
            switch (toast._id) {
                case 1: {
                    if (this.props.showImageToast) {
                        return toast
                    } else {
                        return null
                    }
                }
                case 2: {
                    if (this.props.showGreenBadge) {
                        return toast
                    } else {
                        return null
                    }
                }
                case 3: {
                    if (this.props.showGetGreenBadge) {
                        return toast
                    } else {
                        return null
                    }
                }
                case 4: {
                    if (this.props.showGetBronzeBadge) {
                        return toast
                    } else {
                        return null
                    }
                }
                case 5: {
                    if (
                        this.props.showGetSilverBadge.silverBadgeContent !== ''
                    ) {
                        toast.mainHeading.title = `${this.props.showGetSilverBadge?.silverBadgeContent}`

                        return toast

                        // let shuffledArray = underscore.shuffle(alternatingText)
                        // toast.mainHeading.title = `${shuffledArray[0]}`
                        // return toast
                    } else {
                        return null
                    }
                }
                case 6: {
                    if (
                        this.props.showGetGoldBadge.toShow &&
                        this.props.friendsWithBronzeBadge < 10
                    ) {
                        toast.thirdText = `You only need ${
                            10 - this.props.friendsWithBronzeBadge
                        } more friends with Silver Badges to earn your Gold Badge.`
                        return toast
                    } else {
                        return null
                    }
                }
                case 7: {
                    if (this.props.friendsProfileToVisit.length > 0) {
                        toast.mainHeading.title = `You haven’t seen ${
                            this.props.friendsProfileToVisit.length == 0
                                ? null
                                : this.props.friendsProfileToVisit[0]?.name
                        }’s profile yet.`
                        toast.handleButtonPress = () => {
                            this.props.openProfile(
                                this.props.friendsProfileToVisit[0]?._id
                            )
                            this.props.getToastsData()
                            // this.props.refreshActivityFeed()
                        }

                        return toast
                    } else {
                        return null
                    }
                }
                case 8: {
                    if (
                        this.props.closeFriendsToVisit &&
                        this.props.closeFriendsToVisit.length > 0
                    ) {
                        toast.mainHeading.title = `You haven’t checked out ${
                            this.props?.friendToVisitWhile?.length == 0
                                ? null
                                : this.props.friendToVisitWhile[0].name
                        }’s goals in while.`
                        toast.handleButtonPress = () => {
                            this.props.openProfile(
                                this.props.friendsProfileToVisit[0]._id
                            )
                            this.props.getToastsData()

                            // this.props.refreshActivityFeed()
                        }

                        return toast
                    }
                }
                default:
                    return null
            }
        })

        this.setState({ toastsData: updatedData })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            this.handleToastCarousel()
        }

        // if (!_.isEqual(prevProps, this.props)) {
        //     this.props.getToastsData()
        // }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log('THISS IS STATE', nextProps == nextState)
    // }

    componentDidMount() {
        this.props.getToastsData()

        const { userId } = this.props
        const pageId = this.props.refreshProfileData(userId)
        pageAb = pageId
    }

    openInviteFriendModal = () => {
        this.setState({ showInviteFriendModal: true })
    }

    closeInviteFriendModal = () => {
        this.setState({ showInviteFriendModal: false })
    }

    _renderItem({ item }) {
        return <ToastCard item={item} />
    }

    render() {
        return (
            <View>
                <InviteFriendModal
                    isVisible={this.state.showInviteFriendModal}
                    closeModal={this.closeInviteFriendModal}
                />

                <Carousel
                    ref={(c) => (this.carousel = c)}
                    data={this.state.toastsData}
                    renderItem={this._renderItem}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    containerCustomStyle={styles.carouselContainer}
                    inactiveSlideShift={0}
                    onSnapToItem={(index) => this.setState({ index })}
                    scrollInterpolator={scrollInterpolator}
                    slideInterpolatedStyle={animatedStyles}
                    useScrollView={true}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { user, userId } = state.user
    const { profile } = user
    const { image } = profile
    const { loading } = state.home.mastermind
    const { toastsData } = state.toasts

    // console.log('TOASTT DATA', toastsData)
    const {
        friendsProfileToVisit,
        showImageToast,
        showGreenBadge,
        showGetGreenBadge,
        showGetBronzeBadge,
        showGetSilverBadge,
        showGetGoldBadge,
        friendToVisitWhile,
    } = state.toasts.toastsData
    const { friendsWithBronzeBadge } = showGetGoldBadge

    return {
        profile,
        userId,
        loading,
        image,
        friendsProfileToVisit,
        showImageToast,
        showGetBronzeBadge,
        showGreenBadge,
        showGetGoldBadge,
        showGetSilverBadge,
        showGetGreenBadge,
        friendToVisitWhile,
        toastsData,
        friendsWithBronzeBadge,
    }
}

export default connect(mapStateToProps, {
    openProfileDetailEditForm,
    refreshProfileData,
    openProfile,
    getToastsData,
    refreshActivityFeed,
})(HomeFeedToast)

const styles = StyleSheet.create({
    carouselContainer: {
        marginTop: 10,
        marginBottom: 10,
        right: 10,
    },
    itemContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'dodgerblue',
    },
    itemLabel: {
        color: 'white',
        fontSize: 24,
    },
})
