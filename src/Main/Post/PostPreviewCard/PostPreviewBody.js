/** @format */

import React from 'react'
import {
    View,
    Dimensions,
    ImageBackground,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
    Text,
    Platform,
} from 'react-native'
import _ from 'lodash'

import { switchCase, isSharedPost } from '../../../redux/middleware/utils'
import LottieView from 'lottie-react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import UPLOADING_LOTTIE from '../../../asset/image/uploading.json'

// Components
import ImageModal from '../../Common/ImageModal'
import ProgressCircle from 'react-native-progress-circle'

// Assets
import RefPreview from '../../Common/RefPreview'

// Styles

import { IMAGE_BASE_URL } from '../../../Utils/Constants'
import playVideo from '../../../asset/icons/playVideo.png'
import SparkleBadgeView from '../../Gamification/Badge/SparkleBadgeView'
import GoalCard from '../../Goal/GoalCard/GoalCard'
import PostPreviewCard from './PostPreviewCard'
import ShareCard from '../../Common/Card/ShareCard'
import { default_style, text } from '../../../styles/basic'
// import ScaledImage from '../../../components/ScaledImage'

import { GM_BLUE, GM_DOT_GRAY } from '../../../styles/basic/color'
import { connect } from 'react-redux'

// Constants
const DEBUG_KEY = '[ UI PostPreviewCard.PostPreviewBody ]'
const { width } = Dimensions.get('window')

class PostPreviewBody extends React.Component {
    constructor(props) {
        super(props)
        this.player = React.createRef()
        this.state = {
            mediaModal: false,
            status: {
                isBuffering: true,
            },
        }
    }

    // Current media type is only picture
    renderPostImage(url, type) {
        // TODO: update this to be able to load image
        if (!url) {
            return null
        }
        const imageUrl = `${IMAGE_BASE_URL}${url}`
        return (
            <TouchableWithoutFeedback
                activeOpacity={1}
                onPress={() => this.setState({ mediaModal: true })}
            >
                <View style={{ marginTop: 8 }}>
                    {/*<ImageBackground*/}
                    {/*    style={{*/}
                    {/*        ...styles.mediaStyle,*/}
                    {/*        ...imagePreviewContainerStyle,*/}
                    {/*        borderRadius: 8,*/}
                    {/*        backgroundColor: 'black',*/}
                    {/*    }}*/}
                    {/*    source={{ uri: imageUrl }}*/}
                    {/*    imageStyle={{*/}
                    {/*        borderRadius: 8,*/}
                    {/*        opacity: 0.8,*/}
                    {/*        resizeMode: 'contain',*/}
                    {/*    }}*/}
                    {/*/>*/}
                    {/* <ScaledImage uri={imageUrl} width={width - 24} /> */}
                    {this.renderPostImageModal(imageUrl, type)}
                </View>
            </TouchableWithoutFeedback>
        )
    }

