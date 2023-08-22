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

class ProfileInfoTooltip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toolTipVisible: null,
            checked: this.props.checked ? true : false,
            showTooltip: false,
        }
    }

    async componentDidMount() {
        const hasShownToast = await SecureStore.getItemAsync(
            `${this.props.user.userId}_${this.props.infoKey}`
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
                            top: this.props.top,
                            zIndex: 1,
                            left: this.props.left,
                            bottom: this.props.bottom,
                            right: this.props.right,
                        }}
                    >
                        <ImageBackground
                            resizeMode="contain"
                            source={this.props.image}
                            style={{
                                width: wp(this.props.width),
                                height: this.props.height,
                                padding: this.props.padding,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12,
                                    width: '99%',
                                    padding: 12,
                                    color: 'white',
                                    fontFamily: 'SFProDisplay-Semibold',
                                    lineHeight: 16,
                                }}
                            >
                                {this.props.text}
                            </Text>

                            <TouchableOpacity
                                onPress={async () => {
                                    this.state.checked &&
                                        (await SecureStore.setItemAsync(
                                            `${this.props.user.userId}_${this.props.infoKey}`,
                                            'false',
                                            {}
                                        ))
                                    this.setState({ toolTipVisible: false })
                                }}
                                style={{
                                    position: 'absolute',
                                    right: this.props.crossRight
                                        ? this.props.crossRight
                                        : 10,

                                    top: this.props.crossTop
                                        ? this.props.crossTop
                                        : 12,
                                }}
                            >
                                <Entypo name="cross" size={18} color="white" />
                            </TouchableOpacity>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginHorizontal: 10,
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
                                            height: 11.5,
                                            width: 11.5,
                                            borderWidth: 1,

                                            bottom: 5.5,
                                            left: 2,

                                            borderColor: 'white',
                                            backgroundColor: this.state.checked
                                                ? 'white'
                                                : 'transparent',
                                            borderRadius: 2,
                                        }}
                                    />
                                    <Icon
                                        name="done"
                                        pack="material"
                                        style={{
                                            height: 11,
                                            position: 'absolute',
                                            bottom: 5,
                                            left: 2,

                                            tintColor: '#42C0F5',
                                        }}
                                    />
                                </TouchableOpacity>

                                <View style={{ bottom: 6, left: 8 }}>
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
    ProfileInfoTooltip
)
