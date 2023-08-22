/** @format */

// /** @format */

import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native'
import Modal from 'react-native-modal'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

import Constants from 'expo-constants'
import SEND_ICON from '../../../asset/image/sendMessage.png'

import { GM_BLUE_DEEP } from '../../../styles/basic/color'

//Actions
import { connect } from 'react-redux'
import { text } from '../../../styles/basic'
import {
    getGeneratedReplies,
    generateChatReplies,
} from '../../../actions/GeneratedAiActions'
import { DEVICE_PLATFORM } from '../../../Utils/Constants'

class SuggestedReplies extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isChecked: false,
            textToSend: '',
            textInputs: [],
        }
    }

    componentDidMount() {
        const { isChat, generatedChatReplies, generatedReplies } = this.props
        this.setState({
            textInputs: isChat ? generatedChatReplies : generatedReplies,
        })
    }

    componentDidUpdate(prevProps) {
        const { isChat, generatedChatReplies, generatedReplies } = this.props
        if (
            (isChat &&
                prevProps.generatedChatReplies !==
                    this.props.generatedChatReplies) ||
            prevProps.generatedReplies !== this.props.generatedReplies
        ) {
            this.setState({
                textInputs: isChat ? generatedChatReplies : generatedReplies,
            })
        }
    }

    render() {
        return (
            <>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <Modal
                        backdropColor={'black'}
                        useNativeDriver={true}
                        propagateSwipe
                        backdropOpacity={0.6}
                        animationInTiming={500}
                        animationOutTiming={500}
                        isVisible={this.props.isVisible}
                        onBackdropPress={() => this.props.onClose()}
                        onSwipeComplete={() => this.props.onClose()}
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
                                position: 'absolute',
                                bottom: 0,
                            }}
                        >
                            <View
                                style={{
                                    ...styles.modalContainerStyle,
                                    height: hp(
                                        DEVICE_PLATFORM === 'ios' ? 80 : 60
                                    ),
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
                                        right: 20,
                                        top: 15,
                                    }}
                                    onPress={() => this.props.onClose()}
                                >
                                    <Image
                                        style={{
                                            width: 22,
                                            height: 22,
                                            resizeMode: 'contain',
                                        }}
                                        source={require('../../../asset/image/modalCross.png')}
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        marginTop: 10,
                                        textAlign: 'center',
                                        fontFamily: 'SFProDisplay-Bold',
                                        fontSize: 17,
                                    }}
                                >
                                    Generated Replies
                                </Text>
                                <View style={{ height: 500, marginTop: 15 }}>
                                    {(!this.props.isChat &&
                                        this.props.loadingReplies) ||
                                    this.props.loadingChatReplies ? (
                                        <>
                                            <View style={{ marginTop: 50 }}>
                                                <ActivityIndicator
                                                    size={'small'}
                                                    color={GM_BLUE_DEEP}
                                                />
                                            </View>
                                        </>
                                    ) : (
                                        <>
                                            <FlatList
                                                showsVerticalScrollIndicator={
                                                    false
                                                }
                                                propagateSwipe
                                                data={this.state.textInputs}
                                                renderItem={({
                                                    item,
                                                    index,
                                                }) => {
                                                    return (
                                                        <>
                                                            <TouchableOpacity
                                                                style={{
                                                                    ...styles.inputContainer,
                                                                    backgroundColor:
                                                                        'transparent',
                                                                    borderColor:
                                                                        'lightgrey',
                                                                }}
                                                            >
                                                                <View
                                                                    style={{
                                                                        flexDirection:
                                                                            'row',
                                                                        justifyContent:
                                                                            'space-evenly',
                                                                        alignItems:
                                                                            'center',
                                                                    }}
                                                                >
                                                                    <TextInput
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .textInputs[
                                                                                index
                                                                            ]
                                                                                .description
                                                                        }
                                                                        onChangeText={(
                                                                            text
                                                                        ) => {
                                                                            let copyArray = JSON.parse(
                                                                                JSON.stringify(
                                                                                    this
                                                                                        .state
                                                                                        .textInputs
                                                                                )
                                                                            )

                                                                            copyArray[
                                                                                index
                                                                            ].description = text
                                                                            this.setState(
                                                                                {
                                                                                    textInputs: copyArray,
                                                                                }
                                                                            )
                                                                        }}
                                                                        multiline
                                                                        style={{
                                                                            backgroundColor:
                                                                                'transparent',

                                                                            width:
                                                                                '95%',

                                                                            padding: 8,
                                                                            lineHeight: 20,
                                                                            fontFamily:
                                                                                text
                                                                                    .FONT_FAMILY
                                                                                    .REGULAR,
                                                                            fontSize: 15,
                                                                        }}
                                                                        underlineColor={
                                                                            'transparent'
                                                                        }
                                                                        placeholder={
                                                                            'Add Replies'
                                                                        }
                                                                    />
                                                                    <TouchableOpacity
                                                                        onPress={() => {
                                                                            this.props.onClose()
                                                                            setTimeout(
                                                                                () => {
                                                                                    !this
                                                                                        .props
                                                                                        .isChat
                                                                                        ? this.props.postGeneratedReply(
                                                                                              item.description
                                                                                          )
                                                                                        : this.props.sendChatMessage(
                                                                                              item.description
                                                                                          )
                                                                                },
                                                                                500
                                                                            )
                                                                        }}
                                                                    >
                                                                        <Image
                                                                            source={
                                                                                SEND_ICON
                                                                            }
                                                                            style={{
                                                                                resizeMode:
                                                                                    'contain',
                                                                                width: 18,
                                                                                height: 18,
                                                                            }}
                                                                        />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </>
                                                    )
                                                }}
                                                keyExtractor={(item, index) =>
                                                    item.id.toString()
                                                }
                                                onEndReachedThreshold={0}
                                                keyboardShouldPersistTaps="always"
                                                ListEmptyComponent={
                                                    this.props
                                                        .refreshing ? null : (
                                                        <View
                                                            style={{
                                                                height: 50,
                                                                flex: 1,
                                                                justifyContent:
                                                                    'center',
                                                                alignItems:
                                                                    'center',
                                                            }}
                                                        >
                                                            <Text>
                                                                No Suggested
                                                                Replies
                                                            </Text>
                                                        </View>
                                                    )
                                                }
                                                ItemSeparatorComponent={() => (
                                                    <View
                                                        style={{
                                                            borderWidth: 0.5,
                                                            borderColor:
                                                                '#F1EEEE',
                                                        }}
                                                    ></View>
                                                )}
                                            />
                                        </>
                                    )}
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.isChat
                                            ? this.props.generateChatReplies(
                                                  this.props.lastMessage
                                              )
                                            : this.props.getGeneratedReplies()
                                    }}
                                    style={{
                                        backgroundColor: '#42C0F5',
                                        width: '95%',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        height: 40,
                                        borderColor: '#42C0F5',
                                        borderWidth: 2,
                                        borderRadius: 5,
                                        position: 'absolute',
                                        bottom: 25,
                                    }}
                                >
                                    <Image
                                        source={require('../../../asset/image/refresh2.png')}
                                        style={{
                                            resizeMode: 'contain',
                                            width: 15,
                                            height: 15,
                                            marginHorizontal: 10,
                                        }}
                                    />
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: 'white',
                                            fontSize: 16,
                                            fontWeight: '500',
                                            fontFamily: 'SFProDisplay-Semibold',
                                        }}
                                    >
                                        Generate Again
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </TouchableWithoutFeedback>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    const {
        loadingReplies,
        generatedReplies,
        errorGeneratingReplies,
        loadingChatReplies,
        generatedChatReplies,
        errorGeneratingChatReplies,
    } = state.generatedAi

    return {
        loadingReplies,
        generatedReplies,
        errorGeneratingReplies,
        loadingChatReplies,
        generatedChatReplies,
        errorGeneratingChatReplies,
    }
}
export default connect(mapStateToProps, {
    getGeneratedReplies,
    generateChatReplies,
})(SuggestedReplies)

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
        marginVertical: hp(0.5),
        padding: 10,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: wp(1),
    },
}
