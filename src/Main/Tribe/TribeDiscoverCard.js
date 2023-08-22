/**
 * Tribe discover page card
 * @format
 */
import React from 'react'
import { connect } from 'react-redux'
import DelayedButton from '../Common/Button/DelayedButton'
// import { getImageOrDefault, decode } from '../../redux/middleware/utils'
import tribe_default_icon from '../../asset/utils/tribeIcon.png'
import { View, Image, Text } from 'react-native'
// import { Icon } from '@ui-kitten/components'
import { color } from '../../styles/basic'
import MEMBERS from '../../asset/utils/mutualFriends.png'
import TRIBE_FRIENDS from '../../asset/utils/tribeFriends.png'

import {
    requestJoinTribe,
    tribeDetailOpen,
} from '../../redux/modules/tribe/MyTribeActions'
import ProfileImage from '../Common/ProfileImage'

import { refreshProfileData } from '../../actions'
import { ActivityIndicator } from 'react-native-paper'

let pageAb
class TribeDiscoverCard extends React.PureComponent {
    state = {
        requested: false,
        joined: false,
        selected: false,
        memberState: '',
        loading: false,
    }

    componentDidMount() {
        const pageId = this.props.refreshProfileData(this.props.userId)
        pageAb = pageId
        this.getMembers()
    }

    getMembers = () => {
        const { item, userId } = this.props
        const { members } = item
        let memberState
        members.filter((m) => {
            if (m.memberRef === userId) memberState = m.category
        })
        this.setState({ memberState })
    }

