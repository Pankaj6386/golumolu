/** @format */

import React from 'react'
import { TouchableOpacity, Image, Dimensions, Text, View } from 'react-native'
import RECORDING from '../../asset/utils/Recording.png'
import VIDEO from '../../asset/utils/Video.png'
// import ACCOUNTABILITY from '../../asset/utils/Accountability.png'
// import SWIPER_BACKGROUND from '../../asset/image/tooltip2.png'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import * as Animatable from 'react-native-animatable'
import { openCameraForVideo, openCameraRollForVideo } from '../../actions'
import CommentVideoModal from '../Common/Modal/CommentVideoModal'
// import AccountabilityPopUp from '../Common/Modal/AccountabilityPopUp'
import BottomButtonsSheet from '../Common/Modal/BottomButtonsSheet'
import { getButtonBottomSheetHeight } from '../../styles'
import { getFirstName } from '../../Utils/HelperMethods'
import { connect } from 'react-redux'
// import SwiperTooltip from '../Common/Tooltip'
import { refreshProfileData } from '../../actions'
import LoadingModal from '../Common/Modal/LoadingModal'
import AwesomeAlert from 'react-native-awesome-alerts'
import { color } from '../../styles/basic'
import VideoAccessModal from '../Common/Modal/VideoAccessModal'
// import * as SecureStore from 'expo-secure-store'

// const swiperText = 'You can leave a video or voice comment! 😃'
// const screenWidth = Dimensions.get('screen').width

let row = []
let prevOpenedRow
// const NEWLY_VIDEO_ACCESSED = 'newly_video_accesed_tooltip'

