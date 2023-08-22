/** @format */

import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    StyleSheet,
    Keyboard,
} from 'react-native'
import { color } from '../../styles/basic'
import InputBox from './Common/InputBox'
import OnboardingHeader from './Common/OnboardingHeader'
import { connect } from 'react-redux'
import { api as API } from '../../redux/middleware/api'
import DelayedButton from '../Common/Button/DelayedButton'
import OnboardingStyles, { getCardBottomOffset } from '../../styles/Onboarding'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
    trackWithProperties,
    EVENT as E,
    wrapAnalytics,
    SCREENS,
} from '../../monitoring/segment'
import { updateBasicProfile } from '../../redux/modules/registration/RegistrationActions'
import moment from 'moment'
import { Actions } from 'react-native-router-flux'
import LoadingModal from '../Common/Modal/LoadingModal'
import { DotIndicator } from 'react-native-indicators'

const { text: textStyle, button: buttonStyle } = OnboardingStyles
let dateToSend = undefined

const FIELD_REQUIREMENTS = {
    done: 'done',
    inviteCode: {
        require_code: 'Invite Code is required',
    },
    dateOfBirth: {
        invalid_dateOfBirth: 'Invalid Date of Birth',
        require_dateOfBirth: 'Date of Birth is required',
    },
}

