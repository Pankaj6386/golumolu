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
import { fetchReminderTribeDetails } from '../../../actions/ReminderActions'
import { color, text } from '../../../styles/basic'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Actions } from 'react-native-router-flux'
import ReminderCheckbox from '../../../components/ReminderCheckbox'
import LottieView from 'lottie-react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import RIPPLE from '../../../asset/image/uploading_1.json'
import Button from '../Button'

import ProfileImage from '../../Common/ProfileImage'
import { setCustomReminderForms } from '../../../reducers/ReminderFormReducers'

const ReminderTribeDetails = (props) => {
    const dispatch = useDispatch()
    const { reminderTribeDetailsLoading, reminderTribeDetails } = useSelector(
        (state) => state?.reminder
    )
    console.log('reminder,t', reminderTribeDetails?.title)
    const { recipient_users_details, recipient_users } = useSelector(
        (state) => state?.reminderForm?.customReminderForms
    )
    const [selectedMemberId, setSelectedMemberId] = useState(
        Array.isArray(props.selectedUser) ? props.selectedUser : []
    )
    const selectedMemberDetails = useRef(
        Array.isArray(recipient_users_details) ? recipient_users_details : []
    )

    useEffect(() => {
        console.log('props tribeuid', props.tribeId)
        if (props.tribeId) {
            dispatch(fetchReminderTribeDetails(props.tribeId))
        }
    }, [dispatch, props.tribeId])

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

    const onRefresh = useCallback(() => {
        if (props.tribeId) {
            dispatch(fetchReminderTribeDetails(props?.tribeId))
        }
    }, [dispatch, props.tribeId])

    const onPressConfirm = useCallback(() => {
        dispatch(
            setCustomReminderForms({
                recipient_users_details: selectedMemberDetails.current,
                recipient_users: selectedMemberId,
            })
        )
        Actions.pop()
    }, [selectedMemberId])

    const renderItem = useCallback(
        ({ item, index }) => {
            const name = item.name
            const id = item._id
            const image = item?.profile?.image
            const isSelected = selectedMemberId.includes(id)
            const isLastItem = reminderTribeDetails?.data?.length - 1 === index
            const lastItemIndex = reminderTribeDetails?.length - 1

            return (
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
            )
        },
        [selectedMemberId, reminderTribeDetails]
    )

    const renderEmptyView = () => {
        return (
            <View style={styles.centerView}>
                <Text style={styles.emptyText}>No Tribe found</Text>
            </View>
        )
    }
    console.log('tresds', reminderTribeDetails)
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
                        <Text style={styles.headerTitle}>Tribe Details</Text>
                        <View style={styles.rightView} />
                    </View>
                    {!!props?.tribeName && (
                        <View style={styles.tribeTitleBorderView}>
                            <Text style={styles.tribeTitle}>
                                {props?.tribeName}
                            </Text>
                        </View>
                    )}
                    {!reminderTribeDetails?.data &&
                    reminderTribeDetailsLoading ? (
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
                            data={reminderTribeDetails?.data}
                            contentContainerStyle={styles.contentContainerStyle}
                            keyExtractor={(item, index) => item + index}
                            renderItem={renderItem}
                            onRefresh={onRefresh}
                            refreshing={reminderTribeDetailsLoading}
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
    tribeTitleBorderView: {
        paddingVertical: 12,
        paddingLeft: 16,
        borderBottomWidth: 1,
        borderBottomColor: color.GM_DOT_GRAY,
    },
    tribeTitle: {
        fontSize: 16,
        color: '#000',
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
export default ReminderTribeDetails
