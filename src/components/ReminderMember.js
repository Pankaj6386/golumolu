import React, { useCallback, useState } from 'react'
import {
    FlatList,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native'
import { color, text } from '../styles/basic'
import ProfileImage from '../Main/Common/ProfileImage'
import { getProfileImageOrDefault } from '../redux/middleware/utils'
import {
    REMINDER_FOR,
    REMINDER_REQUEST_STATUS,
    REMINDER_REQUEST_STATUS_TEXT,
} from '../Utils/Constants'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { sendReminderRequestAgain } from '../actions/ReminderActions'
import REMINDER_STATUS_FAILED_IMAGE from '../asset/icons/reminder_status_error.png'
import REMINDER_STATUS_DONE_IMAGE from '../asset/icons/reminder_status_done.png'
import REMINDER_STATUS_ACCEPTED_IMAGE from '../asset/icons/reminder_status_accepted.png'

const HeaderView = () => {
    return (
        <View style={styles.headerView}>
            <Text style={styles.headerTitle}>{'Name'}</Text>
            <Text style={styles.headerTitle}>{'Status'}</Text>
            <Text style={styles.headerTitle}>{'Action'}</Text>
        </View>
    )
}
const ReminderMember = ({ reminder_for, members, reminderId }) => {
    const [isSending, setIsSending] = useState([])
    const dispatch = useDispatch()

    const onPressSendAgain = useCallback(
        async (requestedUserId) => {
            try {
                setIsSending((prevState) => [...prevState, requestedUserId])
                await dispatch(
                    sendReminderRequestAgain(reminderId, requestedUserId)
                )
                setIsSending((prevState) =>
                    prevState.filter((item) => item !== requestedUserId)
                )
            } catch (e) {
                setIsSending((prevState) =>
                    prevState.filter((item) => item !== requestedUserId)
                )
            }
        },
        [reminderId, dispatch]
    )

    const renderItem = useCallback(
        ({ item, index }) => {
            const isFriend = reminder_for === REMINDER_FOR.FRIENDS
            const user = isFriend ? item.userRef : item
            const id = isFriend ? user?._id : user.id
            const name = isFriend
                ? user?.name
                : user?.email || user.phone_number
            const status = item?.status
            const isStatusRequested =
                status === REMINDER_REQUEST_STATUS.REQUESTED
            const isStatusFailed =
                status === REMINDER_REQUEST_STATUS.NOT_REQUESTED
            const isStatusAccepted = status === REMINDER_REQUEST_STATUS.ACCEPTED
            const isStatusDone =
                status === REMINDER_REQUEST_STATUS.MARK_AS_COMPLETED
            const date = isStatusRequested
                ? item.last_requested
                : isStatusAccepted
                ? item.accepted_date
                : isStatusDone
                ? item?.marked_as_done_date
                : null
            const isLoadingItem = isSending.includes(id)
            let formattedDate = null
            let disableButton = true
            if (date) {
                formattedDate = moment(date).format('MMM DD, YYYY [at] hh:mma')
            }
            if (
                status === REMINDER_REQUEST_STATUS.REQUESTED &&
                date &&
                moment().isAfter(moment(date), 'days')
            ) {
                disableButton = false
            }
            return (
                <View style={styles.itemView}>
                    <View style={styles.leftView}>
                        <ProfileImage
                            imageStyle={styles.profileImageStyle}
                            imageUrl={getProfileImageOrDefault(
                                user?.profile?.image
                            )}
                        />
                        <Text numberOfLines={2} style={styles.itemTitle}>
                            {name}
                        </Text>
                    </View>
                    <View style={styles.statusView}>
                        <View style={styles.rowView}>
                            <Image
                                source={
                                    isStatusRequested || isStatusFailed
                                        ? REMINDER_STATUS_FAILED_IMAGE
                                        : isStatusAccepted
                                        ? REMINDER_STATUS_ACCEPTED_IMAGE
                                        : REMINDER_STATUS_DONE_IMAGE
                                }
                                style={styles.statusImageStyle}
                            />
                            <Text style={styles.statusText}>
                                {REMINDER_REQUEST_STATUS_TEXT[status]}
                            </Text>
                        </View>
                        {formattedDate ? (
                            <Text
                                style={[styles.statusText, { marginTop: 4 }]}
                                numberOfLines={2}
                            >
                                {'On ' + formattedDate}
                            </Text>
                        ) : null}
                    </View>
                    <View style={styles.rightView}>
                        <TouchableOpacity
                            style={[
                                styles.buttonView,
                                (disableButton || isLoadingItem) &&
                                    styles.disabledButton,
                            ]}
                            disabled={isLoadingItem || disableButton}
                            onPress={() => {
                                onPressSendAgain(id).then()
                            }}
                        >
                            {isLoadingItem ? (
                                <ActivityIndicator color={'#AEAEAE'} />
                            ) : (
                                <Text
                                    style={[
                                        styles.buttonText,
                                        disableButton &&
                                            styles.disableTextColor,
                                    ]}
                                >
                                    {'Send Again'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            )
        },
        [reminder_for, reminderId, onPressSendAgain, isSending]
    )

    return (
        <FlatList
            data={Array.isArray(members) ? members : []}
            renderItem={renderItem}
            ListHeaderComponent={HeaderView}
        />
    )
}
const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },
    headerView: {
        width: '100%',
        height: 38,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        flexDirection: 'row',
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#252323',
        fontFamily: text.FONT_FAMILY.BOLD,
    },
    itemView: {
        minHeight: 56,
        width: '100%',
        borderBottomColor: '#CBCBCB',
        borderBottomWidth: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    leftView: {
        width: '45%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
    },
    profileImageStyle: {
        height: 26,
        width: 26,
        // resizeMode: 'contain',
    },
    itemTitle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        marginLeft: 6,
        flex: 1,
    },
    statusView: {
        width: '22%',
        justifyContent: 'center',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#777',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    rightView: {
        width: '33%',
        height: '100%',
        paddingVertical: 12,
        paddingRight: 16,
        alignItems: 'flex-end',
    },
    buttonView: {
        paddingHorizontal: 6,
        backgroundColor: color.GM_BLUE,
        borderRadius: 4,
        minHeight: 31,
        justifyContent: 'center',
        minWidth: 72,
    },
    buttonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
    },
    disabledButton: {
        backgroundColor: '#ddd',
    },
    disableTextColor: {
        color: '#AEAEAE',
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusImageStyle: {
        height: 16,
        width: 16,
        marginRight: 8,
    },
})
export default ReminderMember