class GoogleSignup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dateOfBirthStatus: undefined,
            dateOfBirth: '',
            gender: '',
        }
    }

    onNext = async () => {
        const { gender, dateOfBirth } = this.state
        const payload = {
            gender,
            dateOfBirth,
        }
        const respo = await this.props.updateBasicProfile(payload)
        console.log('Respnsee', respo)
        Actions.replace('waitlist')
    }

    validateDateDOB = (dateOfBirth) => {
        let oneYearFromNow = new Date()
        let validateDateTo = oneYearFromNow.setFullYear(
            oneYearFromNow.getFullYear() - 13
        )
        let validateDateFrom = oneYearFromNow.setFullYear(
            oneYearFromNow.getFullYear() - 71
        )
        let validateDateToTime = new Date(validateDateTo).getTime()
        const checkDate =
            moment(dateOfBirth, 'MM/DD/YYYY').format('MM/DD/YYYY') ===
            dateOfBirth
        let validateDateFromTime = new Date(validateDateFrom).getTime()
        let selectedDateToTime = new Date(dateOfBirth).getTime()
        if (!dateOfBirth) {
            this.setState({
                dateOfBirthStatus:
                    FIELD_REQUIREMENTS.dateOfBirth.require_dateOfBirth,
            })
        } else if (
            selectedDateToTime >= validateDateToTime ||
            !checkDate ||
            selectedDateToTime <= validateDateFromTime
        ) {
            this.setState({
                dateOfBirthStatus:
                    FIELD_REQUIREMENTS.dateOfBirth.invalid_dateOfBirth,
            })
        } else {
            this.setState({
                dateOfBirthStatus: FIELD_REQUIREMENTS.done,
            })
        }
    }

    handleFilterUpdate(filterValue) {
        dateToSend = new Date(filterValue)
    }
    renderError(error) {
        return error ? (
            <View style={{ height: 29 }}>
                <Text style={styles.errorStyle}>{error}</Text>
            </View>
        ) : null
    }

    render() {
        const {
            registerErrMsg,
            updateGenderLoading,
            updateGenderErrorMessage,
        } = this.props
        const { gender, dateOfBirth, dateOfBirthStatus } = this.state

        return (
            <>
                <LoadingModal visible={updateGenderLoading} />
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <KeyboardAwareScrollView
                        bounces={false}
                        // enableOnAndroid={true}

                        innerRef={(ref) => (this.scrollView = ref)}
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        <View
                            style={[
                                OnboardingStyles.container.page,
                                {
                                    paddingBottom: getCardBottomOffset(),
                                    flex: 1,
                                },
                            ]}
                        >
                            <OnboardingHeader />
                            <View
                                style={{
                                    backgroundColor: color.GM_CARD_BACKGROUND,
                                    padding: 16,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        // marginBottom: 20,
                                        marginTop: 80,
                                    }}
                                >
                                    {!!updateGenderErrorMessage &&
                                        this.renderError(
                                            updateGenderErrorMessage
                                        )}
                                </View>
                                <Text
                                    style={
                                        ([textStyle.title],
                                        {
                                            fontSize: 22,
                                            fontWeight: '700',
                                            alignSelf: 'flex-start',
                                        })
                                    }
                                >
                                    Almost there!
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'SFProDisplay-Regular',
                                        fontSize: 14,
                                        lineHeight: 17,
                                        alignSelf: 'flex-start',
                                        padding: 3,

                                        color: '#828282',
                                    }}
                                >
                                    A couple more steps...
                                </Text>

                                <InputBox
                                    key="gender"
                                    inputTitle="Gender"
                                    ref="gender"
                                    onChangeText={(val) => {
                                        this.setState({ gender: val })
                                    }}
                                    value={gender}
                                    disabled={this.props.loading}
                                />
                                <InputBox
                                    key="dateOfBirth"
                                    inputTitle="Date of birth"
                                    ref="dateOfBirth"
                                    onChangeText={(val) => {
                                        this.setState({
                                            dateOfBirth: val,
                                        })
                                        this.validateDateDOB(val)
                                    }}
                                    onBlur={() =>
                                        this.validateDateDOB(dateOfBirth)
                                    }
                                    onSubmitEditing={() => {
                                        this.validateDateDOB(dateOfBirth)
                                        // TODO
                                        // this.scrollView.props.scrollToFocusedInput()
                                        Keyboard.dismiss()
                                    }}
                                    status={
                                        this.state.dateOfBirthStatus &&
                                        this.state.dateOfBirthStatus !==
                                            FIELD_REQUIREMENTS.done
                                            ? 'danger'
                                            : 'basic'
                                    }
                                    placeholder={`You must be at least 13yrs of age`}
                                    value={dateOfBirth}
                                    returnKeyType="done"
                                    caption={
                                        !this.state.dateOfBirthStatus ||
                                        this.state.dateOfBirthStatus ==
                                            FIELD_REQUIREMENTS.done
                                            ? `We won't share this information with anyone`
                                            : this.state.dateOfBirthStatus
                                    }
                                    disabled={this.props.loading}
                                />
                            </View>
                            <View
                                style={{
                                    alignItems: 'center',
                                    paddingBottom: 40,
                                    flex: 1,
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <DelayedButton
                                    onPress={this.onNext}
                                    activeOpacity={0.6}
                                    style={[
                                        buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                            .containerStyle,
                                        {
                                            marginBottom: 8,
                                            backgroundColor:
                                                !gender ||
                                                dateOfBirthStatus !== 'done'
                                                    ? color.GM_DOT_GRAY
                                                    : color.GM_BLUE,
                                            width: '95%',
                                        },
                                    ]}
                                    disabled={
                                        !gender || dateOfBirthStatus !== 'done'
                                    }
                                >
                                    <Text
                                        style={
                                            buttonStyle
                                                .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                .textStyle
                                        }
                                    >
                                        Continue
                                    </Text>
                                </DelayedButton>
                                <DelayedButton
                                    style={[
                                        buttonStyle.GM_WHITE_BG_GRAY_TEXT
                                            .containerStyle,
                                    ]}
                                    onPress={() => Actions.pop()}
                                >
                                    <Text
                                        style={
                                            buttonStyle.GM_WHITE_BG_GRAY_TEXT
                                                .textStyle
                                        }
                                    >
                                        Cancel
                                    </Text>
                                </DelayedButton>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </TouchableWithoutFeedback>
            </>
        )
    }
}

const styles = StyleSheet.create({
    textinput: {
        paddingTop: 10,
        paddingHorizontal: 10,
        padding: 5,
    },
    imagePickerStyles: {
        marginVertical: 60,
    },
    errorStyle: {
        marginTop: 5,
        color: '#ff0033',
        justifyContent: 'center',
        alignSelf: 'center',
    },
})

const mapStateToProps = (state) => {
    const {
        name,
        email,
        password,
        gender,
        dateOfBirth,
        error,
        loading,
        registerErrMsg,
        inviterCode,
        updateGenderLoading,
        updateGenderErrorMessage,
    } = state.registration

    return {
        name,
        email,
        password,
        gender,
        dateOfBirth,
        error,
        loading,
        registerErrMsg,
        inviterCode,
        updateGenderLoading,
        updateGenderErrorMessage,
    }
}

const AnalyticsWrapper = wrapAnalytics(GoogleSignup)

export default connect(mapStateToProps, {
    updateBasicProfile,
})(AnalyticsWrapper)
// export default OnboardingInviteCode
