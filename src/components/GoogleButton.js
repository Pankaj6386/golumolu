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
import { GM_BLUE, GM_BLUE_DEEP } from '../styles/basic/color'
import GOOGLE_LOGO from '../asset/icons/GoogleCircle.png'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

function GoogleButton({ onPress, text, isLogin }) {
    return (
        <TouchableOpacity onPress={() => onPress()}>
            <View style={styles.btnContainer2}>
                <Image
                    source={GOOGLE_LOGO}
                    style={{ resizeMode: 'contain', height: 25, width: 25 }}
                />
                <View style={{ width: 6 }} />
                <Text style={styles.btnText2}>{text}</Text>
            </View>
        </TouchableOpacity>
    )
}

;<Image
    source={GOOGLE_LOGO}
    style={{ resizeMode: 'contain', height: 20, width: 20 }}
/>
const styles = StyleSheet.create({
    btnContainer2: {
        backgroundColor: '#46C8F5',
        flexDirection: 'row',
        width: '100%',
        height: hp(5.09),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp(1),
        borderColor: GM_BLUE_DEEP,
        borderWidth: wp(0.3),
        marginHorizontal: wp(1.5),
        marginVertical: hp(2),
    },
    btnText2: {
        color: '#fff',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(1.95),
    },
})

export default GoogleButton
