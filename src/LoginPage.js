/** @format */

import React, { Component } from 'react'
import {
    View,
    Text,
    Animated,
    Keyboard,
    StatusBar,
    TouchableOpacity,
    Alert,
    Image,
    Platform,
} from 'react-native'
import _ from 'lodash'
import { connect } from 'react-redux'
import {
    Field,
    reduxForm,
    SubmissionError,
    formValueSelector,
} from 'redux-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ReactMoE from 'react-native-moengage'

/* Actions */
import { registerUser, loginUser, logInWithSocialMediaAccount } from './actions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DEVICE_PLATFORM } from './Utils/Constants'
import Recaptcha from './Main/Common/Recaptcha'
import { SCREENS, track, wrapAnalytics, EVENT as E } from './monitoring/segment'
import InputBox from './Main/Onboarding/Common/InputBox'
import { default_style, color, text } from './styles/basic'
import OnboardingStyles from './styles/Onboarding'

import DelayedButton from './Main/Common/Button/DelayedButton'
import { CheckBox } from '@ui-kitten/components'
import {
    isValidEmail,
    isPossiblePhoneNumber,
    isValidPhoneNumber,
} from './redux/middleware/utils'
import OnboardingHeader from './Main/Onboarding/Common/OnboardingHeader'
import { Actions } from 'react-native-router-flux'
import GoogleButton from './components/GoogleButton'
import AppleButton from './components/AppleButton'
import OrView from './components/OrView'
import LoadingModal from './Main/Common/Modal/LoadingModal'
import LottieView from 'lottie-react-native'
import UPLOADING_LOTTIE from './asset/image/uploading_1.json'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import TouchID from 'react-native-touch-id'
import { storeData, getData } from './store/storage'
import AwesomeAlert from 'react-native-awesome-alerts'

const FIELD_REQUIREMENT = {
    username: {
        required: 'Email or Phone number is required',
        invalid_username: 'Invalid Email or Phone number',
        invalid_phone_num: 'Invalid Phone number',
    },
    password: {
        required: 'Password is required',
        too_short: 'Password is at least 8 characters',
    },
}

const DEFAULT_SPACE_ABOVE_LOGIN_BUTTON_NO_KEYBOARD = 112
const DEFAULT_SPACE_ABOVE_LOGIN_BUTTON_WITH_KEYBOARD = 24

