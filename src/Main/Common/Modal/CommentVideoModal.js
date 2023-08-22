/** @format */

import React, { Component } from 'react'
import { Text, View, TextInput } from 'react-native'

import Modal from 'react-native-modal'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import { color, text } from '../../../styles/basic'
import OnboardingStyles from '../../../styles/Onboarding'
import VideoPlayer from 'expo-video-player'
// import Video from 'react-native-video'
import { Video } from 'expo-av'
import { GOALS_STYLE, PRIORTY_PILL_STYLES } from '../../../styles/Goal'
import DelayedButton from '../Button/DelayedButton'
import { backToInitialState } from '../../../reducers/ProfileGoalSwipeReducer'
import { sendVideoMessage } from '../../../redux/modules/feed/comment/CommentActions'
import UPLOADING_LOTTIE from '../../../asset/image/uploading_1.json'
import LottieView from 'lottie-react-native'
import Constants from 'expo-constants'

import { openGoalDetail } from '../../../redux/modules/home/mastermind/actions'
import { Icon } from '@ui-kitten/components'
import timeago from 'timeago.js'
import { PRIVACY_OPTIONS } from '../../../Utils/Constants'
import LoadingModal from '../../Common/Modal/LoadingModal'

const { text: textStyle, button: buttonStyle } = OnboardingStyles

let privacyName = ''

class CommentVideoModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            video: '',
            status: {},
            videoName: '',
            selected: '',
            isLoading: true,
            loadingModal: false,
            loading: false,
        }
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState) {}

    changeColor = (id) => {
        this.setState({ selected: id })
    }

    render() {
        const { videoUri, pageId, goalDetail } = this.props
        const PRIORTY_PILL_STYLE =
            PRIORTY_PILL_STYLES[((goalDetail.goalRef.priority || 1) - 1) % 10]

        const privacyObj = PRIVACY_OPTIONS.find(
            ({ value }) => value === goalDetail.goalRef.privacy
        )
        const timeStamp =
            goalDetail.goalRef.created === undefined ||
            goalDetail.goalRef.created.length === 0
                ? new Date()
                : goalDetail.goalRef.created

        privacyName = privacyObj.text

        return (
            <>
                <Modal
                    // isVisible={true}
                    isVisible={this.props.isVisible}
                    animationIn="slideInUp"
                    onSwipeComplete={() => {
                        this.props.onClose()
                    }}
                    swipeDirection="down"
                    animationInTiming={400}
                    onBackdropPress={() => this.props.onClose()}
                    style={{
                        marginTop: Constants.statusBarHeight + 15,
                        borderRadius: 15,
                        margin: 0,
                    }}
                    // coverScreen={true}
                >
                    {this.state.loading ? (
                        <LoadingModal visible={true}>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                }}
                            >
                                <LottieView
                                    style={{
                                        height: hp(8),
                                        marginTop: 2,
                                        alignSelf: 'center',
                                    }}
                                    source={UPLOADING_LOTTIE}
                                    autoPlay
                                    loop
                                />
                            </View>
                        </LoadingModal>
                    ) : (
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                // justifyContent: 'center',
                            }}
                        >
                            <View
                                style={{
                                    width: wp('100%'),

                                    backgroundColor: color.GV_MODAL,
                                    // height: hp('50%'),
                                    borderRadius: 5,
                                    position: 'absolute',
                                    bottom: 0,
                                }}
                            >
                                <View
                                    style={{
                                        marginVertical: 5,
                                        width: 35,
                                        height: 3.5,
                                        borderRadius: 5,
                                        alignSelf: 'center',
                                        backgroundColor: 'lightgray',
                                    }}
                                />

                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: '#333333',
                                            marginTop: 10,
                                        }}
                                    >
                                        {goalDetail.goalRef.category} |{' '}
                                        {timeago().format(timeStamp)}
                                    </Text>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: 7,
                                        }}
                                    >
                                        <View
                                            style={[
                                                GOALS_STYLE.commonPillContainer,
                                                {
                                                    borderWidth: 0.25,

                                                    borderColor:
                                                        color.GM_MID_GREY,
                                                },
                                            ]}
                                        >
                                            <Icon
                                                pack="material-community"
                                                name={
                                                    privacyObj.materialCommunityIconName
                                                }
                                                style={[
                                                    GOALS_STYLE.commonPillIcon,
                                                ]}
                                            />
                                            <Text
                                                style={[
                                                    GOALS_STYLE.commonPillText,
                                                ]}
                                            >
                                                {goalDetail.goalRef.privacy}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                GOALS_STYLE.commonPillContainer,
                                                {
                                                    width:
                                                        GOALS_STYLE.priorityPillWidth,
                                                    backgroundColor:
                                                        PRIORTY_PILL_STYLE.backgroundColor,
                                                    borderColor:
                                                        PRIORTY_PILL_STYLE.color,
                                                    borderWidth: 0.25,

                                                    marginLeft: 8,
                                                },
                                            ]}
                                        >
                                            <Icon
                                                pack="material-community"
                                                name={
                                                    PRIORTY_PILL_STYLE.materialCommunityIconName
                                                }
                                                style={[
                                                    GOALS_STYLE.commonPillIcon,
                                                    {
                                                        tintColor:
                                                            PRIORTY_PILL_STYLE.color,
                                                    },
                                                ]}
                                            />
                                            <Text
                                                style={[
                                                    GOALS_STYLE.commonPillText,
                                                    {
                                                        color:
                                                            PRIORTY_PILL_STYLE.color,
                                                    },
                                                ]}
                                            >
                                                {goalDetail.goalRef.priority}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Text
                                    style={{
                                        padding: 10,
                                        fontFamily: text.FONT_FAMILY.REGULAR,
                                        fontSize: 17,
                                        marginHorizontal: 10,
                                        lineHeight: 22,
                                    }}
                                >
                                    {goalDetail?.goalRef?.title}
                                </Text>

                                {/* <View
                                    style={{
                                        padding: 13,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.onClose()
                                            this.props.backToInitialState()
                                        }}
                                        style={{
                                            position: 'absolute',
                                            right: 10,
                                            top: 10,
                                        }}
                                    >
                                        <Entypo
                                            name="cross"
                                            size={25}
                                            color="#4F4F4F"
                                        />
                                    </TouchableOpacity>
                                </View> */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    {/* {privacyOptions.map((options, index) => {
                                        return (
                                            <TouchableOpacity
                                                key={Math.random()
                                                    .toString(36)
                                                    .substr(2, 9)}
                                                onPress={() => {
                                                    this.changeColor(options.id)
                                                }}
                                                disabled={
                                                    this.state.selected ===
                                                    options.id
                                                }
                                            >
                                                <View
                                                    style={[
                                                        GOALS_STYLE.commonPillContainer,
                                                        {
                                                            height: 35,
                                                            borderColor:
                                                                '#828282',
                                                            borderWidth:
                                                                this.state
                                                                    .selected ===
                                                                options.id
                                                                    ? 0.3
                                                                    : 0.23,
                                                            left: 10,
                                                            width: 80,
                                                            marginHorizontal: 3,
                                                            backgroundColor:
                                                                'white',
                                                        },
                                                    ]}
                                                >
                                                    <Icon
                                                        pack="material-community"
                                                        name={options.iconName}
                                                        style={{
                                                            height: 12,
                                                            width: 12,
                                                            tintColor:
                                                                '#828282',
                                                            opacity:
                                                                this.state
                                                                    .selected ===
                                                                options.id
                                                                    ? 1
                                                                    : 0.3,
                                                        }}
                                                    />

                                                    <Text
                                                        style={{
                                                            fontFamily:
                                                                text.FONT_FAMILY
                                                                    .SEMI_BOLD,
                                                            fontSize: 14,
                                                            color: '#828282',
                                                            marginLeft: 5,
                                                            opacity:
                                                                this.state
                                                                    .selected ===
                                                                options.id
                                                                    ? 1
                                                                    : 0.3,
                                                        }}
                                                    >
                                                        {options.title}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })} */}
                                </View>

                                <View
                                    style={{
                                        borderWidth: 0.5,
                                        width: '90%',

                                        alignSelf: 'center',
                                        borderColor: 'lightgrey',
                                    }}
                                />
                                <TextInput
                                    fontSize={17}
                                    style={{
                                        width: '92%',
                                        height: 43,
                                        borderColor: 'black',
                                        borderWidth: 1,
                                        alignSelf: 'center',
                                        padding: 5,
                                        borderRadius: 3,
                                        borderColor: '#828282',
                                        borderTopColor: 'transparent',
                                        borderBottomColor: 'transparent',
                                        borderLeftColor: 'transparent',
                                        borderRightColor: 'transparent',
                                    }}
                                    placeholder="Add a comment with the video!"
                                    placeholderTextColor={'lightgrey'}
                                    onChangeText={(value) =>
                                        this.setState({ videoName: value })
                                    }
                                />

                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <View
                                        style={{
                                            marginTop: 15,
                                            borderRadius: 4, // apply border radius here
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <VideoPlayer
                                            playFromPositionMillis={0}
                                            videoProps={{
                                                shouldPlay: true,
                                                resizeMode:
                                                    Video.RESIZE_MODE_CONTAIN,
                                                source: {
                                                    uri: videoUri,
                                                },
                                            }}
                                            style={{
                                                // videoBackgroundColor: 'transparent',
                                                // controlsBackgroundColor: 'transparent',

                                                height: hp('30%'),
                                                width: wp('95%'),
                                            }}
                                            fullscreen={{
                                                visible: false,
                                            }}
                                            activityIndicator={{
                                                color: color.GM_BLUE,
                                                size: 'large',
                                            }}
                                        />
                                    </View>
                                </View>

                                <View
                                    style={{
                                        justifyContent: 'center',
                                        marginBottom: 15,
                                    }}
                                >
                                    <View
                                        style={{
                                            borderWidth: 0.5,
                                            width: '90%',
                                            marginTop: 20,
                                            alignSelf: 'center',
                                            borderColor: 'lightgrey',
                                        }}
                                    />
                                    {/* <DelayedButton
                                        style={[
                                            buttonStyle.GM_WHITE_BG_BLUE_TEXT
                                                .containerStyle,
                                            ,
                                            {
                                                width: wp('45%'),
                                                marginTop: 20,
                                                backgroundColor:
                                                    'rgba(66, 192, 245, 0.22)',
                                                borderColor:
                                                    'rgba(66, 192, 245, 0.22)',
                                                height: 45,
                                            },
                                        ]}
                                        onPress={() => {
                                            this.props.onClose()
                                            setTimeout(() => {
                                                this.props.onRecordPress()
                                            }, 500)
                                        }}
                                    >
                                        <Text
                                            style={[
                                                buttonStyle
                                                    .GM_WHITE_BG_GRAY_TEXT
                                                    .textStyle,
                                                { color: '#535353' },
                                            ]}
                                        >
                                            Record
                                        </Text>
                                    </DelayedButton> */}

                                    <DelayedButton
                                        style={[
                                            buttonStyle
                                                .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                .containerStyle,
                                            ,
                                            {
                                                width: wp('90%'),
                                                marginTop: 20,
                                                marginBottom: 10,
                                                height: 35,
                                                alignSelf: 'center',
                                            },
                                        ]}
                                        onPress={() => {
                                            this.setState({ loading: true })

                                            this.props.sendVideoMessage(
                                                videoUri,
                                                this.state.videoName,
                                                pageId,
                                                goalDetail.goalRef._id,
                                                () => {
                                                    this.props.onClose()
                                                    setTimeout(() => {
                                                        this.setState({
                                                            loading: false,
                                                        })
                                                        this.props.openGoalDetail(
                                                            goalDetail.goalRef,
                                                            {
                                                                focusType:
                                                                    'comment',
                                                                initialShowSuggestionModal: false,
                                                                initialFocusCommentBox: true,
                                                                initialScrollToComment: true,
                                                                scrollTobottom: true,
                                                            }
                                                        )
                                                    }, 500)
                                                },
                                                'Goal'
                                            )
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily:
                                                    text.FONT_FAMILY.MEDIUM,
                                                color: 'white',
                                                fontSize: 14,
                                                fontWeight: '600',
                                            }}
                                        >
                                            Publish
                                        </Text>
                                    </DelayedButton>
                                </View>
                            </View>
                        </View>
                    )}
                </Modal>
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { goalSwiper } = state
    const { videoUri } = goalSwiper

    return {
        videoUri,
    }
}

export default connect(mapStateToProps, {
    backToInitialState,
    sendVideoMessage,
    openGoalDetail,
})(CommentVideoModal)
