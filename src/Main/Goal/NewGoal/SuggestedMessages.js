/** @format */

// /** @format */

import React, { Component } from 'react'
import {
    Button,
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    ActivityIndicator,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native'
import Modal from 'react-native-modal'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import DraggableFlatList from 'react-native-draggable-flatlist'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Constants from 'expo-constants'
import SEND_ICON from '../../../asset/image/sendMessage.png'
import REFRESH from '../../../asset/image/refresh.png'
import DRAG from '../../../asset/image/drag.png'

import { GM_BLUE_DEEP } from '../../../styles/basic/color'

//Actions
import { connect } from 'react-redux'
import { text } from '../../../styles/basic'
import {
    paraphaseMessage,
    getGeneratedSavedReplies,
    saveCustomMessage,
    updateMessages,
} from '../../../actions/GeneratedAiActions'
import { DEVICE_PLATFORM } from '../../../Utils/Constants'
import CustomTooltip from '../../../components/CustomTooltip'
import { Size, hp as HP, wp as WP } from '../../../asset/dimensions'
import IMAGE_SOURCE_2 from '../../../asset/image/messageUI.png'

class SuggestedMessages extends Component {
    FlatListRef = null // add a member to hold the flatlist ref
    constructor(props) {
        super(props)
        this.flatlistRef = React.createRef(null)
        this.state = {
            isChecked: false,
            textInputs: [],
            increaseHeight: false,
            textToAdd: '',
            showTextInput: false,
        }
    }

    componentDidMount() {
        this.setState({ textInputs: this.props.generatedSavedReplies })
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.generatedSavedReplies !== this.props.generatedSavedReplies
        ) {
            this.setState({ textInputs: this.props.generatedSavedReplies })
        }
    }

    render() {
        return (
            <>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <Modal
                        backdropColor={'black'}
                        propagateSwipe
                        useNativeDriver={true}
                        backdropOpacity={0.6}
                        animationInTiming={500}
                        animationOutTiming={500}
                        isVisible={this.props.isVisible}
                        onBackdropPress={() => this.props.onClose()}
                        onSwipeComplete={() => this.props.onClose()}
                        hideModalContentWhileAnimating
                        style={{
                            marginTop: Constants.statusBarHeight + 20,
                            borderRadius: 15,
                            margin: 0,
                        }}
                    >
                        <KeyboardAvoidingView
                            behavior={
                                DEVICE_PLATFORM === 'ios'
                                    ? 'position'
                                    : 'height'
                            }
                        >
                            <View
                                style={{
                                    width: '100%',
                                    marginBottom: 50,
                                    borderRadius: 5,
                                }}
                            >
                                <View
                                    style={{
                                        ...styles.modalContainerStyle,
                                        height: hp(
                                            DEVICE_PLATFORM === 'ios' ? 55 : 58
                                        ),
                                        zIndex: 2,
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
                                        My Quick Messages
                                    </Text>
                                    <View
                                        style={{ height: 290, marginTop: 15 }}
                                    >
                                        {this.props.loadingSavedReplies ? (
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
                                                <DraggableFlatList
                                                    onDragEnd={(data) => {
                                                        this.setState({
                                                            textInputs:
                                                                data.data,
                                                        })
                                                        let message =
                                                            data.data[data.from]
                                                                .text
                                                        let nMessageId =
                                                            data.data[data.from]
                                                                ._id
                                                        let order = data.to

                                                        this.props.updateMessages(
                                                            message,
                                                            nMessageId,
                                                            order
                                                        )
                                                    }}
                                                    style={{ zIndex: 1 }}
                                                    ref={this.flatlistRef}
                                                    onContentSizeChange={() =>
                                                        this.flatList?.current?.scrollToEnd()
                                                    }
                                                    data={this.state.textInputs}
                                                    renderItem={({
                                                        item,
                                                        index,
                                                        drag,
                                                    }) => {
                                                        return (
                                                            <>
                                                                <View
                                                                    style={{
                                                                        flexDirection:
                                                                            'row',
                                                                        alignItems:
                                                                            'center',
                                                                        zIndex: 1,
                                                                    }}
                                                                >
                                                                    <TouchableOpacity
                                                                        onLongPress={
                                                                            drag
                                                                        }
                                                                    >
                                                                        <Image
                                                                            source={
                                                                                DRAG
                                                                            }
                                                                            style={{
                                                                                resizeMode:
                                                                                    'contain',
                                                                                width: 19,
                                                                                height: 19,
                                                                            }}
                                                                        />
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity
                                                                        style={{
                                                                            ...styles.inputContainer,
                                                                            backgroundColor:
                                                                                'transparent',
                                                                            borderColor:
                                                                                'lightgrey',
                                                                            zIndex: 1,
                                                                        }}
                                                                        onLongPress={
                                                                            drag
                                                                        }
                                                                    >
                                                                        <View
                                                                            style={{
                                                                                flexDirection:
                                                                                    'row',
                                                                                justifyContent:
                                                                                    'space-between',
                                                                                alignItems:
                                                                                    'center',
                                                                            }}
                                                                        >
                                                                            <TextInput
                                                                                onBlur={() => {
                                                                                    this.props.updateMessages(
                                                                                        item.text,
                                                                                        item._id,
                                                                                        item.order
                                                                                    )
                                                                                    setTimeout(
                                                                                        () => {
                                                                                            this.props.getGeneratedSavedReplies()
                                                                                        },
                                                                                        500
                                                                                    )
                                                                                }}
                                                                                key={
                                                                                    index
                                                                                }
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .textInputs[
                                                                                        index
                                                                                    ]
                                                                                        .text
                                                                                }
                                                                                onChange={({
                                                                                    nativeEvent: {
                                                                                        eventCount,
                                                                                        target,
                                                                                        text,
                                                                                    },
                                                                                }) => {
                                                                                    let copyArray = JSON.parse(
                                                                                        JSON.stringify(
                                                                                            this
                                                                                                .state
                                                                                                .textInputs
                                                                                        )
                                                                                    )
                                                                                    copyArray[
                                                                                        index
                                                                                    ].text = text
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
                                                                                        '70%',

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
                                                                                    'Add Steps'
                                                                                }
                                                                            />
                                                                            <View
                                                                                style={{
                                                                                    flexDirection:
                                                                                        'row',
                                                                                    marginRight: 20,
                                                                                }}
                                                                            >
                                                                                <TouchableOpacity
                                                                                    onPress={() => {
                                                                                        this.props.paraphaseMessage(
                                                                                            item.text,
                                                                                            item._id,
                                                                                            item.order
                                                                                        )
                                                                                        setTimeout(
                                                                                            () => {
                                                                                                this.props.getGeneratedSavedReplies()
                                                                                            },
                                                                                            500
                                                                                        )
                                                                                    }}
                                                                                    style={{}}
                                                                                >
                                                                                    {/* {index ===
                                                                                        0 && (
                                                                                        <CustomTooltip
                                                                                            title={
                                                                                                'Paraphrase your message by tapping here.'
                                                                                            }
                                                                                            imageSource={
                                                                                                IMAGE_SOURCE_2
                                                                                            }
                                                                                            bgStyle={{
                                                                                                width: Size(
                                                                                                    22
                                                                                                ),
                                                                                                height: Size(
                                                                                                    10
                                                                                                ),
                                                                                            }}
                                                                                            viewStyle={{
                                                                                                bottom: HP(
                                                                                                    1
                                                                                                ),
                                                                                            }}
                                                                                            tooltipConstant="generated_refresh_tooltip"
                                                                                        />
                                                                                    )} */}
                                                                                    <Image
                                                                                        source={
                                                                                            REFRESH
                                                                                        }
                                                                                        style={{
                                                                                            resizeMode:
                                                                                                'contain',
                                                                                            width: 18,
                                                                                            height: 18,
                                                                                        }}
                                                                                    />
                                                                                </TouchableOpacity>

                                                                                <View
                                                                                    style={{
                                                                                        width: 12,
                                                                                    }}
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
                                                                                                          item.text
                                                                                                      )
                                                                                                    : this.props.sendChatMessage(
                                                                                                          item.text
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
                                                                                            width: 19,
                                                                                            height: 19,
                                                                                        }}
                                                                                    />
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </>
                                                        )
                                                    }}
                                                    keyExtractor={(
                                                        item,
                                                        index
                                                    ) => item._id.toString()}
                                                    showsVerticalScrollIndicator={
                                                        false
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
                                                                    No Quick
                                                                    Messages
                                                                    saved.
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

                                    {this.state.showTextInput ? (
                                        <TextInput
                                            multiline
                                            onEndEditing={(e) => {
                                                this.setState({
                                                    textToAdd: '',
                                                })
                                                Keyboard.dismiss()
                                                this.props.saveCustomMessage(
                                                    e.nativeEvent.text
                                                )
                                                setTimeout(() => {
                                                    this.props.getGeneratedSavedReplies()
                                                }, 500)
                                            }}
                                            value={this.state.textToAdd}
                                            onChangeText={(text) =>
                                                this.setState({
                                                    textToAdd: text,
                                                })
                                            }
                                            style={{
                                                backgroundColor: 'transparent',
                                                alignSelf: 'center',
                                                width: '95%',
                                                height: 45,
                                                borderColor: 'lightgrey',
                                                borderWidth: 1,
                                                borderRadius: 5,
                                                marginTop:
                                                    DEVICE_PLATFORM === 'ios'
                                                        ? 30
                                                        : 15,
                                                paddingLeft: 15,
                                                paddingTop:
                                                    DEVICE_PLATFORM === 'ios'
                                                        ? 8
                                                        : 2,
                                                lineHeight: 20,
                                                fontFamily:
                                                    text.FONT_FAMILY.REGULAR,
                                                fontSize: 15,
                                            }}
                                            underlineColor={'transparent'}
                                            placeholder={'Add Message'}
                                        />
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.setState({
                                                    showTextInput: true,
                                                })
                                            }
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
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    fontSize: 16,
                                                    fontWeight: '500',
                                                    fontFamily:
                                                        'SFProDisplay-Semibold',
                                                }}
                                            >
                                                Add more
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </Modal>
                </TouchableWithoutFeedback>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    const {
        loadingSavedReplies,
        generatedSavedReplies,
        errorGeneratingSavedReplies,
    } = state.generatedAi

    return {
        loadingSavedReplies,
        generatedSavedReplies,
        errorGeneratingSavedReplies,
    }
}
export default connect(mapStateToProps, {
    paraphaseMessage,
    getGeneratedSavedReplies,
    saveCustomMessage,
    updateMessages,
})(SuggestedMessages)

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
        padding: DEVICE_PLATFORM === 'ios' ? 10 : 2,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: wp(1),
    },
}
