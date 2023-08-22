/** @format */

import React from 'react'
import {
    View,
    Dimensions,
    ImageBackground,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Text,
    Image,
    Platform,
} from 'react-native'
import _ from 'lodash'

// Components
import GoalCardBody from '../Goal/Common/GoalCardBody'
import ImageModal from '../Common/ImageModal'
import RefPreview from '../Common/RefPreview'

// Styles
import { imagePreviewContainerStyle } from '../../styles'
import playVideo from '../../asset/icons/playVideo.png'
import { GM_BLUE, GM_DOT_GRAY } from '../../styles/basic/color'
import ProgressCircle from 'react-native-progress-circle'
import UPLOADING_LOTTIE from '../../asset/image/uploading.json'

// Constants
import { IMAGE_BASE_URL, IS_ZOOMED } from '../../Utils/Constants'
import SparkleBadgeView from '../Gamification/Badge/SparkleBadgeView'
import GoalCard from '../Goal/GoalCard/GoalCard'
import PostPreviewCard from '../Post/PostPreviewCard/PostPreviewCard'
import { isSharedPost } from '../../redux/middleware/utils'
import ShareCard from '../Common/Card/ShareCard'
import { default_style } from '../../styles/basic'
import { connect } from 'react-redux'

const DEBUG_KEY = '[ UI ActivityCard.ActivityBody ]'
const { width } = Dimensions.get('window')

class ActivityBody extends React.Component {
    constructor(props) {
        super(props)
        this.player = React.createRef()
    }
    state = {
        mediaModal: false,
        status: {},
    }

    renderGoalBody(goalRef) {
        const { start, end, steps, needs } = goalRef

        return (
            <GoalCardBody
                containerStyle={{ marginTop: 12 }}
                onPress={this.props.openCardContent}
                startTime={start}
                endTime={end}
                steps={steps}
                needs={needs}
                goalRef={goalRef}
            />
        )
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
                    <ImageBackground
                        style={{
                            ...styles.mediaStyle,
                            ...imagePreviewContainerStyle,
                            borderRadius: 8,
                            backgroundColor: 'black',
                        }}
                        source={{ uri: imageUrl }}
                        imageStyle={{
                            borderRadius: 8,
                            opacity: 0.8,
                            resizeMode: 'cover',
                        }}
                    />
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
                            height: width / 2,
                            borderRadius: 8,
                            width: '100%',
                        }}
                        defaultSource={
                            Platform.OS === 'ios'
                                ? require('../../asset/image/default_image.png')
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

    renderBadgeEarnImage(milestoneIdentifier) {
        return (
            <SparkleBadgeView
                containerStyle={{ marginTop: 8 }}
                milestoneIdentifier={milestoneIdentifier}
                onPress={this.props.openCardContent}
            />
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

    renderUpdateAttachments(item) {
        const { belongsToGoalStoryline, mediaRef } = item
        // console.log('Media red', item)
        let isVideo = mediaRef?.startsWith('FeedVideo/')
        const showGoalRefCard = _.get(belongsToGoalStoryline, 'goalRef', false)
        if (showGoalRefCard) {
            // console.log('ACTIVITY SUMMARY', item, showGoalRefCard)
        }

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

    renderStepsCompleted = () => {
        const { belongsToGoalStoryline, mediaRef } = item
        const showGoalRefCard = _.get(belongsToGoalStoryline, 'goalRef', false)

        return (
            <View>
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

    renderPostBody(postRef) {
        if (!postRef) return null
        const { postType, goalRef, needRef, userRef } = postRef
        if (!isSharedPost(postType)) {
            const milestoneIdentifier = _.get(
                postRef,
                'milestoneCelebration.milestoneIdentifier'
            )
            if (milestoneIdentifier !== undefined) {
                return this.renderBadgeEarnImage(milestoneIdentifier)
            }
            return this.renderUpdateAttachments(postRef)
        }

        let item = goalRef
        if (postType === 'ShareNeed') {
            item = getNeedFromRef(goalRef, needRef)
        }

        // if (postType === 'ShareStep') {
        //     item = getStepFromGoal(goalRef, stepRef)
        // }

        if (postType === 'ShareUser') {
            item = userRef
        }

        if (postType === 'SharePost') {
            item = postRef.postRef
            return (
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: '#F2F2F2',
                        marginTop: 8,
                    }}
                >
                    <PostPreviewCard
                        item={item}
                        hasCaret={false}
                        isSharedItem={true}
                    />
                </View>
            )
        }

        if (postType === 'ShareGoal') {
            return (
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: '#F2F2F2',
                        marginTop: 8,
                    }}
                >
                    <GoalCard item={item} isSharedItem={true} />
                </View>
            )
        }

        return (
            <View style={{ marginTop: 8 }}>
                <RefPreview item={item} postType={postType} goalRef={goalRef} />
            </View>
        )
    }

    // Render Activity Card body
    render() {
        const { item } = this.props

        if (!item) return null

        const { postRef, goalRef, actedUponEntityType } = item
        if (goalRef === null) {
            console.log(`${DEBUG_KEY}: rendering card content: `, item)
        }

        let content = null
        if (actedUponEntityType === 'Post') {
            return this.renderPostBody(postRef)
        }

        if (actedUponEntityType === 'Goal') {
            return this.renderGoalBody(goalRef)
        }

        // Incorrect acteduponEntityType
        console.warn(
            `${DEBUG_KEY}: incorrect actedUponEntityType: ${actedUponEntityType}`
        )
        return null
    }
}

// const getStepFromGoal = (goal, stepRef) =>
//     getItemFromGoal(goal, 'steps', stepRef)

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

const styles = {
    // Post image and modal style
    postImageStyle: {
        width,
        height: width,
    },
    cancelIconStyle: {
        height: 20,
        width: 20,
        justifyContent: 'flex-end',
    },
    mediaStyle: {
        height: width / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
}

const mapStateToProps = (state) => {
    const { userId } = state.user
    const postVideoStatus = state.goalSwiper.feedPostVideoProgress

    return {
        userId,
        postVideoStatus,
    }
}
export default connect(mapStateToProps, null)(ActivityBody)
