/** @format */

// This is new implementation of CommentBox to include tagging
import _ from 'lodash'
import R from 'ramda'
import React, { Component } from 'react'
import { Icon } from '@ui-kitten/components'

import {
    ActivityIndicator,
    Dimensions,
    Image,
    Keyboard,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native'
import { connect } from 'react-redux'

import { openCamera, openCameraRoll } from '../../../actions'
// Actions
import {
    createComment,
    createSuggestion,
    newCommentOnMediaRefChange,
    newCommentOnMediaRefChangeVideo,
    newCommentOnTagsChange,
    newCommentOnTagsRegChange,
    newCommentOnTextChange,
    openCurrentSuggestion,
    postComment,
    removeSuggestion,
    sendVideoMessage,
} from '../../../redux/modules/feed/comment/CommentActions'
import { searchUser } from '../../../redux/modules/search/SearchActions'
// Selectors
import { getNewCommentByTab } from '../../../redux/modules/feed/comment/CommentSelector'
import LoadingModal from '../../Common/Modal/LoadingModal'
import AwesomeAlert from 'react-native-awesome-alerts'
// Utils
import {
    arrayUnique,
    clearTags,
    getProfileImageOrDefaultFromUser,
} from '../../../redux/middleware/utils'
import { default_style, color } from '../../../styles/basic'
import Video from 'react-native-video'

// Components
import MentionsTextInput from './MentionsTextInput'
import EmptyResult from '../../Common/Text/EmptyResult'
import SuggestionPreview, {
    RemoveComponent,
} from '../GoalDetailCard/SuggestionPreview'
import DelayedButton from '../../Common/Button/DelayedButton'
import ProfileImage from '../../Common/ProfileImage'

import { getButtonBottomSheetHeight } from '../../../styles'
import BottomButtonsSheet from '../../Common/Modal/BottomButtonsSheet'

import SuggestedMessages from '../NewGoal/SuggestedMessages'
import SuggestedReplies from '../NewGoal/SuggestionReplies'
import {
    getGeneratedReplies,
    getGeneratedSavedReplies,
    saveCustomMessage,
} from '../../../actions/GeneratedAiActions'
import LottieView from 'lottie-react-native'

import UPLOADING_LOTTIE from '../../../asset/image/uploading_1.json'

import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import CustomTooltip from '../../../components/CustomTooltip'
import IMAGE_SOURCE from '../../../asset/image/messageUI1.png'
import IMAGE_SOURCE_2 from '../../../asset/image/messageUI.png'
import { Size, hp as HP, wp as WP } from '../../../asset/dimensions'
import * as SecureStore from 'expo-secure-store'

const maxHeight = 120
const { width } = Dimensions.get('window')

const INITIAL_TAG_SEARCH = {
    data: [],
    skip: 0,
    limit: 10,
    loading: false,
}

const DEFAULT_WRITE_COMMENT_PLACEHOLDER = 'Write a reply...'
const DEFAULT_REPLY_TO_PLACEHOLDER = 'Reply to the thread...'

class CommentBoxV2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            height: 34,
            defaultValue: DEFAULT_WRITE_COMMENT_PLACEHOLDER,
            keyword: '',
            tagSearchData: INITIAL_TAG_SEARCH,
            showInviteFriendModal: false,
            suggestedMsgsVisible: false,
            suggestedReplyVisible: false,
            progressModalVisible: false,
            showAlert: false,
            generatedReply: '',
            loadingModal: false,
            isCaptureVideo: true,
            generatedMessageTooltip: false,
        }
        this.updateSearchRes = this.updateSearchRes.bind(this)
        this.focus = this.focus.bind(this)
        this.handleOnSubmitEditing = this.handleOnSubmitEditing.bind(this)
        this.renderLoadingComponent = this.renderLoadingComponent.bind(this)
        this.renderPost = this.renderPost.bind(this)
        this.renderSuggestionsRow = this.renderSuggestionsRow.bind(this)
        this.callback = this.callback.bind(this)
        this.validateContentTags = this.validateContentTags.bind(this)
        this.renderLeftIcons = this.renderLeftIcons.bind(this)
        this.renderMedia = this.renderMedia.bind(this)
        this.handleTagSearchLoadMore = this.handleTagSearchLoadMore.bind(this)
        this.renderSuggestionPreview = this.renderSuggestionPreview.bind(this)
        this.handleOnBlur = this.handleOnBlur.bind(this)
    }

    async componentDidMount() {
        if (this.props.onRef) this.props.onRef(this)

        this.setState({
            defaultValue: this.props.isReplyCommentBox
                ? DEFAULT_REPLY_TO_PLACEHOLDER
                : DEFAULT_WRITE_COMMENT_PLACEHOLDER,
        })

        const hasShownToast = await SecureStore.getItemAsync(
            `${this.props.user.userId}_${'saved_message_tooltip'}`
        )

        if (hasShownToast === 'false') {
            setTimeout(() => {
                this.setState({ generatedMessageTooltip: true })
            }, 500)
        }
    }

    componentWillUnmount() {
        if (this.reqTimer) {
            clearTimeout(this.reqTimer)
        }
    }

    openInviteFriendModal = () => {
        this.setState({ ...this.state, showInviteFriendModal: true })
    }

    closeInviteFriendModal = () => {
        this.setState({ ...this.state, showInviteFriendModal: false })
    }

    onTaggingSuggestionTap = (item, hidePanel, cursorPosition) => {
        hidePanel()
        const { name } = item
        const { pageId, newComment } = this.props
        const { contentText, contentTags } = newComment

        const postCursorContent = contentText.slice(cursorPosition)
        const prevCursorContent = contentText.slice(0, cursorPosition)
        const comment = prevCursorContent.slice(0, -this.state.keyword.length)
        const newContentText = `${comment}@${name} ${postCursorContent.replace(
            /^\s+/g,
            ''
        )}`

        this.props.newCommentOnTextChange(newContentText, pageId)

        const newContentTag = {
            user: item,
            startIndex: comment.length, // `${comment}@${name} `
            endIndex: comment.length + 1 + name.length, // `${comment}@${name} `
            tagReg: `\\B@${name}`,
            tagText: `@${name}`,
        }

        // Clean up tags position before comparing
        const newTags = clearTags(newContentText, newContentTag, contentTags)

        // Check if this tags is already in the array
        const containsTag = newTags.some(
            (t) =>
                t.tagReg === `\\B@${name}` &&
                t.startIndex === comment.length + 1
        )

        const needReplceOldTag = newTags.some(
            (t) => t.startIndex === comment.length
        )

        // Update comment contentTags regex and contentTags
        if (!containsTag) {
            let newContentTags
            if (needReplceOldTag) {
                newContentTags = newTags.map((t) => {
                    if (t.startIndex === newContentTag.startIndex) {
                        return newContentTag
                    }
                    return t
                })
            } else {
                newContentTags = [...newTags, newContentTag]
            }

            this.props.newCommentOnTagsChange(
                newContentTags.sort((a, b) => a.startIndex - b.startIndex),
                pageId
            )
        }

        // Clear tag search data state
        this.setState({
            tagSearchData: INITIAL_TAG_SEARCH,
        })
    }

    // This is triggered when a trigger (@) is removed. Verify if all tags
    // are still valid.
    validateContentTags = () => {
        const { pageId, newComment } = this.props
        const { contentText, contentTags } = newComment
        const newContentTags = contentTags.filter((tag) => {
            const { startIndex, endIndex, tagText } = tag

            const actualTag = contentText.slice(startIndex, endIndex)
            // Verify if with the same startIndex and endIndex, we can still get the
            // tag. If not, then we remove the tag.
            return actualTag === tagText
        })
        this.props.newCommentOnTagsChange(newContentTags, pageId)
    }

    updateSearchRes = (res, searchContent) => {
        if (searchContent !== this.state.keyword) return
        this.setState({
            // keyword,
            tagSearchData: {
                ...this.state.tagSearchData,
                skip: res.data.length, //TODO: new skip
                data: res.data,
                loading: false,
            },
        })
    }

    callback = (keyword) => {
        if (this.reqTimer) {
            clearTimeout(this.reqTimer)
        }

        this.reqTimer = setTimeout(() => {
            // TODO: send search request
            this.setState({
                keyword,
                tagSearchData: {
                    ...this.state.tagSearchData,
                    loading: true,
                },
            })
            const { limit } = this.state.tagSearchData
            this.props.searchUser(keyword, 0, limit, (res, searchContent) => {
                this.updateSearchRes(res, searchContent)
            })
        }, 150)
    }

    handleTagSearchLoadMore = () => {
        const { tagSearchData, keyword } = this.state
        const { skip, limit, data, loading } = tagSearchData

        if (loading) return
        this.setState({
            tagSearchData: {
                ...this.state.tagSearchData,
                loading: true,
            },
        })

        this.props.searchUser(keyword, skip, limit, (res) => {
            this.setState({
                keyword,
                tagSearchData: {
                    ...this.state.tagSearchData,
                    skip: skip + res.data.length, //TODO: new skip
                    data: arrayUnique([...data, ...res.data]),
                    loading: false,
                },
            })
        })
    }

    handleOnPost = (uploading) => {
        // Ensure we only create comment once

        if (uploading) return
        this.props.postComment(this.props.pageId, this.props.onPost)
    }

    handleCameraOpen = () => {
        Alert.alert(
            'Select Media',
            'Would you like to take a picture or record a video?',
            [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Image',
                    onPress: () => {
                        this.setState({ isCaptureVideo: false })
                        setTimeout(async () => {
                            this.handleOpenCamera()
                        }, 500)
                    },
                },
                {
                    text: 'Video',
                    onPress: () => {
                        this.setState({ isCaptureVideo: true })
                        setTimeout(async () => {
                            setTimeout(async () => {
                                this.handleOpenCamera()
                            }, 500)
                        }, 500)
                    },
                },
            ]
        )
    }

    handleOpenCamera = () => {
        this.bottomSheetRef.close()

        setTimeout(() => {
            const showModalV2 = () => {
                this.showProgressModal()
            }
            this.props.openCamera(
                (type, result) => {
                    if (type === 'video') {
                        this.props.newCommentOnMediaRefChangeVideo(
                            result,
                            this.props.pageId,
                            type
                        )
                    } else {
                        this.props.newCommentOnMediaRefChange(
                            result.uri,
                            this.props.pageId,
                            type
                        )
                    }
                },
                null,
                null,
                true,
                () =>
                    this.setState({
                        showAlert: true,
                    }),
                showModalV2,
                () => {
                    this.setState({
                        progressModalVisible: false,
                    })
                },
                this.state.isCaptureVideo
            )
        }, 500)
    }

    handleOpenCameraRoll = () => {
        const callback = R.curry((type, result) => {
            if (type === 'video') {
                this.props.newCommentOnMediaRefChangeVideo(
                    result,
                    this.props.pageId,
                    type
                )
            } else {
                this.props.newCommentOnMediaRefChange(
                    result.uri,
                    this.props.pageId,
                    type
                )
            }
        })
        const showModalV2 = () => {
            this.showProgressModal()
        }
        this.bottomSheetRef.close()
        setTimeout(() => {
            this.props.openCameraRoll(
                callback,
                { disableEditing: true },
                null,
                null,
                () =>
                    this.setState({
                        showAlert: true,
                    }),
                showModalV2,
                () => {
                    this.setState({
                        progressModalVisible: false,
                    })
                }
            )
        }, 500)
    }

    /**
     * Open IOS menu to show two options ['Open Camera Roll', 'Take photo']
     * When image icon on the comment box is clicked
     */
    handleImageIconOnClick = () => {
        this.bottomSheetRef && this.bottomSheetRef.open()
    }

    handleOnBlur = () => {
        const { newComment } = this.props
        const { resetCommentType, onSubmitEditing } = this.props
        const { contentText } = newComment
        // On Blur if no content then set default value to comment the goal / post
        if (!contentText || contentText === '' || contentText.trim() === '') {
            this.setState({
                defaultValue: this.props.isReplyCommentBox
                    ? DEFAULT_REPLY_TO_PLACEHOLDER
                    : DEFAULT_WRITE_COMMENT_PLACEHOLDER,
            })
            if (resetCommentType) {
                resetCommentType()
            }
            if (onSubmitEditing) {
                onSubmitEditing()
            }
        }
    }

    /**
     * NOTE: this function might not be called by TextInput somehow.
     */
    handleOnSubmitEditing = () => {
        const { onSubmitEditing } = this.props
        if (onSubmitEditing) {
            onSubmitEditing()
        }
        this.handleOnBlur()
    }

    focus() {
        if (this.textInput) this.textInput.focus()
    }

    updateSize = (height) => {
        this.setState({
            height: Math.min(height, maxHeight),
        })
    }
    renderSuggestionIcon = () => {
        const { newComment, pageId, goalId } = this.props
        const { mediaRef, commentType } = newComment
        const disableButton = mediaRef !== undefined && mediaRef !== ''
        if (commentType === 'Reply') return null
        return (
            <View>
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => {
                        Keyboard.dismiss()
                        this.props.createSuggestion(goalId, pageId)
                    }}
                    disabled={disableButton}
                    style={{
                        paddingTop: 12,
                        paddingBottom: 4,
                    }}
                >
                    <Icon
                        name="lightbulb-on-outline"
                        pack="material-community"
                        style={[
                            styles.iconStyle,
                            {
                                position: 'relative',
                                bottom: 2,
                                tintColor: '#F2C94C',
                            },
                        ]}
                    />
                </DelayedButton>
                {this.state.generatedMessageTooltip && (
                    <CustomTooltip
                        title={
                            'Tap this button to generate a comment or reply!'
                        }
                        imageSource={IMAGE_SOURCE_2}
                        bgStyle={{
                            width: Size(22),
                            height: Size(10),
                        }}
                        viewStyle={{
                            bottom: HP(4),
                            left: HP(8),
                        }}
                        tooltipConstant="generated_message_tooltip"
                    />
                )}
            </View>
        )
    }

    renderSuggestionMessage = () => {
        return (
            <View>
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => {
                        this.props.getGeneratedSavedReplies()
                        this.setState({ suggestedMsgsVisible: true })
                    }}
                    style={{
                        marginTop: 12,
                        padding: 6,
                    }}
                >
                    <Image
                        source={require('../../../asset/image/suggestedMessage.png')}
                        style={{
                            resizeMode: 'contain',
                            height: 26,
                            width: 26,
                        }}
                    />
                </DelayedButton>
            </View>
        )
    }

    renderLeftIcons = () => {
        const {
            newComment,
            pageId,
            hasSuggestion,
            goalId,
            sendSuggestedMessage,
        } = this.props
        const suggestionIcon = hasSuggestion
            ? this.renderSuggestionIcon(newComment, pageId, goalId)
            : null
        const suggestionMessage = sendSuggestedMessage
            ? this.renderSuggestionMessage()
            : null
        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginLeft: 5,
                    marginRight: 5,
                    flexGrow: 1,
                }}
            >
                {this.renderImageIcon(newComment)}
                {suggestionIcon}
                {suggestionMessage}
                <CustomTooltip
                    title={
                        'Tap the clipboard button to create or send saved message templates!'
                    }
                    imageSource={IMAGE_SOURCE}
                    bgStyle={{
                        width: Size(24),
                        height: Size(11),
                    }}
                    viewStyle={{
                        bottom: HP(4),
                        left: HP(13),
                    }}
                    tooltipConstant="saved_message_tooltip"
                    callback={() =>
                        this.setState({ generatedMessageTooltip: true })
                    }
                />
            </View>
        )
    }

    showProgressModal = () => this.setState({ progressModalVisible: true })

    renderImageIcon = () => {
        const { newComment } = this.props
        const { commentType } = newComment
        // Disable image icon if there is a valid suggestion
        const disableButton = commentType === 'Suggestion'
        const options = [
            {
                text: 'Open Camera Roll',
                onPress: this.handleOpenCameraRoll,
            },
            {
                text: 'Take Photo or Video',
                onPress: this.handleCameraOpen,
            },
        ]
        return (
            <View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={this.handleImageIconOnClick}
                    disabled={disableButton}
                    style={{
                        paddingTop: 12,
                        paddingBottom: 4,
                        paddingRight: 8,
                    }}
                >
                    <Icon
                        name="image-outline"
                        pack="material-community"
                        style={[
                            styles.iconStyle,
                            {
                                tintColor: '#4F4F4F',
                            },
                        ]}
                    />
                </TouchableOpacity>
                <BottomButtonsSheet
                    ref={(r) => (this.bottomSheetRef = r)}
                    buttons={options}
                    height={getButtonBottomSheetHeight(options.length)}
                />
            </View>
        )
    }

    renderMedia = () => {
        const { newComment } = this.props
        const { mediaRef, type } = newComment

        if (!mediaRef) return null
        const onPress = () => {}
        const onRemove = () =>
            this.props.newCommentOnMediaRefChange(undefined, this.props.pageId)

        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.mediaContainerStyle}
                onPress={onPress}
            >
                {type === 'image' ? (
                    <Image
                        style={{ width: 50, height: 50, borderRadius: 0 }}
                        source={{ uri: mediaRef }}
                    />
                ) : (
                    <Video
                        source={{
                            uri: mediaRef,
                            isNetwork: true,
                            type: '',
                        }}
                        style={{ width: 50, height: 50 }}
                        resizeMode={'cover'}
                        paused={false}
                        muted={true}
                    />
                )}

                <View
                    style={{
                        flex: 1,
                        marginLeft: 12,
                        marginRight: 12,
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={styles.headingTextStyle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        Attached {type === 'image' ? 'image' : 'video'}
                    </Text>
                </View>
                <RemoveComponent onRemove={onRemove} />
            </TouchableOpacity>
        )
    }

    renderPost = () => {
        const { newComment } = this.props
        const {
            uploading,
            contentText,
            commentType,
            mediaRef,
            type,
        } = newComment
        const isInValidComment =
            (commentType === 'Comment' || commentType === 'Reply') &&
            (!contentText || contentText === '' || contentText.trim() === '') &&
            mediaRef === undefined
        const isInValidSuggestion = !validSuggestion(newComment)
        const disable = uploading || isInValidComment || isInValidSuggestion

        const tintColor = disable ? 'lightgray' : color.GM_BLUE
        return (
            <DelayedButton
                activeOpacity={0.6}
                onPress={() => {
                    if (type === 'video') {
                        return this.props.sendVideoMessage(
                            this.props.newComment.mediaRef,
                            '',
                            this.props.pageId,
                            this.props.entityId
                                ? this.props.entityId
                                : this.props.goalId,
                            null,
                            this.props.entityId ? 'Post' : 'Goal',
                            this.props.newComment.contentText
                        )
                    } else {
                        this.handleOnPost(uploading)
                    }
                }}
                disabled={disable}
            >
                <View
                    style={{
                        padding: 12,
                        paddingBottom: 4,
                        flexDirection: 'row',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.getGeneratedReplies()
                            this.setState({ suggestedReplyVisible: true })
                        }}
                    >
                        <Image
                            style={{
                                resizeMode: 'contain',
                                height: 20,
                                width: 20,
                                marginTop: 10,
                                marginRight: 8,
                            }}
                            source={require('../../../asset/image/refresh.png')}
                        />
                    </TouchableOpacity>

                    <Icon
                        name="send"
                        pack="material-community"
                        style={[styles.iconStyle, { tintColor }]}
                    />
                </View>
            </DelayedButton>
        )
    }

    renderSuggestionPreview() {
        const { pageId, newComment } = this.props
        const { showAttachedSuggestion, suggestion, uploading } = newComment

        if (showAttachedSuggestion) {
            return (
                <SuggestionPreview
                    item={suggestion}
                    onRemove={() => {
                        this.props.removeSuggestion(pageId)
                    }}
                    onPress={() => {
                        this.props.openCurrentSuggestion(pageId)
                    }}
                    uploading={uploading}
                />
            )
        }

        return null
    }

    /**
     * This is to render tagging suggestion row
     * @param hidePanel: lib passed in funct to close suggestion panel
     * @param item: suggestion item to render
     */
    renderSuggestionsRow = ({ item }, hidePanel, cursorPosition) => {
        const { name } = item
        return (
            <TouchableOpacity
                onPress={() =>
                    this.onTaggingSuggestionTap(item, hidePanel, cursorPosition)
                }
                style={{
                    height: 50,
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderTopColor: '#F2F2F2',
                    borderTopWidth: 0.5,
                }}
            >
                <ProfileImage
                    imageContainerStyle={styles.imageContainerStyle}
                    imageUrl={getProfileImageOrDefaultFromUser(item)}
                    imageStyle={{ height: 30, width: 30 }}
                />
                <Text style={{ fontSize: 16, color: 'darkgray' }}>{name}</Text>
            </TouchableOpacity>
        )
    }

    renderLoadingComponent = () => {
        if (this.state.tagSearchData.loading) {
            return (
                <View
                    style={{
                        flex: 1,
                        height: 50,
                        width,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ActivityIndicator />
                </View>
            )
        }
        return (
            <EmptyResult
                text={'No User Found'}
                textStyle={{ paddingTop: 15, height: 50 }}
            />
        )
    }

    postGeneratedReply = (reply) => {
        if (this.props.newComment.uploading) return
        this.props.postComment(this.props.pageId, this.props.onPost, reply)
    }
    hideAlert = () => {
        this.setState({
            showAlert: false,
        })
    }

    render() {
        const { pageId, newComment } = this.props
        if (!newComment || !newComment.parentRef) return null
        const { uploading } = newComment

        const inputStyle = uploading
            ? {
                  ...styles.inputStyle,
                  color: '#b9c3c4',
              }
            : styles.inputStyle
        return (
            <>
                <MentionsTextInput
                    ref={(r) => (this.textInput = r)}
                    placeholder={this.state.defaultValue}
                    onChangeText={(val) =>
                        this.props.newCommentOnTextChange(val, pageId)
                    }
                    editable={!uploading}
                    maxHeight={maxHeight}
                    multiline
                    value={newComment.contentText}
                    contentTags={newComment.contentTags}
                    contentTagsReg={newComment.contentTags.map((t) => t.tagReg)}
                    tagSearchRes={this.state.tagSearchData.data}
                    defaultValue={this.state.defaultValue}
                    onBlur={this.handleOnBlur}
                    onSubmitEditing={this.handleOnSubmitEditing}
                    renderSuggestionPreview={this.renderSuggestionPreview}
                    renderMedia={this.renderMedia}
                    renderLeftIcons={this.renderLeftIcons}
                    renderPost={this.renderPost}
                    textInputContainerStyle={styles.inputContainerStyle}
                    textInputStyle={inputStyle}
                    validateTags={this.validateContentTags}
                    suggestionsPanelStyle={{
                        backgroundColor: 'rgba(100,100,100,0.1)',
                    }}
                    loadingComponent={this.renderLoadingComponent}
                    trigger={'@'}
                    triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
                    triggerCallback={this.callback}
                    triggerLoadMore={this.handleTagSearchLoadMore}
                    renderSuggestionsRow={this.renderSuggestionsRow}
                    suggestionsData={this.state.tagSearchData.data} // array of objects
                    keyExtractor={(item) => item._id}
                    suggestionRowHeight={50}
                    horizontal={false} // defaut is true, change the orientation of the list
                    MaxVisibleRowCount={7} // this is required if horizontal={false}
                />
                <AwesomeAlert
                    show={this.state.showAlert}
                    title="Video too large to upload!"
                    titleStyle={{
                        fontWeight: 'bold',
                        fontSize: 20,
                    }}
                    contentContainerStyle={{
                        minHeight: 150,
                        width: '80%',
                    }}
                    messageStyle={{
                        fontSize: 15,
                        fontWeight: '500',
                    }}
                    message={'Please upload a video less than 150MB'}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={true}
                    confirmText="OK"
                    confirmButtonColor={color.GM_BLUE}
                    onCancelPressed={() => {
                        this.hideAlert()
                    }}
                    onConfirmPressed={() => {
                        this.hideAlert()
                    }}
                    confirmButtonStyle={{
                        width: 100,
                    }}
                    confirmButtonTextStyle={{
                        textAlign: 'center',
                    }}
                />

                <LoadingModal visible={uploading}>
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

                {/* {this.state.loadingModal && (
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
                )} */}
                <LoadingModal
                    visible={this.state.progressModalVisible}
                    // visible={true}
                    animationType="fade"
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '80%',
                                backgroundColor: 'white',
                                borderRadius: 5,

                                padding: 30,
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: 17,

                                    fontWeight: '600',
                                }}
                            >
                                Video being attached...
                            </Text>
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: 17,
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    paddingTop: 10,
                                }}
                            >
                                {`${this.props.videoPreparing}%`}
                            </Text>
                        </View>
                    </View>
                </LoadingModal>

                <SuggestedMessages
                    isVisible={this.state.suggestedMsgsVisible}
                    onClose={() =>
                        this.setState({ suggestedMsgsVisible: false })
                    }
                    postGeneratedReply={this.postGeneratedReply}
                />
                <SuggestedReplies
                    isVisible={this.state.suggestedReplyVisible}
                    onClose={() =>
                        this.setState({ suggestedReplyVisible: false })
                    }
                    postGeneratedReply={this.postGeneratedReply}
                />

                {/* <InviteFriendModal
                    isVisible={this.state.showInviteFriendModal}
                    closeModal={this.closeInviteFriendModal}
                    goalTosend={`My friend ${this.props.name} has the goal ${this.props.title} I thought you might be able to help. Please join us on GoalMogul so I can connect you!`}
                    shouldOpenFromComments
                /> */}
            </>
        )
    }
}

