/** @format */

import React, { Component } from 'react'
import { Text, View, Dimensions, StyleSheet, Image } from 'react-native'
import { color } from '../../../styles/basic'
import CreateGoal from '../../../asset/image/CreateGoalLion.png'
import { connect } from 'react-redux'
import SwiperGoal from '../../../CreateGoalToast'

import Carousel from 'react-native-snap-carousel' // Version can be specified in package.json

import { scrollInterpolator, animatedStyles } from './goalAnimation'

import { CopilotStep, walkthroughable } from 'react-native-copilot'

const WalkableView = walkthroughable(View)

const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.82)
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 12)

const DATA = []
for (let i = 0; i < 10; i++) {
    DATA.push(i)
}

class CreateGoalToast extends Component {
    state = {
        index: 0,
        showTooltip: false,
    }

    constructor(props) {
        super(props)
        this._renderItem = this._renderItem.bind(this)
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ showTooltip: true })
        }, 1000)
    }

    _renderItem({ item, index }) {
        const { firstText, randomText } = this.props

        return (
            <>
                <View style={styles.itemContainer}>
                    <View
                        style={{
                            position: 'absolute',
                            left: 10,
                            flexDirection: 'row',
                        }}
                    >
                        <Image
                            source={CreateGoal}
                            style={{
                                height: 90,
                                width: 45,

                                resizeMode: 'contain',
                            }}
                        />
                        <View
                            style={{
                                justifyContent: 'center',

                                marginHorizontal: 10,
                                width: ITEM_WIDTH * 0.78,
                                flex: 1,
                            }}
                        >
                            <Text
                                style={{
                                    color: '#4F4F4F',
                                    fontSize: 14,
                                    lineHeight: 17,
                                    letterSpacing: 0.3,

                                    fontFamily: 'SFProDisplay-Regular',
                                }}
                            >
                                {item}
                            </Text>
                        </View>
                    </View>
                </View>
            </>
        )
    }

    render() {
        const { profile } = this.props

        const { currentMilestone } = profile.badges.milestoneBadge

        return (
            <>
                {this.state.showTooltip ? (
                    <SwiperGoal>
                        <Carousel
                            ref={(c) => (this.carousel = c)}
                            loop={true}
                            loopClonesPerSide={30}
                            data={
                                currentMilestone == 3
                                    ? this.props.randomSilverText
                                    : this.props.randomText
                            }
                            renderItem={this._renderItem}
                            sliderWidth={SLIDER_WIDTH}
                            itemWidth={ITEM_WIDTH}
                            containerCustomStyle={styles.carouselContainer}
                            inactiveSlideShift={0}
                            onSnapToItem={(index) => this.setState({ index })}
                            scrollInterpolator={scrollInterpolator}
                            slideInterpolatedStyle={animatedStyles}
                            useScrollView={true}
                        />
                    </SwiperGoal>
                ) : (
                    <WalkableView style={{ flexGrow: 1 }}>
                        <Carousel
                            ref={(c) => (this.carousel = c)}
                            loop={true}
                            loopClonesPerSide={30}
                            data={
                                currentMilestone == 3
                                    ? this.props.randomSilverText
                                    : this.props.randomText
                            }
                            renderItem={this._renderItem}
                            sliderWidth={SLIDER_WIDTH}
                            itemWidth={ITEM_WIDTH}
                            containerCustomStyle={styles.carouselContainer}
                            inactiveSlideShift={0}
                            onSnapToItem={(index) => this.setState({ index })}
                            scrollInterpolator={scrollInterpolator}
                            slideInterpolatedStyle={animatedStyles}
                            useScrollView={true}
                        />
                    </WalkableView>
                )}
            </>
        )
    }
}

const mapStateToProps = (state) => {
    const { user } = state.user
    const { profile } = user

    return {
        profile,
    }
}

export default connect(mapStateToProps, {})(CreateGoalToast)

const styles = StyleSheet.create({
    carouselContainer: {},
    itemContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color.PG_BACKGROUND,
        flexDirection: 'row',
        borderRadius: 7,
        right: 28,
    },
    itemLabel: {
        color: 'white',
        fontSize: 24,
    },
    counter: {
        marginTop: 25,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})
