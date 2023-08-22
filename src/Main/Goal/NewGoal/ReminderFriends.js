import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    FlatList,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchReminderFriends,
    searchReminderFriends,
} from '../../../actions/ReminderActions'
import { color, text } from '../../../styles/basic'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Actions } from 'react-native-router-flux'
import ReminderSearchBar from '../../../components/ReminderSearchBar'
import ReminderCheckbox from '../../../components/ReminderCheckbox'
import LottieView from 'lottie-react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import RIPPLE from '../../../asset/image/uploading_1.json'
import Button from '../Button'
import {
    resetReminderSearchFriends,
    setReminderSearchFriendsLoading,
} from '../../../reducers/ReminderReducers'
import ProfileImage from '../../Common/ProfileImage'
import { setCustomReminderForms } from '../../../reducers/ReminderFormReducers'
import { debounce } from 'lodash'

const ReminderFriends = () => {
    const dispatch = useDispatch()
    const {
        reminderFriendsLoading,
        reminderFriendsAvailable,
        reminderFriends,
        reminderSearchFriends,
        reminderSearchFriendsLoading,
        reminderSearchFriendsAvailable,
    } = useSelector((state) => state?.reminder)
    const { recipient_users_details, recipient_users } = useSelector(
        (state) => state?.reminderForm?.customReminderForms
    )
    const [searchText, setSearchText] = useState('')
    const [selectedMemberId, setSelectedMemberId] = useState(
        Array.isArray(recipient_users) ? recipient_users : []
    )
    const isFetching = useRef(false)
    const isMoreSearchFetching = useRef(false)
    const selectedMemberDetails = useRef(
        Array.isArray(recipient_users_details) ? recipient_users_details : []
    )

    useEffect(() => {
        isFetching.current = reminderFriendsLoading
    }, [reminderFriendsLoading])

    useEffect(() => {
        isMoreSearchFetching.current = reminderSearchFriendsLoading
    }, [reminderSearchFriendsLoading])

    useEffect(() => {
        dispatch(fetchReminderFriends(0, 10))
        dispatch(resetReminderSearchFriends())
    }, [])

    const onChangeMemberId = useCallback(
        (id, allUserDetail) => {
            if (selectedMemberId.includes(id)) {
                setSelectedMemberId(
                    selectedMemberId.filter((item) => item !== id)
                )
                selectedMemberDetails.current = selectedMemberDetails.current.filter(
                    (item) => item._id !== id
                )
            } else {
                setSelectedMemberId([...selectedMemberId, id])
                selectedMemberDetails.current = [
                    ...selectedMemberDetails.current,
                    allUserDetail,
                ]
            }
        },
        [selectedMemberId]
    )

    const debounceSearch = useCallback(
        debounce((searchText) => {
            return dispatch(searchReminderFriends(0, 10, searchText))
        }, 500),
        [dispatch]
    )

    const onSearchTextChange = useCallback(
        (value) => {
            setSearchText(value)
            if (value?.trim()) {
                dispatch(setReminderSearchFriendsLoading(true))
                debounceSearch(value.trim())
            } else {
                dispatch(resetReminderSearchFriends())
            }
        },
        [dispatch]
    )

    const onEndReach = useCallback(() => {
        const isSearching = searchText.trim().length
        const previousDataLength = isSearching
            ? reminderSearchFriends?.length
            : reminderFriends?.length
        if (
            !isSearching &&
            reminderFriendsAvailable &&
            !reminderFriendsLoading &&
            previousDataLength % 10 === 0 &&
            !isFetching.current
        ) {
            isFetching.current = true
            dispatch(fetchReminderFriends(previousDataLength, 10))
        } else if (
            isSearching &&
            reminderSearchFriendsAvailable &&
            !reminderSearchFriendsLoading &&
            previousDataLength % 10 === 0 &&
            !isMoreSearchFetching.current
        ) {
            isMoreSearchFetching.current = true
            dispatch(searchReminderFriends(previousDataLength, 10))
        }
    }, [
        dispatch,
        reminderFriends,
        reminderFriendsAvailable,
        reminderFriendsLoading,
        searchText,
        reminderSearchFriends,
        reminderSearchFriendsLoading,
        reminderSearchFriendsAvailable,
    ])

    const onRefresh = useCallback(() => {
        if (searchText.trim().length) {
            dispatch(searchReminderFriends(0, 10, searchText.trim()))
        } else {
            dispatch(fetchReminderFriends(0, 10))
        }
    }, [dispatch, searchText])

    const onPressConfirm = useCallback(() => {
        dispatch(
            setCustomReminderForms({
                recipient_users_details: selectedMemberDetails.current,
                recipient_users: selectedMemberId,
            })
        )
        Actions.pop()
    }, [selectedMemberId])

    const onPressTribe = useCallback(() => {
        Actions.push('ReminderTribe')
    }, [])

    const renderItem = useCallback(
        ({ item, index }) => {
            const userDetails = item?.userDetails
            const name = userDetails?.name
            const id = userDetails?._id
            const image = userDetails?.profile?.image
            const isSelected = selectedMemberId.includes(id)
            const dataLength = searchText.trim()
                ? reminderSearchFriends.length
                : reminderFriends.length
            const isEndOfList = dataLength - 1 === index
            return (
                <>
                    <TouchableOpacity
                        style={styles.itemView}
                        activeOpacity={0.6}
                        onPress={() => {
                            onChangeMemberId(id, userDetails)
                        }}
                    >
                        <View style={styles.checkboxStyle}>
                            <ReminderCheckbox isSelected={isSelected} />
                        </View>
                        <View
                            style={[
                                styles.borderContainer,
                                // isLastItem && styles.noBorder,
                            ]}
                        >
                            <ProfileImage
                                imageStyle={styles.imageStyle}
                                imageUrl={image}
                                defaultImageContainerStyle={styles.imageStyle}
                                userId={id}
                            />
                            <Text style={styles.nameStyle}>
                                {name || 'no name'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {isEndOfList &&
                        (reminderFriendsLoading ||
                            reminderSearchFriendsLoading) && (
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
                </>
            )
        },
        [
            selectedMemberId,
            reminderFriends,
            searchText,
            reminderSearchFriends,
            reminderSearchFriendsLoading,
            reminderFriendsLoading,
        ]
    )

    const renderEmptyView = () => {
        return (
            <View style={styles.centerView}>
                <Text style={styles.emptyText}>No Friends found</Text>
            </View>
        )
    }

    return (
        <View style={styles.mainView}>
            <SafeAreaView style={{ backgroundColor: color.GM_BLUE }} />
            <SafeAreaView style={styles.safeAreaView}>
                <View style={styles.mainView}>
                    <View style={styles.headerview}>
                        <Ionicons
                            onPress={() => Actions.pop()}
                            name="chevron-back"
                            size={26}
                            color="#FFF"
                        />
                        <Text style={styles.headerTitle}>Friends</Text>
                        <View style={styles.rightView} />
                    </View>
                    <View style={styles.searchView}>
                        <ReminderSearchBar
                            value={searchText}
                            onChangeText={onSearchTextChange}
                            placeholder={'Search'}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.selectTribeButton}
                        onPress={onPressTribe}
                    >
                        <Text style={styles.tribeTitle}>
                            {'Select from Tribes'}
                        </Text>
                        <Ionicons
                            size={20}
                            name={'chevron-forward'}
                            color={'#333'}
                        />
                    </TouchableOpacity>
                    {(searchText &&
                        !reminderSearchFriends.length &&
                        reminderSearchFriendsLoading) ||
                    (reminderFriendsLoading && !reminderFriends.length) ? (
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
                                searchText?.trim()
                                    ? reminderSearchFriends
                                    : reminderFriends
                            }
                            contentContainerStyle={styles.contentContainerStyle}
                            keyExtractor={(item, index) => item + index}
                            renderItem={renderItem}
                            onRefresh={onRefresh}
                            refreshing={reminderFriendsLoading}
                            onEndReached={onEndReach}
                            ListEmptyComponent={renderEmptyView()}
                        />
                    )}
                    {selectedMemberId.length !== 0 && (
                        <View style={styles.bottomButtonView}>
                            <Button
                                text={'Done'}
                                onPress={onPressConfirm}
                                containerStyle={styles.buttonStyle}
                                textStyle={styles.buttonTitle}
                            />
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </View>
    )
}
const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
    mainView: {
        flex: 1,
    },
    contentContainerStyle: {
        flexGrow: 1,
    },
    rightView: {
        height: 24,
        width: 24,
    },
    headerview: {
        backgroundColor: '#45C9F6',
        width: '100%',
        height: 44,
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: text.FONT_FAMILY.BOLD,
    },
    sectionTitle: {
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        color: color.TEXT_COLOR.DARK,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    searchView: {
        height: 62,
        width: '100%',
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    sectionView: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 4,
        backgroundColor: 'white',
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    allRowTitle: {
        fontFamily: text.FONT_FAMILY.MEDIUM,
        color: color.TEXT_COLOR.DARK,
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 12,
    },
    itemView: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxStyle: {
        marginRight: 20,
    },
    imageStyle: {
        height: 30,
        width: 30,
        marginRight: 20,
        borderRadius: 30,
    },
    nameStyle: {
        fontFamily: text.FONT_FAMILY.MEDIUM,
        color: '#000',
        fontSize: 16,
        fontWeight: '500',
    },
    borderContainer: {
        flex: 1,
        borderBottomWidth: 1.5,
        borderBottomColor: color.GM_LIGHT_GRAY,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    centerView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomButtonView: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    buttonStyle: {
        backgroundColor: color.GM_BLUE,
        height: 40,
        width: '100%',
        justifyContent: 'center',
    },
    buttonTitle: {
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
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
    selectTribeButton: {
        flexDirection: 'row',
        height: 40,
        marginHorizontal: 16,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        marginTop: 16,
        justifyContent: 'space-between',
    },
    tribeTitle: {
        fontSize: 18,
        color: '#333',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
})
export default ReminderFriends
