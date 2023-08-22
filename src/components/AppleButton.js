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

function AppleButton({ onPress }) {
    return (
        <TouchableOpacity onPress={() => onPress()}>
            <View style={styles.btnContainer2}>
                <Image
                    source={APPLE_LOGO}
                    style={{ resizeMode: 'contain', height: 25, width: 25 }}
                />
                <View style={{ width: 6 }} />
                <Text style={styles.btnText2}>{'Continue With Apple'}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btnContainer2: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        width: '100%',
        height: hp(5.09),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp(1),
        borderColor: GM_BLUE,
        borderWidth: wp(0.3),
        marginHorizontal: wp(1.5),
    },
    btnText2: {
        color: '#000',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(1.95),
    },
})

export default AppleButton
