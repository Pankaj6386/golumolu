/** @format */

import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    ActionSheetIOS,
    Dimensions,
    SafeAreaView,
    Keyboard,
    Platform,
    Text,
    Image,
} from 'react-native'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import EditIcon from '../../../asset/utils/edit-icon.png'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { DotIndicator } from 'react-native-indicators'
import {
    EVENT as E,
    track,
    trackWithProperties,
} from '../../../monitoring/segment'

/* Component */
import FormHeader from '../../Common/Header/FormHeader'
import LoadingModal from '../../Common/Modal/LoadingModal'

import PROFIE_INFO from '../../../asset/image/messageUI1.png'

/* Actions */
import {
    submitUpdatingProfile,
    openCamera,
    openCameraRoll,
} from '../../../actions'

// Selectors
import {
    getUserDataByPageId,
    getUserData,
} from '../../../redux/modules/User/Selector'

/** Constants */
import { color, default_style } from '../../../styles/basic'
import { Icon } from '@ui-kitten/components'
import ProfileImage from '../../Common/ProfileImage'

import {
    getProfileImageOrDefault,
    getProfileImageOrDefaultFromUser,
} from '../../../redux/middleware/utils'
import BottomButtonsSheet from '../../Common/Modal/BottomButtonsSheet'
import { getButtonBottomSheetHeight } from '../../../styles'
import { resetTutorial } from '../../../redux/modules/User/TutorialActions'
import { getToastsData } from '../../../actions/ToastActions'
import { refreshActivityFeed } from '../../../redux/modules/home/feed/actions'
import ProfileInfoTooltip from '../../../components/ProfileInfoTooltip'
import { TextInput } from 'react-native-gesture-handler'
import CountryDropdown from '../../../components/CountryDropdown'
import AboutTextInput from '../../../components/AboutTextinput'

const BUTTONS = ['Take a Picture', 'Camera Roll', 'Cancel']
const TAKING_PICTURE_INDEX = 0
const CAMERA_ROLL_INDEX = 1
const CANCEL_INDEX = 2

const { width } = Dimensions.get('window')
const DEBUG_KEY = '[ UI ProfileDetailEditForm ]'

class ProfileDetailEditForm extends Component {
    updateRef(name, ref) {
        this[name] = ref
    }
    constructor() {
        super()
        this.inputRefs = {}
        this.state = {
            mylinkCountArray: [1],
            countryModalVisible: false,
            aboutModalVisible: false,
        }
    }

    refreshActivity = () => this.props.refreshActivityFeed()

    submit = (values) => {
        console.log(
            '\ninitialValues from submit in ProfileDetailEditForm',
            this.props.initialValues
        )
        console.log('\nprofile from submit in ProfileDetailEditForm', values)

        const refreshActivity = () => {
            this.refreshActivity()
        }

        const hasImageModified =
            JSON.stringify(this.props.initialValues.profile.image) !==
            JSON.stringify(values.profile.image)
        this.props.submitUpdatingProfile(
            { values, hasImageModified },
            this.props.pageId,
            refreshActivity
        )

        track(E.PROFILE_UPDATED)
    }

    _scrollToInput(reactNode) {
        // Add a 'scroll' ref to your ScrollView
        this.scrollview.props.scrollToFocusedInput(reactNode)
    }

    // handleOnFocus = (position) => {
    //     console.log('on focus')
    //     this.refs.scrollview.scrollTo({ x: 0, y: position, animated: true })
    // }

