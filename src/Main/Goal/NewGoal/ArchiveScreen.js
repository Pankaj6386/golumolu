/** @format */

import 'react-native-gesture-handler'
import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native'
import { Divider } from 'react-native-paper'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { ScaledSheet, scale } from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons'
import global from '../../../../global'
import { SwipeListView } from 'react-native-swipe-list-view'
import { Actions } from 'react-native-router-flux'
import moment from 'moment'

import { color, text } from '../../../styles/basic'
import {
    fetchArchiveOrCompletedReminder,
    moveToDeleteReminders,
    moveToRestoreReminders,
} from '../../../actions/ReminderActions'
import { connect } from 'react-redux'
import LoadingModal from '../../Common/Modal/LoadingModal'

class ArchiveScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            apiData: [],
            selectArray: [],
            value: '0',
            checked: false,
            selectAllIds: [],
            isLoading: false,
        }
        this.AllSelectedData = this.AllSelectedData.bind(this)
        this.recoverDataAll = this.recoverDataAll.bind(this)
        this.onDeleteAll = this.onDeleteAll.bind(this)
        this.recoverData = this.recoverData.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.onEndReach = this.onEndReach.bind(this)
        this.onRefresh = this.onRefresh.bind(this)
    }

    AllSelectedData = () => {
        if (
            this.state.selectArray.length <
            this.props.completedOrArchivedReminder?.length
        ) {
            this.setState({
                selectArray: [
                    ...new Set(
                        this.props.completedOrArchivedReminder.map(
                            (item) => item._id
                        )
                    ),
                ],
            })
        } else if (
            this.state.selectArray.length ===
            this.props.completedOrArchivedReminder.length
        ) {
            this.setState({ selectArray: [] })
        }
    }

    componentDidMount() {
        this.props.fetchArchiveOrCompletedReminder(0, 10)
    }

    onDelete = async (payload) => {
        this.setState({ isLoading: true })
        await this.props.moveToDeleteReminders(payload)
        this.setState({ isLoading: false })
    }

    recoverData = async (payload) => {
        this.setState({ isLoading: true })
        await this.props.moveToRestoreReminders(payload)
        this.setState({ isLoading: false })
    }

    onDeleteAll = async () => {
        this.setState({ value: '0', isLoading: true })
        const { selectArray } = this.state
        if (Array.isArray(selectArray) && selectArray?.length) {
            const payload = {
                reminderIds: selectArray,
            }
            await this.props.moveToDeleteReminders(payload)
            this.setState({ selectArray: [] })
        }
        this.setState({ isLoading: false })
    }

    onRefresh = () => {
        this.props.fetchArchiveOrCompletedReminder(0, 10)
    }

    onEndReach = () => {
        const {
            isAvailableToFetchCompletedOrArchived,
            completedOrArchivedReminder,
        } = this.props
        const previousDataLength = completedOrArchivedReminder?.length || 0

        if (
            isAvailableToFetchCompletedOrArchived &&
            previousDataLength &&
            previousDataLength % 10 === 0
        ) {
            this.props.fetchArchiveOrCompletedReminder(previousDataLength, 10)
        }
    }

    recoverDataAll = async () => {
        this.setState({ value: '0', isLoading: true })
        const { selectArray } = this.state
        if (Array.isArray(selectArray) && selectArray?.length) {
            const payload = {
                reminderIds: selectArray,
            }
            await this.props.moveToRestoreReminders(payload)
        }
        this.setState({ isLoading: false })
    }
    renderBackItem = ({ item }, rowMap) => {
        if (this.state.value === '1') {
            return null
        }
        return (
            <View style={styles.itemBackContainer}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        rowMap[item._id]?.closeRow()
                        const payload = {
                            reminderIds: [item._id],
                        }
                        this.recoverData(payload)
                    }}
                    style={[
                        styles.iconContainer,
                        { backgroundColor: '#765CEF' },
                    ]}
                >
                    <Image
                        source={global.ASSETS.RECOVER}
                        style={styles.recover}
                    />
                    <Text style={styles.iconTextStyle}>Recover</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        rowMap[item._id]?.closeRow()
                        const payload = {
                            reminderIds: [item._id],
                        }
                        this.onDelete(payload)
                    }}
                    activeOpacity={0.7}
                    style={styles.iconContainer}
                >
                    <Ionicons name="ios-trash-outline" size={30} color="#FFF" />
                    <Text style={styles.iconTextStyle}>Delete</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderEmptyView() {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.listHeaderText}>
                    {' '}
                    No Archived or Completed Reminders found
                </Text>
            </View>
        )
    }

    renderItem = ({ item }) => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: this.state.value === '1' ? scale(20) : 0,

                    // width: Width,
                }}
            >
                {this.state.value === '1' && (
                    <>
                        <BouncyCheckbox
                            disableBuiltInState
                            isChecked={this.state.selectArray.includes(
                                item._id
                            )}
                            fillColor={color.GM_BLUE_DEEP}
                            unfillColor={'#FFFFFF'}
                            onPress={() => {
                                if (this.state.selectArray.includes(item._id)) {
                                    this.setState({
                                        selectArray: this.state.selectArray.filter(
                                            (value) => value !== item._id
                                        ),
                                    })
                                } else {
                                    this.setState({
                                        selectArray: [
                                            ...new Set([
                                                ...this.state.selectArray,
                                                item._id,
                                            ]),
                                        ],
                                    })
                                }
                            }}
                        />
                    </>
                )}
                <View
                    style={[
                        styles.listHeaderContainer,
                        {
                            paddingHorizontal:
                                this.state.value === '0' ? scale(25) : 0,
                            width:
                                this.state.value === '0'
                                    ? scale(350)
                                    : scale(260),
                        },
                    ]}
                >
                    {item.reminder_status === 'completed' ? (
                        <Text
                            style={[
                                styles.statusText,
                                {
                                    color: '#46BA1D',
                                },
                            ]}
                        >
                            [{item.reminder_status}]
                        </Text>
                    ) : (
                        <Text style={[styles.statusText]}>
                            [{item.reminder_status}]
                        </Text>
                    )}

                    <View>
                        <Text numberOfLines={3} style={styles.listHeaderText}>
                            ({item?.goalId?.title || item.message})
                            {item.messageString}
                        </Text>
                        <View style={styles.dateContainer}>
                            {/*<Ionicons name="md-volume-high-outline" size={20} />*/}
                            <Text style={styles.dateTextStyle}>
                                {/* {item.repeat} */}
                                By {moment(item?.goal_end_date).format('ll')}
                            </Text>
                            {/* {item._id == '2' && (
                                <Image
                                    source={global.ASSETS.FILES}
                                    style={styles.iconStyle}
                                />
                            )} */}
                        </View>
                    </View>
                </View>
                <Divider style={styles.divider} />
            </View>
        )
    }
    render() {
        const { isLoading } = this.state
        const {
            completedOrArchivedReminderLoading,
            completedOrArchivedReminder,
        } = this.props
        return (
            <>
                <SafeAreaView style={{ backgroundColor: color.GM_BLUE }} />
                <SafeAreaView style={styles.safeAreaView}>
                    <LoadingModal visible={isLoading} />
                    <View style={styles.container}>
                        <View style={styles.headerContainer}>
                            <Ionicons
                                onPress={() => Actions.pop()}
                                name="chevron-back"
                                size={26}
                                color="#FFF"
                            />
                            <Text style={styles.headerText}>
                                Archived Reminders
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ value: '1' })
                                }}
                            >
                                {this.state.value === '0' ? (
                                    <Text
                                        style={[
                                            styles.headerSubText,
                                            { color: '#fff' },
                                        ]}
                                    >
                                        Edit
                                    </Text>
                                ) : (
                                    <>
                                        {this.state.selectArray.length !==
                                        completedOrArchivedReminder?.length ? (
                                            <Text
                                                onPress={this.AllSelectedData}
                                                style={[
                                                    styles.headerSubText,
                                                    { color: '#fff' },
                                                ]}
                                            >
                                                Select All
                                            </Text>
                                        ) : (
                                            <Text
                                                onPress={this.AllSelectedData}
                                                style={[
                                                    styles.headerSubText,
                                                    { color: '#fff' },
                                                ]}
                                            >
                                                Unselect All
                                            </Text>
                                        )}
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                        {completedOrArchivedReminderLoading &&
                        !completedOrArchivedReminder.length ? (
                            <View style={styles.centerContainer}>
                                <ActivityIndicator size={'large'} />
                            </View>
                        ) : (
                            <SwipeListView
                                ref={(ref) => {
                                    this.swipeListRef = ref
                                }}
                                keyExtractor={(item) => item._id}
                                data={completedOrArchivedReminder}
                                renderItem={this.renderItem}
                                renderHiddenItem={this.renderBackItem}
                                // leftOpenValue={75}
                                closeOnRowPress={true}
                                rightOpenValue={
                                    this.state.value === '1' ? 0 : -200
                                }
                                onRefresh={this.onRefresh}
                                refreshing={completedOrArchivedReminderLoading}
                                disableRightSwipe={true}
                                disableLeftSwipe={this.state.value === '1'}
                                contentContainerStyle={{
                                    paddingBottom:
                                        this.state.value === '1' ? 50 : 0,
                                    flexGrow: 1,
                                }}
                                onEndReached={this.onEndReach}
                                ListEmptyComponent={this.renderEmptyView()}
                            />
                        )}
                    </View>
                </SafeAreaView>
                {this.state.value === '1' ? (
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity onPress={this.recoverDataAll}>
                            <Text style={styles.bottomTextStyle}>Recover</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onDeleteAll}>
                            <Text style={styles.bottomTextStyle}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </>
        )
    }
}

