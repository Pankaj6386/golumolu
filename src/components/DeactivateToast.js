/** @format */

import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableWithoutFeedback,
    Platform,
    Image,
} from 'react-native'
import Modal from 'react-native-modal'
import { color, default_style } from '../styles/basic'
import { addNudge, NUDGE_TYPES } from '../actions/NudgeActions'
import { connect } from 'react-redux'
import LottieView from 'lottie-react-native'
import NO_GOAL_LOTTIE from '../asset/toast_popup_lotties/help_friend/help_friend.json'
import YES_LOTTIE from '../asset/toast_popup_lotties/yes-button/yes_button.json'

import NEW_VERSION from '../asset/NewVersion.png'

import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

class DeactivateToast extends Component {
    constructor(props) {
        super(props)
    }

    renderNoButton() {
        return (
            <>
                <TouchableWithoutFeedback
                    onPress={() => this.props.onPressOk()}
                >
                    <View
                        style={{
                            width: 80,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 32.5,
                            borderColor: '#42C0F5',
                            borderWidth: 2,
                            borderRadius: 3,
                            marginBottom: 15,
                        }}
                    >
                        <Text
                            style={{
                                color: '#42C0F5',
                                fontWeight: '600',
                                fontSize: 15,
                                fontFamily: 'SFProDisplay-Semibold',
                            }}
                        >
                            YES
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }

    renderYesButton() {
        const { visitedUser, token } = this.props
        return (
            <>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.props.onPressNotNow()
                    }}
                >
                    <View
                        style={{
                            marginBottom: 14.5,
                            width: 100,
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
                            NO
                        </Text>
                        <LottieView
                            style={{ height: 37 }}
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
        const { isVisible } = this.props

        return (
            <>
                <Modal
                    backdropOpacity={0.85}
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
                            <Image
                                style={{
                                    height: 200,
                                    width: 200,
                                    marginTop: 2,
                                    alignSelf: 'center',
                                }}
                                source={NEW_VERSION}
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
                                {`Are you sure you want to PERMANENTLY delete your account? `}
                            </Text>
                            <Text
                                style={{
                                    fontWeight: '400',
                                    fontSize: 15,

                                    lineHeight: 25,
                                    width: '90%',
                                    alignSelf: 'center',
                                }}
                            >
                                {`We will be unable to retrieve any of your data after deletion.`}
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 18,
                                    alignItems: 'center',
                                }}
                            >
                                {this.renderYesButton()}
                                <View style={{ width: 10 }} />
                                {this.renderNoButton()}
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const visitedUser = state.profile.userId.userId
    const { token } = state.auth.user

    return {
        visitedUser,
        token,
    }
}

export default connect(mapStateToProps, {
    addNudge,
})(DeactivateToast)