    renderPostVideo(url, type) {
        // TODO: update this to be able to load image
        // TODO: update this to be able to load image
        if (!url) {
            return null
        }
        const videoUrl = `${IMAGE_BASE_URL}${url}/playlist.m3u8`
        const videoUrlThumbnail = `${IMAGE_BASE_URL}${url}/playlist.m3u8.png`
        const checkTranscodedVideo = url.split('FeedVideo/')[1]

        return (
            <View activeOpacity={1} style={{ marginTop: 8 }}>
                <View
                    style={{
                        zIndex: 2,
                        position: 'absolute',
                        alignSelf: 'center',
                        top: width / 5,
                    }}
                >
                    {this.props?.postVideoStatus?.map(
                        ({
                            progress,
                            uploadedFor,
                            uploaded,
                            userId,
                            videoUploading,
                        }) => {
                            if (
                                uploadedFor === checkTranscodedVideo &&
                                videoUploading
                            ) {
                                return (
                                    <>
                                        {videoUploading ? (
                                            <ProgressCircle
                                                // key={index}
                                                percent={progress}
                                                outerCircleStyle={{
                                                    flexDirection: 'row',
                                                    position: 'absolute',
                                                    zIndex: 5,
                                                }}
                                                radius={25}
                                                borderWidth={4}
                                                color={GM_BLUE}
                                                shadowColor={GM_DOT_GRAY}
                                                bgColor="#fff"
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 11,
                                                        fontFamily:
                                                            text.FONT_FAMILY
                                                                .MEDIUM,
                                                    }}
                                                >
                                                    {`${progress}%`}
                                                </Text>
                                            </ProgressCircle>
                                        ) : (
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    position: 'absolute',

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
                                                    source={UPLOADING_LOTTIE}
                                                />
                                            </View>
                                        )}
                                    </>
                                )
                            } else if (!videoUploading) {
                                return (
                                    <>
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.setState({
                                                    mediaModal: true,
                                                })
                                            }
                                        >
                                            <Image
                                                source={playVideo}
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </>
                                )
                            }
                        }
                    )}
                </View>
                <View
                    style={{
                        ...styles.mediaStyle,
                        borderRadius: 8,
                        backgroundColor: GM_DOT_GRAY,
                    }}
                >
                    <Image
                        source={{ uri: videoUrlThumbnail }}
                        style={{
                            resizeMode: 'cover',
                            height: width / 1.8,
                            borderRadius: 8,
                            width: '100%',
                        }}
                        defaultSource={
                            Platform.OS === 'ios'
                                ? require('../../../asset/image/default_image.png')
                                : null
                        }
                    />
                </View>

                {/* <Video
                    ref={this.player}
                    style={{
                        ...styles.mediaStyle,
                        ...imagePreviewContainerStyle,
                        borderRadius: 8,
                        backgroundColor: 'black',
                        zIndex: 1,
                    }}
                    source={{ uri: `${videoUrl}` }}
                    useNativeControls={false}
                    resizeMode="cover"
                    isLooping
                    shouldPlay
                    isMuted={true}
                    onPlaybackStatusUpdate={(status) => {
                        console.log('STATAUSSS', status)
                        this.setState({ status })
                    }}
                /> */}
                {this.renderPostImageModal(videoUrl, type)}
            </View>
        )
    }

    renderPostImageModal(imageUrl, type) {
        return (
            <ImageModal
                mediaRef={imageUrl}
                mediaModal={this.state.mediaModal}
                closeModal={() => this.setState({ mediaModal: false })}
                type={type}
            />
        )
    }

    renderBadgeEarnImage(milestoneIdentifier) {
        return (
            <SparkleBadgeView
                containerStyle={{ marginTop: 8 }}
                milestoneIdentifier={milestoneIdentifier}
                onPress={this.props.openCardContent}
            />
        )
    }

    renderUpdateAttachments(item) {
        const { belongsToGoalStoryline, mediaRef } = item
        let isVideo = mediaRef?.startsWith('FeedVideo/')
        const showGoalRefCard = _.get(belongsToGoalStoryline, 'goalRef', false)
        return (
            <View>
                {isVideo
                    ? this.renderPostVideo(mediaRef, 'video')
                    : this.renderPostImage(mediaRef, 'image')}
                {showGoalRefCard && [
                    <Text
                        style={[
                            default_style.normalText_2,
                            { marginTop: 12, marginBottom: 4 },
                        ]}
                    >
                        Attached
                    </Text>,
                    <ShareCard
                        goalRef={
                            belongsToGoalStoryline.goalRef._id ||
                            belongsToGoalStoryline.goalRef
                        }
                        containerStyle={{ width: '100%' }}
                    />,
                ]}
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return null

        const { postType } = item
        if (!isSharedPost(postType)) {
            const milestoneIdentifier = _.get(
                item,
                'milestoneCelebration.milestoneIdentifier'
            )
            if (milestoneIdentifier !== undefined) {
                return this.renderBadgeEarnImage(milestoneIdentifier)
            }
            return this.renderUpdateAttachments(item)
        }

        if (this.props.showRefPreview === false) return null
        console.log('DIE ALONE', { item: item, postType: postType })
        const previewItem = switchItem(item, postType)
        // const previewItem = item.postRef || item.goalRef || item.userRef;
        if (postType === 'ShareGoal') {
            return (
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: '#F2F2F2',
                        borderRadius: 5,
                        marginTop: 8,
                    }}
                >
                    <GoalCard item={previewItem} isSharedItem={true} />
                </View>
            )
        }

        if (postType === 'SharePost') {
            return (
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: '#F2F2F2',
                        marginTop: 8,
                    }}
                >
                    <PostPreviewCard
                        item={previewItem}
                        hasCaret={false}
                        isSharedItem={true}
                    />
                </View>
            )
        }

        return (
            <View style={{ marginTop: 8 }}>
                <RefPreview
                    item={previewItem}
                    postType={postType}
                    goalRef={item.goalRef}
                />
            </View>
        )
    }
}

const styles = {
    // Post image and modal style
    postImageStyle: {
        width,
        height: width / 2,
    },
    cancelIconStyle: {
        height: 20,
        width: 20,
        justifyContent: 'flex-end',
    },
    mediaStyle: {
        height: width / 1.8,
    },
}

const switchItem = (item, postType) =>
    switchCase({
        ShareNeed: getNeedFromRef(item.goalRef, item.needRef),
        ShareGoal: item.goalRef,
        SharePost: item.postRef,
        ShareUser: item.userRef,
        ShareStep: getStepFromGoal(item.goalRef, item.stepRef),
        GoalStorylineUpdate: item.belongsToGoalStoryline.goalRef,
    })('ShareGoal')(postType)

const getStepFromGoal = (goal, stepRef) =>
    getItemFromGoal(goal, 'steps', stepRef)

const getNeedFromRef = (goal, needRef) =>
    getItemFromGoal(goal, 'needs', needRef)

const getItemFromGoal = (goal, type, ref) => {
    let ret
    if (goal) {
        _.get(goal, `${type}`).forEach((item) => {
            if (item._id === ref) {
                ret = item
            }
        })
    }
    return ret
}

const mapStateToProps = (state) => {
    const { userId } = state.user
    const postVideoStatus = state.goalSwiper.feedPostVideoProgress

    return {
        userId,
        postVideoStatus,
    }
}
export default connect(mapStateToProps, null)(PostPreviewBody)
