/** @format */

import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { Overlay } from 'react-native-elements'
import { scale } from 'react-native-size-matters'
import global from '../../global'
import { text, color } from '../styles/basic'
import { isEqual } from 'lodash'
import CreatePostModal from '../Main/Post/CreatePostModal'
import { connect } from 'react-redux'
import { updateReminderNotification } from '../actions/ReminderActions'
import { updateGoal } from '../redux/modules/goal/GoalDetailActions'

export class ReminderMoreModal extends Component {
    constructor() {
        super()
        this.state = {
            isModalVisible: this.props?.isVisible || false,
            selectedTextShown: false,
            notifications: {},
        }
        this.onCloseModal = this.onCloseModal.bind(this)
        this.updateNotificationType = this.updateNotificationType.bind(this)
        this.addToStep = this.addToStep.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (!isEqual(this.props.isVisible, prevProps.isVisible)) {
            // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
            this.setState({
                isModalVisible: this.props.isVisible,
            })
            if (this.props.isVisible) {
                this.setState({
                    selectedTextShown: false,
                })
            }
        }
        if (!isEqual(this.props.selectedReminder, prevProps.selectedReminder)) {
            // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
            this.setState({
                notifications:
                    this.props.selectedReminder?.notifications_type || {},
            })
        }
    }

    onCloseModal(isAddedStep) {
        const { onClose, selectedReminder } = this.props
        this.setState({ isModalVisible: false })
        onClose && onClose(isAddedStep ? selectedReminder?._id : null)
    }

    updateNotificationType(key) {
        const { selectedReminder } = this.props
        const notifications = { ...this.state.notifications }
        notifications[key] = !notifications[key]
        let falseCounter = 0
        Object.values(notifications).forEach((item) => {
            if (!item) {
                falseCounter++
            }
        })
        if (falseCounter === 3) {
            return
        }
        this.setState({ notifications })
        const reminderId = selectedReminder?._id
        const goalId = selectedReminder?.goalId
        this.props.updateReminderNotification(reminderId, goalId, notifications)
    }
    addToStep() {
        const { selectedReminder, selectedGoal } = this.props
        const { message } = selectedReminder
        if (message && typeof message === 'string' && message.trim()) {
            this.props.updateGoal(
                null,
                'step',
                {
                    description: message,
                },
                selectedGoal,
                null
            )
            this.onCloseModal(true)
        }
    }

