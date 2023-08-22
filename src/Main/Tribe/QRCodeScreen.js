/** @format */

import React, { Component } from 'react'
import QRCode from 'react-native-qrcode-svg'
import {
    View,
    Button,
    Text,
    Alert,
    ImageBackground,
    Image,
    Dimensions,
} from 'react-native'
import SearchBarHeader from '../Common/Header/SearchBarHeader'
import { captureRef } from 'react-native-view-shot'
import CameraRoll from '@react-native-community/cameraroll'
import DelayedButton from '../Common/Button/DelayedButton'
import OnboardingStyles from '../../styles/Onboarding'
import { default_style, color, text } from '../../styles/basic'
import AwesomeAlert from 'react-native-awesome-alerts'

import ProfileImage from '../Common/ProfileImage'
import {
    generateInvitationLink,
    getProfileImageOrDefaultFromUser,
} from '../../redux/middleware/utils'

import { Actions } from 'react-native-router-flux'

const { width } = Dimensions.get('window')

class QRCodeScreen extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        cameraRollUri: null,
        showAlert: false,
    }

    _saveToCameraRollAsync = async () => {
        try {
            let result = await captureRef(this._container, {
                format: 'png',
            })

            let saveResult = await CameraRoll.saveToCameraRoll(result, 'photo')

            this.setState({ cameraRollUri: saveResult, showAlert: true })
        } catch (snapshotError) {
            console.error(snapshotError)
        }
    }
    hideAlert = () => {
        this.setState({
            showAlert: false,
        })
    }

    getInviteLink = () => {
        return generateInvitationLink(this.props.tribe?.tribeInviteCode?.code)
    }

    render() {
        let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..'

        const inviteLink = this.getInviteLink()

        return (
            <>
                <SearchBarHeader
                    backButton
                    title={'QRCode'}
                    onBackPress={() => Actions.pop()} // componentWillUnmount takes care of the state cleaning
                />

                <View style={{ backgroundColor: 'white' }}>
                    <ImageBackground
                        style={{
                            justifyContent: 'center',
                            borderRadius: 5,
                            marginTop: 100,
                            width: '85%',
                            alignSelf: 'center',
                            backgroundColor: color.GM_BLUE_LIGHT_LIGHT,
                            height: '55%',
                        }}
                        collapsable={false}
                        ref={(view) => {
                            this._container = view
                        }}
                    >
                        <View
                            style={{
                                alignSelf: 'center',
                                marginBottom: 20,
                            }}
                        >
                            <ProfileImage
                                imageUrl={getProfileImageOrDefaultFromUser(
                                    this.props.admin[0]
                                )}
                                imageContainerStyle={styles.imageStyle}
                                imageStyle={styles.imageStyle}
                            />
                        </View>

                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 18,
                                fontFamily: 'SFProDisplay-Regular',
                            }}
                        >
                            {this.props.tribe.name}
                        </Text>
                        <View
                            style={{
                                height: '55%',
                                width: '65%',
                                backgroundColor: 'white',
                                alignSelf: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 5,
                                marginTop: 20,
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 13,
                                    bottom: 10,
                                    fontFamily: 'SFProDisplay-Regular',
                                }}
                            >
                                Invite Code :{' '}
                                {this.props?.tribe?.tribeInviteCode?.code}
                            </Text>
                            <QRCode
                                value={inviteLink}
                                logo={{ uri: base64Logo }}
                                size={130}
                                logoBackgroundColor="transparent"
                            />
                        </View>
                    </ImageBackground>
                    <View style={{ marginTop: 30 }}>
                        <DelayedButton
                            onRef={(ref) => (this.loginButton = ref)}
                            activeOpacity={0.8}
                            onPress={this._saveToCameraRollAsync}
                            style={[
                                OnboardingStyles.button
                                    .GM_BLUE_BG_WHITE_BOLD_TEXT.containerStyle,
                                {
                                    backgroundColor: this.props.loading
                                        ? // Disable user agreement check
                                          // || !this.state.userAgreementChecked
                                          color.GM_BLUE_LIGHT
                                        : color.GM_BLUE,
                                    width: '65%',
                                    alignSelf: 'center',

                                    borderRadius: 20,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    OnboardingStyles.button
                                        .GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle,
                                ]}
                            >
                                Take Screenshot
                            </Text>
                        </DelayedButton>
                        <AwesomeAlert
                            show={this.state.showAlert}
                            title="Screenshot saved"
                            titleStyle={{
                                fontWeight: 'bold',
                                fontSize: 20,
                            }}
                            contentContainerStyle={{
                                height: 150,
                                width: '75%',
                            }}
                            messageStyle={{
                                fontSize: 15,
                                fontWeight: '500',
                            }}
                            message={'Screen shot saved to camera roll'}
                            closeOnTouchOutside={true}
                            closeOnHardwareBackPress={false}
                            showCancelButton={false}
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
                    </View>
                </View>
            </>
        )
    }
}

const styles = {
    imageStyle: {
        height: 60,
        width: 60,
        borderRadius: 30,
    },
    defaultImageStyle: {
        height: 26,
        width: 26,
        borderRadius: 13,
    },
    imageContainerStyle: {
        borderWidth: 0.5,
        padding: 1.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        height: 34,
        width: 34,
        borderRadius: 17,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
}

export default QRCodeScreen
