import React, { useCallback, useEffect, useRef } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import { Divider, Overlay } from 'react-native-elements'
import { text } from '../styles/basic'
import global from '../../global'

const ReminderForModal = ({ isVisible, onClose, onPressReminderFor }) => {
    const onRequestClose = useCallback(() => {
        onClose && onClose()
    }, [onClose])

    return (
        <Overlay
            onBackdropPress={onRequestClose}
            onRequestClose={onRequestClose}
            isVisible={isVisible}
            overlayStyle={styles.neveroverly}
        >
            <View>
                <TouchableOpacity
                    onPress={() => {
                        onPressReminderFor && onPressReminderFor(2)
                    }}
                    style={styles.neverconteinar}
                >
                    <Text style={styles.neverWhenOn}>{'Friend(s)'}</Text>
                    <Image
                        style={styles.imageStyle}
                        source={global.ASSETS.RIGHTKEY}
                    />
                </TouchableOpacity>

                <Divider />

                <TouchableOpacity
                    onPress={() => {
                        onPressReminderFor && onPressReminderFor(3)
                    }}
                    style={styles.neverconteinar}
                >
                    <Text style={styles.neverWhenOn}>{'Phone Contact(s)'}</Text>
                    <Image
                        style={styles.imageStyle}
                        source={global.ASSETS.RIGHTKEY}
                    />
                </TouchableOpacity>
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    neveroverly: {
        width: 220,
        alignSelf: 'flex-end',
        marginHorizontal: 20,
        borderRadius: 7,
        justifyContent: 'center',
        marginBottom: 120,
        padding: 0,
        paddingVertical: 8,
    },

    neverWhenOn: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    neverconteinar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: 16,
        // backgroundColor:"#828282"
    },
    imageStyle: {
        height: 16,
        width: 16,
        resizeMode: 'contain',
    },
})

export default ReminderForModal