    chooseImage = async () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
            },
            (buttonIndex) => {
                console.log('button clicked', BUTTONS[buttonIndex])
                switch (buttonIndex) {
                    case TAKING_PICTURE_INDEX:
                        this.props.openCamera((result) => {
                            this.props.change('profile.image', result.uri)
                        })
                        break
                    case CAMERA_ROLL_INDEX:
                        this.props.openCameraRoll((_, result) => {
                            this.props.change('profile.image', result.uri)
                        })
                        break
                    default:
                        return
                }
            }
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
    openCameraRollBottomSheet = () => this.CameraRefBottomSheetRef.open()
    closeNotificationBottomSheet = () => this.CameraRefBottomSheetRef.close()
    makeCameraRefOptions = () => {
        return [
            {
                text: 'Take a Picture',
                onPress: () => {
                    this.closeNotificationBottomSheet(),
                        setTimeout(() => {
                            this.props.openCamera((result) => {
                                this.props.change('profile.image', result.uri)
                            })
                        }, 500)
                },
            },
            {
                text: 'Camera Roll',
                onPress: () => {
                    this.closeNotificationBottomSheet()
                    setTimeout(() => {
                        this.props.openCameraRoll((_, result) => {
                            this.props.change('profile.image', result.uri)
                        })
                    }, 500)
                },
            },
        ]
    }

    renderImage = ({ input: { value } }) => {
        return (
            <View style={{ width: '100%' }}>
                <View
                    style={{
                        height: 90 * default_style.uiScale,
                        backgroundColor: color.GM_BLUE_LIGHT_LIGHT,
                    }}
                />
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={
                        Platform.OS == 'ios'
                            ? this.chooseImage
                            : this.openCameraRollBottomSheet
                    }
                >
                    <View style={styles.imageContainerStyle}>
                        <View style={styles.imageWrapperStyle}>
                            <ProfileImage
                                imageStyle={styles.imageStyle}
                                imageUrl={getProfileImageOrDefault(value)}
                            />
                        </View>
                    </View>
                    <View style={styles.iconContainerStyle}>
                        <Image source={EditIcon} style={styles.editIconStyle} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    // TODO: convert this to an independent component
    renderInput = ({
        input: { onChange, onFocus, ...restInput },
        input,
        label,
        secure,
        limitation,
        multiline,
        disabled,
        clearButtonMode,
        enablesReturnKeyAutomatically,
        forFocus,
        onNextPress,
        autoCorrect,
        meta: { error },
        returnKeyType,
        isRequired,
        refName,
        customStyle,
        hideTitle,
        ...custom
    }) => {
        return (
            <View style={styles.inputContainerStyle}>
                {!hideTitle ? (
                    <Text style={styles.label}>
                        {label}
                        {isRequired ? (
                            <Text style={styles.require}>{' *'}</Text>
                        ) : null}
                    </Text>
                ) : null}

                <TextInput
                    ref={(ref) => {
                        if (refName) {
                            this.inputRefs[refName] = ref
                        }
                    }}
                    style={[
                        styles.defaultTextInputStyle,
                        customStyle && customStyle,
                    ]}
                    title={custom.title}
                    autoCapitalize={'none'}
                    onChangeText={onChange}
                    error={error}
                    enablesReturnKeyAutomatically={
                        enablesReturnKeyAutomatically
                    }
                    returnKeyType={returnKeyType || 'done'}
                    secureTextEntry={secure}
                    characterRestriction={limitation}
                    multiline={multiline}
                    clearButtonMode={clearButtonMode}
                    onFocus={forFocus}
                    disabled={disabled}
                    blurOnSubmit={false}
                    autoCorrect
                    onSubmitEditing={(key) => {
                        if (onNextPress) {
                            onNextPress()
                        }
                    }}
                    {...custom}
                    {...restInput}
                />
            </View>
        )
    }

    render() {
        const {
            headline,
            about,
            elevatorPitch,
            handleSubmit,
            uploading,
            initialValues,
        } = this.props
        const isValidValues = validValues({ headline, about, elevatorPitch })
        const { countryModalVisible, aboutModalVisible } = this.state
        const { links, country } = this.props

        return (
            <View style={{ flex: 1 }}>
                <FormHeader
                    segmants
                    title="Profile"
                    onSubmit={handleSubmit(this.submit)}
                    actionDisabled={!isValidValues || uploading}
                />
                <SafeAreaView
                    forceInset={{ bottom: 'always' }}
                    style={{ backgroundColor: 'white', flex: 1 }}
                    onPress={() => {
                        Keyboard.dismiss()
                    }}
                >
                    <LoadingModal
                        visible={this.props.uploading}
                        customIndicator={
                            <DotIndicator size={12} color="white" />
                        }
                    />
                    <KeyboardAwareScrollView
                        enableOnAndroid
                        innerRef={(ref) => {
                            this.scrollview = ref
                        }}
                        nestedScrollEnabled
                        extraScrollHeight={Platform.select({
                            ios: 50,
                            default: 50,
                        })}
                        keyboardOpeningTime={0}
                        contentContainerStyle={{
                            backgroundColor: 'white',
                            flexGrow: 1,
                        }}
                    >
                        {/* <ProfileInfoTooltip
                            text={
                                'YOU HAVE GREATNESS IN YOU! Don’t be afraid to mention some of your life’s Top 10 awesome achievements that make you the total badass that you are! 🔥💪👏'
                            }
                            width={'70%'}
                            height={125}
                            top={280}
                            right={43}
                            infoKey={'profile_info_tooltip_2'}
                            image={PROFIE_INFO}
                            padding={6}
                            crossTop={16.5}
                            crossRight={5}
                        /> */}
                        <Field
                            name="profile.image"
                            label="Profile Picture"
                            component={this.renderImage.bind(this)}
                        />
                        <View style={{ paddingHorizontal: 20, flex: 1 }}>
                            <Field
                                name="name"
                                label="Full Name"
                                component={this.renderInput}
                                disabled={uploading}
                                returnKeyType="next"
                                autoCorrect
                                isRequired={true}
                                onNextPress={() => {
                                    this.inputRefs['headline']?.focus()
                                }}
                            />
                            <Field
                                refName="headline"
                                name="headline"
                                label="Headline"
                                component={this.renderInput}
                                limitation={42}
                                disabled={uploading}
                                placeholder={'Enter Headline'}
                                returnKeyType="next"
                                onNextPress={() => {
                                    // this.inputRefs['city']?.focus()
                                    this.setState({ countryModalVisible: true })
                                }}
                                autoCorrect
                            />
                            <View style={styles.countryCityContainer}>
                                <View style={styles.countryContainer}>
                                    <View style={styles.inputContainerStyle}>
                                        <Text style={styles.label}>
                                            {'Country'}
                                        </Text>
                                        <CountryDropdown
                                            initialValue={country}
                                            visible={countryModalVisible}
                                            onSelectCountry={(countryCode) => {
                                                this.setState({
                                                    countryModalVisible: false,
                                                })
                                                this.props.change(
                                                    'country',
                                                    countryCode
                                                )
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={styles.countryContainer}>
                                    <Field
                                        refName="city"
                                        name="city"
                                        label="City"
                                        component={this.renderInput}
                                        disabled={uploading}
                                        onNextPress={() => {
                                            this.inputRefs[
                                                'occupation'
                                            ]?.focus()
                                        }}
                                        placeholder={'Write your city'}
                                        returnKeyType="next"
                                        autoCorrect
                                    />
                                </View>
                            </View>
                            <Field
                                refName="occupation"
                                name="profile.occupation"
                                label="Occupation"
                                component={this.renderInput}
                                disabled={uploading}
                                onNextPress={() => {
                                    this.inputRefs['links_0']?.focus()
                                }}
                                returnKeyType="next"
                                autoCorrect
                                placeholder={'Enter Occupation'}
                            />
                            {Array.isArray(links) &&
                                links.map((_, index) => {
                                    return (
                                        <Field
                                            key={'links' + index}
                                            refName={`links_${index}`}
                                            name={`links[${index}]`}
                                            label="My Links"
                                            component={this.renderInput}
                                            disabled={uploading}
                                            onNextPress={() => {
                                                if (index < links.length - 1) {
                                                    this.inputRefs[
                                                        `links_${index + 1}`
                                                    ]?.focus()
                                                } else {
                                                    Keyboard.dismiss()
                                                    this.setState({
                                                        aboutModalVisible: true,
                                                    })
                                                }
                                            }}
                                            returnKeyType="next"
                                            autoCorrect
                                            hideTitle={index > 0}
                                        />
                                    )
                                })}
                            <TouchableOpacity
                                style={styles.moreButtonContainer}
                                onPress={() => {
                                    this.props.change('links', [...links, ''])
                                }}
                            >
                                <Text style={styles.moreButtonText}>
                                    {'Add More'}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.inputContainerStyle}>
                                <Text style={styles.label}>{'About'}</Text>
                                <TouchableOpacity
                                    style={styles.aboutTextInputStyle}
                                    activeOpacity={0.6}
                                    onPress={() => {
                                        this.setState({
                                            aboutModalVisible: true,
                                        })
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.aboutTextStyle,
                                            !about && styles.placeholderColor,
                                        ]}
                                    >
                                        {about || 'Me and my Story'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Field
                                refName="help"
                                customStyle={{
                                    height: 120,
                                    paddingTop: 10,
                                }}
                                name="helpOrServe"
                                label="Who I Help or Serve"
                                component={this.renderInput}
                                limitation={500}
                                disabled={uploading}
                                multiline
                                autoCorrect
                                placeholder={'Who I Help or Serve'}
                                returnKeyType="next"
                                maxLength={500}
                            />
                            <Field
                                refName="likeToConnect"
                                customStyle={{
                                    height: 120,
                                    paddingTop: 10,
                                }}
                                name="likeToConnect"
                                label="Who I'd like to Connect with"
                                component={this.renderInput}
                                limitation={500}
                                disabled={uploading}
                                multiline
                                autoCorrect
                                returnKeyType="next"
                                maxLength={500}
                                placeholder={"Who I'd like to Connect with"}
                            />
                        </View>
                        {this.renderCameraRollBottomSheet()}
                    </KeyboardAwareScrollView>
                </SafeAreaView>
                <AboutTextInput
                    about={about}
                    isVisible={aboutModalVisible}
                    onClose={(text, isUpdate) => {
                        this.setState({ aboutModalVisible: false })
                        if (isUpdate) {
                            this.props.change('profile.about', text)
                        }
                    }}
                />
            </View>
        )
    }
}

/**
 * Validate critical form values
 * @param {*} headline
 * @param {*} about
 * @param {*} elevatorPitch
 */
const validValues = ({ headline, about, elevatorPitch }) => {
    if (headline && headline.length > 42) {
        return false
    }

    if (about && about.length > 500) {
        return false
    }

    if (elevatorPitch && elevatorPitch.length > 250) {
        return false
    }

    return true
}

const styles = {
    inputContainerStyle: {
        marginTop: 16,
    },
    imageStyle: {
        width: 120 * default_style.uiScale,
        height: 120 * default_style.uiScale,
        borderRadius: 60 * default_style.uiScale,
    },
    imageContainerStyle: {
        height: 60 * default_style.uiScale,
        backgroundColor: 'white',
    },
    imageWrapperStyle: {
        alignItems: 'center',
        borderRadius: 60 * default_style.uiScale,
        position: 'absolute',
        bottom: 10,
        backgroundColor: 'white',
        left: 20,
    },
    iconContainerStyle: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 0,
        left: 120 * default_style.uiScale,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editIconStyle: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    defaultTextInputStyle: {
        height: 50,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        width: '100%',
        fontSize: 16,
        fontFamily: 'SFProDisplay-Regular',
        fontWeight: '400',
        paddingHorizontal: 16,
        borderRadius: 5,
    },
    aboutTextInputStyle: {
        height: 172,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        width: '100%',
        borderRadius: 5,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    aboutTextStyle: {
        fontSize: 16,
        fontFamily: 'SFProDisplay-Regular',
        fontWeight: '400',
    },
    placeholderColor: {
        color: '#BDBDBD',
    },
    label: {
        color: '#333333',
        fontSize: 16,
        fontFamily: 'SFProDisplay-Semibold',
        fontWeight: '700',
        marginBottom: 10,
    },
    countryCityContainer: {
        flexDirection: 'row',
        alignItem: 'center',
        justifyContent: 'space-between',
    },
    countryContainer: {
        width: width / 2 - 24,
    },
    require: {
        fontSize: 16,
        fontFamily: 'SFProDisplay-Bold',
        fontWeight: '900',
        textAlignVertical: 'top',
        color: '#000',
    },
    moreButtonContainer: {
        marginTop: 8,
        alignSelf: 'flex-end',
    },
    moreButtonText: {
        fontSize: 14,
        fontFamily: 'SFProDisplay-Regular',
        fontWeight: '500',
        color: '#42C0F5',
    },
}

ProfileDetailEditForm = reduxForm({
    form: 'profileDetailEditForm',
    enableReinitialize: true,
})(ProfileDetailEditForm)

const mapStateToProps = (state, props) => {
    const { userId, pageId } = props
    const selector = formValueSelector('profileDetailEditForm')

    const uploading = getUserDataByPageId(state, userId, pageId, 'uploading')
    const user = getUserData(state, userId, 'user')
    const links =
        Array.isArray(user?.links) && user?.links?.length ? user?.links : ['']

    return {
        // uploading: state.profile.uploading,
        // initialValues: state.profile.user // This is before reducer redesign way
        uploading,
        initialValues: { ...user, links },
        headline: selector(state, 'headline'),
        elevatorPitch: selector(state, 'profile.elevatorPitch'),
        about: selector(state, 'profile.about'),
        links: selector(state, 'links'),
        country: selector(state, 'country'),
    }
}

export default connect(mapStateToProps, {
    submitUpdatingProfile,
    openCamera,
    openCameraRoll,
    getToastsData,
    refreshActivityFeed,
})(ProfileDetailEditForm)
