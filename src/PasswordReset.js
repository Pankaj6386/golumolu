/** @format */

import React, { Component } from 'react'
import {
    Animated,
    StyleSheet,
    Keyboard,
    View,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Linking,
} from 'react-native'

import InputBox from './Main/Onboarding/Common/InputBox'
import { openInbox } from 'react-native-email-link'

import OnboardingStyles from './styles/Onboarding'
import { color, default_style } from './styles/basic'

import OnboardingHeader from './Main/Onboarding/Common/OnboardingHeader'
import DelayedButton from './Main/Common/Button/DelayedButton'

import AwesomeAlert from 'react-native-awesome-alerts'
import { api as API } from './redux/middleware/api'
import { trackWithProperties, EVENT as E } from './monitoring/segment'
import { Actions } from 'react-native-router-flux'

const DEFAULT_SPACE_ABOVE_LOGIN_BUTTON_NO_KEYBOARD = 112
const DEFAULT_SPACE_ABOVE_LOGIN_BUTTON_WITH_KEYBOARD = 24

class PasswordReset extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numFailLoginAttempt: 0,
            spaceAboveLoginButton: new Animated.Value(
                DEFAULT_SPACE_ABOVE_LOGIN_BUTTON_NO_KEYBOARD
            ),

            errMsg: undefined,
            statusMessage: '',
            emailOrPhone: '',
            showPhoneInput: false,

            medium: '',
            destination: '',
            shouldScrollToLoginButton: false,
            success: false,
            username: undefined,
            password: undefined,
            showAlert: false,
            buttonLoading: false,
            cca2: 'US',
            countryCode: {
                cca2: 'US',
                country: {
                    callingCode: ['1'],
                    cca2: 'US',
                    currency: ['USD'],
                    flag: 'flag-us',
                    name: 'United States',
                    region: 'Americas',
                    subregion: 'North America',
                },
            },
            // Disable user agreement
            // userAgreementChecked: false,
        }
    }

    _keyboardDidShow = () => {
        if (this.state.shouldScrollToLoginButton) {
            // this.scrollView.props.scrollToFocusedInput(this.loginButton)
            this.setState({
                shouldScrollToLoginButton: false,
            })
        }
    }
    _keyboardWillShow = () => {
        Animated.timing(this.state.spaceAboveLoginButton, {
            useNativeDriver: false,
            toValue: DEFAULT_SPACE_ABOVE_LOGIN_BUTTON_WITH_KEYBOARD,
            duration: 250,
        }).start()
    }
    _keyboardWillHide = () => {
        Animated.timing(this.state.spaceAboveLoginButton, {
            useNativeDriver: false,
            toValue: DEFAULT_SPACE_ABOVE_LOGIN_BUTTON_NO_KEYBOARD,
            duration: 250,
        }).start()
    }

    hideAlert = () => {
        this.setState({
            showAlert: false,
        })
    }

    verifyInputs = () => {
        if (!this.state.emailOrPhone.length) {
            this.setState({
                statusMessage: 'Please enter an email.',
                showAlert: true,
            })
            return false
        }
        return true
    }

    handleSumbit = () => {
        this.setState({ statusMessage: '' })
        Keyboard.dismiss()
        if (this.verifyInputs()) {
            const emailReg = new RegExp(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
            const email =
                (emailReg.test(this.state.emailOrPhone) &&
                    this.state.emailOrPhone) ||
                undefined
            const phone = (!email && this.state.emailOrPhone) || undefined
            this.dispatchPwResetRequest(email, phone)
        }
        return false
    }

    dispatchPwResetRequest = async (email, phone) => {
        try {
            this.setState({ buttonLoading: true })
            const ress = await this.pwResetRequest({
                email: email,
                phone:
                    this.state.showPhoneInput &&
                    `+${this.state.countryCode.country.callingCode[0]}${phone}`,
            })
            const dest = email || phone

            if (ress.status === 200) {
                this.setState({
                    success: true,
                    destination: dest,
                    buttonLoading: false,
                })
                trackWithProperties(E.FORGET_PASSWORD_SUCCESS, {
                    destination: dest,
                })
            } else if (ress.message === 'User does not exist') {
                this.setState({
                    statusMessage:
                        'Sorry, we don’t recognize that email address. Please try again.',
                    showAlert: true,
                    buttonLoading: false,
                })
                trackWithProperties(E.FORGET_PASSWORD_FAILED, {
                    destination: dest,
                    errMessage: this.state.statusMessage,
                })
            } else if (ress.message === 'Invalid phone number.') {
                this.setState({
                    statusMessage: 'Please enter a valid phone number.',
                    showAlert: true,
                    buttonLoading: false,
                })
                trackWithProperties(E.FORGET_PASSWORD_FAILED, {
                    destination: dest,
                    errMessage: this.state.statusMessage,
                })
            } else if (ress.message === 'User exist on google account') {
                this.setState({
                    statusMessage:
                        'This account has previously signed into GoalMogul using Google login, so your password can no longer be reset manually. Please try signing in again with Google. If you still experience an issue logging in, please email us at support@goalmogul.com\n\n' +
                        'Thanks!\n',
                    showAlert: true,
                    buttonLoading: false,
                })
                trackWithProperties(E.FORGET_PASSWORD_FAILED, {
                    destination: dest,
                    errMessage: this.state.statusMessage,
                })
            } else if (ress.message === 'User exist on apple account') {
                this.setState({
                    statusMessage:
                        'This account has previously signed into GoalMogul using Apple login, so your password can no longer be reset manually. Please try signing in again with Apple. If you still experience an issue logging in, please email us at support@goalmogul.com\n\n' +
                        'Thanks!\n',
                    showAlert: true,
                    buttonLoading: false,
                })
                trackWithProperties(E.FORGET_PASSWORD_FAILED, {
                    destination: dest,
                    errMessage: this.state.statusMessage,
                })
            } else {
                this.setState({
                    statusMessage: ress.message,
                    showAlert: true,
                    buttonLoading: false,
                })
                trackWithProperties(E.FORGET_PASSWORD_FAILED, {
                    destination: dest,
                    errMessage: ress.message,
                })
            }
        } catch (err) {
            trackWithProperties(E.FORGET_PASSWORD_FAILED, {
                destination: dest,
                errMessage: err.message,
            })
            // this.setState({ statusMessage: message })
        }
    }

    pwResetRequest = (inputs) => {
        try {
            return API.post('pub/user/password/reset-request', inputs)
        } catch (e) {
            throw e
        }
    }

    render() {
        // console.log('SUCCCCESSS', this.state.success)
        return (
            <>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : ''}
                        style={{
                            flex: 1,
                            backgroundColor: color.GM_CARD_BACKGROUND,

                            alignItems: 'center',
                        }}
                        focusable
                    >
                        <OnboardingHeader />
                        <View
                            style={{
                                width: '90%',
                                borderWidth: 1,
                                borderRadius: 2,
                                marginTop: 15,
                                borderColor: 'lightgrey',
                            }}
                        >
                            {!this.state.success ? (
                                <>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontFamily: 'SFProDisplay-Bold',
                                            fontSize: 24,
                                            marginTop: 20,
                                        }}
                                    >
                                        Lost your password?
                                    </Text>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontFamily: 'SFProDisplay-Regular',
                                            fontSize: 18,
                                            paddingTop: 15,
                                        }}
                                    >
                                        {!this.state.showPhoneInput
                                            ? 'Please enter your email address'
                                            : 'Please enter your mobile # registered on GoalMogul'}
                                    </Text>

                                    {/* <InputBox
                                                onChangeText={(val) =>
                                                    this.setState({
                                                        emailOrPhone: val,
                                                    })
                                                }
                                                placeholder="Enter your Email"
                                                value={this.state.emailOrPhone}
                                                returnKeyType="done"
                                            /> */}
                                    {!this.state.showPhoneInput ? (
                                        <>
                                            <TextInput
                                                onChangeText={(val) =>
                                                    this.setState({
                                                        emailOrPhone: val,
                                                    })
                                                }
                                                textContentType="emailAddress"
                                                placeholder="Enter your Email"
                                                value={this.state.emailOrPhone}
                                                placeholderTextColor={
                                                    color.TEXT_COLOR
                                                        .PLACEHOLDER_COLOR
                                                }
                                                style={{
                                                    width: '90%',
                                                    height: 50,
                                                    borderWidth: 1,
                                                    borderRadius: 5,
                                                    borderColor: '#E4E9F2',
                                                    padding: 15,
                                                    fontSize: 16,
                                                    alignSelf: 'center',
                                                    marginTop: 20,
                                                }}
                                            />
                                            <Text
                                                style={[
                                                    default_style.smallTitle_1,
                                                    {
                                                        color: color.GM_BLUE,
                                                        paddingRight: 15,
                                                        paddingTop: 3,
                                                        alignSelf: 'flex-end',
                                                    },
                                                ]}
                                                onPress={() => Actions.pop()}
                                            >
                                                Return to Login Screen
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <InputBox
                                                key="phoneNumber"
                                                inputTitle="Phone Number"
                                                hideRedStar
                                                placeholder={`Enter Phone Number`}
                                                onSubmitEditing={() => {
                                                    Keyboard.dismiss()
                                                }}
                                                onChangeText={(val) =>
                                                    this.setState({
                                                        emailOrPhone: val,
                                                    })
                                                }
                                                style={{
                                                    borderRadius: 5,
                                                    backgroundColor: 'white',
                                                    fontSize: 16,
                                                    width: '90%',
                                                    alignSelf: 'center',
                                                }}
                                                value={this.state.emailOrPhone}
                                                countryCode={
                                                    this.state.countryCode
                                                }
                                                onCountryCodeSelected={(
                                                    value
                                                ) =>
                                                    this.setState({
                                                        countryCode: value,
                                                    })
                                                }
                                            />
                                            <Text
                                                style={[
                                                    default_style.smallTitle_1,
                                                    {
                                                        color: color.GM_BLUE,
                                                        paddingRight: 15,
                                                        alignSelf: 'flex-end',
                                                        bottom: 5,
                                                    },
                                                ]}
                                                onPress={() => Actions.pop()}
                                            >
                                                Return to Login Screen
                                            </Text>
                                        </>
                                    )}

                                    <DelayedButton
                                        onRef={(ref) =>
                                            (this.loginButton = ref)
                                        }
                                        activeOpacity={0.8}
                                        onPress={this.handleSumbit}
                                        style={[
                                            OnboardingStyles.button
                                                .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                .containerStyle,
                                            {
                                                backgroundColor: this.state
                                                    .buttonLoading
                                                    ? // Disable user agreement check
                                                      // || !this.state.userAgreementChecked
                                                      color.GM_BLUE_LIGHT
                                                    : color.GM_BLUE,
                                                width: '75%',
                                                alignSelf: 'center',
                                                marginTop: 15,
                                                borderRadius: 20,
                                            },
                                        ]}
                                        disabled={this.state.buttonLoading}
                                    >
                                        <Text
                                            style={[
                                                OnboardingStyles.button
                                                    .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                    .textStyle,
                                            ]}
                                        >
                                            Proceed
                                        </Text>
                                    </DelayedButton>
                                    <DelayedButton
                                        onRef={(ref) =>
                                            (this.loginButton = ref)
                                        }
                                        activeOpacity={0.8}
                                        onPress={() =>
                                            this.setState((prevState) => ({
                                                showPhoneInput: !prevState.showPhoneInput,
                                            }))
                                        }
                                        style={[
                                            OnboardingStyles.button
                                                .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                .containerStyle,
                                            {
                                                backgroundColor: this.state
                                                    .buttonLoading
                                                    ? // Disable user agreement check
                                                      // || !this.state.userAgreementChecked
                                                      color.GM_BLUE_LIGHT
                                                    : color.GM_DOT_GRAY,
                                                width: '90%',
                                                alignSelf: 'center',
                                                marginTop: !this.state
                                                    .showPhoneInput
                                                    ? 30
                                                    : null,
                                                borderRadius: 20,
                                                marginTop: 10,
                                                marginBottom: 20,
                                            },
                                        ]}
                                        disabled={this.state.buttonLoading}
                                    >
                                        <Text
                                            style={[
                                                OnboardingStyles.button
                                                    .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                    .textStyle,
                                            ]}
                                        >
                                            {this.state.showPhoneInput
                                                ? 'Find Account Using Email'
                                                : 'Find Account Using Mobile #'}
                                        </Text>
                                    </DelayedButton>
                                </>
                            ) : (
                                <>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontFamily: 'SFProDisplay-Bold',
                                            fontSize: 24,
                                            marginTop: 40,
                                        }}
                                    >
                                        Magic Link Sent!
                                    </Text>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontFamily: 'SFProDisplay-Regular',
                                            fontSize: 18,
                                            marginTop: 10,
                                            padding: 10,
                                        }}
                                    >
                                        We just sent an{' '}
                                        {this.state.showPhoneInput
                                            ? 'sms'
                                            : 'email'}{' '}
                                        to you at
                                        <Text
                                            style={{
                                                fontFamily: 'SFProDisplay-Bold',
                                            }}
                                        >
                                            {' '}
                                            {this.state.destination}{' '}
                                        </Text>
                                        It contains a link that’ll helps you
                                        reset your password!
                                    </Text>

                                    <DelayedButton
                                        onRef={(ref) =>
                                            (this.loginButton = ref)
                                        }
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            this.state.showPhoneInput
                                                ? Linking.openURL('sms:')
                                                : openInbox()
                                        }}
                                        style={[
                                            OnboardingStyles.button
                                                .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                .containerStyle,
                                            {
                                                backgroundColor: this.props
                                                    .loading
                                                    ? // Disable user agreement check
                                                      // || !this.state.userAgreementChecked
                                                      color.GM_BLUE_LIGHT
                                                    : color.GM_BLUE,
                                                width: '75%',
                                                alignSelf: 'center',
                                                marginTop: 10,
                                                marginBottom: 10,
                                                borderRadius: 20,
                                            },
                                        ]}
                                        disabled={this.props.loading}
                                    >
                                        <Text
                                            style={[
                                                OnboardingStyles.button
                                                    .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                    .textStyle,
                                            ]}
                                        >
                                            Open{' '}
                                            {this.state.showPhoneInput
                                                ? 'Messages'
                                                : 'Email'}
                                        </Text>
                                    </DelayedButton>
                                    <DelayedButton
                                        onRef={(ref) =>
                                            (this.loginButton = ref)
                                        }
                                        activeOpacity={0.8}
                                        onPress={() => Actions.pop()}
                                        style={[
                                            OnboardingStyles.button
                                                .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                .containerStyle,
                                            {
                                                backgroundColor: this.props
                                                    .loading
                                                    ? // Disable user agreement check
                                                      // || !this.state.userAgreementChecked
                                                      color.GM_BLUE_LIGHT
                                                    : color.GM_BLUE,
                                                width: '75%',
                                                alignSelf: 'center',
                                                marginBottom: 20,
                                                borderRadius: 20,
                                            },
                                        ]}
                                        disabled={this.props.loading}
                                    >
                                        <Text
                                            style={[
                                                OnboardingStyles.button
                                                    .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                    .textStyle,
                                            ]}
                                        >
                                            Go Back
                                        </Text>
                                    </DelayedButton>
                                </>
                            )}
                            <AwesomeAlert
                                show={this.state.showAlert}
                                // show={true}
                                title="Unable to Reset Password"
                                titleStyle={{
                                    fontWeight: 'bold',
                                    fontSize: 20,
                                }}
                                contentContainerStyle={{
                                    minHeight: 160,
                                    width: '80%',
                                }}
                                messageStyle={{
                                    fontSize: 15,
                                    fontWeight: '500',
                                }}
                                message={this.state.statusMessage}
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
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </>
        )
    }
}

const styles = StyleSheet.create({})

export default PasswordReset