const validSuggestion = (newComment) => {
    const { commentType, suggestion } = newComment
    if (commentType === 'Comment' || commentType === 'Reply') return true
    if (isInvalidObject(suggestion)) {
        return false
    }
    const {
        suggestionFor,
        suggestionForRef,
        suggestionType,
        suggestionText,
        suggestionLink,
        selectedItem,
    } = suggestion
    if (
        isInvalidObject(suggestionFor) ||
        isInvalidObject(suggestionForRef) ||
        isInvalidObject(suggestionType)
    ) {
        return false
    }

    if (suggestionType !== 'Custom' && isInvalidObject(selectedItem)) {
        return false
    }

    if (suggestionType === 'Custom') {
        if (
            isInvalidObject(suggestionText) ||
            isInvalidObject(suggestionLink)
        ) {
            return false
        }
    }
    return true
}

export const isInvalidObject = (o) => {
    if (o === null) return true
    if (typeof o === 'object') {
        return _.isEmpty(o) || o === undefined
    }
    if (typeof o === 'string') {
        return o === '' || o.trim() === ''
    }
    return false
}

const styles = {
    inputContainerStyle: {
        justifyContent: 'center',
    },
    inputStyle: {
        ...default_style.normalText_1,
        minHeight: 30 * default_style.uiScale,
        maxHeight: 80 * default_style.uiScale,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: 'white',
    },
    iconStyle: {
        ...default_style.buttonIcon_1,
        margin: 4,
        height: 30,
        width: 30,
    },
    // Media preview styles
    mediaContainerStyle: {
        flexDirection: 'row',
        height: 50,
        borderColor: '#cacaca',
        borderTopWidth: 0.5,
        backgroundColor: '#fff',
    },
    imageContainerStyle: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        margin: 4,
        marginHorizontal: 12,
    },
    headingTextStyle: {
        fontSize: 13,
        color: '#666',
    },
}

const mapStateToProps = (state, props) => {
    const { goalDetail, user } = state
    const { videoPreparing } = state.goalSwiper
    const title = goalDetail.goal.goal?.title
    const name = goalDetail.goal.goal?.owner?.name
    return {
        newComment: getNewCommentByTab(state, props.pageId),
        title,
        name,
        videoPreparing,
        user,
    }
}

export default connect(mapStateToProps, {
    searchUser,
    createComment,
    newCommentOnTextChange,
    openCurrentSuggestion,
    removeSuggestion,
    createSuggestion,
    postComment,
    openCamera,
    openCameraRoll,
    newCommentOnMediaRefChange,
    newCommentOnMediaRefChangeVideo,
    newCommentOnTagsRegChange,
    newCommentOnTagsChange,
    getGeneratedReplies,
    getGeneratedSavedReplies,
    saveCustomMessage,
    sendVideoMessage,
})(CommentBoxV2)
