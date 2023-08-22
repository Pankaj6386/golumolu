/** @format */

import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Divider } from 'react-native-elements'
import global from '../../../global'
import { text } from '../../styles/basic'
import moment from 'moment'
import {
    moveToArchiveReminder,
    moveToCompleteReminder,
    updateReminderOrders,
} from '../../actions/ReminderActions'
import { connect } from 'react-redux'
import ReminderMoreModal from '../../components/ReminderMoreModal'
import LoadingModal from '../Common/Modal/LoadingModal'
import { GM_MID_GREY } from '../../styles/basic/color'
import { getReminderTimeForCustom } from '../../Utils/HelperMethods'
import _ from 'lodash'

let row = []
let prevOpenedRow

class SwipeList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            finalData: Array.isArray(this.props.reminders)
                ? this.props.reminders
                : [],
            isMoreModalVisible: false,
            selectedReminder: null,
            isLoading: false,
            addedStepReminderIds: [],
        }
        this.refsArray = []
        this.onDragEnd.bind(this)
    }
    componentDidUpdate(prevProps) {
        if (!_.isEqual(prevProps.reminders, this.props.reminders)) {
            this.setState({ finalData: this.props.reminders })
        }
    }

    handleDone = async (item) => {
        this.setState({ isLoading: true })
        await this.props.moveToCompleteReminder(item._id)
        this.setState({ isLoading: false })
    }
    handleArchive = async (item) => {
        this.setState({ isLoading: true })
        await this.props.moveToArchiveReminder(item._id)
        this.setState({ isLoading: false })
    }

    rightSwipeActions = (item, index) => {
        return (
            <View style={styles.itemBackContainer}>
                {/*<TouchableOpacity*/}
                {/*    activeOpacity={0.7}*/}
                {/*    style={[*/}
                {/*        styles.iconContainer,*/}
                {/*        { backgroundColor: '#42C0F5' },*/}
                {/*    ]}*/}
                {/*>*/}
                {/*    <Image*/}
                {/*        source={global.ASSETS.SOUND}*/}
                {/*        style={[styles.backIconStyle, { width: scale(28) }]}*/}
                {/*    />*/}
                {/*    <Text style={styles.iconTextStyle}>Sound On</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*<TouchableOpacity*/}
                {/*    // onPress={onDelete}*/}
                {/*    activeOpacity={0.7}*/}
                {/*    style={[*/}
                {/*        styles.iconContainer,*/}
                {/*        { backgroundColor: '#3E8DF7' },*/}
                {/*    ]}*/}
                {/*>*/}
                {/*    <Image*/}
                {/*        source={global.ASSETS.SYNC}*/}
                {/*        style={[styles.backIconStyle, { tintColor: '#fff' }]}*/}
                {/*    />*/}
                {/*    <Text style={styles.iconTextStyle}>Sync</Text>*/}
                {/*</TouchableOpacity>*/}
                <TouchableOpacity
                    onPress={() => {
                        this.closeCurrentRow(index)
                        this.handleArchive(item)
                    }}
                    activeOpacity={0.7}
                    style={[
                        styles.iconContainer,
                        { backgroundColor: '#ED7437' },
                    ]}
                >
                    <Image
                        source={global.ASSETS.ARCHIVE1}
                        style={styles.backIconStyle}
                    />
                    <Text style={styles.iconTextStyle}>Archive</Text>
                </TouchableOpacity>
            </View>
        )
    }

    leftSwipeActions = (item, index, isAddedAsStep) => {
        return (
            <View style={styles.itemBackContainer}>
                <TouchableOpacity
                    onPress={() => {
                        this.closeCurrentRow(index)
                        this.handleDone(item)
                    }}
                    activeOpacity={0.7}
                    style={[
                        styles.iconContainer,
                        { backgroundColor: '#46BA1D' },
                    ]}
                >
                    <Image
                        source={global.ASSETS.DONE}
                        style={styles.backIconStyle}
                    />
                    <Text style={styles.iconTextStyle}>Done</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() =>
                        this.setState({
                            isMoreModalVisible: true,
                            selectedReminder: { ...item, isAddedAsStep },
                        })
                    }
                    activeOpacity={0.7}
                    style={[
                        styles.iconContainer,
                        { backgroundColor: '#BDBDBD' },
                    ]}
                >
                    <Image
                        source={global.ASSETS.MORE}
                        style={styles.backIconStyle}
                    />
                    <Text style={styles.iconTextStyle}>More</Text>
                </TouchableOpacity>
            </View>
        )
    }

    getReminderMessage(type) {
        switch (type) {
            case 'month_before_due_date':
                return 'Reminder: Your goal is due in 1 MONTH!'
            case 'week_before_due_date':
                return 'Reminder: Your goal is due in 1 WEEK!'
            case 'day_before_due_date':
                return 'Reminder:  Your goal is due TOMORROW!'
            case 'on_due_date':
                return 'Reminder: Your goal is due TODAY!'
            default:
                return 'Reminder: '
        }
    }

    closeRow = (index) => {
        if (prevOpenedRow && prevOpenedRow !== row[index]) {
            prevOpenedRow.close()
        }
        prevOpenedRow = row[index]
    }
    closeCurrentRow = (index) => {
        row[index] && row[index].close()
    }

    onDragEnd = ({ data }) => {
        const { goalDetails } = this.props
        this.setState({ finalData: data })
        const activeReminders = data.map((item) => item._id)
        this.props.updateReminderOrders(goalDetails?._id, activeReminders)
    }

    renderItem = ({ item, isActive, index }) => {
        const { goalDetails } = this.props
        const { addedStepReminderIds } = this.state
        const steps = goalDetails?.steps || []
        const isAddedAsStep =
            steps.filter((stepItem) => stepItem?.description === item?.message)
                .length > 0 || addedStepReminderIds.includes(item?._id)
        return (
            <Swipeable
                ref={(ref) => (row[index] = ref)}
                renderRightActions={() => this.rightSwipeActions(item, index)}
                renderLeftActions={() =>
                    this.leftSwipeActions(item, index, isAddedAsStep)
                }
                onSwipeableWillOpen={() => {
                    this.closeRow(index)
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        this.props.onPressReminder &&
                            this.props.onPressReminder(goalDetails, item)
                    }}
                    // onLongPress={drag}
                >
                    <View style={{ backgroundColor: '#fff' }}>
                        <View style={styles.listContainer}>
                            <View style={{ width: 26 }}>
                                {isAddedAsStep && (
                                    <MaterialIcons
                                        name="signal-cellular-4-bar"
                                        size={16}
                                        color={GM_MID_GREY}
                                    />
                                )}
                            </View>
                            <View style={{ flex: 1 }}>
                                {!!item?.message && (
                                    <Text
                                        numberOfLines={2}
                                        style={styles.listTextStyle}
                                    >
                                        {item?.message}
                                    </Text>
                                )}
                                {item?.reminder_type !== 'custom' && (
                                    <Text style={styles.listTextStyle}>
                                        {this.getReminderMessage(
                                            item.reminder_type
                                        )}
                                    </Text>
                                )}
                                {item?.reminder_type === 'custom' ? (
                                    <View style={styles.rowView}>
                                        {Array.isArray(item?.reminder_audios) &&
                                        item?.reminder_audios?.length ? (
                                            <Ionicons
                                                name="md-volume-high-outline"
                                                size={21}
                                                style={{ marginHorizontal: 5 }}
                                                color={GM_MID_GREY}
                                            />
                                        ) : null}
                                        <Text style={styles.descriptionText}>
                                            {getReminderTimeForCustom({
                                                type: item.repeat_type,
                                                startDate: item.start_date,
                                                everyWeek:
                                                    item?.weeklyRepeatType
                                                        ?.every_week,
                                                weeklySelectedDays:
                                                    item?.weeklyRepeatType
                                                        ?.weekly_selected_days,
                                                monthlySelectedDays:
                                                    item?.monthlyRepeatType
                                                        ?.monthly_selected_day,
                                                everyMonth:
                                                    item?.monthlyRepeatType
                                                        ?.every_month,
                                                customEvery:
                                                    item?.customRepeatType
                                                        ?.custom_every,
                                                customEveryUnit:
                                                    item?.customRepeatType
                                                        ?.custom_every_unit,
                                                exceptionDates:
                                                    item?.customRepeatType
                                                        ?.exception_dates,
                                                exceptionTimes:
                                                    item?.customRepeatType
                                                        ?.exception_times,
                                                everyYear:
                                                    item?.yearlyRepeatType
                                                        ?.every_year,
                                                yearlyDay:
                                                    item?.yearlyRepeatType
                                                        ?.yearly_day,
                                                yearlyWeek:
                                                    item?.yearlyRepeatType
                                                        ?.yearly_week,
                                                yearlyMonth:
                                                    item?.yearlyRepeatType
                                                        ?.yearly_month,
                                            })}
                                        </Text>
                                        {item?.reminder_images?.length ||
                                        item?.reminder_videos?.length ? (
                                            <>
                                                <View style={styles.dotView} />
                                                <Ionicons
                                                    name="attach"
                                                    size={21}
                                                    color={GM_MID_GREY}
                                                />
                                            </>
                                        ) : null}
                                    </View>
                                ) : (
                                    <Text
                                        key={index + 'rem'}
                                        style={styles.dateTextStyle1}
                                    >
                                        {'On ' +
                                            moment(item.reminder_date).format(
                                                'MMMM DD,YYYY | HH:mm:A (dddd)'
                                            )}
                                    </Text>
                                )}
                                {/*<View style={styles.dateContainer}>*/}
                                {/*    <Text style={styles.dateTextStyle1}>*/}
                                {/*        Notification deliver dates*/}
                                {/*    </Text>*/}
                                {/*    /!*<Ionicons*!/*/}
                                {/*    /!*    name="md-volume-high-outline"*!/*/}
                                {/*    /!*    size={21}*!/*/}
                                {/*    /!*    //   style={{marginHorizontal: 5}}*!/*/}
                                {/*>*/}
                                {/*    /!*<Text style={styles.dateTextStyle1}>*!/*/}
                                {/*    /!*    {item.repeat} at{' '}*!/*/}
                                {/*    /!*    {moment(item.startDate).format(*!/*/}
                                {/*    /!*        'YYY-MM-DD'*!/*/}
                                {/*    /!*    ) ==*!/*/}
                                {/*    /!*    moment(new Date()).format('YYY-MM-DD')*!/*/}
                                {/*    /!*        ? moment(item.startDate).format(*!/*/}
                                {/*    /!*              'LT'*!/*/}
                                {/*    /!*          )*!/*/}
                                {/*    /!*        : moment(item.startDate).format(*!/*/}
                                {/*    /!*              'll'*!/*/}
                                {/*    /!*          )}*!/*/}
                                {/*    /!*</Text>*!/*/}
                                {/*</View>*/}
                            </View>
                        </View>

                        <Divider style={styles.divider} />
                    </View>
                </TouchableOpacity>
            </Swipeable>
        )
    }

    render() {
        const {
            isMoreModalVisible,
            selectedReminder,
            isLoading,
            successPopup,
            successMessage,
        } = this.state

        return (
            <View style={styles.MainContainer}>
                <LoadingModal visible={isLoading} />
                <View style={{ width: '100%' }}>
                    <FlatList
                        ref={(ref) => {
                            if (ref && ref.containerRef)
                                this.flatList = ref.flatlistRef.current
                        }}
                        data={this.state.finalData}
                        renderItem={(item) => this.renderItem(item)}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>

                <ReminderMoreModal
                    isVisible={isMoreModalVisible}
                    onClose={(reminderId) => {
                        let tempObj = {}
                        if (reminderId) {
                            tempObj.addedStepReminderIds = [
                                ...this.state.addedStepReminderIds,
                                reminderId,
                            ]
                            const selectedReminder = this.state.finalData?.filter(
                                (item) => item?._id === reminderId
                            )
                            if (selectedReminder.length) {
                                const successMessage = `"${selectedReminder[0]?.message}" added to your goal’s Steps`
                                this.props.showSuccessPopup(successMessage)
                            }
                        }
                        this.setState({
                            isMoreModalVisible: false,
                            ...tempObj,
                        })
                    }}
                    selectedGoal={this.props.goalDetails}
                    selectedReminder={selectedReminder}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        // justifyContent: "center",
        // alignItems: "center",
        // flex: 1,
        // margin: 2,
    },

    item: {
        padding: 10,
        fontSize: 18,
        // height: 44,
    },

    textInputStyle: {
        textAlign: 'center',
        height: 40,
        width: '90%',
        borderWidth: 1,
        borderColor: '#4CAF50',
        borderRadius: 7,
        marginTop: 12,
    },

    button: {
        width: '90%',
        height: 40,
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        marginTop: 10,
    },

    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    listContainer: {
        // backgroundColor: '#8787',
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        minHeight: 40,
    },
    listTextStyle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        color: '#000',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateTextStyle: {
        fontWeight: '400',
        fontSize: 16,
        fontFamily: text.FONT_FAMILY.REGULAR,
        marginHorizontal: 5,
    },
    dateTextStyle1: {
        fontWeight: '400',
        fontSize: 14,
        fontFamily: text.FONT_FAMILY.REGULAR,
        marginTop: 6,
        color: GM_MID_GREY,
    },
    divider: {
        marginTop: 10,
    },
    iconContainer: {
        // backgroundColor: '#F66565',
        height: '98%',
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIconStyle: {
        height: 25,
        width: 25,
        marginBottom: 5,
    },
    iconTextStyle: {
        fontWeight: '600',
        fontSize: 12,
        fontFamily: text.FONT_FAMILY.REGULAR,
        color: '#fff',
    },
    itemBackContainer: {
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        paddingRight: 16,
        flex: 1,
    },
    descriptionText: {
        fontWeight: '400',
        fontSize: 14,
        fontFamily: text.FONT_FAMILY.REGULAR,
        color: GM_MID_GREY,
    },
    dotView: {
        height: 2,
        width: 2,
        borderRadius: 1,
        marginHorizontal: 8,
        backgroundColor: GM_MID_GREY,
    },
})

const mapStateToProps = () => {
    return {}
}

export default connect(mapStateToProps, {
    moveToCompleteReminder,
    moveToArchiveReminder,
    updateReminderOrders,
})(SwipeList)
