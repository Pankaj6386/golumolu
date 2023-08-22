import React from 'react'
import { View, StyleSheet, Image, TextInput } from 'react-native'
import { GM_GREEN } from '../styles/basic/color'
import { text, color } from '../styles/basic'
import SearchIcon from '../asset/icons/searchIcon.png'

const ReminderSearchBar = ({ value, placeholder, onChangeText }) => {
    return (
        <View style={styles.mainView}>
            <Image source={SearchIcon} style={styles.leftImage} />
            <TextInput
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#D3D3D3"
                onChangeText={onChangeText}
                style={styles.textInputStyle}
                clearButtonMode={'while-editing'}
                returnKeyType={'search'}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    mainView: {
        height: 40,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: GM_GREEN,
        paddingHorizontal: 12,
        alignItems: 'center',
        flexDirection: 'row',
    },
    leftImage: {
        height: 16,
        width: 16,
        resizeMode: 'contain',
    },
    textInputStyle: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: 14,
        color: color.TEXT_COLOR.DARK,
        height: 40,
        flex: 1,
        paddingLeft: 8,
    },

})
export default ReminderSearchBar
