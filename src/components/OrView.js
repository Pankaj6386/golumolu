/** @format */

import React from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    TouchableWithoutFeedback,
} from 'react-native'
import { text } from '../styles/basic'
import { GM_BLUE } from '../styles/basic/color'
import APPLE_LOGO from '../asset/icons/appleIcon.png'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

function OrView({ onPress }) {
    return (
        <View style={styles.mainView}>
            <View style={styles.subMainView} />
            <Text style={styles.titleStyle}>or</Text>
            <View style={styles.lineView} />
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'row',
        paddingTop: 20,
        justifyContent: 'space-between',
    },
    subMainView: {
        backgroundColor: '#E0E0E0',
        height: 1,
        width: '43%',
    },
    titleStyle: {
        color: '#E0E0E0',
        fontSize: 14,
        bottom: 8,
    },
    lineView: {
        backgroundColor: '#E0E0E0',
        height: 1,
        width: '43%',
    },
})

export default OrView
