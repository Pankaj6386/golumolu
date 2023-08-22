/** @format */

import {
    setPhoneContacts,
    loadingPhoneContacts,
    phoneContactsError,
} from '../reducers/ContactsReducer'
import * as Contacts from 'expo-contacts'
import { getData } from '../store/storage'

const DEBUG_KEY = '[ ContactActions ]'

export const getAllContacts = () => {
    return async (dispatch, getState) => {
        const { status } = await Contacts.requestPermissionsAsync()

        try {
            if (status === 'granted') {
                dispatch(loadingPhoneContacts(true))
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers],
                })

                if (data.length > 0) {
                    const contactsData = data.map((data, index) => {
                        return {
                            name: data.firstName,
                            number: data.phoneNumbers[0].number,
                            id: index,
                        }
                    })

                    dispatch(setPhoneContacts(contactsData))
                    // Actions.push('ContactMessage')

                    console.log(
                        `${DEBUG_KEY} This is the response of getting all contacts`,
                        contactsData
                    )
                    dispatch(loadingPhoneContacts(false))
                }
            }
        } catch (error) {
            dispatch(phoneContactsError(error.message))
            console.log(
                `${DEBUG_KEY} This is the error of getting conatacts `,
                error.message
            )
        }
    }
}

export const getAllContactsForReminder = async (userId) => {
    try {
        const { status } = await Contacts.requestPermissionsAsync()
        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [
                    Contacts.Fields.PhoneNumbers,
                    Contacts.Fields.Emails,
                    Contacts.Fields.Image,
                ],
            })
            if (data.length > 0) {
                let contactsData = []
                let favoriteData = []
                const favoriteContact = await getData(`${userId}_contact_like`)
                console.log("favorite contacts",favoriteContact)
                data.forEach((data, index) => {
                    // const phone_number
                    const phoneNumbers = Array.isArray(data.phoneNumbers)
                        ? data.phoneNumbers?.map((item) => ({
                              id: item.id,
                              number: item.number,
                              phone_number: item.digits,
                              country_code: item.countryCode,
                          }))
                        : []
                    const emails = Array.isArray(data.emails)
                        ? data.emails?.map((item) => ({
                              id: item.id,
                              email: item.email,
                          }))
                        : []
                    const image = data?.image?.uri
                    const payloadData = {
                        id: data?.id,
                        name: data?.name,
                        contacts: [...phoneNumbers, ...emails],
                        image,
                    }
                    if (!!favoriteContact && Array.isArray(favoriteContact)) {
                        const foundIndex = payloadData.contacts.findIndex(
                            (item) => favoriteContact.includes(item.id)
                        )
                        if (foundIndex !== -1) {
                            return favoriteData.push(payloadData)
                        }
                    }
                    return contactsData.push(payloadData)
                })
                contactsData.sort((a, b) => a.name > b.name)
                favoriteData.sort((a, b) => a.name > b.name)
                return [...favoriteData, ...contactsData]
            }
            return []
        } else {
            throw Error('No Access')
        }
    } catch (error) {
        console.log(
            `${DEBUG_KEY} This is the error of getting conatacts `,
            error.message
        )
        throw error
    }
}
