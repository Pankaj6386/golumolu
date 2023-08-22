import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import ProfileImage from '../Main/Common/ProfileImage'
import { text } from '../styles/basic'

const ReminderMemberProfiles = ({ userDetails, isLarger }) => {
    const isLengthGreaterThen1 = userDetails?.length > 1
    const dataLength = userDetails.length
    return (
        <View
            style={[
                styles.mainView,
                isLengthGreaterThen1 && {
                    width: Math.min(20 * dataLength, 100),
                },
            ]}
        >
            {dataLength === 1 ? (
                <>
                    <ProfileImage
                        imageUrl={userDetails[0]?.profile?.image}
                        imageStyle={styles.imageStyle}
                        defaultImageStyle={styles.imageStyle}
                    />
                    <Text
                        style={[
                            isLarger ? styles.largerNameText : styles.nameText,
                        ]}
                    >
                        {`${isLarger ? 'For ' : ''}${userDetails[0]?.name}`}
                    </Text>
                </>
            ) : dataLength <= 5 ? (
                userDetails.map((item, index) => (
                    <View
                        style={[styles.borderView, { left: index * 20 }]}
                        key={item?._id}
                    >
                        <ProfileImage
                            imageUrl={item?.profile?.image}
                            imageStyle={styles.imageStyle}
                            defaultImageStyle={styles.imageStyle}
                        />
                    </View>
                ))
            ) : (
                Array.apply(null, Array(5)).map((item, index) => {
                    const tempItem = userDetails[index]
                    return (
                        <View
                            style={[styles.borderView, { left: index * 20 }]}
                            key={item?._id}
                        >
                            {index < 4 ? (
                                <ProfileImage
                                    imageUrl={tempItem?.profile?.image}
                                    imageStyle={styles.imageStyle}
                                    defaultImageStyle={styles.imageStyle}
                                />
                            ) : (
                                <View style={styles.circleView}>
                                    <Text style={styles.circleText}>
                                        {`${dataLength - 4}+`}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )
                })
            )}
        </View>
    )
}
const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'row',
        position: 'relative',
        marginRight: 8,
        height: 30,
        alignItems: 'center',
    },
    imageStyle: {
        height: 26,
        width: 26,
        borderRadius: 22,
    },
    borderView: {
        height: 26,
        width: 26,
        borderRadius: 26,
        borderWidth: 1,
        borderColor: 'white',
        position: 'absolute',
        overflow: 'hidden',
    },
    circleView: {
        width: 26,
        height: 26,
        backgroundColor: '#414141',
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleText: {
        fontSize: 10,
        fontWeight: '600',
        color: 'white',
        fontFamily: text.FONT_FAMILY.REGULAR,
    },
    nameText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        marginLeft: 4,
    },
    largerNameText: {
        fontSize: 14,
        color: '#000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        marginLeft: 4,
    },
})
export default ReminderMemberProfiles
