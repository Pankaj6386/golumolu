/** @format */

import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'

import { GM_BLUE } from '../../styles/basic/color'
import * as text from '../../styles/basic/text'

class UnfriendPopup extends Component {
    constructor(props) {
        super(props)
    }

    renderButtons() {
        return (
            <>
                <View
                    style={{ flexDirection: 'row', justifyContent: 'center' }}
                >
                    <TouchableWithoutFeedback onPress={this.props.onPressYes}>
                        <View style={styles.btnContainer1}>
                            <Text style={styles.btnText1}>YES</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this.props.onClose}>
                        <View style={styles.btnContainer2}>
                            <Text style={styles.btnText2}>NO</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </>
        )
    }

    render() {
        return (
            <Modal isVisible={this.props.isVisible} backdropOpacity={0.4}>
                <View style={styles.container}>
                    <View>
                        <Text style={styles.text}>
                            {`Are you sure you want to unfriend ${this.props.friendName}?`}
                        </Text>
                    </View>
                    <View>{this.renderButtons()}</View>
                </View>
            </Modal>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const user = state.user
    const { isVisible, closeModal } = ownProps
    return {
        user,
        isVisible,
        closeModal,
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        justifyContent: 'space-between',
        height: hp(16.5),
        width: wp(91.5),
        borderRadius: 5,
    },
    btnContainer1: {
        backgroundColor: '#E3E3E3',
        width: wp(17.5),
        height: hp(4),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp(1),
        marginHorizontal: wp(1.5),
    },
    btnContainer2: {
        backgroundColor: GM_BLUE,
        width: wp(17.5),
        height: hp(4),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp(1),
        borderColor: GM_BLUE,
        borderWidth: wp(0.3),
        marginHorizontal: wp(1.5),
    },

    btnText1: {
        color: '#505050',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(1.7),
    },
    btnText2: {
        color: '#ffffff',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(1.7),
    },

    text: {
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(2),
        textAlign: 'center',

        lineHeight: 25,
    },
    closeBtn: {
        justifyContent: 'center',
    },
})

export default connect(mapStateToProps)(UnfriendPopup)