    renderTitle(item) {
        let title = item.name
        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 2,
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{ color: 'black', fontSize: 18, fontWeight: '600' }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
            </View>
        )
    }

    renderButtonText = () => {
        const buttonState = this.state.memberState

        if (this.props.isSeekTribe) {
            if (this.state.selected) {
                return 'Posted'
            }
            return 'Select'
        } else {
            if (buttonState === 'JoinRequester') {
                return 'Requested'
            } else if (
                buttonState === 'Admin' ||
                buttonState === 'Member' ||
                buttonState === 'autoJoin'
            ) {
                return 'Joined'
            } else if (buttonState === undefined) {
                // console.log('HELLO')
                return 'Join'
            } else null
        }
    }

    handleJoinButton = (item) => {
        const { onPress } = this.props
        const { memberState } = this.state

        if (memberState === undefined && item.isAutoAcceptEnabled) {
            this.setState({ memberState: 'autoJoin' })
            this.props.requestJoinTribe(
                item._id,
                true,
                pageAb,
                item.isAutoAcceptEnabled
            )
        } else if (memberState === undefined) {
            this.setState({ memberState: 'JoinRequester' })
            this.props.requestJoinTribe(
                item._id,
                true,
                pageAb,
                item.isAutoAcceptEnabled
            )
        } else if (
            memberState === 'JoinRequester' ||
            memberState === 'Admin' ||
            memberState === 'autoJoin' ||
            memberState === 'Member'
        ) {
            // console.log('ITEMMM 3')
            onPress(item)
        }
        // else {
        //     this.setState({ requested: true })
        //     this.props.requestJoinTribe(
        //         item._id,
        //         true,
        //         pageAb,
        //         item.isAutoAcceptEnabled
        //     )
        // }
    }

    renderButton(item) {
        const { memberState } = this.state
        return (
            <View style={styles.iconContainerStyle}>
                <DelayedButton
                    // disabled={
                    //     this.state.memberState == 'JoinRequester' ? true : false
                    // }
                    activeOpacity={0.8}
                    onPress={() => {
                        if (this.props.isSeekTribe) {
                            this.setState({ selected: true })
                            return this.props.onPress(item)
                        }
                        this.handleJoinButton(item)
                    }}
                    style={{
                        height: 31,
                        width: memberState === 'JoinRequester' ? 110 : 65,
                        backgroundColor:
                            memberState === 'JoinRequester'
                                ? '#BDBDBD'
                                : color.GM_BLUE,
                        borderRadius: 3,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 3,
                    }}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 12,
                            fontWeight: '600',
                            lineHeight: 14,
                            fontFamily: 'SFProDisplay-Semibold',
                        }}
                    >
                        {this.state.loading ? (
                            <>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <ActivityIndicator
                                        size={14}
                                        color={'white'}
                                    />
                                </View>
                            </>
                        ) : (
                            <>{this.renderButtonText()}</>
                        )}
                    </Text>
                </DelayedButton>
            </View>
        )
    }
    renderInformation(item) {
        let count = item.memberCount
        let friendCount = item.friendsCount

        if (count > 999) {
            count = '1k+'
        }
        if (friendCount > 999) {
            friendCount = '1k+'
        }
        const defaultTextStyle = { color: '#abb1b0', fontSize: 10 }

        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 3,
                }}
            >
                {/* <Text style={defaultTextStyle}>{category}</Text> */}
                {/* <Dot /> */}
                <Image
                    source={MEMBERS}
                    style={{ height: 12, width: 12, marginHorizontal: 1 }}
                    resizeMode="contain"
                />
                {count ? (
                    <View style={{ flexDirection: 'row', marginHorizontal: 3 }}>
                        <Text
                            style={{
                                ...defaultTextStyle,
                                color: '#737475',
                                fontSize: 12,
                                fontWeight: '500',
                            }}
                        >
                            {count}
                        </Text>
                        <Text
                            style={{
                                ...defaultTextStyle,
                                color: '#737475',
                                fontSize: 12,
                                fontWeight: '500',
                            }}
                        >
                            &nbsp;{item.memberCount > 1 ? 'members' : 'member'}
                        </Text>
                    </View>
                ) : null}

                {friendCount > 0 ? (
                    <>
                        <Image
                            source={TRIBE_FRIENDS}
                            style={{
                                height: 12,
                                width: 12,
                                marginHorizontal: 1,
                            }}
                            resizeMode="contain"
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                marginHorizontal: 3,
                            }}
                        >
                            <Text
                                style={{
                                    ...defaultTextStyle,
                                    color: '#737475',
                                    fontSize: 12,
                                    fontWeight: '500',
                                }}
                            >
                                {friendCount}
                            </Text>
                            <Text
                                style={{
                                    ...defaultTextStyle,
                                    color: '#737475',
                                    fontSize: 12,
                                    fontWeight: '500',
                                }}
                            >
                                &nbsp;
                                {item.friendsCount > 1 ? 'friends' : 'friend'}
                            </Text>
                        </View>
                    </>
                ) : null}
            </View>
        )
    }

    renderCardContent(item) {
        let content
        if (item.description) {
            content = item.description
        }

        return (
            <View
                style={{
                    justifyContent: 'flex-start',
                    flex: 1,
                    marginLeft: 10,
                }}
            >
                {this.renderTitle(item)}
                {this.renderInformation(item)}
                <View style={{ marginTop: item.memberCount ? 3 : 6 }}>
                    <Text
                        style={{
                            flex: 1,
                            flexWrap: 'wrap',
                            color: '#000000',
                            fontSize: 14,
                            // letterSpacing: -0.216066,
                            fontFamily: 'SFProDisplay-Regular',
                        }}
                        numberOfLines={4}
                        ellipsizeMode="tail"
                    >
                        {content}
                    </Text>
                </View>
            </View>
        )
    }

    render() {
        const { onPress, item, canSelect, type } = this.props

        const { selected, name, picture, description, memberCount } = item
        const containerStyle = selected
            ? styles.tribeCardSelectedContainerStyle
            : styles.tribeCardContainerStyle

        return (
            <DelayedButton
                // style={containerStyle}
                onPress={() => onPress(item)}
                activeOpacity={0.9}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 1,
                        paddingLeft: 12,
                        paddingRight: 12,
                        paddingTop: 8,
                        paddingBottom: 8,
                        backgroundColor: '#ffffff',
                        shadowColor: 'gray',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                    }}
                >
                    <ProfileImage
                        imageStyle={{
                            height: 48,
                            width: 48,
                            borderRadius: 0,
                            borderColor: 'transparent',
                        }}
                        imageUrl={picture}
                        rounded
                        imageContainerStyle={styles.imageContainerStyle}
                        defaultUserProfile={tribe_default_icon}
                    />
                    {this.renderCardContent(item)}
                    {this.renderButton(item, type)}

                    {/* {canSelect && (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 16,
                                left: 16,
                                zIndex: 2,
                                borderRadius: 10,
                                borderWidth: 0.5,
                                backgroundColor: selected
                                    ? color.GM_BLUE
                                    : color.GM_CARD_BACKGROUND,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: selected
                                    ? color.GM_BLUE
                                    : '#8C8C8C',
                            }}
                        >
                            <Icon
                                name="check"
                                pack="material-community"
                                style={{
                                    tintColor: selected
                                        ? color.GM_CARD_BACKGROUND
                                        : '#8C8C8C',
                                    height: 20,
                                    width: 20,
                                }}
                            />
                        </View>
                    )} */}
                    {/* {picture ? (
                        <Image
                            style={{
                                height: (width - 32) / 2.2,
                                width: width - 32,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                            }}
                            resizeMode="cover"
                            source={getImageOrDefault(picture)}
                        />
                    ) : (
                        <View
                            style={{
                                height: (width - 32) / 2.2,
                                width: width - 32,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Icon
                                pack="material-community"
                                name="flag"
                                style={{ height: 72 }}
                            />
                        </View>
                    )} */}
                </View>
                {/* <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            paddingVertical: 8,
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={[
                                default_style.titleText_1,
                                {
                                    letterSpacing: text.LETTER_SPACING.REGULAR,
                                    flex: 1,
                                },
                            ]}
                        >
                            {name}
                        </Text>
                        <Text
                            style={[
                                default_style.normalText_1,
                                {
                                    color: '#828282',
                                    letterSpacing: text.LETTER_SPACING.REGULAR,
                                },
                            ]}
                        >
                            {memberCount}{' '}
                            {memberCount > 1 ? 'members' : 'member'}
                        </Text>
                    </View>
                    <Text
                        style={[
                            default_style.normalText_1,
                            {
                                color: '#828282',
                                letterSpacing: text.LETTER_SPACING.REGULAR,
                            },
                        ]}
                    >
                        {decode(description)}
                    </Text>
                </View> */}
            </DelayedButton>
        )
    }
}

