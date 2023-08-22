import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    SafeAreaView,
    View,
    StyleSheet,
    SectionList,
    Text,
    TouchableOpacity,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchReminderTribes,
    searchReminderTribes,
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
    resetReminderSearchTribes,
    resetReminderTribesDetails,
    setReminderSearchTribesLoading,
} from '../../../reducers/ReminderReducers'
import ProfileImage from '../../Common/ProfileImage'
import { setCustomReminderForms } from '../../../reducers/ReminderFormReducers'
import { debounce } from 'lodash'
import ChevronIcon from '../../../components/ChevronIcon'

const currentTribeLimitIndex = 4

const ReminderTribe = () => {
    const dispatch = useDispatch()
    const {
        reminderTribesLoading,
        reminderTribesAvailable,
        reminderTribes,
        reminderSearchTribes,
        reminderSearchTribesLoading,
        reminderSearchTribesAvailable,
    } = useSelector((state) => state?.reminder)
    const { recipient_users_details, recipient_users } = useSelector(
        (state) => state?.reminderForm?.customReminderForms
    )
    const [searchText, setSearchText] = useState('')
    const [selectedMemberId, setSelectedMemberId] = useState(
        Array.isArray(recipient_users) ? recipient_users : []
    )
    const [collapsedTribes, setCollapsedTribes] = useState([])
    const isFetching = useRef(false)
    const isMoreSearchFetching = useRef(false)
    const selectedMemberDetails = useRef(
        Array.isArray(recipient_users_details) ? recipient_users_details : []
    )
    const previousTribeId = useRef(null)

    useEffect(() => {
        setSelectedMemberId(recipient_users)
    }, [recipient_users])

    useEffect(() => {
        isFetching.current = reminderTribesLoading
    }, [reminderTribesLoading])

    useEffect(() => {
        isMoreSearchFetching.current = reminderSearchTribesLoading
    }, [reminderSearchTribesLoading])

    useEffect(() => {
        dispatch(fetchReminderTribes(0, 10))
        dispatch(resetReminderSearchTribes())
        return () => dispatch(resetReminderTribesDetails())
    }, [])

    const onChangeExpandedTribes = useCallback(
        (item) => {
            if (collapsedTribes.includes(item)) {
                setCollapsedTribes((prevState) =>
                    prevState.filter((subItem) => subItem !== item)
                )
            } else {
                setCollapsedTribes([...collapsedTribes, item])
            }
        },
        [collapsedTribes]
    )

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
            return dispatch(searchReminderTribes(0, 10, searchText))
        }, 500),
        [dispatch]
    )

    const onSearchTextChange = useCallback(
        (value) => {
            setSearchText(value)
            if (value?.trim()) {
                dispatch(setReminderSearchTribesLoading(true))
                debounceSearch(value.trim())
            } else {
                dispatch(resetReminderSearchTribes())
            }
        },
        [dispatch]
    )

    // const onChangeAllSelect = useCallback(
    //     (ids, isAllSelected, allUserDetails) => {
    //         if (isAllSelected) {
    //             setSelectedMemberId(
    //                 selectedMemberId.filter((item) => !ids.includes(item))
    //             )
    //             selectedMemberDetails.current = selectedMemberDetails.current.filter(
    //                 (item) => !ids.includes(item._id)
    //             )
    //         } else {
    //             const resArr = []
    //             selectedMemberDetails.current = [
    //                 ...selectedMemberDetails.current,
    //                 ...allUserDetails,
    //             ]
    //             selectedMemberDetails.current.filter(function (item) {
    //                 const i = resArr.findIndex((x) => x._id === item.id)
    //                 if (i === -1) {
    //                     resArr.push(item)
    //                 }
    //                 return null
    //             })
    //             selectedMemberDetails.current = resArr
    //             setSelectedMemberId([...new Set([...selectedMemberId, ...ids])])
    //         }
    //     },
    //     [selectedMemberId]
    // )

    const onEndReach = useCallback(() => {
        const isSearching = searchText.trim().length
        const previousDataLength = isSearching
            ? reminderSearchTribes?.length
            : reminderTribes?.length
        if (
            !isSearching &&
            reminderTribesAvailable &&
            !reminderTribesLoading &&
            previousDataLength % 10 === 0 &&
            !isFetching.current
        ) {
            isFetching.current = true
            dispatch(fetchReminderTribes(previousDataLength, 10))
        } else if (
            isSearching &&
            reminderSearchTribesAvailable &&
            !reminderSearchTribesLoading &&
            previousDataLength % 10 === 0 &&
            !isMoreSearchFetching.current
        ) {
            isMoreSearchFetching.current = true
            dispatch(searchReminderTribes(previousDataLength, 10))
        }
    }, [
        dispatch,
        reminderTribes,
        reminderTribesAvailable,
        reminderTribesLoading,
        searchText,
        reminderSearchTribes,
        reminderSearchTribesLoading,
        reminderSearchTribesAvailable,
    ])

    const onRefresh = useCallback(() => {
        if (searchText.trim().length) {
            dispatch(searchReminderTribes(0, 10, searchText.trim()))
        } else {
            dispatch(fetchReminderTribes(0, 10))
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
        Actions.pop()
    }, [selectedMemberId])

    const renderSectionHeader = useCallback(
        ({ section: { title, data } }) => {
            const allId = data?.map((item) => item._id)
            const isAllSelected = allId.every((i) =>
                selectedMemberId.includes(i)
            )
            const key = title + data.length
            const isCollapse = collapsedTribes.includes(key)
            return (
                <View style={styles.sectionView}>
                    <View style={styles.mainRowView}>
                        <Text style={styles.sectionTitle}>{title}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                onChangeExpandedTribes(key)
                            }}
                            hitSlop={{ top: 8, left: 8, right: 8, bottom: 0 }}
                        >
                            <ChevronIcon isExpanded={!isCollapse} />
                        </TouchableOpacity>
                    </View>
                    {/*{data.length <= 1000 && (*/}
                    {/*    <TouchableOpacity*/}
                    {/*        style={styles.rowView}*/}
                    {/*        onPress={() => {*/}
                    {/*            onChangeAllSelect(allId, isAllSelected, data)*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <ReminderCheckbox isSelected={isAllSelected} />*/}
                    {/*        <Text style={styles.allRowTitle}>*/}
                    {/*            {'Select Entire Tribe'}*/}
                    {/*        </Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*)}*/}
                </View>
            )
        },
        [selectedMemberId, collapsedTribes]
    )

    const renderItem = useCallback(
        ({ item, section, index }) => {
            const name = item.name
            const id = item._id
            const image = item?.profile?.image
            const isSelected = selectedMemberId.includes(id)
            const isLastItem = section?.data?.length - 1 === index
            const lastItemIndex = reminderTribes?.length - 1
            const isEndOfList =
                index === section?.data?.length - 1 &&
                section?.title === reminderTribes[lastItemIndex]?.title
            const key = section?.title + section?.data?.length
            const isCollapse = collapsedTribes.includes(key)

            if (isCollapse) {
                return null
            }
            return (
                <>
                    <TouchableOpacity
                        style={styles.itemView}
                        activeOpacity={0.6}
                        onPress={() => {
                            onChangeMemberId(id, item)
                        }}
                    >
                        <View style={styles.checkboxStyle}>
                            <ReminderCheckbox isSelected={isSelected} />
                        </View>
                        <View
                            style={[
                                styles.borderContainer,
                                isLastItem && styles.noBorder,
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
                    {index === 4 && (
                        <TouchableOpacity
                            style={styles.showAllView}
                            onPress={() => {
                                if (previousTribeId.current !== item?.tribeId) {
                                    dispatch(resetReminderTribesDetails())
                                }
                                previousTribeId.current = item?.tribeId
                                Actions.push('ReminderTribeDetail', {
                                    tribeId: item?.tribeId,
                                    tribeName: section?.title,
                                    selectedUser: selectedMemberId,
                                })
                            }}
                        >
                            <Text style={styles.showAll}>{'Show All'}</Text>
                        </TouchableOpacity>
                    )}
                    {isEndOfList &&
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
                </>
            )
        },
        [selectedMemberId, reminderTribes, collapsedTribes]
    )

    const renderEmptyView = () => {
        return (
            <View style={styles.centerView}>
                <Text style={styles.emptyText}>No Tribes found</Text>
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
                        <Text style={styles.headerTitle}>Tribes</Text>
                        <View style={styles.rightView} />
                    </View>
                    <View style={styles.searchView}>
                        <ReminderSearchBar
                            value={searchText}
                            onChangeText={onSearchTextChange}
                            placeholder={'Search'}
                        />
                    </View>
                    {(searchText &&
                        !reminderSearchTribes.length &&
                        reminderSearchTribesLoading) ||
                    (reminderTribesLoading && !reminderTribes.length) ? (
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
                        <SectionList
                            sections={
                                searchText?.trim()
                                    ? reminderSearchTribes
                                    : reminderTribes
                            }
                            contentContainerStyle={styles.contentContainerStyle}
                            keyExtractor={(item, index) => item + index}
                            renderItem={renderItem}
                            renderSectionHeader={renderSectionHeader}
                            stickySectionHeadersEnabled={true}
                            onRefresh={onRefresh}
                            refreshing={reminderTribesLoading}
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
    showAll: {
        fontFamily: text.FONT_FAMILY.MEDIUM,
        color: color.GM_BLUE_DEEP,
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
    showAllView: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    mainRowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 12,
    },
})
export default ReminderTribe
