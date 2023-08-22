/** @format */

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native'

import { Icon } from '@ui-kitten/components'
import { connect } from 'react-redux'
import { Entypo } from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable'
import * as SecureStore from 'expo-secure-store'

const VIDEO_SWIPER_TOOLTIP = 'video_swiper_tooltip'

class GoalSwiperTooltip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toolTipVisible: true,
            checked: false,
        }
    }

    async componentDidMount() {
        const hasShownToast = await SecureStore.getItemAsync(
            `${this.props.user.userId}_${VIDEO_SWIPER_TOOLTIP}`
        )

        setTimeout(() => {
            this.setState({ showTooltip: true })
        }, 500)
        this.setState({ toolTipVisible: hasShownToast })
    }

    render() {
        const { imageSource, bgStyle } = this.props

        return (
            <>
                {this.state.toolTipVisible === null &&
                this.state.showTooltip ? (
                    <Animatable.View
                        animation="fadeIn"
                        delay={500}
                        duration={500}
                        style={{
                            alignSelf: 'flex-end',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            zIndex: 1,
                            right: 30,
                            top: 30,
                        }}
                    >
                        <ImageBackground
                            resizeMode="cover"
                            source={imageSource}
                            style={
                                ([
                                    {
                                        width: 217,
                                        height: 95,
                                    },
                                ],
                                { ...bgStyle })
                            }
                        >
                            <View style={{ padding: 5 }}>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        lineHeight: 15,
                                        width: '88%',

                                        padding: 12,
                                        color: 'white',
                                        fontFamily: 'SFProDisplay-Semibold',
                                    }}
                                >
                                    {this.props.title}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={async () => {
                                    this.state.checked &&
                                        (await SecureStore.setItemAsync(
                                            `${this.props.user.userId}_${VIDEO_SWIPER_TOOLTIP}`,
                                            'false',
                                            {}
                                        ))
                                    this.setState({ toolTipVisible: false })
                                }}
                                style={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                }}
                            >
                                <Entypo name="cross" size={18} color="white" />
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', padding: 10 }}>
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
                                            bottom: 14,

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
                                            bottom: 14,
                                            left: 3,
                                            tintColor: '#42C0F5',
                                        }}
                                    />
                                </TouchableOpacity>

                                <View
                                    style={{ bottom: 15, marginHorizontal: 5 }}
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
                    </Animatable.View>
                ) : null}
            </>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const { user } = state

    return { user }
}

export default connect(mapStateToProps, {})(GoalSwiperTooltip)