    render() {
        const { isModalVisible, notifications, selectedTextShown } = this.state
        const { selectedGoal, selectedReminder } = this.props

        return (
            <>
                <Overlay
                    visible={isModalVisible}
                    onBackdropPress={() => {
                        this.onCloseModal()
                    }}
                    overlayStyle={{
                        backgroundColor: '#EAE9E9',
                        width: '100%',
                        position: 'absolute',
                        bottom: 0,
                        borderTopLeftRadius: scale(10),
                        borderTopRightRadius: scale(10),
                        paddingBottom: 40,
                    }}
                >
                    <View style={styles.mainContainer}>
                        <View style={styles.overlyconteinar}>
                            <TouchableOpacity
                                style={[
                                    styles.bellmain,
                                    notifications?.push_notification &&
                                        styles.selectedIconBackground,
                                ]}
                                onPress={() => {
                                    this.updateNotificationType(
                                        'push_notification'
                                    )
                                }}
                            >
                                <Image
                                    style={[
                                        styles.bellimg,
                                        {
                                            tintColor: notifications?.push_notification
                                                ? '#FFFFFF'
                                                : '#BDBDBD',
                                        },
                                    ]}
                                    source={global.ASSETS.BELL}
                                />

                                <Text
                                    style={[
                                        styles.text,
                                        notifications?.push_notification &&
                                            styles.selectedText,
                                    ]}
                                >
                                    Push
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.bellmain,
                                    notifications?.email &&
                                        styles.selectedIconBackground,
                                ]}
                                onPress={() => {
                                    this.updateNotificationType('email')
                                }}
                            >
                                <Image
                                    style={[
                                        styles.msgimg,
                                        {
                                            tintColor: notifications?.email
                                                ? '#FFFFFF'
                                                : '#BDBDBD',
                                        },
                                    ]}
                                    source={global.ASSETS.MSG}
                                />
                                <Text
                                    style={[
                                        styles.text,
                                        notifications?.email &&
                                            styles.selectedText,
                                    ]}
                                >
                                    Email
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.bellmain,
                                    notifications?.sms &&
                                        styles.selectedIconBackground,
                                ]}
                                onPress={() => {
                                    this.updateNotificationType('sms')
                                }}
                            >
                                <Image
                                    style={[
                                        styles.drftimg,
                                        {
                                            tintColor: notifications?.sms
                                                ? '#FFFFFF'
                                                : '#BDBDBD',
                                        },
                                    ]}
                                    source={global.ASSETS.DRFT}
                                />

                                <Text
                                    style={[
                                        styles.text,
                                        notifications?.sms &&
                                            styles.selectedText,
                                    ]}
                                >
                                    SMS
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.botton}
                            onPress={() => {
                                this.onCloseModal()
                                setTimeout(() => {
                                    this.createPostModal.open()
                                }, 500)
                            }}
                        >
                            <View style={styles.shareandimg}>
                                <Image
                                    style={styles.share}
                                    source={global.ASSETS.SHARE}
                                />

                                <Text style={styles.shareText}>
                                    Share Update
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/*<TouchableOpacity style={styles.botton}>*/}
                        {/*    <View style={styles.shareandimg}>*/}
                        {/*        <Image*/}
                        {/*            style={styles.share}*/}
                        {/*            source={global.ASSETS.SATH}*/}
                        {/*        />*/}

                        {/*        <Text style={styles.shareText}>*/}
                        {/*            Accountability*/}
                        {/*        </Text>*/}
                        {/*    </View>*/}
                        {/*</TouchableOpacity>*/}

                        <TouchableOpacity
                            style={styles.botton}
                            onPress={() => {
                                this.onCloseModal()
                                setTimeout(() => {
                                    this.createPostModal.open()
                                }, 500)
                                this.setState({ selectedTextShown: true })
                            }}
                        >
                            <View style={styles.shareandimg}>
                                <Image
                                    style={styles.hand}
                                    source={global.ASSETS.HAND}
                                />

                                <Text style={styles.shareText}>Seek Help</Text>
                            </View>
                        </TouchableOpacity>
                        {selectedReminder?.message &&
                        !selectedReminder?.isAddedAsStep ? (
                            <TouchableOpacity
                                style={styles.botton}
                                onPress={this.addToStep}
                            >
                                <View style={styles.shareandimg}>
                                    <Image
                                        style={styles.share}
                                        source={global.ASSETS.SHAPE}
                                    />

                                    <Text style={styles.shareText}>
                                        Add to Steps
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </Overlay>

                <CreatePostModal
                    onRef={(r) => (this.createPostModal = r)}
                    initializeFromGoal
                    // pageId={pageId}
                    initialPost={{
                        belongsToGoalStoryline: {
                            goalRef: selectedGoal?._id,
                            title: selectedGoal?.title,
                            owner: selectedGoal?.owner,
                            category: selectedGoal?.category,
                            priority: selectedGoal?.priority,
                        },
                        privacy: selectedGoal?.privacy,
                    }}
                    selectedText={
                        selectedTextShown
                            ? 'Can someone help? Does anyone know...'
                            : ''
                    }
                />
            </>
        )
    }
}

const styles = StyleSheet.create({
    overlyconteinar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    mainContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    bellmain: {
        width: '32%',
        height: 100,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedIconBackground: {
        backgroundColor: color.GM_BLUE_DEEP,
    },

    text: {
        fontSize: 14,
        fontWeight: '500',
        color: '#828282',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        marginTop: 5,
    },
    selectedText: {
        color: '#fff',
    },
    botton: {
        backgroundColor: '#fff',
        width: '100%',
        height: 63,
        marginTop: 10,
        borderRadius: 10,
        justifyContent: 'center',
    },
    shareandimg: {
        flexDirection: 'row',
    },
    share: {
        width: 21.28,
        height: 23.17,
        marginHorizontal: 20,
    },
    shareText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#828282',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    hand: {
        width: 16.21,
        height: 23.57,
        marginHorizontal: 20,
    },
    bellimg: {
        width: 22,
        height: 21,
        tintColor: '#B5B4B4',
    },
    msgimg: {
        width: 21,
        height: 18.75,
    },
    drftimg: {
        width: 20.73,
        height: 17.42,
    },
    goalTitleText: {
        fontSize: 14,
        fontWeight: '400',
        fontFamily: text.FONT_FAMILY.REGULAR,
    },
})
export default connect(null, {
    updateReminderNotification,
    updateGoal,
})(ReminderMoreModal)
