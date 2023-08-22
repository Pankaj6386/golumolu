/** @format */

import React, { Component } from 'react'
import { Text, View, TouchableWithoutFeedback } from 'react-native'
import Modal from 'react-native-modal'
import { color, default_style } from '../../../styles/basic'
import { connect } from 'react-redux'
import LottieView from 'lottie-react-native'
import NO_GOAL_LOTTIE from '../../../asset/toast_popup_lotties/sorry_lottie.json'
import YES_LOTTIE from '../../../asset/toast_popup_lotties/yes-button/yes_button.json'

import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

// const NEWLY_VIDEO_ACCESSED = 'newly_video_accesed_tooltip'

class VideoAccessModal extends Component {
    constructor(props) {
        super(props)
    }

    renderYesButton() {
        return (
            <>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.props.onClose()
                    }}
                >
                    <View
                        style={{
                            marginBottom: 14.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                position: 'absolute',
                                zIndex: 1,
                                alignSelf: 'center',
                                color: 'white',
                                fontFamily: 'SFProDisplay-Semibold',
                            }}
                        >
                            OK
                        </Text>
                        <LottieView
                            style={{ height: 41 }}
                            source={YES_LOTTIE}
                            autoPlay
                            loop
                        />
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }

    render() {
        const { name, isVisible, gender } = this.props
        return (
            <>
                <Modal
                    backdropOpacity={0.5}
                    isVisible={isVisible}
                    style={{
                        borderRadius: 20,
                    }}
                    animationIn="zoomInUp"
                    animationInTiming={400}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                // height: '0%',
                                width: '100%',

                                borderRadius: 8,
                                backgroundColor: color.GV_MODAL,
                            }}
                        >
                            <View
                                style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    marginTop: 10,
                                    marginHorizontal: 25,
                                }}
                            >
                                <Text style={{ ...default_style.titleText_1 }}>
                                    Important Message!
                                </Text>
                                {/* <TouchableOpacity
                                    onPress={this.props.onClose}
                                    style={{ bottom: 5 }}
                                >
                                    <Entypo
                                        name="cross"
                                        size={27}
                                        color="#4F4F4F"
                                    />
                                </TouchableOpacity> */}
                            </View>
                            <LottieView
                                style={{
                                    height: hp(25),
                                    marginTop: 2,
                                    alignSelf: 'center',
                                }}
                                source={NO_GOAL_LOTTIE}
                                autoPlay
                                loop
                            />

                            <Text
                                style={{
                                    fontWeight: '400',
                                    fontSize: 15,

                                    marginTop: 12,
                                    lineHeight: 25,
                                    width: '90%',
                                    alignSelf: 'center',
                                }}
                            >
                                Video uploads are limited to three (3) minutes
                                in length while GoalMogul is in private beta.
                                Videos exceeding this length will be
                                automatically trimmed at the 3:00 minute mark.
                                We apologize for any inconvenience this may
                                cause you.
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 15,
                                    alignItems: 'center',
                                }}
                            >
                                {this.renderYesButton()}
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = () => {
    return {}
}

export default connect(mapStateToProps, {})(VideoAccessModal)
