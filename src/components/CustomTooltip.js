import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
} from 'react-native'
import { Icon } from '@ui-kitten/components'
import { Entypo } from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable'
import * as SecureStore from 'expo-secure-store'
import { useSelector } from 'react-redux'

function CustomTooltip({
    title,
    imageSource,
    bgStyle,
    tooltipConstant,
    viewStyle,
    callback,
}) {
    const [toolTipVisible, setTooltipVisible] = useState(true)
    const [checked, setChecked] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)
    const user = useSelector((state) => state.user)

    useEffect(() => {
        shouldTooltipVisible()
    }, [])

    const shouldTooltipVisible = async () => {
        const hasShownToast = await SecureStore.getItemAsync(
            `${user.userId}_${tooltipConstant}`
        )
        setTimeout(() => {
            setShowTooltip(true)
        }, 500)
        setTooltipVisible(hasShownToast)
    }

    return (
        <>
            {toolTipVisible === null && showTooltip ? (
                <Animatable.View
                    animation="fadeIn"
                    delay={500}
                    duration={500}
                    style={[styles.container, viewStyle]}
                >
                    <ImageBackground
                        resizeMode="cover"
                        source={imageSource}
                        style={{ ...bgStyle }}
                    >
                        <View style={{ padding: 20 }}>
                            <Text style={styles.titleText}>{title}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={async () => {
                                checked &&
                                    (await SecureStore.setItemAsync(
                                        `${user.userId}_${tooltipConstant}`,
                                        'false',
                                        {}
                                    ))
                                setTooltipVisible(false)
                                if (callback) callback()
                            }}
                            style={styles.crossIcon}
                        >
                            <Entypo name="cross" size={18} color="white" />
                        </TouchableOpacity>

                        <View style={styles.crossContainer}>
                            <TouchableOpacity
                                onPress={() => setChecked(!checked)}
                            >
                                <View
                                    style={{
                                        ...styles.crossView,
                                        backgroundColor: checked
                                            ? 'white'
                                            : 'transparent',
                                    }}
                                />
                                <Icon
                                    name="done"
                                    pack="material"
                                    style={styles.doneIcon}
                                />
                            </TouchableOpacity>
                            <View style={styles.bottomContainer}>
                                <Text style={styles.bottomText}>
                                    Don't show me this tip again.
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                </Animatable.View>
            ) : null}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1,
    },
    titleText: {
        fontSize: 12,
        width: '90%',
        color: 'white',
        fontFamily: 'SFProDisplay-Semibold',
    },
    crossIcon: {
        position: 'absolute',
        right: 8,
        top: 8,
    },
    crossContainer: {
        flexDirection: 'row',
        marginHorizontal: 15,
        paddingTop: 2,
    },
    crossView: {
        height: 13,
        width: 13,
        borderWidth: 1,
        marginHorizontal: 3,
        bottom: 14,
        borderColor: 'white',
        borderRadius: 2,
        borderColor: 'white',
    },
    doneIcon: {
        height: 12,
        position: 'absolute',
        bottom: 14,
        left: 3,
        tintColor: '#42C0F5',
    },
    bottomContainer: {
        bottom: 15,
        marginHorizontal: 4,
    },
    bottomText: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'SFProDisplay-Semibold',
    },
})

export default CustomTooltip