class GoalSwiper extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            swiperToolTipVisible: false,
            videoModalVisible: false,
            accountPopUpVisible: false,
            progressModalVisible: false,
            showAlert: false,
            videoAccessedModal: false,
            shouldShowModal: false,
        }
        this.refsArray = [] // add this
        this.SWIPED_DATA = [
            // {
            //     id: 1,
            //     source: ACCOUNTABILITY,
            //     onPress: () => {
            //         prevOpenedRow.close()
            //         this.setState({ accountPopUpVisible: true })
            //     },
            //     backgroundColor: '#CEFFBC',
            // },

            {
                id: 3,
                source: RECORDING,
                onPress: () => {
                    prevOpenedRow.close()
                    this.openRecordingModal()
                },
                backgroundColor: '#D7F3FF',
            },
            {
                id: 2,
                source: VIDEO,
                onPress: () => {
                    prevOpenedRow.close()
                    setTimeout(() => {
                        this.showVideoAccessedModal()
                    }, 500)

                    // this.openCameraRollBottomSheet()
                },
                backgroundColor: '#E5F7FF',
            },
        ]
    }

    async componentDidMount() {
        // const hasShownToast = await SecureStore.getItemAsync(
        //     `${this.props.userId}_${NEWLY_VIDEO_ACCESSED}`
        // )
        // console.log('hasShownToast', hasShownToast)
        // this.setState({ shouldShowModal: hasShownToast })
    }

    showVideoModal = () => this.setState({ videoModalVisible: true })

    showProgressModal = () => this.setState({ progressModalVisible: true })

    openCameraRollBottomSheet = () => this.CameraRefBottomSheetRef.open()
    closeNotificationBottomSheet = () => this.CameraRefBottomSheetRef.close()
    openRecordingModal = () => this.bottomRecodingSheet.open()
    closeRecordingnModal = () => this.bottomRecodingSheet.close()

    showVideoAccessedModal = () => {
        this.setState({ videoAccessedModal: true })
    }

    onVideoPress = () => {
        const showModalV2 = () => {
            this.showProgressModal()
        }
        const showModal = () => {
            this.showVideoModal()
        }
        return this.props.openCameraForVideo(
            showModal,
            showModalV2,
            () => {
                this.setState({
                    progressModalVisible: false,
                })
            },
            () =>
                this.setState({
                    showAlert: true,
                })
        )
    }

    onVideoSelect = () => {
        const showModalV2 = () => {
            this.showProgressModal()
        }
        const showModal = () => {
            this.showVideoModal()
        }
        return this.props.openCameraRollForVideo(
            showModal,
            showModalV2,
            () => {
                this.setState({
                    progressModalVisible: false,
                })
            },
            () =>
                this.setState({
                    showAlert: true,
                })
        )
    }

    makeCameraRefOptions = () => {
        return [
            {
                text: 'Record a Video',
                onPress: () => {
                    prevOpenedRow.close()
                    this.closeNotificationBottomSheet(),
                        setTimeout(() => {
                            this.onVideoPress()
                        }, 500)
                },
            },
            {
                text: 'Open Camera Roll',
                onPress: () => {
                    prevOpenedRow.close()
                    this.closeNotificationBottomSheet()
                    setTimeout(() => {
                        this.onVideoSelect()
                    }, 500)
                },
            },
        ]
    }

    renderBottomVoiceRecording = () => {
        const sheetHeight = getButtonBottomSheetHeight(5)
        return (
            <BottomButtonsSheet
                ref={(r) => (this.bottomRecodingSheet = r)}
                buttons={[{}]}
                height={sheetHeight}
                commentRecordingPress
                pageId={this.props.pageId}
                item={this.props.goalRef}
            />
        )
    }

    renderCameraRollBottomSheet = () => {
        const options = this.makeCameraRefOptions()

        const sheetHeight = getButtonBottomSheetHeight(options.length)

        return (
            <BottomButtonsSheet
                ref={(r) => (this.CameraRefBottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
            />
        )
    }
    rightSwipeActions = () => {
        const { marginTop, marginBottom } = this.props
        return (
            <>
                {/* {this.state.swiperToolTipVisible && this.props.index == 0 ? (
                    <SwiperTooltip
                        title={swiperText}
                        imageSource={SWIPER_BACKGROUND}
                        type="swiperDetail"
                        bgStyle={{ width: 200, height: 87 }}
                        viewStyle={{
                            position: 'absolute',
                            zIndex: 1,
                            left: 95,
                            top: 0,
                        }}
                    />
                ) : null} */}

                {this.SWIPED_DATA.map((item, index) => {
                    return (
                        <TouchableOpacity
                            onPress={item.onPress}
                            key={index}
                            activeOpacity={0.7}
                            style={{
                                backgroundColor: item.backgroundColor,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 100,
                                marginBottom: marginBottom,
                                padding: 16,
                                marginTop: marginTop,
                                zIndex: 2,
                            }}
                        >
                            <Animatable.View>
                                <Image
                                    source={item.source}
                                    resizeMode="contain"
                                    style={{ height: 40, width: 40 }}
                                />
                            </Animatable.View>
                        </TouchableOpacity>
                    )
                })}
            </>
        )
    }

    closeRow = (index) => {
        if (prevOpenedRow && prevOpenedRow !== row[index]) {
            prevOpenedRow.close()
        }
        prevOpenedRow = row[index]
    }

    hideAlert = () => {
        this.setState({
            showAlert: false,
        })
    }

    render() {
        const {
            index,
            visitedUserName,
            ownerName,
            homeFeedGoal,
            children,
            goalId,
            goalRef,
        } = this.props
        return (
            <>
                <CommentVideoModal
                    isVisible={this.state.videoModalVisible}
                    onClose={() => this.setState({ videoModalVisible: false })}
                    onRecordPress={this.openCameraRollBottomSheet}
                    pageId={this.props.pageId}
                    goalDetail={this.props.goalRef}
                />
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
                <Swipeable
                    renderRightActions={this.rightSwipeActions}
                    friction={2}
                    ref={(ref) => (row[index] = ref)}
                    leftThreshold={80}
                    rightThreshold={40}
                    onSwipeableOpen={() => this.closeRow(index)}
                >
                    {children}
                </Swipeable>
                {this.renderCameraRollBottomSheet()}
                {this.renderBottomVoiceRecording()}
                {/* <AccountabilityPopUp
                    isVisible={this.state.accountPopUpVisible}
                    onClose={() =>
                        this.setState({ accountPopUpVisible: false })
                    }
                    name={getFirstName(
                        homeFeedGoal ? ownerName : visitedUserName
                    )}
                    goalId={goalId}
                /> */}

                <VideoAccessModal
                    isVisible={this.state.videoAccessedModal}
                    onClose={async () => {
                        // await SecureStore.setItemAsync(
                        //     `${this.props.userId}_${NEWLY_VIDEO_ACCESSED}`,
                        //     'false',
                        //     {}
                        // )
                        this.setState({ videoAccessedModal: false })
                        setTimeout(() => {
                            this.openCameraRollBottomSheet()
                        }, 500)
                    }}
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
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const visitedUserName = state.profile.user.name
    const { userId } = state.user
    // const pageId = constructPageId('goal')
    // console.log('THIS IS PAGE IDDD', pageId)
    const { videoUri, videoPreparing } = state.goalSwiper

    return {
        visitedUserName,
        userId,
        videoUri,
        videoPreparing,
        // newComment: getNewCommentByTab(state, pageId),
        // pageId,
    }
}

export default connect(mapStateToProps, {
    openCameraForVideo,
    openCameraRollForVideo,
    refreshProfileData,
})(GoalSwiper)
