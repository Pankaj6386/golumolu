/** @format */

import React, { PureComponent } from 'react'
import {
    TouchableOpacity,
    Animated,
    Dimensions,
    View,
    Text,
    Image,
    Alert,
    Platform,
} from 'react-native'
// import { Video as VideoPlayer } from 'expo-av'
import Modal from 'react-native-modal'
import LottieView from 'lottie-react-native'
import ProgressCircle from 'react-native-progress-circle'
import VideoPlayer from 'react-native-media-console'
// import Videosss from 'expo-video-player'
import PlayIcon from '../asset/icons/playVideo.png'
import { text } from '../styles/basic'
import { GM_BLUE, GM_DOT_GRAY } from '../styles/basic/color'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import UPLOADING_LOTTIE from '../asset/image/uploading.json'
import { backToInitialState } from '../reducers/ProfileGoalSwipeReducer'
import Orientation from 'react-native-orientation-locker'

const { width } = Dimensions.get('window')

class VideoPlayerComponent extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            playing: false,
            isVisible: false,
            currentTime: 0, // miliseconds; value interpolated by animation.
            duration: 0,
            trackLayout: {},
            showPercentage: false,
            dotOffset: new Animated.ValueXY(),
            xDotOffsetAtAnimationStart: 0,
            buffering: true,
            fullScreen: false,
            opacity: 0,
            fullScreen: false,
        }
        this.isInitialized = false

        // Important:
        // this.state.dotOffset.x is the actual offset
        // this.state.dotOffset.x._value is the offset from the point where the animation started
        // However, since this.state.dotOffset.x is an object and not a value, it is difficult
        // to compare it with other numbers. Therefore, the const currentOffsetX is used.
        // To print all attributes of the object see https://stackoverflow.com/questions/9209747/printing-all-the-hidden-properties-of-an-object
        // this._panResponder = PanResponder.create({
        //     onMoveShouldSetResponderCapture: () => true,
        //     onMoveShouldSetPanResponderCapture: () => true,
        //     onPanResponderGrant: async (e, gestureState) => {
        //         if (this.state.playing) {
        //             await this.pause()
        //         }
        //         await this.setState({
        //             xDotOffsetAtAnimationStart: this.state.dotOffset.x._value,
        //         })
        //         await this.state.dotOffset.setOffset({
        //             x: this.state.dotOffset.x._value,
        //         })
        //         await this.state.dotOffset.setValue({ x: 0, y: 0 })
        //     },
        //     onPanResponderMove: (e, gestureState) => {
        //         Animated.event([
        //             null,
        //             { dx: this.state.dotOffset.x, dy: this.state.dotOffset.y },
        //         ])(e, gestureState)
        //     },
        //     onPanResponderTerminationRequest: () => false,
        //     onPanResponderTerminate: async (evt, gestureState) => {
        //         // Another component has become the responder, so this gesture is cancelled.

        //         const currentOffsetX =
        //             this.state.xDotOffsetAtAnimationStart +
        //             this.state.dotOffset.x._value
        //         if (
        //             currentOffsetX < 0 ||
        //             currentOffsetX > this.state.trackLayout.width
        //         ) {
        //             await this.state.dotOffset.setValue({
        //                 x: -this.state.xDotOffsetAtAnimationStart,
        //                 y: 0,
        //             })
        //         }
        //         await this.state.dotOffset.flattenOffset()
        //         await this.mapAudioToCurrentTime()
        //     },
        //     onPanResponderRelease: async (e, { vx }) => {
        //         const currentOffsetX =
        //             this.state.xDotOffsetAtAnimationStart +
        //             this.state.dotOffset.x._value
        //         if (
        //             currentOffsetX < 0 ||
        //             currentOffsetX > this.state.trackLayout.width
        //         ) {
        //             await this.state.dotOffset.setValue({
        //                 x: -this.state.xDotOffsetAtAnimationStart,
        //                 y: 0,
        //             })
        //         }
        //         await this.state.dotOffset.flattenOffset()
        //         await this.mapAudioToCurrentTime()
        //     },
        // })
    }

    // mapAudioToCurrentTime = async () => {
    //     await this.soundObject.setPositionAsync(this.state.currentTime)
    // }

    async componentDidMount() {
        this.videoObject = new VideoPlayer()
        await this.videoObject.loadAsync(this.props.source)
        const status = await this.videoObject.getStatusAsync()
        this.setState({ duration: status['durationMillis'] })
    }

    componentWillUnmount() {
        const unMountAudio = async () => {
            this.videoObject && (await this.videoObject.unloadAsync())
        }
        unMountAudio()
    }

    onLoadStart = () => {
        this.setState({ opacity: 1 })
    }

    onLoad = () => {
        this.setState({ opacity: 0 })
    }

    onBuffer = ({ isBuffering }) => {
        this.setState({ opacity: isBuffering ? 1 : 0 })
    }

    fullScreen = () => {
        if (this.state.fullScreen) {
            Orientation.lockToPortrait()
        } else {
            Orientation.lockToLandscape()
        }
        this.setState({ fullScreen: !this.state.fullScreen })
    }

    render() {
        const { source, chatView, selfUser } = this.props

        let showProgrss = source.split('CommentVideo/')[1]
        let showChatProgrss = source.split('ChatVideo/')[1]

        // console.log('videoUploadedFor 2', `${source}/playlist.m3u8.png`)
        // console.log('uploaded', uploaded)
        const videoRef = React.createRef(null)
        return (
            <>
                {chatView ? (
                    <>
                        {/* <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                position: 'absolute',
                                bottom: 110,
                                left: 80,
                                zIndex: 5,
                            }}
                            onPress={() => this.setState({ isVisible: true })}
                        >
                            <Image
                                source={PlayIcon}
                                resizeMode="contain"
                                style={{
                                    width: 40,
                                    height: 40,
                                }}
                            />
                        </TouchableOpacity>
                        <VideoPlayer
                            ref={videoRef}
                            source={{ uri: `${source}/playlist.m3u8` }}
                            style={{
                                height: 250,
                                width: 200,
                            }}
                            resizeMode="contain"
                            onPlaybackStatusUpdate={(status) =>
                                this.setState({ status })
                            }
                        /> */}
                        <View
                            style={{
                                height: 150,
                                width: 250,
                                marginVertical: 10,
                                marginLeft: 0,
                                backgroundColor: GM_DOT_GRAY,
                                borderRadius: 5,
                            }}
                        >
                            <Image
                                source={{
                                    uri: `${source}/playlist.m3u8.png`,
                                }}
                                style={{
                                    width: '100%',
                                    height: '105%',
                                    borderRadius: 5,
                                }}
                                defaultSource={
                                    Platform.OS === 'ios'
                                        ? require('../asset/image/default_image.png')
                                        : null
                                }
                            />

                            {this.props.chatVideoStatus.map(
                                ({
                                    progress,
                                    uploadedFor,
                                    uploaded,
                                    userId,
                                    videoUploading,
                                }) => {
                                    if (
                                        uploadedFor === showChatProgrss &&
                                        uploaded
                                    ) {
                                        return (
                                            <>
                                                {!videoUploading ? (
                                                    <ProgressCircle
                                                        // key={index}
                                                        percent={progress}
                                                        outerCircleStyle={{
                                                            flexDirection:
                                                                'row',
                                                            position:
                                                                'absolute',
                                                            bottom: 55,
                                                            left: 100,
                                                            zIndex: 5,
                                                        }}
                                                        radius={25}
                                                        borderWidth={4}
                                                        color={GM_BLUE}
                                                        shadowColor={
                                                            GM_DOT_GRAY
                                                        }
                                                        bgColor="#fff"
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 11,
                                                                fontFamily:
                                                                    text
                                                                        .FONT_FAMILY
                                                                        .MEDIUM,
                                                            }}
                                                        >
                                                            {`${progress}%`}
                                                        </Text>
                                                    </ProgressCircle>
                                                ) : (
                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                'row',
                                                            position:
                                                                'absolute',

                                                            left: 100,
                                                            top: 30,
                                                        }}
                                                    >
                                                        <LottieView
                                                            style={{
                                                                height: hp(14),
                                                            }}
                                                            loop={false}
                                                            autoPlay
                                                            autoSize
                                                            source={
                                                                UPLOADING_LOTTIE
                                                            }
                                                        />
                                                    </View>
                                                )}
                                            </>
                                        )
                                    } else if (!uploaded) {
                                        return (
                                            <>
                                                <TouchableOpacity
                                                    style={{
                                                        flexDirection: 'row',
                                                        position: 'absolute',
                                                        bottom: 60,
                                                        left: 105,
                                                        zIndex: 5,
                                                    }}
                                                    onPress={() =>
                                                        this.setState({
                                                            isVisible: true,
                                                        })
                                                    }
                                                >
                                                    <Image
                                                        source={PlayIcon}
                                                        resizeMode="contain"
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </>
                                        )
                                    }
                                }
                            )}
                        </View>
                    </>
                ) : (
                    <>
                        <View
                            style={{
                                height: 150,
                                width: 310,
                                marginVertical: 10,
                                marginLeft: 0,
                            }}
                        >
                            <Image
                                source={{
                                    uri: `${source}/playlist.m3u8.png`,
                                }}
                                style={{
                                    width: '95%',
                                    height: '105%',
                                    borderRadius: 5,
                                }}
                                defaultSource={
                                    Platform.OS === 'ios'
                                        ? require('../asset/image/default_image.png')
                                        : null
                                }
                            />
                            {this.props.videoStatus?.map(
                                ({
                                    progress,
                                    uploadedFor,
                                    uploaded,
                                    userId,
                                    videoUploading,
                                }) => {
                                    if (
                                        uploadedFor === showProgrss &&
                                        uploaded
                                    ) {
                                        return (
                                            <>
                                                {!videoUploading ? (
                                                    <ProgressCircle
                                                        // key={index}
                                                        percent={progress}
                                                        outerCircleStyle={{
                                                            flexDirection:
                                                                'row',
                                                            position:
                                                                'absolute',
                                                            bottom: 55,
                                                            left: 135,
                                                            zIndex: 5,
                                                        }}
                                                        radius={25}
                                                        borderWidth={4}
                                                        color={GM_BLUE}
                                                        shadowColor={
                                                            GM_DOT_GRAY
                                                        }
                                                        bgColor="#fff"
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 11,
                                                                fontFamily:
                                                                    text
                                                                        .FONT_FAMILY
                                                                        .MEDIUM,
                                                            }}
                                                        >
                                                            {`${progress}%`}
                                                        </Text>
                                                    </ProgressCircle>
                                                ) : (
                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                'row',
                                                            position:
                                                                'absolute',

                                                            left: 100,
                                                            top: 30,
                                                        }}
                                                    >
                                                        <LottieView
                                                            style={{
                                                                height: hp(14),
                                                            }}
                                                            loop={false}
                                                            autoPlay
                                                            autoSize
                                                            source={
                                                                UPLOADING_LOTTIE
                                                            }
                                                        />
                                                    </View>
                                                )}
                                            </>
                                        )
                                    } else if (!uploaded) {
                                        return (
                                            <>
                                                <TouchableOpacity
                                                    style={{
                                                        flexDirection: 'row',
                                                        position: 'absolute',
                                                        bottom: 60,
                                                        left: 140,
                                                    }}
                                                    onPress={() =>
                                                        this.setState({
                                                            isVisible: true,
                                                        })
                                                    }
                                                >
                                                    <Image
                                                        source={PlayIcon}
                                                        resizeMode="contain"
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </>
                                        )
                                    }
                                }
                            )}

                            {/* <VideoPlayer
                                    ref={videoRef}
                                    source={{ uri: source }}
                                    style={{
                                        height: 150,
                                        width: 310,
                                        borderRadius: 5,
                                    }}
                                    resizeMode="cover"
                                    onPlaybackStatusUpdate={(status) =>
                                        this.setState({ status })
                                    }
                                /> */}
                        </View>
                        {/* </ImageBackground> */}
                    </>
                )}
                <Modal
                    backdropColor={'transparent'}
                    isVisible={this.state.isVisible}
                    backdropOpacity={1}
                    animationInTiming={600}
                    animationIn={'fadeIn'}
                    onSwipeComplete={() => this.setState({ isVisible: false })}
                    swipeDirection="down"
                    deviceWidth={width}
                    style={{
                        padding: 0,
                        margin: 0,
                        backgroundColor: 'black',
                    }}
                >
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        {/* <VideoPlayer
                            ref={videoRef}
                            source={{
                                uri:
                                    'https://goalmogul-v1.s3.us-west-2.amazonaws.com/ChatVideo/8f586f53-8490-49d0-b70f-14a7740f278e/index.m3u8',
                            }}
                            style={{
                                height: 1000,
                                width: 1000,
                            }}
                            resizeMode="cover"
                            useNativeControls
                            onPlaybackStatusUpdate={(status) => {
                                console.log('STATUUSSS', status)
                            }}
                        /> */}
                        {/* <View style={styles.fullScreen}> */}
                        {/* <Video
                            source={{
                                uri: `${source}/playlist.m3u8`,
                                isNetwork: true,
                                type: '',
                            }}
                            poster={`${source}/playlist.m3u8.png`}
                            ref={videoRef}
                            onBuffer={this.onBuffer}
                            onLoadStart={this.onLoadStart}
                            onLoad={this.onLoad}
                            onError={(err) => {
                                Alert.alert(
                                    'Video cannot be played. Please try back later'
                                )
                            }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                            }}
                            fullscreen={this.fullScreen}
                            resizeMode={'contain'}
                            paused={false}
                            controls={true}
                            ignoreSilentSwitch={'ignore'}
                        /> */}

                        <VideoPlayer
                            source={{
                                uri: this.props.reminderVideo
                                    ? source
                                    : `${source}/playlist.m3u8`,
                            }}
                            containerStyle={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                            }}
                            onBack={() => this.setState({ isVisible: false })}
                            onError={(err) => {
                                console.log('ERRROR', err)
                                Alert.alert(
                                    'Error Playing video!',
                                    'Video is in uploading process right now. Please try back later',
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () =>
                                                this.setState({
                                                    isVisible: false,
                                                }),
                                        },
                                    ]
                                )
                            }}
                            rewindTime={5}
                            seekColor={GM_BLUE}
                            // showOnEnd={true}
                            showDuration={true}
                            disableFullscreen
                            disableVolume
                            isFullscreen
                            // onSeek={(data) => console.log('onSeek', data)}
                            controls={true}
                            ignoreSilentSwitch={'ignore'}
                            controlAnimationTiming={300}
                            videoRef={videoRef}
                            // toggleResizeModeOnFullscreen={false}
                        />

                        {/* </View> */}
                        {/* <Videosss
                            videoProps={{
                                shouldPlay: true,
                                resizeMode: Videosss.RESIZE_MODE_CONTAIN,
                                source: {
                                    uri: source,
                                },
                            }}
                            style={{
                                // videoBackgroundColor: 'transparent',
                                // controlsBackgroundColor: 'transparent',
                                flex: 0.8,
                            }}
                            fullscreen={{
                                visible: false,
                            }}
                            activityIndicator={{
                                color: color.GM_BLUE,
                                size: 'large',
                            }}
                        /> */}
                    </View>
                </Modal>
            </>
        )
    }
}

// const styles = StyleSheet.create({
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'black',
//     },
//     fullScreen: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         bottom: 0,
//         right: 0,
//     },
//     fullscreenVideo: {
//         backgroundColor: 'black',
//         ...StyleSheet.absoluteFill,
//         elevation: 1,
//     },
// })

const mapStateToProps = (state) => {
    const videoStatus = state.goalSwiper.videoProgress
    const chatVideoStatus = state.goalSwiper.chatVideoProgress
    const selfUser = state.user.userId

    return {
        videoStatus,
        selfUser,
        chatVideoStatus,
    }
}

export default connect(mapStateToProps, {
    backToInitialState,
})(VideoPlayerComponent)
