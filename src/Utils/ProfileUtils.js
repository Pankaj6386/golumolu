/** @format */

import _ from 'lodash'
import { api as API } from '../redux/middleware/api'
const ProfileUtils = {
    async updateAccount(values) {
        const {
            name,
            headline,
            country,
            city,
            links,
            helpOrServe,
            likeToConnect,
            token,
        } = values
        const user = {
            name,
            headline,
            country,
            city,
            links,
            helpOrServe,
            likeToConnect,
        }

        return API.put('secure/user/account', user, token)
    },

    async updateProfile(values) {
        const {
            image,
            about,
            occupation,
            location,
            elevatorPitch,
            token,
        } = values

        let profile = {
            image,
            about,
            occupation,
            location,
            elevatorPitch,
        }

        Object.keys(profile).forEach((key) => {
            if (
                profile[key] == undefined ||
                profile[key] == null ||
                _.isEmpty(profile[key])
            ) {
                key == 'image' ? delete profile[key] : (profile[key] = '')
            }
        })

        return API.put('secure/user/profile', profile, token)
    },

    async updatePassword(values) {
        const { oldPassword, newPassword, token } = values
        console.log('in utils old password is: ', oldPassword)
        console.log('in utils new password is: ', newPassword)
        console.log('in utils values is: ', values)
        return API.put(
            'secure/user/account/password',
            { oldPassword, newPassword },
            token
        )
    },
}

module.exports = {
    updateProfile: ProfileUtils.updateProfile,
    updateAccount: ProfileUtils.updateAccount,
    updatePassword: ProfileUtils.updatePassword,
}
