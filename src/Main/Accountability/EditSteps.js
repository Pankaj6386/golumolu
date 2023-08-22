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

import Constants from 'expo-constants'

import DraggableFlatList from 'react-native-draggable-flatlist'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import Trash from '../../asset/icons/trash.png'
import VerticalDots from '../../asset/icons/verticaldots.png'
import DELETE from '../../asset/icons/delete.png'

import { connect } from 'react-redux'

import { text } from '../../styles/basic'
import { FONT_FAMILY } from '../../styles/basic/text'

let row = []
let prevOpenedRow
class EditStepsModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            arrayHolder: [],

            textInput_Holder: '',
        }
        this.refsArray = []
    }

    componentDidMount() {
        this.setState({ arrayHolder: this.props.accountableFriendSteps })
    }

    joinData = () => {
        const demeArray = this.state.arrayHolder
        demeArray.push({
            text: this.state.textInput_Holder,
            id: Math.random() * 100,
        })

        this.setState({
            arrayHolder: demeArray,
        })
        this.setState({ textInput_Holder: '' })
    }

    handleDelete = (item, index) => {
        const filteredData = this.state.arrayHolder.filter(
            (i) => i.id !== item.id
        )

        this.setState({ arrayHolder: filteredData })
    }

    FlatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: '#607D8B',
                }}
            />
        )
    }

    renderItem = ({ item, index }) => {
        return (
            <View
                style={{
                    height: 45,
                    width: '90%',
                    backgroundColor: 'transparent',
                    marginVertical: 5,
                    alignSelf: 'center',
                    padding: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',

                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: '#82828299',
                }}
            >
                <Text
                    style={{
                        fontSize: 16,

                        width: '85%',
                        fontFamily: FONT_FAMILY.REGULAR,
                    }}
                    numberOfLines={1}
                >
                    {item.text}
                </Text>
                <TouchableOpacity
                    onPress={() => this.handleDelete(item, index)}
                >
                    <Image
                        source={DELETE}
                        style={{
                            width: 15,
                            height: 15,
                            resizeMode: 'contain',
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
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
                    // swipeDirection={'down'}
                    style={{
                        marginTop: Constants.statusBarHeight + 10,
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

                            height: '95%',
                        }}
                    >
                        <View
                            style={{
                                ...styles.modalContainerStyle,
                                height: hp(85),
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

                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        // marginVertical: 20,
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        color: '#42C0F5',
                                        fontFamily: FONT_FAMILY.BOLD,
                                    }}
                                >
                                    Finishing writing my book
                                </Text>
                            </View>

                            <Text
                                style={{
                                    marginHorizontal: 20,
                                    padding: 20,
                                    textAlign: 'center',
                                    fontSize: 19,
                                    fontFamily: FONT_FAMILY.SEMI_BOLD,
                                }}
                            >
                                Edit Steps
                            </Text>
                            <View style={{ height: 380 }}>
                                <DraggableFlatList
                                    ref={(ref) => {
                                        if (ref && ref.containerRef)
                                            this.flatList =
                                                ref.flatlistRef.current
                                    }}
                                    data={this.state.arrayHolder}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={(item) => this.renderItem(item)}
                                    keyExtractor={(item, index) =>
                                        index.toString()
                                    }
                                    // onDragEnd={({ data }) => {
                                    //     this.setState({ arrayHolder: data })
                                    // }}
                                    style={{ flex: 1 }}
                                    keyboardShouldPersistTaps="always"
                                />
                            </View>

                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 19,
                                    marginTop: 10,

                                    fontFamily: FONT_FAMILY.SEMI_BOLD,
                                }}
                            >
                                Add New Steps
                            </Text>
                            <View style={{}}>
                                <TextInput
                                    // clearButtonMode="always"
                                    placeholder="Something to make progress"
                                    onChangeText={(data) =>
                                        this.setState({
                                            textInput_Holder: data,
                                        })
                                    }
                                    // onChangeText={(text) => this.setState({ text })}
                                    // clearTextOnFocus="true"
                                    value={this.state.textInput_Holder}
                                    // enablesReturnKeyAutomatically="true"
                                    style={{
                                        padding: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginVertical: 15,
                                        width: '90%',
                                        borderRadius: 5,

                                        alignSelf: 'center',
                                        fontSize: 16,
                                        height: 45,
                                        borderWidth: 1,
                                        borderColor: '#828282',
                                    }}
                                    underlineColorAndroid="transparent"
                                />
                                <TouchableOpacity
                                    onPress={this.joinData}
                                    activeOpacity={0.7}
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',

                                        width: '90%',
                                        borderRadius: 5,
                                        alignSelf: 'center',
                                        height: 45,

                                        borderWidth: 1,
                                        borderColor: '#45C9F6',
                                    }}
                                >
                                    <Text
                                        style={{
                                            justifyContent: 'center',
                                            textAlign: 'center',
                                            color: '#45C9F6',
                                            fontSize: 16,
                                        }}
                                    >
                                        + Add Steps
                                    </Text>
                                </TouchableOpacity>
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
                                    bottom: 0,
                                }}
                                onPress={() => this.props.onConfirmPress()}
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
export default connect(mapStateToProps, {})(EditStepsModal)

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
