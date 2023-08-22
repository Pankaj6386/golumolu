import React from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import PUSH_SELECT from '../../../../asset/image/pushSelect.png'
import PUSH_UNSELECT from '../../../../asset/image/pushUnselect.png'
import EMAIL_SELECT from '../../../../asset/image/emailSelect.png'
import EMAIL_UNSELECT from '../../../../asset/image/emailUnselect.png'
import SMS_SELECT from '../../../../asset/image/smsSelect.png'
import SMS_UNSELECT from '../../../../asset/image/smsUnselect.png'

function ToogleComponent({ item, onItemPress }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => onItemPress(item, 'notification')}>
                <Image
                    source={item.pushNotification ? PUSH_SELECT : PUSH_UNSELECT}
                    style={styles.image}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onItemPress(item, 'email')}>
                <Image
                    source={item.email ? EMAIL_SELECT : EMAIL_UNSELECT}
                    style={styles.image}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onItemPress(item, 'sms')}>
                <Image
                    source={item.sms ? SMS_SELECT : SMS_UNSELECT}
                    style={styles.image}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 5,
        marginTop: 20,
    },
    image: {
        resizeMode: 'contain',
        height: 70,
        width: 70,
    },
})

export default ToogleComponent
