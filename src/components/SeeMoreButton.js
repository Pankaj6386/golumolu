/** @format */

import React from 'react'
import { Text, View } from 'react-native'
import DelayedButton from '../Main/Common/Button/DelayedButton'
import { color, default_style, text } from '../styles/basic'

const SeeMoreButton = (props) => {
    const { onPress } = props

    return (
        <View
            style={{
                borderColor: 'lightgrey',
                borderWidth: 0.3,
                justifyContent: 'center',
            }}
        >
            <DelayedButton
                style={{
                    width: '90%',
                    backgroundColor: '#F2F2F2',
                    alignItems: 'center',
                    paddingVertical: 12,
                    marginBottom: 8,
                    marginTop: 8,
                    borderRadius: 3,
                    marginHorizontal: 20,
                    justifyContent: 'center',
                }}
                onPress={onPress}
            >
                <Text
                    style={
                        (default_style.buttonText_1,
                        {
                            color: color.TEXT_COLOR.DARK,
                            fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                        })
                    }
                >
                    See More
                </Text>
            </DelayedButton>
        </View>
    )
}

export default SeeMoreButton
