import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchReminderForOther,
    fetchReminderTribes,
    moveToArchiveReminder,
    moveToCompleteReminder,
    prefillCustomReminderForm,
    searchReminder,
} from '../actions/ReminderActions'
import { text } from '../styles/basic'
import LottieView from 'lottie-react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import RIPPLE from '../asset/image/uploading_1.json'

import { resetReminderForOtherSearch } from '../reducers/ReminderReducers'
import ReminderMemberProfiles from './ReminderMemberProfiles'
import moment from 'moment'
import ChevronIcon from './ChevronIcon'
import { Actions } from 'react-native-router-flux'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import global from '../../global'
import ReminderMember from './ReminderMember'
import { REMINDER_FOR } from '../Utils/Constants'
import { getReminderTimeForCustom } from '../Utils/HelperMethods'

const ReminderForOther = () => {
    const [isUpdating, setIsUpdating] = useState(false)
    const [expandedReminder, setExpandedReminder] = useState([])
    const dispatch = useDispatch()
    const {
        reminderForOtherLoading,
        reminderForOtherAvailable,
        reminderForOther,
        reminderForOtherSearch,
        reminderForOtherSearchLoading,
        reminderForOtherSearchAvailable,
        reminderSearchText,
    } = useSelector((state) => state?.reminder)

    const isFetching = useRef(false)
    const isMoreSearchFetching = useRef(false)
    const row = useRef([])

    useEffect(() => {
        isFetching.current = reminderForOtherLoading
    }, [reminderForOtherLoading])

    useEffect(() => {
        isMoreSearchFetching.current = reminderForOtherSearchLoading
    }, [reminderForOtherSearchLoading])

    useEffect(() => {
        dispatch(fetchReminderForOther(0, 10))
        dispatch(resetReminderForOtherSearch())
    }, [])

    const onEndReach = useCallback(() => {
        const isSearching = reminderSearchText.trim().length
        const previousDataLength = isSearching
            ? reminderForOtherSearch?.length
            : reminderForOther?.length
        if (
            !isSearching &&
            reminderForOtherAvailable &&
            !reminderForOtherLoading &&
            previousDataLength % 10 === 0 &&
            !isFetching.current
        ) {
            isFetching.current = true
            dispatch(fetchReminderTribes(previousDataLength, 10))
        } else if (
            isSearching &&
            reminderForOtherSearchAvailable &&
            !reminderForOtherSearchLoading &&
            previousDataLength % 10 === 0 &&
            !isMoreSearchFetching.current
        ) {
            isMoreSearchFetching.current = true
            dispatch(searchReminder(previousDataLength, 10))
        }
    }, [
        dispatch,
        reminderForOther,
        reminderForOtherAvailable,
        reminderForOtherLoading,
        reminderSearchText,
        reminderForOtherSearch,
        reminderForOtherSearchLoading,
        reminderForOtherSearchAvailable,
    ])

    const onRefresh = useCallback(() => {
        if (reminderSearchText.trim().length) {
            dispatch(searchReminder(0, 10, reminderSearchText))
        } else {
            dispatch(fetchReminderForOther(0, 10))
        }
    }, [dispatch, reminderSearchText])

    const onPressReminder = useCallback(
        (selectedReminder) => {
            dispatch(prefillCustomReminderForm(selectedReminder))
            Actions.push('CreateReminder', { selectedReminder })
        },
        [dispatch]
    )

    const closeCurrentRow = useCallback((index) => {
        row.current[index] && row.current[index].close()
    }, [])

    const handleDone = useCallback(
        async (item) => {
            setIsUpdating(true)
            await dispatch(moveToCompleteReminder(item._id))
            setIsUpdating(false)
        },
        [dispatch]
    )

    const handleArchive = useCallback(
        async (item) => {
            setIsUpdating(true)
            await dispatch(moveToArchiveReminder(item._id))
            setIsUpdating(false)
        },
        [dispatch]
    )

    const onChangeExpandReminder = useCallback(
        (reminderId) => {
            if (expandedReminder.includes(reminderId)) {
                setExpandedReminder((prevState) =>
                    prevState.filter((item) => item !== reminderId)
                )
            } else {
                setExpandedReminder((prevState) => [...prevState, reminderId])
            }
        },
        [expandedReminder]
    )

    const rightSwipeActions = useCallback((item, index) => {
        return (
            <View style={styles.itemBackContainer}>
                <TouchableOpacity
                    onPress={() => {
                        closeCurrentRow(index)
                        handleArchive(item).then((r) => {})
                    }}
                    activeOpacity={0.7}
                    style={[
                        styles.iconContainer,
                        { backgroundColor: '#ED7437' },
                    ]}
                >
                    <Image
                        source={global.ASSETS.ARCHIVE1}
                        style={styles.backIconStyle}
                    />
                    <Text style={styles.iconTextStyle}>Archive</Text>
                </TouchableOpacity>
            </View>
        )
    }, [])

    const leftSwipeActions = useCallback((item, index) => {
        return (
            <View style={styles.itemBackContainer}>
                <TouchableOpacity
                    onPress={() => {
                        closeCurrentRow(index)
                        handleDone(item).then((r) => {})
                    }}
                    activeOpacity={0.7}
                    style={[
                        styles.iconContainer,
                        { backgroundColor: '#46BA1D' },
                    ]}
                >
                    <Image
                        source={global.ASSETS.DONE}
                        style={styles.backIconStyle}
                    />
                    <Text style={styles.iconTextStyle}>Done</Text>
                </TouchableOpacity>
            </View>
        )
    }, [])

    const renderItem = useCallback(
        ({ item, index }) => {
            const message = item?.message
            const reminderForOtherData = reminderSearchText.trim()
                ? reminderForOtherSearch
                : reminderForOther
            const reminderForOtherDataLength = reminderForOtherData.length
            const isLastItem = reminderForOtherDataLength === index - 1
            const userRef = item.recipient_users?.map(
                (subItem) => subItem.userRef
            )
            const isExpanded = expandedReminder?.includes(item._id)
            const reminderFor = item?.reminder_for

            return (
                <>
                    <Swipeable
                        ref={(ref) => (row.current[index] = ref)}
                        renderRightActions={() =>
                            rightSwipeActions(item, index)
                        }
                        renderLeftActions={() =>
                            leftSwipeActions(item, index, false)
                        }
                        onSwipeableWillOpen={() => {
                            this.closeRow(index)
                        }}
                    >
                        <View style={styles.rowView}>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => {
                                    onPressReminder(item)
                                }}
                                style={styles.itemView}
                            >
                                <Text
                                    style={styles.nameStyle}
                                    numberOfLines={2}
                                >
                                    {message || 'no reminder message'}
                                </Text>
                                {userRef.length && !isExpanded ? (
                                    <ReminderMemberProfiles
                                        userDetails={userRef}
                                        isLarger={true}
                                    />
                                ) : null}
                                <Text style={styles.dateText}>
                                    {getReminderTimeForCustom({
                                        type: item.repeat_type,
                                        startDate: item.start_date,
                                        everyWeek:
                                            item?.weeklyRepeatType?.every_week,
                                        weeklySelectedDays:
                                            item?.weeklyRepeatType
                                                ?.weekly_selected_days,
                                        monthlySelectedDays:
                                            item?.monthlyRepeatType
                                                ?.monthly_selected_day,
                                        everyMonth:
                                            item?.monthlyRepeatType
                                                ?.every_month,
                                        customEvery:
                                            item?.customRepeatType
                                                ?.custom_every,
                                        customEveryUnit:
                                            item?.customRepeatType
                                                ?.custom_every_unit,
                                        exceptionDates:
                                            item?.customRepeatType
                                                ?.exception_dates,
                                        exceptionTimes:
                                            item?.customRepeatType
                                                ?.exception_times,
                                        everyYear:
                                            item?.yearlyRepeatType?.every_year,
                                        yearlyDay:
                                            item?.yearlyRepeatType?.yearly_day,
                                        yearlyWeek:
                                            item?.yearlyRepeatType?.yearly_week,
                                        yearlyMonth:
                                            item?.yearlyRepeatType
                                                ?.yearly_month,
                                    })}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.iconStyle}
                                hitSlop={{
                                    top: 10,
                                    right: 10,
                                    left: 10,
                                    bottom: 10,
                                }}
                                onPress={() => {
                                    onChangeExpandReminder(item._id)
                                }}
                            >
                                <ChevronIcon isExpanded={isExpanded} />
                            </TouchableOpacity>
                        </View>
                    </Swipeable>
                    {isLastItem &&
                        (isFetching.current ||
                            isMoreSearchFetching.current) && (
                            <View style={styles.lastItemView}>
                                <LottieView
                                    style={{
                                        height: hp(4),
                                    }}
                                    source={RIPPLE}
                                    autoPlay
                                    loop
                                />
                            </View>
                        )}
                    {isExpanded ? (
                        <ReminderMember
                            members={
                                reminderFor === REMINDER_FOR.FRIENDS
                                    ? item.recipient_users
                                    : item.recipient_contacts
                            }
                            reminder_for={reminderFor}
                            reminderId={item._id}
                        />
                    ) : null}
                </>
            )
        },
        [
            reminderSearchText,
            reminderForOtherSearch,
            reminderForOther,
            onPressReminder,
            expandedReminder,
        ]
    )

    const renderEmptyView = () => {
        return (
            <View style={styles.centerView}>
                <Text style={styles.emptyText}>
                    No Reminder For Other found
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.mainView}>
            {(reminderSearchText &&
                !reminderForOtherSearch.length &&
                reminderForOtherSearchLoading) ||
            (reminderForOtherLoading && !reminderForOther.length) ? (
                <View style={styles.centerView}>
                    <LottieView
                        style={{
                            height: hp(8),
                        }}
                        source={RIPPLE}
                        autoPlay
                        loop
                    />
                </View>
            ) : (
                <FlatList
                    data={
                        reminderSearchText?.trim()
                            ? reminderForOtherSearch
                            : reminderForOther
                    }
                    contentContainerStyle={styles.contentContainerStyle}
                    keyExtractor={(item, index) => item + index}
                    renderItem={renderItem}
                    stickySectionHeadersEnabled={true}
                    onRefresh={onRefresh}
                    refreshing={reminderForOtherLoading || isUpdating}
                    onEndReached={onEndReach}
                    ListEmptyComponent={renderEmptyView()}
                />
            )}
        </View>
    )
}
const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },
    contentContainerStyle: {
        flexGrow: 1,
    },
    nameStyle: {
        fontFamily: text.FONT_FAMILY.MEDIUM,
        color: '#000',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 6,
    },
    dateText: {
        color: '#00000080',
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: 16,
        fontWeight: '400',
        marginTop: 6,
        marginRight: 6,
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    centerView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#CBCBCB',
        backgroundColor: 'white',
        justifyContent: 'space-between',
    },
    itemView: {
        flex: 1,
        paddingVertical: 16,
    },
    lastItemView: {
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    iconContainer: {
        // backgroundColor: '#F66565',
        height: '98%',
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIconStyle: {
        height: 25,
        width: 25,
        marginBottom: 5,
    },
    iconTextStyle: {
        fontWeight: '600',
        fontSize: 12,
        fontFamily: text.FONT_FAMILY.REGULAR,
        color: '#fff',
    },
    itemBackContainer: {
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
})
export default ReminderForOther
