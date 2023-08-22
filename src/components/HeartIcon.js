import React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import HeartEmpty from '../asset/icons/heart_empty.png'
import HeartFill from '../asset/icons/heart_fill.png'

const HeartIcon = ({ isSelected, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.heartTouchable}
            hitSlop={{ left: 12, right: 12, top: 12, bottom: 12 }}
            onPress={() => onPress && onPress()}
        >
            <Image
                style={styles.mainView}
                source={isSelected ? HeartFill : HeartEmpty}
            />
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    heartTouchable: {
        height: 30,
        width: 30,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    mainView: {
        height: 18,
        width: 18,
        resizeMode: 'contain',
    },
})
export default HeartIcon