const optionalConfigObject = {
    title: 'Authentication Required', // Android
    color: '#e00606', // Android,
    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
}
class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showRecaptcha: false,
            numFailLoginAttempt: 0,
            spaceAboveLoginButton: new Animated.Value(
                DEFAULT_SPACE_ABOVE_LOGIN_BUTTON_NO_KEYBOARD
            ),
            shouldScrollToLoginButton: false,
            errMsg: undefined,
            // TODO are these still relevant?
            username: undefined,
            password: undefined,
            biometryType: null,
            isChecked: true,
            initialEmail: '',
            showAlert: false,
            initialPassword: '',

            // Disable user agreement
            // userAgreementChecked: false,
        }
    }
    async componentDidMount() {
        // this.props.initialize({ username: 'your name' })
        const userSavedData = await getData('userLoginCreds')
        this.setState({
            initialEmail: userSavedData?.username,
            initialPassword: userSavedData?.password,
        })
        TouchID.isSupported().then((biometryType) => {
            this.setState({ biometryType })
        })
        Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
        Keyboard.addListener('keyboardWillShow', this._keyboardWillShow)
        Keyboard.addListener('keyboardWillHide', this._keyboardWillHide)
    }
    componentWillUnmount() {
        Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow)
        Keyboard.removeListener('keyboardWillShow', this._keyboardWillShow)
        Keyboard.removeListener('keyboardWillHide', this._keyboardWillHide)
    }

    authenticateWithTouchID = async () => {
        // Check if TouchID is available
        try {
            const isTouchIDAvailable = await TouchID.isSupported()
            if (isTouchIDAvailable) {
                // Prompt the user to authenticate with TouchID
                const touchIDResult = await TouchID.authenticate(
                    Platform.OS === 'ios'
                        ? `FaceId required to log into GoalMogul`
                        : 'TouchId required to log into GoalMogul',
                    optionalConfigObject
                )
                if (touchIDResult) {
                    // Retrieve the stored email and password from the asyncStorage
                    if (this.state.initialEmail && this.state.initialPassword) {
                        setTimeout(() => {
                            return this.props.loginUser({
                                username: this.state.initialEmail,
                                password: this.state.initialPassword,
                                onError: (errMsg, username) => {
                                    this.increaseNumFailLoginAttempt()
                                    this.setErrorMessage(errMsg)
                                    // Set username to the one we applied
                                    // This is for phone number when user
                                    // doesn't enter country code so that it's
                                    // clear which country code we are using / assuming
                                    // this.props.change('username', username)
                                },
                                onSuccess: async () => {
                                    ReactMoE.setUserUniqueID(username)
                                    this.resetNumFailLoginAttempt()
                                    this.resetErrorMessage()
                                    !this.state.isChecked &&
                                        (await AsyncStorage.removeItem(
                                            'userLoginCreds'
                                        ))
                                },
                                isFaceId: true,
                            })
                        }, 500)
                    } else {
                        this.setState({ showAlert: true })
                    }
                }
            } else {
                Alert.alert(
                    'There is an error proceeding it. Please try again.'
                )
            }
        } catch (error) {
            console.log('ERRRRORRR', error.message)
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

    validate = (values) => {
        const { username, password } = values
        const errors = {}
        errors.username = this.validateUsername(username)
        errors.password = this.validatePassword(password)
        return errors
    }

    /**
     * This validation only checks for if username exists.
     * @param {*} username
     */
    validateUsername = (username) => {
        // Missing username
        if (!username || !username.trim()) {
            return FIELD_REQUIREMENT.username.required
        }

        const possiblePhoneNumber = isPossiblePhoneNumber(username)
        const validPhoneNumber = isValidPhoneNumber(username)
        const validEmail = isValidEmail(username)

        // valid email or valid phone number
        if (validEmail || validPhoneNumber) return undefined // pass email or phone number check

        if (possiblePhoneNumber) {
            return FIELD_REQUIREMENT.username.invalid_phone_num
        }
        return FIELD_REQUIREMENT.username.invalid_username
    }

    validatePassword = (password) => {
        let error
        // Validate password
        if (!password) {
            error = FIELD_REQUIREMENT.password.required
        } else if (password.trim().length < 8) {
            error = FIELD_REQUIREMENT.password.too_short
        }
        return error
    }

    openRecaptcha = () => {
        this.setState({
            ...this.state,
            showRecaptcha: true,
        })
    }

    closeRecaptcha = () => {
        this.setState({
            ...this.state,
            showRecaptcha: false,
            username: undefined,
            password: undefined,
        })
    }

    increaseNumFailLoginAttempt = () => {
        this.setState({
            ...this.state,
            numFailLoginAttempt: this.state.numFailLoginAttempt + 1,
        })
    }

    resetNumFailLoginAttempt = () => {
        this.setState({
            ...this.state,
            numFailLoginAttempt: 0,
        })
    }

    setErrorMessage = (errMsg) => {
        this.setState({
            ...this.state,
            errMsg,
        })
    }

    resetErrorMessage = () => {
        this.setState({
            ...this.state,
            errMsg: undefined,
        })
    }

    handleResetPassword = async () => {
        // const canOpen = await Linking.canOpenURL(RESET_PASSWORD_URL)
        // if (canOpen) {
        //     await Linking.openURL(RESET_PASSWORD_URL)
        // }
        Actions.push('passwordReset')
    }

    handleSignUp = () => {
        this.props.registerUser()
        track(E.SPLASH_SCREEN_SIGN_UP)
    }

    handleLoginPressed = async (values) => {
        // Disable user agreement
        // if (!this.state.userAgreementChecked) return
        const errors = this.validate(values)

        const hasErrors =
            Object.keys(errors).length &&
            _.filter(
                _.map(Object.keys(errors), (key) => _.get(errors, key)),
                (error) => error !== undefined
            ).length > 0
        if (hasErrors) {
            throw new SubmissionError(errors)
        }
        const { username, password } = values

        Keyboard.dismiss()

        if (this.state.numFailLoginAttempt >= 2) {
            // Show recaptcha for not a robot verification
            this.setState(
                {
                    ...this.state,
                    username,
                    password,
                },
                () => this.openRecaptcha()
            )
        } else {
            this.props.loginUser({
                username,
                password,
                onError: (errMsg, username) => {
                    this.increaseNumFailLoginAttempt()
                    this.setErrorMessage(errMsg)
                    // Set username to the one we applied
                    // This is for phone number when user
                    // doesn't enter country code so that it's
                    // clear which country code we are using / assuming
                    this.props.change('username', username)
                },
                onSuccess: async () => {
                    // await Keychain.setGenericPassword(username, password)
                    ReactMoE.setUserUniqueID(username)
                    // ReactMoE.setUserEmailID(username)
                    this.resetNumFailLoginAttempt()
                    this.resetErrorMessage()
                    this.state.isChecked
                        ? await storeData('userLoginCreds', {
                              username,
                              password,
                          })
                        : await AsyncStorage.removeItem('userLoginCreds')
                },
                isFaceId: false,
            })
        }
    }

    handleRecaptchaOnSuccess = () => {
        // clear state
        this.closeRecaptcha()
        const { username, password } = this.state

        setTimeout(() => {
            // handle login
            this.props.loginUser({
                username,
                password,
                onError: (errMsg) => {
                    this.increaseNumFailLoginAttempt()
                    this.setErrorMessage(errMsg)
                },
                onSuccess: () => {
                    this.resetNumFailLoginAttempt()
                    this.resetErrorMessage()
                },
                isFaceId: false,
            })
        }, 100)
    }

    scrollToLoginButton() {
        this.setState({
            shouldScrollToLoginButton: true,
        })
    }

    renderError(error) {
        return error ? (
            <View
                style={{
                    height: 50,
                    paddingHorizontal: 20,
                    justifyContent: 'center',
                }}
            >
                <Text style={[default_style.normalText_1, styles.errorStyle]}>
                    {error}
                </Text>
            </View>
        ) : (
            <View style={{ height: 50 }} />
        )
    }

    renderRecaptcha() {
        return (
            <Recaptcha
                showRecaptcha={this.state.showRecaptcha}
                closeModal={this.closeRecaptcha}
                onSuccess={this.handleRecaptchaOnSuccess}
            />
        )
    }

    hideAlert = () => {
        this.setState({
            showAlert: false,
        })
    }

    renderSignUp = () => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    marginTop: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={[
                        default_style.subTitleText_1,
                        {
                            fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                            color: color.GM_MID_GREY,
                        },
                    ]}
                >
                    Don't have an account?
                </Text>
                <DelayedButton
                    style={[{ padding: 12, paddingLeft: 3 }]}
                    onPress={this.handleSignUp}
                >
                    <Text
                        style={[
                            default_style.subTitleText_1,
                            {
                                fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                                color: color.GM_BLUE,
                            },
                        ]}
                    >
                        {' '}
                        Sign Up
                    </Text>
                </DelayedButton>
            </View>
        )
    }

    render() {
        const { handleSubmit, socialMediaError } = this.props
        return (
            <View style={[OnboardingStyles.container.page]}>
                <StatusBar
                    animated={true}
                    backgroundColor={color.GM_BLUE}
                    // barStyle={statusBarStyle}
                    // showHideTransition={statusBarTransition}
                />
                <KeyboardAwareScrollView
                    bounces={false}
                    // enableOnAndroid={true}
                    innerRef={(ref) => (this.scrollView = ref)}
                    // keyboardShouldPersistTaps={'handled'}
                >
                    <LoadingModal visible={this.props.socialMediaLoading} />
                    <OnboardingHeader />

                    <LoadingModal visible={this.props.loading}>
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
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: color.GM_CARD_BACKGROUND,
                        }}
                    >
                        <View style={[OnboardingStyles.container.card]}>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                }}
                            >
                                {this.renderError(
                                    this.state.errMsg || socialMediaError
                                )}
                                <GoogleButton
                                    text={'Continue with Google'}
                                    onPress={() => {
                                        this.props.logInWithSocialMediaAccount(
                                            'google_login'
                                        )
                                    }}
                                />
                                {DEVICE_PLATFORM === 'ios' && (
                                    <AppleButton
                                        onPress={() => {
                                            this.props.logInWithSocialMediaAccount(
                                                'apple_login'
                                            )
                                        }}
                                    />
                                )}
                                <OrView />
                                <Field
                                    name="username"
                                    label="Email"
                                    inputTitle="Enter your Email"
                                    placeholder="Email"
                                    component={InputBox}
                                    disabled={this.props.loading}
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        /**
                                         * Most cases the user has filled password and is focussed on user is:
                                         * A. Credentials were autofilled
                                         * B. user needs to fix email/phone and submit again
                                         * Either case, by pressing enter they would expect it to submit
                                         * If they want to correct password, they would just tap the input
                                         */
                                        if (
                                            this.props.password &&
                                            this.props.password.length
                                        ) {
                                            handleSubmit(
                                                this.handleLoginPressed
                                            )
                                        }
                                        // else {
                                        //     this.refs['password']
                                        //         .getRenderedComponent()
                                        //         .focus()
                                        // }
                                    }}
                                    onFocus={this.scrollToLoginButton.bind(
                                        this
                                    )}
                                    textContentType="username"
                                    caption=" "
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                                <Field
                                    ref="password"
                                    name="password"
                                    label="Password"
                                    inputTitle="Enter your Password"
                                    placeholder="Password"
                                    withRef
                                    component={InputBox}
                                    disabled={this.props.loading}
                                    onSubmitEditing={handleSubmit(
                                        this.handleLoginPressed
                                    )}
                                    onFocus={this.scrollToLoginButton.bind(
                                        this
                                    )}
                                    textContentType="password"
                                    secureTextEntry
                                    caption=" "
                                />
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        <CheckBox
                                            checked={this.state.isChecked}
                                            onChange={(checked) =>
                                                this.setState({
                                                    isChecked: checked,
                                                })
                                            }
                                            style={{
                                                width: 10,
                                                height: 15,
                                                marginHorizontal: 2,
                                            }}
                                        />
                                        <Text
                                            style={[
                                                default_style.smallTitle_1,
                                                {
                                                    color: '#828282',
                                                    padding: 8,
                                                    paddingTop: 0,
                                                    alignSelf: 'flex-end',
                                                    marginHorizontal: 7,
                                                },
                                            ]}
                                        >
                                            Remember Me
                                        </Text>
                                    </View>

                                    <Text
                                        style={[
                                            default_style.smallTitle_1,
                                            {
                                                color: color.GM_BLUE,
                                                padding: 8,
                                                paddingTop: 0,
                                                alignSelf: 'flex-end',
                                            },
                                        ]}
                                        onPress={this.handleResetPassword}
                                    >
                                        Forgot password?
                                    </Text>
                                </View>

                                {/*
                                Disable user agreement check
                                <UserAgreementCheckBox
                                    onPress={(val) =>
                                        this.setState({
                                            ...this.state,
                                            userAgreementChecked: val,
                                        })
                                    }
                                    checked={this.state.userAgreementChecked}
                                /> */}
                                {/* Comment below when user agreement check is in use */}
                            </View>
                            <TouchableOpacity
                                onPress={this.authenticateWithTouchID}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 10,
                                }}
                            >
                                <Text
                                    style={[
                                        default_style.smallTitle_1,
                                        {
                                            color: color.GM_BLUE,
                                            padding: 8,
                                            fontSize: 13,
                                        },
                                    ]}
                                >
                                    {`Login with ${
                                        Platform.OS === 'ios'
                                            ? this.state.biometryType
                                            : 'TouchId'
                                    }`}
                                </Text>
                                <Image
                                    source={require('./asset/image/faceid2.png')}
                                    style={{
                                        resizeMode: 'contain',
                                        height: 30,
                                        width: 30,
                                    }}
                                />
                            </TouchableOpacity>
                            <Animated.View
                                style={{
                                    height: this.state.spaceAboveLoginButton,
                                }}
                            />
                            <View
                                style={{
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            >
                                <DelayedButton
                                    onRef={(ref) => (this.loginButton = ref)}
                                    activeOpacity={0.8}
                                    // onPress={handleSubmit(
                                    //     this.handleLoginPressed
                                    // )}
                                    onPress={handleSubmit(
                                        this.handleLoginPressed
                                    )}
                                    style={[
                                        OnboardingStyles.button
                                            .GM_BLUE_BG_WHITE_BOLD_TEXT
                                            .containerStyle,
                                        {
                                            backgroundColor: this.props.loading
                                                ? // Disable user agreement check
                                                  // || !this.state.userAgreementChecked
                                                  color.GM_BLUE_LIGHT
                                                : color.GM_BLUE,
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
                                        Log In
                                    </Text>
                                </DelayedButton>
                                {/* <DelayedButton
                                    onRef={(ref) => (this.loginButton = ref)}
                                    activeOpacity={0.8}
                                    // onPress={handleSubmit(
                                    //     this.handleLoginPressed
                                    // )}
                                    onPress={this.authenticateWithTouchID}
                                    style={[
                                        OnboardingStyles.button
                                            .GM_BLUE_BG_WHITE_BOLD_TEXT
                                            .containerStyle,
                                        {
                                            backgroundColor: this.props.loading
                                                ? // Disable user agreement check
                                                  // || !this.state.userAgreementChecked
                                                  color.GM_BLUE_LIGHT
                                                : color.GM_BLUE,
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
                                        {`Authenticate with ${this.state.biometryType}`}
                                    </Text>
                                </DelayedButton> */}
                                {this.renderSignUp()}
                            </View>
                        </View>
                    </View>
                    {this.renderRecaptcha()}
                    <AwesomeAlert
                        show={this.state.showAlert}
                        title="Unable to Proceed!"
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
                        message={`Sign in with email and password this time. Next time,you'll be able to use Face ID.`}
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
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

const styles = {
    bodyContainerStyle: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    titleTextStyle: {
        fontSize: 25,
        fontWeight: '700',
        color: '#646464',
        alignSelf: 'center',
        marginTop: 25,
    },
    splitterStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    splitterTextStyle: {
        fontSize: 15,
        color: '#646464',
        fontWeight: '800',
        marginLeft: 10,
        marginRight: 10,
    },
    errorStyle: {
        color: '#ff0033',
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',
    },
}

const mapStateToProps = (state) => {
    const selector = formValueSelector('loginForm')
    const { loading, socialMediaLoading, socialMediaError } = state.auth

    return {
        loading,
        socialMediaLoading,
        username: selector(state, 'username'),
        password: selector(state, 'password'),
        socialMediaError,
    }
}

// Analytics must be the inner most HOC wrapper
const AnalyticsWrapper = wrapAnalytics(LoginPage, SCREENS.LOGIN_PAGE)

const ReduxWrapper = reduxForm({
    form: 'loginForm',
})(AnalyticsWrapper)

export default connect(mapStateToProps, {
    registerUser,
    loginUser,
    logInWithSocialMediaAccount,
})(ReduxWrapper)
