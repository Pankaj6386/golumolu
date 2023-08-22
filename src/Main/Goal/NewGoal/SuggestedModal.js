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
} from 'react-native'
import Modal from 'react-native-modal'

import { formValueSelector, reduxForm } from 'redux-form'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

import Constants from 'expo-constants'
import PLUS_ICON from '../../../asset/image/suggestedAdd.png'
import PLUS_ICON_2 from '../../../asset/image/suggestedAdd2.png'

//Actions

import { connect } from 'react-redux'
import { text } from '../../../styles/basic'
import { GM_BLUE_DEEP } from '../../../styles/basic/color'
import { getGeneratedSteps } from '../../../actions/GeneratedAiActions'
import {
    selectedSteps,
    clearGeneratedData,
} from '../../../reducers/GeneratedReducers'

class SuggestedModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isChecked: false,
            textToSend: '',
            generatedSteps: [],
            textInputs: [],
            isShown: true,

            selectedItem: null,
        }
    }

    componentDidMount() {
        this.setState({ textInputs: this.props.generatedSteps })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            this.setState({ textInputs: this.props.generatedSteps })
        }
    }

    selectItem = (id) => {
        let textInputs = JSON.parse(JSON.stringify(this.state.textInputs))
        for (let item of textInputs) {
            if (item.id == id) {
                item.isSelected =
                    item.isSelected == null ? true : !item.isSelected
                break
            }
        }
        this.setState({ textInputs })
    }

    render() {
        let selectedSteps = this.state.textInputs
            .filter(({ isSelected, id, ...rest }) => {
                if (isSelected === true) {
                    return rest
                }
            })
            .map(({ isSelected, id, ...rest }) => rest)

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
                    style={{
                        marginTop: Constants.statusBarHeight + 20,
                        borderRadius: 15,
                        margin: 0,
                    }}
                    onModalWillHide={() => {
                        let selectedSteps = this.state.textInputs
                            .filter(({ isSelected, id, ...rest }) => {
                                if (isSelected === true) {
                                    return rest
                                }
                            })
                            .map(({ isSelected, id, ...rest }) => rest)
                        this.props.selectedStepsClose(selectedSteps)
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
                                height: hp(80),
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
                                    source={require('../../../asset/icons/cross.png')}
                                />
                            </TouchableOpacity>
                            <Text
                                style={{
                                    marginTop: 10,
                                    textAlign: 'center',
                                    fontFamily: 'SFProDisplay-Bold',
                                    fontSize: 16,
                                }}
                            >
                                Generate Suggested Steps
                            </Text>
                            <Text
                                style={{
                                    marginTop: 10,
                                    fontSize: 16,
                                    lineHeight: 20,

                                    fontFamily: 'SFProDisplay-Regular',
                                }}
                            >
                                Tap on the + to add any of these to your list of
                                steps. Tap on the text to edit.
                            </Text>
                            {this.props.loadingSteps ? (
                                <>
                                    <View style={{ marginTop: 50 }}>
                                        <ActivityIndicator
                                            size={'small'}
                                            color={GM_BLUE_DEEP}
                                        />
                                    </View>
                                </>
                            ) : (
                                <View style={{ height: 440 }}>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        propagateSwipe
                                        data={this.state.textInputs}
                                        renderItem={({ item, index }) => {
                                            const isSelected = item?.isSelected

                                            return (
                                                <>
                                                    <TouchableOpacity
                                                        style={{
                                                            ...styles.inputContainer,
                                                            backgroundColor: isSelected
                                                                ? '#EBF9FF'
                                                                : 'transparent',
                                                            borderColor: isSelected
                                                                ? '#45C9F6'
                                                                : 'lightgrey',
                                                        }}
                                                        onPress={() =>
                                                            this.selectItem(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <View
                                                            style={{
                                                                flexDirection:
                                                                    'row',
                                                                justifyContent:
                                                                    'space-evenly',
                                                            }}
                                                        >
                                                            <Image
                                                                source={
                                                                    isSelected
                                                                        ? PLUS_ICON_2
                                                                        : PLUS_ICON
                                                                }
                                                                style={{
                                                                    resizeMode:
                                                                        'contain',
                                                                    width: 30,
                                                                    height: 20,
                                                                    alignSelf:
                                                                        'center',
                                                                }}
                                                            />

                                                            <TextInput
                                                                value={
                                                                    this.state
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
                                                                    backgroundColor: isSelected
                                                                        ? '#EBF9FF'
                                                                        : 'transparent',

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
                                                                    'Add Steps'
                                                                }
                                                            />
                                                        </View>
                                                    </TouchableOpacity>
                                                </>
                                            )
                                        }}
                                        keyExtractor={(item) =>
                                            item.id.toString()
                                        }
                                        listKey={Math.random()
                                            .toString(36)
                                            .substr(2, 9)}
                                        onEndReachedThreshold={0}
                                        keyboardShouldPersistTaps="always"
                                        ListEmptyComponent={
                                            this.props.refreshing ? null : (
                                                <View
                                                    style={{
                                                        height: 50,
                                                        flex: 1,
                                                        justifyContent:
                                                            'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Text>
                                                        No Suggested Steps
                                                    </Text>
                                                </View>
                                            )
                                        }
                                        ItemSeparatorComponent={() => (
                                            <View
                                                style={{
                                                    borderWidth: 0.5,
                                                    borderColor: '#F1EEEE',
                                                }}
                                            ></View>
                                        )}
                                    />
                                </View>
                            )}

                            <TouchableOpacity
                                disabled={
                                    this.props.title === undefined
                                        ? true
                                        : false
                                }
                                style={{
                                    backgroundColor:
                                        this.props.title === undefined
                                            ? 'lightgrey'
                                            : '#42C0F5',
                                    width: '95%',
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    height: 40,
                                    borderColor:
                                        this.props.title === undefined
                                            ? 'lightgrey'
                                            : '#42C0F5',
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    position: 'absolute',
                                    bottom: 75,
                                }}
                                onPress={() => {
                                    this.props.onClose()

                                    // setTimeout(() => {
                                    //     this.props.createGoal(selectedSteps)
                                    // }, 500)
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: 'white',
                                        fontSize: 16,
                                        fontWeight: '500',
                                    }}
                                >
                                    Add Steps
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.getGeneratedSteps(
                                        this.props.title
                                    )
                                }
                                style={{
                                    backgroundColor: 'trasnparent',
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
                                    source={require('../../../asset/image/refresh.png')}
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
                                        color: '#42C0F5',
                                        fontSize: 16,
                                        fontWeight: '500',
                                    }}
                                >
                                    Generate Again
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}

SuggestedModal = reduxForm({
    form: 'stepsSuggestion',
    enableReinitialize: true,
})(SuggestedModal)

const mapStateToProps = (state) => {
    const selector = formValueSelector('createGoalModal')

    const {
        loadingSteps,
        generatedSteps,
        errorGeneratingSteps,
    } = state.generatedAi

    return {
        loadingSteps,
        generatedSteps,
        errorGeneratingSteps,
        title: selector(state, 'title'),
    }
}

export default connect(mapStateToProps, {
    getGeneratedSteps,
    selectedSteps,
    clearGeneratedData,
})(SuggestedModal)

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
        marginVertical: hp(0.85),
        padding: wp(4),
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: wp(1),
    },
}
