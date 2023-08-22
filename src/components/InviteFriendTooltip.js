/** @format */

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native'

import { Icon } from '@ui-kitten/components'
import { connect } from 'react-redux'
import { Entypo } from '@expo/vector-icons'
import { setProgressTooltip } from '../actions'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import * as SecureStore from 'expo-secure-store'

const NEWLY_CREATED_KEY = 'invite_friend_tooltip_show'
class InviteFriendTooltip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toolTipVisible: null,
            checked: true,
            showTooltip: false,
        }
    }

    async componentDidMount() {
        const hasShownToast = await SecureStore.getItemAsync(
            `${this.props.user.userId}_${NEWLY_CREATED_KEY}`
        )

        setTimeout(() => {
            this.setState({ showTooltip: true })
        }, 500)
        this.setState({ toolTipVisible: hasShownToast })
    }

    render() {
        // console.log('hasShownToast', this.props.goals)

        return (
            <>
                {this.state.toolTipVisible === null &&
                this.state.showTooltip ? (
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 1,
                            top: 440,
                            right: 65,
                        }}
                    >
                        <ImageBackground
                            resizeMode="cover"
                            source={require('../asset/image/tooltip.png')}
                            style={{
                                width: wp('65%'),
                                height: 130,
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        lineHeight: 15,
                                        width: '99%',

                                        padding: 12,
                                        color: 'white',
                                        fontFamily: 'SFProDisplay-Semibold',
                                    }}
                                >
                                    Tap these buttons to cycle through templated
                                    Invite messages. You can also edit the text
                                    in the textbox above and create your own
                                    customized Invite message
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={async () => {
                                    this.state.checked &&
                                        (await SecureStore.setItemAsync(
                                            `${this.props.user.userId}_${NEWLY_CREATED_KEY}`,
                                            'false',
                                            {}
                                        ))
                                    this.setState({ toolTipVisible: false })
                                }}
                                style={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 10,
                                }}
                            >
                                <Entypo name="cross" size={18} color="white" />
                            </TouchableOpacity>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    padding: 5,
                                    alignItems: 'center',
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() =>
                                        this.setState({
                                            checked: !this.state.checked,
                                        })
                                    }
                                >
                                    <View
                                        style={{
                                            height: 13,
                                            width: 13,
                                            borderWidth: 1,
                                            marginHorizontal: 3,
                                            bottom: 5,

                                            borderColor: 'white',
                                            backgroundColor: this.state.checked
                                                ? 'white'
                                                : 'transparent',
                                            borderRadius: 2,
                                            borderColor: 'white',
                                        }}
                                    />
                                    <Icon
                                        name="done"
                                        pack="material"
                                        style={{
                                            height: 12,
                                            position: 'absolute',
                                            bottom: 5,
                                            left: 3,
                                            tintColor: '#42C0F5',
                                        }}
                                    />
                                </TouchableOpacity>

                                <View
                                    style={{ bottom: 6, marginHorizontal: 5 }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 12,

                                            color: 'white',
                                            fontFamily: 'SFProDisplay-Semibold',
                                        }}
                                    >
                                        Don't show me this tip again.
                                    </Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                ) : null}
            </>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const { user } = state
    const myGoals = state.profile.goals.data

    return {
        user,
        myGoals,
    }
}

export default connect(mapStateToProps, { setProgressTooltip })(
    InviteFriendTooltip
)
