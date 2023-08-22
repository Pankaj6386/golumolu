/** @format */

import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    SafeAreaView,
} from 'react-native'

import AlphabetFlatList from 'react-native-alphabetflatlist'

import { Icon } from '@ui-kitten/components'

import { MaterialIcons } from '@expo/vector-icons'

import * as _ from 'underscore'
import { Actions } from 'react-native-router-flux'

import SearchBarHeader from './src/Main/Common/Header/SearchBarHeader'
import { TextInput } from 'react-native-paper'
import { color } from './src/styles/basic'
import { getData } from './src/store/storage'

import { uploadContacts } from './src/redux/modules/registration/RegistrationActions'
import { connect } from 'react-redux'
import {
    generateInvitationLink,
    getPhoneNumber,
} from './src/redux/middleware/utils'

import { api as API } from './src/redux/middleware/api'

const ROW_HEIGHT = 60
const HEADER_HEIGHT = 100

const DEBUGKEY = ['Contacts Screen']

class AlphabetFlatListExample extends Component {
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

        this.viewabilityConfig = {
            itemVisiblePercentThreshold: 50,
        }
    }

    getInviteLink = () => {
        return generateInvitationLink(this.props.inviteCode)
    }
    onPressRow = (rowID, rowData) => {}

    async componentDidMount() {
        const getInviteMessage = await getData('INVITEMESSAGE')

        this.setState({ inviteMessage: getInviteMessage })
        console.log(
            `${DEBUGKEY} this is the Invite message of User to Send`,
            getInviteMessage
        )

        const onMatchNotFound = () => {
            const contactFilterData = this.props.contacts.filter((contact) => {
                return contact.name && contact.phoneNumbers
            })

            let renderData = _.sortBy(contactFilterData, 'name')
            console.log('contactFilterData', renderData)
            this.setState(
                {
                    ...this.state,
                    flatListData: renderData,
                },
                () => this.setState({ isLoading: false })
            )
        }

        // close modal and go to invite page
        const onMatchFound = () => {}

        const onError = (errType) => {
            let errMessage = ''
            if (errType == 'upload') {
                errMessage =
                    "We're sorry that some error happened. Please try again later."
            }

            this.setState({
                ...this.state,
                isLoading: false,
            })
        }
        this.props.uploadContacts({ onMatchFound, onMatchNotFound, onError })
    }

    renderProfileImage(item) {
        if (item.image == null) {
            return require('./src/asset/utils/defaultUserProfile.png')
        } else {
            return { uri: item.image?.uri }
        }
    }

    selectItem = (id) => {
        let flatListData = [...this.state.flatListData]

        for (let item of flatListData) {
            if (item.id === id) {
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

        let friendsFilteredData = this.state.flatListData.filter(function (
            item
        ) {
            return (
                item.name.toLowerCase().includes(input) ||
                item.name.includes(input)
            )
        })

        this.setState({ friendsFilteredData })
    }

    renderItem = ({ item }) => {
        let infoToDisplay
        const name = item.name
        const phoneNumber = getPhoneNumber(item)

        if (!phoneNumber) {
            infoToDisplay = 'Mobile number not found.'
        } else {
            infoToDisplay = phoneNumber
        }

        return (
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
                                        fontFamily: 'SFProDisplay-Regular',
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

                                        fontFamily: 'SFProDisplay-Regular',
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
        )
    }

    getItemLayout = (data, index) => ({
        length: ROW_HEIGHT + 20,
        offset: (ROW_HEIGHT + 20) * index + HEADER_HEIGHT,
        index,
    })

    render() {
        const inviteLink = this.getInviteLink()

        const getSelectedData = this.state.flatListData.filter((item) => {
            return item.isSelected
        })

        return (
            <View style={styles.container}>
                <SearchBarHeader title={'Contacts'} backButton />

                {this.state.isLoading ? (
                    <>
                        <ActivityIndicator
                            color="#42C0F5"
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        />
                    </>
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
                            renderItem={this.renderItem}
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

                        <SafeAreaView>
                            <TouchableOpacity
                                style={{}}
                                onPress={async () => {
                                    try {
                                        const postData = await API.post(
                                            'secure/user/account/send-invite',
                                            {
                                                usersToinvite: getSelectedData,
                                                content: this.state
                                                    .inviteMessage,
                                                link: inviteLink,
                                            }
                                        )
                                        if (postData.status === 200) {
                                            Alert.alert(postData.message, '', [
                                                {
                                                    text: 'Ok',
                                                    onPress: () =>
                                                        Actions.pop(),
                                                },
                                            ])
                                        }
                                    } catch (error) {
                                        Alert.alert(
                                            JSON.stringify(error.message)
                                        )
                                        console.log('error', error.message)
                                    }
                                }}
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
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        contacts: state.contactSync.contacts.data,
    }
}

export default connect(mapStateToProps, {
    uploadContacts,
})(AlphabetFlatListExample)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageContainerStyle: {
        height: 50,
        width: 50,
        marginTop: 8,
    },
    imageStyle: {
        height: 50,
        width: 50,
    },
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
})
