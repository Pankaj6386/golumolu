import React from 'react'
import { StyleSheet, Image } from 'react-native'
import global from '../../global'

const ReminderCheckbox = ({ isSelected }) => {
    return (
        <Image
            style={styles.mainView}
            source={isSelected ? global.ASSETS.RIGHTCLICK : global.ASSETS.BOX}
        />
    )
}
const styles = StyleSheet.create({
    mainView: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
    },
})
export default ReminderCheckbox
