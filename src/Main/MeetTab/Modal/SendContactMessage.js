/** @format */

import React, { Component } from 'react'
import {
    View,
    Text,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ScrollView,
    SafeAreaView,
} from 'react-native'

import * as SMS from 'expo-sms'
import { color } from '../../../styles/basic'
import { Icon } from '@ui-kitten/components'
import { connect } from 'react-redux'
import AlphabetFlatList from 'react-native-alphabetflatlist'
// import { SafeAreaView } from 'react-navigation'
import { TextInput } from 'react-native-paper'
import * as Contacts from 'expo-contacts'
import { ActivityIndicator } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'

import SearchBarHeader from '../../Common/Header/SearchBarHeader'

//MiddleWare to get the Invite Link
import {
    generateInvitationLink,
    getPhoneNumber,
} from '../../../redux/middleware/utils'

//To get Stored Data in asyncStorage
import { getData } from '../../../store/storage'

import { api as API } from '../../../redux/middleware/api'
import * as _ from 'underscore'
import { Actions } from 'react-native-router-flux'

import { Image } from 'react-native-animatable'
import { SentryRequestBuilder } from '../../../monitoring/sentry'
import {
    SENTRY_MESSAGE_TYPE,
    SENTRY_TAGS,
    SENTRY_MESSAGE_LEVEL,
    SENTRY_CONTEXT,
} from '../../../monitoring/sentry/Constants'
import { FONT_FAMILY } from '../../../styles/basic/text'

const screenHeight = Dimensions.get('screen').height

const DEBUGKEY = ['Contacts Screen']

const { width, height } = Dimensions.get('window')
const ROW_HEIGHT = 60
const HEADER_HEIGHT = 100
const APP_FONT_FAMILY = Platform.select({
    ios: 'Gill Sans',
    android: 'sans-serif',
})

const sizes = {
    itemHeight: 28,
    headerHeight: 30,

    spacing: {
        small: 10,
        regular: 15,
        large: 20,
    },
}

class MessageToContactsModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            renderData: [],
            isLoading: true,
            currentPage: 1,
            inviteMessage: '',
            itemPerPage: 4000,
            flatListData: [],
            friendsSearchText: '',
            pageSize: 40,
            pageOffset: 0,
            currentPagination: [],
            friendsFilteredData: [],
        }
    }

    getInviteLink = () => {
        return generateInvitationLink(this.props.inviteCode)
    }

    inviteSms = async (usersToSend) => {
        const isAvailable = await SMS.isAvailableAsync()
        const inviteLink = this.getInviteLink()

        console.log(`${DEBUGKEY}: SMS is available?`, isAvailable)
        if (isAvailable) {
            // do your SMS stuff here
            const { result } = await SMS.sendSMSAsync(
                usersToSend,
                `${this.state.inviteMessage}\n\n${inviteLink}`
            )
            console.log(`${DEBUGKEY}: result is: `, result)
        }
    }

    async componentDidMount() {
        const getInviteMessage = await getData('INVITEMESSAGE')

        this.setState({ inviteMessage: getInviteMessage })
        console.log(
            `${DEBUGKEY} this is the Invite message of User to Send`,
            getInviteMessage
        )
        setTimeout(async () => {
            const { status } = await Contacts.requestPermissionsAsync()
            console.log(
                `${DEBUGKEY} this is the Status of Contacts Permission`,
                status
            )
            try {
                if (status === 'granted') {
                    const { data } = await Contacts.getContactsAsync({
                        fields: [
                            Contacts.Fields?.Name,
                            Contacts.Fields?.PhoneNumbers,
                            Contacts.Fields?.Image,
                        ],
                    })

                    console.log(
                        `${DEBUGKEY} this is all Contacts we get from the device`,
                        data
                    )

                    if (data.length > 0) {
                        const contactFilterData = data.filter((contact) => {
                            return contact.name && contact.phoneNumbers
                        })
                        let renderData = _.sortBy(contactFilterData, 'name')
                        this.setState({
                            isLoading: false,
                            flatListData: renderData,
                        })
                    }
                } else if (status === 'denied') {
                    this.setState({ isLoading: false })
                    Alert.alert('Please give access of your Contacts')
                }
            } catch (error) {
                // this.setState({ isLoading: true })
                new SentryRequestBuilder(error, SENTRY_MESSAGE_TYPE.ERROR)
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(SENTRY_TAGS.CONTACTS.ACTION, 'contact failed')
                    .withExtraContext(
                        SENTRY_CONTEXT.CONTACT.CONTACTS,
                        error.message
                    )
                    .send()
                console.log(
                    `${DEBUGKEY} this is the error while getting Contacts`,
                    error.message
                )
            }
        }, 2000)
    }

    selectItem = (id) => {
        let flatListData = [...this.state.flatListData]
        for (let item of flatListData) {
            if (item.id == id) {
                item.isSelected =
                    item.isSelected == null ? true : !item.isSelected
                break
            }
        }
        this.setState({ flatListData })
    }

    searchFriends = (input) => {
        const { friendsSearchText } = this.state

        this.setState({ friendsSearchText: input })
        // this.setState({ input })

        let friendsFilteredData = this.state.flatListData.filter(function (
            item
        ) {
            return item.name.toLowerCase().includes(input.toLowerCase())
        })

        this.setState({ friendsFilteredData: friendsFilteredData })
    }

    renderProfileImage(item) {
        if (item.image == null) {
            return require('../../../asset/utils/defaultUserProfile.png')
        } else {
            return { uri: item.image?.uri }
        }
    }

    getItemLayout = (data, index) => ({
        length: ROW_HEIGHT + 20,
        offset: (ROW_HEIGHT + 20) * index + HEADER_HEIGHT,
        index,
    })

    render() {
        let selectedUsers = []
        const getSelectedData = this.state.flatListData.map((item) => {
            if (item.isSelected) {
                selectedUsers.push(item.phoneNumbers[0].number)
            }
        })

        console.log(
            `${DEBUGKEY} this is all selected Contacts we want to send invite Message `,
            getSelectedData
        )

        const inviteLink = this.getInviteLink()

        const renderUser = ({ item }) => {
            let infoToDisplay
            const name = item.name
            const phoneNumber = getPhoneNumber(item)

            if (!phoneNumber) {
                infoToDisplay = 'Mobile number not found.'
            } else {
                infoToDisplay = phoneNumber
            }
            return (
                <>
                    <View style={styles.rowContainer}>
                        <TouchableOpacity
                            onPress={() => this.selectItem(item.id)}
                            style={styles.rowButton}
                            activeOpacity={0.5}
                        >
                            <View style={styles.titleTextContainer}>
                                <View style={{ marginTop: 10 }}>
                                    <Image
                                        source={this.renderProfileImage(item)}
                                        style={{
                                            height: 50,
                                            width: 50,
                                            borderRadius: 150 / 2,
                                            overflow: 'hidden',
                                        }}
                                    />
                                </View>

                                <View
                                    style={{
                                        marginTop: 5,
                                        padding: 10,
                                    }}
                                >
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text
                                            style={{
                                                color: '#000000',
                                                width: '100%',
                                                fontFamily:
                                                    'SFProDisplay-Regular',
                                                fontSize: 17,
                                            }}
                                        >
                                            {name}
                                        </Text>
                                    </View>

                                    <View style={{ marginTop: 5 }}>
                                        <Text
                                            style={{
                                                color: '#696868',
                                                width: '100%',

                                                fontFamily:
                                                    'SFProDisplay-Regular',
                                                fontSize: 15,
                                            }}
                                        >
                                            {infoToDisplay}
                                        </Text>
                                    </View>

                                    <View style={{ right: 100, bottom: 50 }}>
                                        <View
                                            style={{
                                                backgroundColor: item.isSelected
                                                    ? color.GM_BLUE
                                                    : 'transparent',
                                                height: 20,
                                                width: 20,

                                                position: 'absolute',
                                                left: 0,
                                                top: 15,
                                                borderRadius: 4,
                                                borderColor: item.isSelected
                                                    ? 'transparent'
                                                    : 'grey',
                                                borderWidth: 0.5,
                                            }}
                                        />
                                        <View
                                            style={{
                                                position: 'absolute',
                                                left: 2,
                                                top: 17,

                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Icon
                                                name="done"
                                                pack="material"
                                                style={{
                                                    height: 15,

                                                    tintColor: 'white',
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </>
            )
        }

        return (
            <>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: color.GM_CARD_BACKGROUND,
                    }}
                >
                    <SearchBarHeader title={'Contacts'} backButton />

                    {this.state.isLoading ? (
                        <ActivityIndicator
                            color="#42C0F5"
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        />
                    ) : (
                        <>
                            <View
                                style={{
                                    justifyContent: 'center',
                                    marginTop: 10,
                                }}
                            >
                                <TextInput
                                    theme={{
                                        colors: {
                                            primary: '#27AE60',
                                            underlineColor: 'transparent',
                                        },
                                    }}
                                    value={this.state.friendsSearchText}
                                    onChangeText={this.searchFriends}
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        borderColor: 'lightgrey',
                                        width: '95%',
                                        height: 35,
                                        marginHorizontal: 10,

                                        // padding: 10,
                                    }}
                                    underlineColor={'transparent'}
                                    placeholder={'Search'}
                                    left={
                                        <TextInput.Icon
                                            name={() => (
                                                <MaterialIcons
                                                    name={'search'}
                                                    size={20}
                                                    color="grey"
                                                />
                                            )}
                                        />
                                    }
                                />
                            </View>

                            <AlphabetFlatList
                                renderItem={renderUser}
                                data={
                                    this.state.friendsFilteredData &&
                                    this.state.friendsFilteredData.length > 0
                                        ? this.state.friendsFilteredData
                                        : this.state.flatListData
                                }
                                getItemLayout={this.getItemLayout}
                                mainFlatListContainerStyle={{ flex: 1 }}
                                matchFieldName="name"
                                alphabetListProps={{
                                    selectedAlphabetTextStyle: {
                                        color: '#42C0F5',
                                        fontSize: 12,
                                    },
                                    alphabetTextStyle: {
                                        color: '#42C0F5',
                                        fontSize: 12,
                                    },

                                    alphabetListContainerStyle: {
                                        flex: 0.2,
                                    },
                                    showsVerticalScrollIndicator: false,
                                }}
                            />

                            {/* <FlatList
                                data={
                                    this.state.friendsFilteredData &&
                                    this.state.friendsFilteredData.length > 0
                                        ? this.state.friendsFilteredData
                                        : this.state.flatListData
                                }
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={(item) => renderUser(item)}
                                listKey={Math.random()
                                    .toString(36)
                                    .substr(2, 9)}
                                refreshing={this.state.isLoading}
                                ListEmptyComponent={
                                    this.props.refreshing ? null : (
                                        <View
                                            style={{
                                                height: 50,
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text>No Contacts Found</Text>
                                        </View>
                                    )
                                }
                            /> */}
                            <SafeAreaView>
                                <TouchableOpacity
                                    style={{}}
                                    onPress={
                                        () => {
                                            this.inviteSms(selectedUsers)

                                            setTimeout(() => {
                                                Actions.pop()
                                            }, 500)
                                        }

                                        //     async () => {
                                        //     try {
                                        //         const postData = await API.post(
                                        //             'secure/user/account/send-invite',
                                        //             {
                                        //                 usersToinvite: selectedUsers,
                                        //                 content: this.state
                                        //                     .inviteMessage,
                                        //                 link: inviteLink,
                                        //             }
                                        //         )
                                        //         if (postData.status === 200) {
                                        //             Alert.alert(
                                        //                 postData.message,
                                        //                 '',
                                        //                 [
                                        //                     {
                                        //                         text: 'Ok',
                                        //                         onPress: () =>
                                        //                             Actions.pop(),
                                        //                     },
                                        //                 ]
                                        //             )
                                        //         }
                                        //     } catch (error) {
                                        //         console.log('error', error.message)
                                        //     }
                                        // }
                                    }
                                >
                                    <View
                                        style={{
                                            backgroundColor: '#42C0F5',
                                            width: '90%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 40,
                                            borderColor: '#42C0F5',
                                            borderWidth: 2,
                                            borderRadius: 5,

                                            marginHorizontal: 20,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontWeight: '600',
                                                fontSize: 15,
                                                fontFamily:
                                                    FONT_FAMILY.SEMI_BOLD,
                                            }}
                                        >
                                            Done
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </SafeAreaView>
                        </>
                    )}
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        // flex: 1,
        height: ROW_HEIGHT,
        width: '90%',
        backgroundColor: 'white',
        shadowColor: '#707070',
        justifyContent: 'center',
        alignItems: 'center',

        flexDirection: 'row',
        margin: 20,
        marginVertical: 10,
    },
    sectionHeaderContainer: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        marginHorizontal: 20,

        height: sizes.headerHeight,

        paddingHorizontal: sizes.spacing.regular,
    },
    titleText: {},
    titleTextContainer: {
        flex: 4,
        backgroundColor: color.GM_CARD_BACKGROUND,
        marginTop: 5,
        borderRadius: 10,
        marginHorizontal: 40,
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    rowButton: {
        flex: 1,
        flexDirection: 'row',
        // paddingTop: '5%',
        // paddingBottom: '5%'
    },

    sectionHeaderLabel: {
        color: '#42C0F5',
        fontSize: 28,
        fontFamily: FONT_FAMILY.BOLD,
    },
})

const mapStateToProps = (state, props) => {
    const { token } = state.auth.user
    const { user } = state.user
    const { inviteCode } = user

    return {
        token,
        inviteCode,
    }
}

export default connect(mapStateToProps, null)(MessageToContactsModal)
