/** @format */

import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native'
import React, { Component } from 'react'
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import { Actions } from 'react-native-router-flux'
import DeactivateToast from '../../../components/DeactivateToast'
import {
    logout,
    removeNotificationToken,
    deleteUserAccount,
} from '../../../actions'
import { connect } from 'react-redux'

class Deactivate extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        isVisible: false,
    }
    render() {
        return (
            <>
                <View style={{ flex: 1 }}>
                    <SearchBarHeader
                        backButton
                        rightIcon="empty"
                        title="Deactivate Account"
                        onBackPress={() => Actions.pop()}
                    />
                    <View style={{ padding: 20, marginTop: 20 }}>
                        <Text
                            style={{
                                fontSize: 17,
                                lineHeight: 20,
                                fontFamily: 'SFProDisplay-Bold',
                            }}
                        >
                            Deleting your account is PERMANENT.
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
                                lineHeight: 22,
                                marginTop: 15,
                                fontFamily: 'SFProDisplay-Regular',
                            }}
                        >
                            When you delete your GoalMogul account, you won't be
                            able to retrieve the content or information you've
                            previously shared on GoalMogul. Your Chat messages
                            will also be deleted.
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
                                lineHeight: 22,
                                marginTop: 15,
                                fontFamily: 'SFProDisplay-Regular',
                            }}
                        >
                            Select an Option:
                        </Text>
                        <TouchableWithoutFeedback onPress={() => Actions.pop()}>
                            <View
                                style={{
                                    backgroundColor: '#42C0F5',
                                    width: '95%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 35,
                                    borderColor: '#42C0F5',
                                    borderWidth: 2,
                                    borderRadius: 3,
                                    marginTop: 20,
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 14,
                                        fontFamily: 'SFProDisplay-Semibold',
                                    }}
                                >
                                    Oops, I want to KEEP my account! Go back
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.setState({ isVisible: true })
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: '#42C0F5',
                                    width: '95%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 35,
                                    borderColor: '#42C0F5',
                                    borderWidth: 2,
                                    borderRadius: 3,
                                    marginTop: 20,
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 14,
                                        fontFamily: 'SFProDisplay-Semibold',
                                    }}
                                >
                                    Delete my account - PERMANENT
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <DeactivateToast
                            isVisible={this.state.isVisible}
                            onPressNotNow={() => {
                                this.setState({ isVisible: false })
                                setTimeout(() => {
                                    Actions.pop()
                                }, 500)
                            }}
                            onPressOk={() => {
                                this.setState({ isVisible: false })

                                setTimeout(() => {
                                    Alert.alert(
                                        'Sorry to see you go…',
                                        'Your GoalMogul account will now be deleted.You will now be logged out.',
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => {
                                                    // this.props.logout()
                                                    // this.props.deleteUserAccount()
                                                    // this.props.removeNotificationToken()
                                                    this.props.deleteUserAccount()
                                                },
                                            },
                                        ]
                                    )
                                }, 500)
                            }}
                        />
                    </View>
                </View>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    const { userId, user } = state.user

    return {
        userId,

        user,
    }
}

export default connect(mapStateToProps, {
    logout,
    removeNotificationToken,
    deleteUserAccount,
})(Deactivate)
