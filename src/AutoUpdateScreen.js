/** @format */

import { View, Text, SafeAreaView, StyleSheet, Image } from 'react-native'
import React, { Component } from 'react'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import LottieView from 'lottie-react-native'
import DOWNLOADING_LOTTIE from '../src/asset/updatelottie.json'
import newSplashScreenLogo from '../src/asset/header/newSplashScreenLogo.png'

import { color } from './styles/basic'

class AutoUpdateScreen extends Component {
    constructor(props) {
        super(props)
    }
    state = {}
    render() {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: color.GM_BLUE_DEEP,

                    alignItems: 'center',
                }}
            >
                <View style={{ marginTop: 120 }}>
                    <Image
                        source={newSplashScreenLogo}
                        style={styles.logoIconStyle}
                    />

                    <LottieView
                        style={{
                            height: hp(10),
                            alignSelf: 'center',
                            marginTop: 10,
                        }}
                        source={DOWNLOADING_LOTTIE}
                        autoPlay
                        loop
                    />
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 17,
                            textAlign: 'center',
                            marginTop: 50,
                            fontWeight: '600',
                        }}
                    >
                        App is Updating...
                    </Text>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    // containers
    containerStyle: {
        flex: 1,
        backgroundColor: color.GM_BLUE_DEEP,
    },
    bodyContainerStyle: {
        flexGrow: 1,
    },
    actionButtonsContainerStyle: {
        paddingVertical: 24,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },

    // Logo
    logoContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
        flexDirection: 'row',
    },
    logoIconStyle: {
        height: 60,
        width: 300,
        marginTop: 100,
        resizeMode: 'contain',
    },
    logoTextStyle: {
        height: 40,
        width: 208,
        resizeMode: 'contain',
    },

    // center artwork and slogan

    // action button styles
    signUpButtonStyle: {
        paddingVertical: 12,
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 3,
        alignItems: 'center',
    },
})

export default AutoUpdateScreen
