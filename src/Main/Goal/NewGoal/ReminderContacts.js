import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    PanResponder,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { color, text } from '../../../styles/basic'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Actions } from 'react-native-router-flux'
import ReminderSearchBar from '../../../components/ReminderSearchBar'
import ReminderCheckbox from '../../../components/ReminderCheckbox'
import LottieView from 'lottie-react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import RIPPLE from '../../../asset/image/uploading_1.json'
import Button from '../Button'
import { getAllContactsForReminder } from '../../../actions/ContactActions'
import defaultUserProfile from '../../../asset/utils/defaultUserProfile.png'
import HeartIcon from '../../../components/HeartIcon'
import ChevronIcon from '../../../components/ChevronIcon'
import { getData, storeData } from '../../../store/storage'
import { setCustomReminderForms } from '../../../reducers/ReminderFormReducers'

const allAlphabets = [
    '#',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
]

const CustomButton = ({ item, onPressIn, isActive, onInnerRef }) => {
    return (
        <TouchableOpacity
            onPressIn={() => {
                onPressIn && onPressIn(item)
            }}
            ref={(ref) => onInnerRef(ref)}
        >
            <Text style={styles.contactText}>{item}</Text>
        </TouchableOpacity>
    )
}

const ReminderContacts = () => {
    const dispatch = useDispatch()

    const { recipient_contacts } = useSelector(
        (state) => state?.reminderForm?.customReminderForms
    )
    const [searchText, setSearchText] = useState('')
    const [selectedContacts, setSelectedContacts] = useState(
        Array.isArray(recipient_contacts) ? recipient_contacts : []
    )
    const [isLoading, setIsLoading] = useState(true)
    const [allContacts, setAllContacts] = useState([])
    const [expandedContacts, setExpandedContacts] = useState([])
    const [likeContacts, setLikeContacts] = useState([])
    const allContactsDetails = useRef([])
    const allContactNames = useRef([])
    const userId = useSelector((state) => state?.user?.userId)

    const flatlistRef = useRef(null)
    const buttonsRefs = useRef({})
    const activeButtonRef = useRef('A')

    const handlePressIn = useCallback((character) => {
        activeButtonRef.current = character
        const foundIndex = allContactNames.current.findIndex(
            (item) => item[0].toUpperCase() === character
        )
        if (foundIndex !== -1) {
            flatlistRef.current.scrollToIndex({
                index: foundIndex,
                animated: true,
            })
        }
    }, [])

    const panResponderRef = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                activeButtonRef.current = 'A' // Clear the activeButtons state when a touch gesture starts
            },
            onPanResponderMove: (_, gestureState) => {
                const touchX = gestureState.moveX
                const touchY = gestureState.moveY

                // Loop through all the buttons to check if the touch point is inside any button
                allAlphabets.forEach((letter) => {
                    const button = buttonsRefs.current[letter]
                    button.measure((x, y, width, height, pageX, pageY) => {
                        if (
                            touchX >= pageX &&
                            touchX <= pageX + width &&
                            touchY >= pageY &&
                            touchY <= pageY + height &&
                            activeButtonRef.current !== letter
                        ) {
                            handlePressIn(letter)
                        }
                    })
                })
            },
        })
    ).current

    const fetchContactDetails = useCallback(() => {
        getData(`${userId}_contact_like`).then((resp) => {
            if (resp) {
                setLikeContacts(resp)
            }
        })
        getAllContactsForReminder(userId)
            .then((contacts) => {
                allContactsDetails.current = contacts
                setAllContacts(contacts)
                allContactNames.current = contacts.map((item) => item.name)
                setIsLoading(false)
            })
            .catch((e) => {
                setIsLoading(false)
                if (e.message === 'No Access') {
                    alert('No permission to access the contact')
                }
            })
    }, [userId])

    useEffect(() => {
        fetchContactDetails()
    }, [])

    const onSearchTextChange = useCallback((value) => {
        setSearchText(value)
        if (value?.trim()) {
            const searchValue = value.trim()?.toLowerCase()
            const searchContacts = allContactsDetails.current.filter((item) => {
                const isMatchingName = item.name
                    ?.toString()
                    ?.toLowerCase()
                    .includes(searchValue)
                const contacts = item.contacts
                const isMatchingContact = contacts.findIndex((contact) => {
                    const numbers =
                        contact.phone_number?.toString()?.toLowerCase() || ''
                    const email =
                        contact?.email?.toString()?.toLowerCase() || ''
                    return (
                        numbers.includes(searchValue) ||
                        email.includes(searchValue)
                    )
                })
                return !!(isMatchingName || isMatchingContact >= 0)
            })
            allContactNames.current = searchContacts.map((item) => item.name)
            setAllContacts(searchContacts)
        } else {
            allContactNames.current = allContactsDetails.current.map(
                (item) => item.name
            )
            setAllContacts(allContactsDetails.current)
        }
    }, [])

    const onRefresh = useCallback(() => {
        fetchContactDetails()
    }, [])

    const renderEmptyView = () => {
        return (
            <View style={styles.centerView}>
                <Text style={styles.emptyText}>No Contacts found</Text>
            </View>
        )
    }

    const onToggleExpand = useCallback(
        (id) => {
            if (expandedContacts.includes(id)) {
                setExpandedContacts((prevState) =>
                    prevState.filter((item) => item !== id)
                )
            } else {
                setExpandedContacts((prevState) => [...prevState, id])
            }
        },
        [expandedContacts]
    )

    const refreshContactList = useCallback((favoriteContact)=>{
        const favoriteData = []
        const contactsData = []
        allContacts.forEach((item) => {
            if (!!favoriteContact && Array.isArray(favoriteContact)) {
                const foundIndex = item.contacts.findIndex(
                    (item) => favoriteContact.includes(item.id)
                )
                if (foundIndex !== -1) {
                    return favoriteData.push(item)
                }
            }
            return contactsData.push(item)
        })
        contactsData.sort((a, b) => a.name > b.name)
        favoriteData.sort((a, b) => a.name > b.name)
        const finalData =  [...favoriteData, ...contactsData]
        allContactNames.current = finalData.map(
            (item) => item.name
        )
        setAllContacts(finalData)
    },[allContacts])

    const onToggleHeart = useCallback(
        (id) => {
            if (likeContacts.includes(id)) {
                const filterLikeContacts = likeContacts.filter(
                    (item) => item !== id
                )
                refreshContactList(filterLikeContacts)
                setLikeContacts(filterLikeContacts)
                storeData(`${userId}_contact_like`, filterLikeContacts).then()
            } else {
                const newData = [...likeContacts, id]
                setLikeContacts(newData)
                refreshContactList(newData)
                storeData(`${userId}_contact_like`, newData).then()
            }
        },
        [likeContacts,refreshContactList]
    )

    const onToggleContact = useCallback(
        (contact, name, image) => {
            if (
                selectedContacts.findIndex((item) => item.id === contact.id) >
                -1
            ) {
                setSelectedContacts((prevState) =>
                    prevState.filter((item) => item.id !== contact.id)
                )
            } else {
                setSelectedContacts((prevState) => [
                    ...prevState,
                    { ...contact, name, image },
                ])
            }
        },
        [selectedContacts]
    )

    const onPressConfirm = useCallback(() => {
        const finalData = selectedContacts.map((item) => ({
            id: item.id,
            name: item.name,
            phone_number: item?.phone_number || null,
            email: item?.email || null,
            country_code: item?.country_code || null,
            image: item?.image || null,
        }))
        dispatch(
            setCustomReminderForms({
                recipient_contacts: finalData,
            })
        )
        Actions.pop()
    }, [selectedContacts])

    const renderItem = ({ item }) => {
        const contacts = item.contacts
        const isSingle = contacts.length === 1
        const id = item.id
        const name = item.name
        const image = item.image
        const contactDetails = isSingle ? contacts[0] : null
        const isExpanded = expandedContacts.includes(id)
        let mainContactId
        let isSelected
        let isLiked
        if (isSingle) {
            mainContactId = contactDetails?.id
            isSelected =
                selectedContacts.findIndex(
                    (item) => item.id === mainContactId
                ) > -1
            isLiked = likeContacts.includes(mainContactId)
        }

        return (
            <>
                <TouchableOpacity
                    style={[
                        styles.rowView,
                        isExpanded && styles.isExpandedColor,
                    ]}
                    activeOpacity={0.6}
                    onPress={() => {
                        if (isSingle) {
                            onToggleContact(contactDetails, name)
                        } else {
                            onToggleExpand(id)
                        }
                    }}
                >
                    {isSingle && (
                        <View style={styles.marginRightView}>
                            <ReminderCheckbox isSelected={isSelected} />
                        </View>
                    )}
                    <Image
                        source={image ? { uri: image } : defaultUserProfile}
                        style={styles.imageStyle}
                    />
                    <View style={styles.subRowView}>
                        <Text style={styles.title}>{name}</Text>
                        {isSingle && (
                            <Text style={styles.description}>
                                {contactDetails?.number ||
                                    contactDetails?.email}
                            </Text>
                        )}
                    </View>
                    {isSingle ? (
                        <HeartIcon
                            isSelected={isLiked}
                            onPress={() => {
                                onToggleHeart(mainContactId)
                            }}
                        />
                    ) : (
                        <ChevronIcon isExpanded={isExpanded} />
                    )}
                </TouchableOpacity>
                {(isExpanded || searchText.trim()) && !isSingle
                    ? contacts.map((contact, i) => {
                          const contactId = contact.id
                          const isContactSelected =
                              selectedContacts.findIndex(
                                  (item) => item.id === contactId
                              ) > -1
                          const isContactLiked = likeContacts.includes(
                              contactId
                          )
                          const isLastIndex = contacts.length - 1 === i
                          return (
                              <TouchableOpacity
                                  key={contactId}
                                  style={[styles.contactRowView]}
                                  activeOpacity={0.6}
                                  onPress={() => {
                                      onToggleContact(contact, name, image)
                                  }}
                              >
                                  <View
                                      style={[
                                          styles.borderView,
                                          isLastIndex && {
                                              borderBottomWidth: 0,
                                          },
                                      ]}
                                  >
                                      <View style={styles.marginRightView}>
                                          <ReminderCheckbox
                                              isSelected={isContactSelected}
                                          />
                                      </View>
                                      <View style={styles.subRowView}>
                                          <Text style={styles.contactTitle}>
                                              {contact?.number ||
                                                  contact?.email}
                                          </Text>
                                      </View>
                                      <HeartIcon
                                          isSelected={isContactLiked}
                                          onPress={() => {
                                              onToggleHeart(contactId)
                                          }}
                                      />
                                  </View>
                              </TouchableOpacity>
                          )
                      })
                    : null}
            </>
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
                        <Text style={styles.headerTitle}>Contacts</Text>
                        <View style={styles.rightView} />
                    </View>
                    <View style={styles.searchView}>
                        <ReminderSearchBar
                            value={searchText}
                            onChangeText={onSearchTextChange}
                            placeholder={'Search'}
                        />
                    </View>
                    <View style={styles.mainView}>
                        <View
                            style={styles.contactView}
                            {...panResponderRef.panHandlers}
                        >
                            {allAlphabets.map((item, index) => (
                                <CustomButton
                                    key={'alphabet_' + item}
                                    item={item}
                                    onPressIn={handlePressIn}
                                    onInnerRef={(ref) =>
                                        (buttonsRefs.current[item] = ref)
                                    }
                                />
                            ))}
                        </View>
                        {isLoading ? (
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
                                ref={(ref) => (flatlistRef.current = ref)}
                                keyExtractor={(item) => item.id?.toString()}
                                data={allContacts}
                                contentContainerStyle={
                                    styles.contentContainerStyle
                                }
                                initialNumToRender={50}
                                renderItem={renderItem}
                                refreshing={isLoading}
                                onRefresh={onRefresh}
                                ListEmptyComponent={renderEmptyView()}
                            />
                        )}
                    </View>
                    {selectedContacts.length !== 0 && (
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
    title: {
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        color: '#000',
        fontSize: 18,
        fontWeight: '700',
    },
    description: {
        fontFamily: text.FONT_FAMILY.MEDIUM,
        color: '#4F4F4F',
        fontSize: 14,
        marginTop: 4,
    },
    contactTitle: {
        fontFamily: text.FONT_FAMILY.MEDIUM,
        color: '#727272',
        fontSize: 16,
    },
    searchView: {
        height: 62,
        width: '100%',
        paddingHorizontal: 16,
        justifyContent: 'center',
    },

    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingLeft: 24,
        paddingRight: 32,
        minHeight: 76,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F2',
    },
    contactRowView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 24,
        paddingRight: 32,
        width: '100%',
        backgroundColor: '#F9F9F9',
    },
    borderView: {
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F2',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    subRowView: {
        flexGrow: 1,
    },
    imageStyle: {
        height: 44,
        width: 44,
        marginRight: 16,
        borderRadius: 44,
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
    emptyText: {
        fontSize: 16,
        color: '#000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    marginRightView: {
        marginRight: 16,
    },
    isExpandedColor: {
        backgroundColor: '#F9F9F9',
        borderBottomWidth: 0,
        borderBottomColor: '#F2F2F2',
    },
    contactView: {
        position: 'absolute',
        right: 8,
        top: 0,
        zIndex: 999,
        alignItems: 'center',
    },
    contactText: {
        fontFamily: text.FONT_FAMILY.MEDIUM,
        color: color.GM_BLUE_DEEP,
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 18,
    },
})
export default ReminderContacts
