import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import CountryPicker from 'react-native-country-picker-modal'

const CountryDropdown = ({
    customStyle,
    visible,
    initialValue,
    onSelectCountry,
}) => {
    const [selectedCountry, setSelectedCountry] = useState(initialValue || '')
    useEffect(() => {
        if (initialValue) {
            setSelectedCountry(initialValue)
        }
    }, [initialValue])
    return (
        <View>
            <CountryPicker
                countryCode={selectedCountry}
                visible={visible}
                onSelect={(country) => {
                    setSelectedCountry(country?.cca2)
                    onSelectCountry && onSelectCountry(country?.cca2)
                }}
                withAlphaFilter
                withFlagButton={false}
                placeholder={''}
                theme={{
                    fontFamily: 'SFProDisplay-Regular',
                    fontSize: 16,
                }}
                withCountryNameButton
                containerButtonStyle={[
                    styles.containerView,
                    customStyle && customStyle,
                ]}
            />
            {!selectedCountry ? (
                <Text pointerEvents={'none'} style={styles.absolutePlaceholder}>
                    {'Select Country'}
                </Text>
            ) : null}
        </View>
    )
}
const styles = StyleSheet.create({
    containerView: {
        height: 50,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        width: '100%',
        paddingHorizontal: 16,
        borderRadius: 5,
        justifyContent: 'center',
    },
    absolutePlaceholder: {
        position: 'absolute',
        top: 16,
        left: 16,
        fontFamily: 'SFProDisplay-Regular',
        fontSize: 16,
        color: '#BDBDBD',
    },
})
export default CountryDropdown
