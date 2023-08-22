/** @format */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    Switch,
} from 'react-native'

markUserAsOnboarded

import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot'
import {
    CreateGoalModalTooltip,
    CreateGoalTooltip,
} from './Main/Tutorial/Tooltip'
import {
    markUserAsOnboarded,
    pauseTutorial,
    showNextTutorialPage,
} from './redux/modules/User/TutorialActions'
import { connect } from 'react-redux'

const WalkthroughableText = walkthroughable(Text)
const WalkthroughableView = walkthroughable(View)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 40,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
    },
})

class CreateGoalToast extends Component {
    static propTypes = {
        start: PropTypes.func.isRequired,
        copilotEvents: PropTypes.shape({
            on: PropTypes.func.isRequired,
        }).isRequired,
    }

    state = {
        secondStepActive: true,
    }

    componentDidMount() {
        const { user } = this.props
        if (user && !user.isOnBoarded) {
            this.props.start()

            this.props.copilotEvents.on('stepChange', this.handleStepChange)

            // this.props.pauseTutorial('lion_toast', 'home', 1)

            // if (this.props.nextStepNumber === 1) {
            // Actions.createGoalModal({ isFirstTimeCreateGoal: true })
            // this.props.pauseTutorial('lion_toast', 'home', 1)
            setTimeout(() => {
                // this.props.showNextTutorialPage('lion_toast', 'home')
                this.props.markUserAsOnboarded()
            }, 400)
            // return
        }
        // }
    }

    componentWillUnmount() {
        // Don't forget to disable event handlers to prevent errors
        this.props.copilotEvents.off('stop')
    }

    handleStepChange = (step) => {
        console.log(`Current step is: ${step.name}`)
    }

    render() {
        return (
            <CopilotStep
                text="Tip: Swipe on these blue bubbles to reveal more empowering goal questions!"
                order={0}
                name="lion_toast"
            >
                <WalkthroughableView style={{ left: 1 }}>
                    <WalkthroughableView style={{}}>
                        {this.props.children}
                    </WalkthroughableView>
                </WalkthroughableView>
            </CopilotStep>
        )
    }
}

const HomeExplained = copilot({
    animated: true, // Can be true or false
    overlay: 'svg', // Can be either view or svg
    tooltipComponent: CreateGoalModalTooltip,
    backdropColor: 'rgba(0,0,0, 0.79)',

    stepNumberComponent: () => <View />,
    verticalOffset: Platform.OS === 'android' ? 25 : 0,
})(CreateGoalToast)

const mapStateToProps = (state) => {
    const { user } = state.user

    return {
        user,
    }
}

export default connect(mapStateToProps, {
    markUserAsOnboarded,
    pauseTutorial,
    showNextTutorialPage,
})(HomeExplained)
