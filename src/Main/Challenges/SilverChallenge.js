/**
 * This file is to fulfill Apple review requirement to provide user agreement
 * upon signup and login
 *
 * @format
 */

import React from 'react'
import { View, Dimensions } from 'react-native'
import { WebView } from 'react-native-webview'
import OnboardingHeader from '../../Main/Onboarding/Common/OnboardingHeader'
import { trackWithProperties, EVENT as E } from '../../monitoring/segment'
import SearchBarHeader from '../Common/Header/SearchBarHeader'

const SILVER_CHALLENGE_URL = 'https://www.goalmogul.com/silverchallenge'

class SilverChallenge extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
        }
    }

    componentDidMount() {
        // setTimeout(() => {
        //     trackWithProperties(E.DEEPLINK_CLICKED, {
        //         FunnelName: this.props.funnel,
        //     })
        // }, 2000)
    }

    render() {
        const { width } = Dimensions.get('window')
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <SearchBarHeader backButton />
                <WebView
                    javaScriptEnabled={true}
                    mixedContentMode={'always'}
                    style={{ flex: 1, resizeMode: 'cover', width }}
                    scalesPageToFit={false}
                    source={{
                        uri: SILVER_CHALLENGE_URL ? SILVER_CHALLENGE_URL : '',
                    }}
                    bounces={false}
                    onLoadEnd={(e) => {
                        if (!this.state.loaded) {
                            // Wait for WebView to be fully loaded and converted to transparent.
                            // Otherwise, it will be a white glitch.
                            setTimeout(() => {
                                this.setState({ loaded: true })
                            }, 100)
                        }
                    }}
                />
            </View>
        )
    }
}

export default SilverChallenge