const styles = ScaledSheet.create({
    safeAreaView: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContainer: {
        width: '100%',
        height: '53@s',
        backgroundColor: color.GM_BLUE,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '15@s',
    },
    headerText: {
        fontWeight: '700',
        fontSize: '16@s',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        color: '#FFF',
    },
    headerSubText: {
        fontSize: '16@s',
        fontWeight: '500',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    noDataStyle: {
        fontSize: '20@s',
        fontWeight: '600',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        textAlign: 'center',
        marginTop: 30,
    },

    bottomContainer: {
        position: 'absolute',
        backgroundColor: color.GM_BLUE_DEEP,
        height: '50@s',
        bottom: 0,
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: '25@s',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomTextStyle: {
        fontSize: '16@s',
        fontWeight: '500',
        color: '#FFF',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    listHeaderContainer: {
        // paddingHorizontal: '20@s',
        // marginTop: '10@s',
        // width: '270@s',
        backgroundColor: '#ffff',
        minHeight: '100@s',
        justifyContent: 'center',
        // padding:10
    },
    listHeaderText: {
        fontSize: '15@s',
        fontWeight: '500',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        color: '#000',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dateTextStyle: {
        fontWeight: '400',
        fontSize: '14@s',
        fontFamily: text.FONT_FAMILY.REGULAR,
        marginHorizontal: '5@s',
    },
    iconContainer: {
        backgroundColor: '#F66565',
        height: '98%',
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconTextStyle: {
        fontWeight: '600',
        fontSize: '12@s',
        fontFamily: text.FONT_FAMILY.REGULAR,
        color: '#fff',
    },
    iconStyle: {
        width: '8@s',
        height: '16@s',
        marginHorizontal: '5@s',
    },
    recover: {
        width: '25@s',
        height: '25@s',
    },
    itemBackContainer: {
        // marginTop: '10@s',
        height: '100%',
        flexDirection: 'row',
        alignSelf: 'flex-end',
        alignItems: 'center',
        // minHeight:190
    },
    statusText: {
        fontWeight: '600',
        fontSize: '18@s',
        color: '#ED7437',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    divider: {
        marginTop: '10@s',
    },
    checkImage: {
        height: '20@s',
        width: '20@s',
    },
})

const mapStateToProps = (state) => {
    const { userId } = state.user
    const {
        isAvailableToFetchCompletedOrArchived,
        completedOrArchivedReminder,
        completedOrArchivedReminderLoading,
        completedOrArchivedReminderError,
    } = state.reminder
    return {
        userId,
        completedOrArchivedReminder,
        completedOrArchivedReminderLoading,
        completedOrArchivedReminderError,
        isAvailableToFetchCompletedOrArchived,
    }
}

export default connect(mapStateToProps, {
    fetchArchiveOrCompletedReminder,
    moveToDeleteReminders,
    moveToRestoreReminders,
})(ArchiveScreen)
