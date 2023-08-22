import React, { useCallback, useEffect, useState } from 'react'
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
} from 'react-native'
import { scale } from 'react-native-size-matters'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReminderGoals, searchReminder } from '../actions/ReminderActions'
import moment from 'moment'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Divider } from 'react-native-elements'
import SwipeList from '../Main/Accountability/SwipeList'
import { color, text } from '../styles/basic'
import LottieView from 'lottie-react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import RIPPLE from '../asset/image/uploading_1.json'

const SelfReminder = ({
    onPressReminderItem,
    showSuccessPopup,
    initialExtendedGoal,
}) => {
    const dispatch = useDispatch()
    const {
        reminderGoals,
        reminderGoalLoading,
        isAvailableReminderGoals,
        reminderGoalSearch,
        reminderGoalSearchLoading,
        reminderGoalSearchAvailable,
        reminderSearchText,
    } = useSelector((state) => state.reminder)
    const [state, setState] = useState({
        showTooltip: false,
        extendedGoal: Array.isArray(initialExtendedGoal)
            ? initialExtendedGoal
            : [],
    })

    useEffect(() => {
        dispatch(fetchReminderGoals(0, 10))
    }, [])

    const onEndReach = useCallback(() => {
        const isSearching = reminderSearchText.trim().length

        const previousDataLength = isSearching
            ? reminderGoalSearch.length
            : reminderGoals?.length || 0

        if (
            !isSearching &&
            isAvailableReminderGoals &&
            !reminderGoalLoading &&
            previousDataLength % 10 === 0
        ) {
            fetchReminderGoals(previousDataLength, 10)
        } else if (
            isSearching &&
            reminderGoalSearchAvailable &&
            !reminderGoalSearchLoading &&
            previousDataLength % 10 === 0
        ) {
            dispatch(searchReminder(previousDataLength, 10))
        }
    }, [
        dispatch,
        reminderGoals,
        isAvailableReminderGoals,
        reminderSearchText,
        reminderGoalSearchAvailable,
        reminderGoalSearchLoading,
        reminderGoalLoading,
    ])

    const onRefresh = useCallback(() => {
        if (reminderSearchText.trim().length) {
            dispatch(searchReminder(0, 10, reminderSearchText))
        } else {
            dispatch(fetchReminderGoals(0, 10))
        }
    }, [dispatch, reminderSearchText])

    const onPressGoal = useCallback(
        (goalId, index) => {
            const { extendedGoal } = state
            if (extendedGoal.includes(goalId)) {
                const temp = {}
                if (index === 0) {
                    temp.showTooltip = false
                }
                setState((prevState) => ({
                    ...prevState,
                    extendedGoal: extendedGoal.filter(
                        (item) => item !== goalId
                    ),
                    ...temp,
                }))
            } else {
                const temp = {}
                if (index === 0) {
                    temp.showTooltip = true
                }
                setState((prevState) => ({
                    ...prevState,
                    extendedGoal: [...extendedGoal, goalId],
                    ...temp,
                }))
            }
        },
        [state.extendedGoal]
    )

    const onPressReminder = useCallback(
        (goalData, selectedReminder) => {
            onPressReminderItem &&
                onPressReminderItem(goalData, selectedReminder)
        },
        [onPressReminderItem]
    )

    const onShowSuccessPopup = useCallback(
        (message) => {
            showSuccessPopup && showSuccessPopup(message)
        },
        [onPressReminderItem]
    )

    const renderEmptyView = useCallback(() => {
        return (
            <View style={styles.centerView}>
                <Text style={styles.emptyText}>No Reminders found</Text>
            </View>
        )
    }, [])

    const renderItem = useCallback(
        ({ item, index }) => {
            const date = moment(item.end).format('ll')
            const isExtend = state.extendedGoal?.includes(item._id)
            const isSearching = reminderSearchText?.trim()
            return (
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            onPressGoal(item?._id, index)
                        }}
                        style={[
                            styles.listHeaderContainer,
                            {
                                borderLeftWidth: isExtend ? 5 : 0,
                            },
                        ]}
                    >
                        <View>
                            <Text style={styles.listHeaderText}>
                                {item.title}
                            </Text>
                            <View style={styles.dateContainer}>
                                <Text style={styles.dateTextStyle}>
                                    By {date}
                                </Text>
                                <Ionicons
                                    size={20}
                                    name={
                                        isExtend
                                            ? 'caret-down-outline'
                                            : 'caret-forward-outline'
                                    }
                                    color={isExtend ? '#828282' : '#DADADA'}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View>
                        <Divider />
                        {isExtend || isSearching ? (
                            <SwipeList
                                reminders={item.active_reminders}
                                goalDetails={item}
                                onPressReminder={onPressReminder}
                                showSuccessPopup={onShowSuccessPopup}
                            />
                        ) : null}
                    </View>
                </View>
            )
        },
        [
            state.extendedGoal,
            reminderSearchText,
            onPressReminder,
            onShowSuccessPopup,
        ]
    )

    return (
        <View style={styles.mainView}>
            {(reminderSearchText &&
                !reminderGoalSearch.length &&
                reminderGoalSearchLoading) ||
            (reminderGoalLoading && !reminderGoals.length) ? (
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
                        reminderSearchText.trim()
                            ? reminderGoalSearch
                            : reminderGoals
                    }
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={true}
                    contentContainerStyle={{
                        paddingBottom: scale(50),
                        flexGrow: 1,
                    }}
                    style={styles.container}
                    onRefresh={onRefresh}
                    refreshing={reminderGoalLoading}
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listHeaderContainer: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        borderLeftColor: color.GM_BLUE_DEEP,
        paddingBottom: 10,
    },
    listHeaderText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateTextStyle: {
        fontWeight: '400',
        fontSize: 16,
        marginHorizontal: 5,
        fontFamily: text.FONT_FAMILY.REGULAR,
    },
    centerView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
})
export default SelfReminder
