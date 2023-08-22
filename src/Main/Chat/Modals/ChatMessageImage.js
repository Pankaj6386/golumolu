/**
 * /* eslint no-use-before-define: ["error", { "variables": false }]
 *
 * @format
 */

import PropTypes from 'prop-types'
import React from 'react'
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewPropTypes,
} from 'react-native'
import ImageModal from '../../Common/ImageModal'
import { wp, hp } from '../../../asset/dimensions'

export default class ChatMessageImage extends React.Component {
    UNSAFE_componentWillMount() {
        this.setState({
            imageOpen: false,
        })
    }

    openImage = () => {
        this.setState({
            imageOpen: true,
        })
    }

    render() {
        const {
            containerStyle,
            imageProps,
            imageStyle,
            currentMessage,
            type,
            reminderImage,
        } = this.props
        return (
            <TouchableOpacity
                style={[styles.container, containerStyle]}
                activeOpacity={0.6}
                onPress={this.openImage}
            >
                <View style={[styles.container, containerStyle]}>
                    <Image
                        {...imageProps}
                        style={[styles.image, imageStyle]}
                        source={{
                            uri: reminderImage
                                ? reminderImage
                                : currentMessage.image,
                        }}
                    />
                    <ImageModal
                        mediaRef={
                            reminderImage ? reminderImage : currentMessage.image
                        }
                        mediaModal={this.state.imageOpen}
                        closeModal={() => this.setState({ imageOpen: false })}
                        type={type}
                    />
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: hp(25),
        width: 'auto',
    },
    image: {
        width: 'auto',
        minWidth: 150,
        height: 200,
        borderRadius: 13,
        margin: 3,
        resizeMode: 'cover',
    },
    imageActive: {
        flex: 1,
        resizeMode: 'contain',
    },
})

ChatMessageImage.defaultProps = {
    currentMessage: {
        image: null,
    },
    containerStyle: {},
    imageStyle: {},
    imageProps: {},
    lightboxProps: {},
}

ChatMessageImage.propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    imageStyle: Image.propTypes.style,
    imageProps: PropTypes.object,
    lightboxProps: PropTypes.object,
}
