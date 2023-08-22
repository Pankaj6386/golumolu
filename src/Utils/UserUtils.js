/** @format */

// Util functions for user
import { api as API } from '../redux/middleware/api'
import { _transformUserForGiftedChat } from '../redux/modules/chat/ChatRoomActions'

export class MemberDocumentFetcher {
    static clearMemberCache() {
        MemberDocumentFetcher.cachedMemberMap = {}
    }
    static async getUserDocument(
        userId,
        token,
        maybeMemberMap,
        skipTransformUserForGiftedChat
    ) {
        let result
        if (MemberDocumentFetcher.cachedMemberMap[userId]) {
            // check cache
            result = MemberDocumentFetcher.cachedMemberMap[userId]
        } else if (maybeMemberMap[userId]) {
            result = maybeMemberMap[userId]
        } else {
            result = (
                await API.get(`secure/user/profile?userId=${userId}`, token)
            ).data
        }
        if (result) {
            // cache the result
            MemberDocumentFetcher.cachedMemberMap[result._id] = result
        }
        return skipTransformUserForGiftedChat
            ? result
            : _transformUserForGiftedChat(result)
    }
}
MemberDocumentFetcher.cachedMemberMap = {}

export const getGenderNameByGender = (gender) => {
    return gender === 'Female' ? 'her' : gender === 'Male' ? 'his' : 'their'
}

export const getGenderNoun = (gender) => {
    return gender === 'Female' ? 'her' : gender === 'Male' ? 'him' : 'them'
}

export const getGenderPronoun = (gender) => {
    return gender === 'Female' ? 'She' : gender === 'Male' ? 'He' : 'They'
}
