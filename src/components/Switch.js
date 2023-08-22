import React from 'react'
import { Switch, Text, View, StyleSheet } from 'react-native'
import { GM_BLUE_DEEP } from '../styles/basic/color'

const CustomSwitch = (props) => {
    return (
        <View style={styles.viewStyle}>
            <Text style={styles.textStyle}>{props?.value ? 'On' : 'Off'}</Text>
            <Switch
                {...props}
                thumbColor={'white'}
                trackColor={{ true: GM_BLUE_DEEP }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    viewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textStyle: {
        color: '#b3b3b3',
        fontFamily: 'SFProDisplay-Regular',
        fontSize: 16,
        fontWeight: '400',
        marginRight: 12,
    },
})
export default CustomSwitch
