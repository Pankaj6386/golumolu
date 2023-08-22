import React, { useCallback, useState } from 'react'
import {
    Image,
    Text,
    TextInput,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Divider } from 'react-native-elements'
import { text, color } from '../styles/basic'
import { REMINDER_FOR } from '../Utils/Constants'
import defaultUserProfile from '../asset/utils/defaultUserProfile.png'
import { isValidEmail, isValidPhoneNumber } from '../Utils/HelperMethods'
import { setCustomReminderForms } from '../reducers/ReminderFormReducers'
import { v4 as uuidv4 } from 'uuid'
import global from '../../global'

const ReminderContactList = () => {
    const dispatch = useDispatch()
    const [text, setText] = useState('')
    const [error, setError] = useState('')
    const { reminder_for, recipient_contacts } = useSelector(
        (state) => state.reminderForm?.customReminderForms
    )

    const onChangeText = useCallback((textLocal) => {
        setText(textLocal)
        if (isValidEmail(textLocal) || isValidPhoneNumber(textLocal)) {
            setError('')
        } else {
            setError('Invalid email or phone number')
        }
    }, [])

    const onClickAdd = useCallback(() => {
        if (isValidEmail(text) || isValidPhoneNumber(text)) {
            setError('')
            const id = uuidv4()
            const obj = {
                country_code: 'us',
                id,
                name: id,
            }
            if (isValidEmail(text)) {
                obj.email = text
                obj.phone_number = null
            }
            if (isValidPhoneNumber(text)) {
                obj.phone_number = text
                obj.email = null
            }
            dispatch(
                setCustomReminderForms({
                    recipient_contacts: [...recipient_contacts, obj],
                })
            )
            setText('')
        } else {
            setError('Invalid email or phone number')
        }
    }, [text, recipient_contacts])

    const onDeleteContact = useCallback(
        (id) => {
            const filterContacts = recipient_contacts.filter(
                (item) => item.id !== id
            )
            dispatch(
                setCustomReminderForms({ recipient_contacts: filterContacts })
            )
        },
        [recipient_contacts, dispatch]
    )

    const isContactSelected = reminder_for === REMINDER_FOR.CONTACTS
    if (isContactSelected) {
        return (
            <>
                <Divider style={styles.lineborder} />
                <View style={styles.mainContactView}>
                    {recipient_contacts.map((item) => {
                        const details = item?.phone_number || item?.email
                        const image = item?.image || null
                        return (
                            <View style={styles.contactView} key={item.id}>
                                <Image
                                    source={
                                        image
                                            ? { uri: image }
                                            : defaultUserProfile
                                    }
                                    style={styles.contactImageStyle}
                                />
                                <Text
                                    style={styles.contactText}
                                    numberOfLines={1}
                                >
                                    {details}
                                </Text>
                                <TouchableOpacity
                                    style={styles.closeIconView}
                                    onPress={() => {
                                        onDeleteContact(item?.id)
                                    }}
                                >
                                    <Image
                                        source={global.ASSETS.CROSSBAG}
                                        style={styles.closeIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                    <View style={styles.rowView}>
                        <TextInput
                            style={styles.textInputStyle}
                            onChangeText={onChangeText}
                            value={text}
                            placeholder={'Add another email or SMS #'}
                            placeholderTextColor={'#777'}
                            returnKeyType={'done'}
                            keyboardType={'email-address'}
                            autoCapitalize={'none'}
                        />
                        <TouchableOpacity
                            style={[
                                styles.buttonStyle,
                                !!error && styles.disabledButton,
                            ]}
                            onPress={onClickAdd}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    !!error && styles.disableButtonText,
                                ]}
                            >
                                {'Add'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {error ? (
                        <Text style={styles.errorStyle}>{error}</Text>
                    ) : null}
                </View>
            </>
        )
    }
    return null
}
const styles = StyleSheet.create({
    lineborder: {
        marginTop: 16,
    },
    mainContactView: {
        paddingTop: 20,
        paddingHorizontal: 16,
    },
    contactView: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
    },
    contactImageStyle: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
        marginRight: 12,
        borderRadius: 20,
    },
    contactText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#000',
        fontFamily: text.FONT_FAMILY.REGULAR,
        flex: 1,
    },
    textInputStyle: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        fontSize: 16,
        height: 44,
        flex: 1,
        paddingHorizontal: 16,
        marginRight: 12,
    },
    errorStyle: {
        fontSize: 14,
        fontWeight: '700',
        color: 'red',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        marginTop: 8,
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStyle: {
        height: 44,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color.GM_BLUE_DEEP,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
    },
    disabledButton: {
        backgroundColor: '#ddd',
    },
    disableButtonText: {
        color: '#AEAEAE',
    },
    closeIconView: {
        height: 32,
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        height: 24,
        width: 24,
        resizeMode: 'contain',
    },
})
export default ReminderContactList