const styles = {
    tribeCardContainerStyle: {
        backgroundColor: 'white',
        borderRadius: 5,
        justifyContent: 'center',
        flex: 1,
        marginTop: 20,
        marginLeft: 16,
        marginRight: 16,
        shadowOffset: {
            width: -2,
            height: 2,
        },
        shadowRadius: 3,
        shadowOpacity: 0.9,
        shadowColor: 'rgba(0,0,0,0.1)',
        borderWidth: 0.5,
        borderColor: '#FAFAFA',
    },
    tribeCardSelectedContainerStyle: {
        backgroundColor: '#F6FDFF',
        borderRadius: 5,
        justifyContent: 'center',
        flex: 1,
        marginTop: 20,
        marginLeft: 16,
        marginRight: 16,
        shadowOffset: {
            width: -2,
            height: 2,
        },
        shadowRadius: 3,
        shadowOpacity: 0.9,
        shadowColor: 'rgba(0,0,0,0.1)',
        borderWidth: 0.5,
        borderColor: color.GM_BLUE,
    },
}

const mapStateToProps = (state, props) => {
    const { userId } = state.user

    return {
        userId,
    }
}

export default connect(mapStateToProps, {
    tribeDetailOpen,
    requestJoinTribe,
    refreshProfileData,
})(TribeDiscoverCard)
