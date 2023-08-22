/** @format */

// /** @format */

import React, { useState, Component } from 'react'
import {
    Button,
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
} from 'react-native'
import Modal from 'react-native-modal'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

// import TimePic from './TimePic'
// import Tooltip from '../Common/Tooltip'
import { CheckBox } from '@ui-kitten/components'
import ProfileImage from '../Common/ProfileImage'
// import Headline from '../Goal/Common/Headline'
// import TimePickers from './TimePickers'
import Constants from 'expo-constants'

//Actions
import { getProfileImageOrDefaultFromUser } from '../../redux/middleware/utils'

import { connect } from 'react-redux'

import { text } from '../../styles/basic'

class AccountabilityCheckin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isChecked: false,
            textToSend: '',
            increaseHeight: false,
        }
    }

    render() {
        return (
            <>
                <Modal
                    backdropColor={'black'}
                    propagateSwipe
                    backdropOpacity={0.6}
                    animationInTiming={400}
                    isVisible={this.props.isVisible}
                    onBackdropPress={() => this.props.onClose()}
                    onSwipeComplete={() => this.props.onClose()}
                    swipeDirection={'down'}
                    style={{
                        marginTop: Constants.statusBarHeight + 20,
                        borderRadius: 15,
                        margin: 0,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'white',

                            width: '100%',

                            borderRadius: 5,
                            position: !this.state.increaseHeight
                                ? 'absolute'
                                : null,
                            bottom: !this.state.increaseHeight ? 0 : null,

                            height: this.state.increaseHeight ? '95%' : null,
                            justifyContent: this.state.increaseHeight
                                ? 'center'
                                : null,
                        }}
                    >
                        <View
                            style={{
                                ...styles.modalContainerStyle,
                                height: hp(70),
                            }}
                        >
                            <View
                                style={{
                                    marginVertical: 10,
                                    alignSelf: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        width: 50,
                                        height: 4,
                                        borderRadius: 5,
                                        backgroundColor: 'lightgray',
                                    }}
                                />
                            </View>

                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    right: 15,
                                    top: 10,
                                }}
                                onPress={() => this.props.onClose()}
                            >
                                <Image
                                    style={{
                                        width: 25,
                                        height: 25,
                                        resizeMode: 'contain',
                                    }}
                                    source={require('../../asset/icons/cross.png')}
                                />
                            </TouchableOpacity>
                            <View
                                style={{
                                    marginHorizontal: 10,
                                }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <ProfileImage
                                        imageStyle={{
                                            width: 50,
                                            height: 50,
                                        }}
                                        imageUrl={getProfileImageOrDefaultFromUser(
                                            this.props.accountableFriend
                                                .memberRef
                                        )}
                                        imageContainerStyle={{
                                            backgroundColor: 'white',
                                        }}
                                        disabled
                                    />
                                    <View style={{ marginHorizontal: 15 }}>
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                color: '#3B414B',
                                                fontWeight: '600',
                                                fontFamily:
                                                    'SFProDisplay-Regular',
                                            }}
                                        >
                                            {
                                                this.props.accountableFriend
                                                    .memberRef.name
                                            }
                                        </Text>
                                        <View
                                            style={{
                                                width: 250,
                                                height: 100,
                                                borderRadius: 15,
                                                marginVertical: 5,

                                                justifyContent: 'center',
                                                backgroundColor: '#99E1FF33',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    fontWeight: '500',
                                                    padding: 12,
                                                    lineHeight: 21,
                                                    fontFamily:
                                                        'SFProDisplay-Regular',
                                                }}
                                            >
                                                Your next checkin with{' '}
                                                {
                                                    this.props.accountableFriend
                                                        .memberRef.name
                                                }
                                                is:
                                                <Text
                                                    style={{
                                                        fontSize: 15,
                                                        fontWeight: '500',
                                                        padding: 12,
                                                        lineHeight: 21,
                                                        color: '#42C0F5',
                                                        fontFamily:
                                                            'SFProDisplay-Semibold',
                                                    }}
                                                >
                                                    {` August 15, 2021 `}
                                                </Text>
                                                at
                                                <Text
                                                    style={{
                                                        fontSize: 15,
                                                        fontWeight: '500',
                                                        padding: 12,
                                                        lineHeight: 21,
                                                        color: '#42C0F5',
                                                        fontFamily:
                                                            'SFProDisplay-Semibold',
                                                    }}
                                                >
                                                    {` 11:00 AM `}
                                                </Text>
                                                your local time
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <CheckBox
                                        checked={this.state.isChecked}
                                        onChange={(checked) =>
                                            this.setState({
                                                isChecked: checked,
                                            })
                                        }
                                    />
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: '500',
                                            marginTop: 15,
                                            width: '90%',
                                            fontFamily: 'SFProDisplay-Semibold',
                                        }}
                                    >
                                        Ask: "What 3 steps are you committed to
                                        taking before our next check-in?”
                                    </Text>
                                </View>
                            </View>

                            <Text
                                style={{
                                    top: 10,
                                    fontSize: 12,
                                    marginHorizontal: 10,
                                    fontFamily: 'SFProDisplay-Regular',
                                }}
                            >
                                Add a Personal Message
                            </Text>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder={`Awesome goal! I'm holding you to it!`}
                                    multiline={true}
                                    style={styles.inputText}
                                    onChangeText={(value) =>
                                        this.setState({
                                            textToSend: value,
                                        })
                                    }
                                    value={this.state.textToSend}
                                    onFocus={() =>
                                        this.setState({
                                            increaseHeight: true,
                                        })
                                    }
                                    onEndEditing={() =>
                                        this.setState({
                                            increaseHeight: false,
                                        })
                                    }
                                    ref={(c) => {
                                        this.textInputRef = c
                                    }}
                                    onSubmitEditing={() => {
                                        this.textInputRef.blur()
                                        this.setState({
                                            increaseHeight: false,
                                        })
                                    }}
                                />
                            </View>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: 'transparent',

                                    width: '95%',
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    height: 40,
                                    borderColor: '#42C0F5',
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    position: 'absolute',
                                    bottom: 30,
                                }}
                                onPress={() => this.props.onGoBackPress()}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',

                                        color: '#42C0F5',
                                        fontSize: 16,
                                        fontWeight: '500',
                                    }}
                                >
                                    Go Back
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#42C0F5',
                                    width: '95%',
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    height: 40,
                                    borderColor: '#42C0F5',
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    position: 'absolute',
                                    bottom: 80,
                                }}
                                onPress={this.handleConfirmButton}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: 'white',
                                        fontSize: 16,
                                        fontWeight: '500',
                                    }}
                                >
                                    Confirm
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    const accountability = state.accountabilityTime

    // console.log('accountability', accountability)

    return {
        accountability,
    }
}
export default connect(mapStateToProps, {})(AccountabilityCheckin)

const styles = {
    modalContainerStyle: {
        backgroundColor: 'white',
        paddingHorizontal: wp(4.26),
        borderRadius: 15,
        padding: 5,
    },
    inputText: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: hp(1.9),
    },
    inputContainer: {
        width: wp(91),
        height: 90,
        marginVertical: hp(0.85),
        padding: wp(4),
        borderWidth: 1,
        borderColor: '#42C0F5',
        borderRadius: wp(1),
        marginTop: 30,
    },
}
