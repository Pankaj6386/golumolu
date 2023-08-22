/** @format */

import React, { Component } from 'react'
import {
    Image,
    Platform,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { Divider, Overlay } from 'react-native-elements'
import { scale, ScaledSheet } from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons'
import global from '../../../../global'
import { Actions } from 'react-native-router-flux'
import { color, text } from '../../../styles/basic'
import { setAdjustNothing, setAdjustResize } from 'rn-android-keyboard-adjust'
import { withNavigation } from 'react-navigation'
import SyncCalender from '../../../components/SyncCalender'
import ReminderPopup from '../../../components/ReminderPopup'
import { connect } from 'react-redux'
import {
    createNewReminder,
    fetchReminderGoals,
    prefillCustomReminderForm,
    searchReminder,
    updateReminder,
} from '../../../actions/ReminderActions'
import AttachGoal from '../../Post/AttachGoal'
import { MenuProvider } from 'react-native-popup-menu'
import {
    resetCustomReminderForms,
    resetReminderField,
    setCustomReminderForms,
    setSelectedGoal,
} from '../../../reducers/ReminderFormReducers'
import { refreshMyUserGoals } from '../../../redux/modules/goal/GoalActions'
import LoadingModal from '../../Common/Modal/LoadingModal'
import MESSAGE_UI3 from '../../../asset/image/messageUI3.png'
import ProfileInfoTooltip from '../../../components/ProfileInfoTooltip'
import ReminderSuccessView from '../../../components/ReminderSuccessView'
import ReminderForPopup from '../../../components/ReminderForPopup'
import { SceneMap, TabView } from 'react-native-tab-view'
import SelfReminder from '../../../components/SelfReminder'
import ReminderForOther from '../../../components/ReminderForOther'
import ReminderSearchBar from '../../../components/ReminderSearchBar'
import {
    setReminderSearchText,
    setReminderSelectedTabIndex,
} from '../../../reducers/ReminderReducers'
import ReminderTabButton from '../../../components/ReminderTabButton'

class ReminderDashboard extends Component {
    constructor(props) {
        super(props)
        this.goalModalFoReminderRef
        this.createPostModal
        this.state = {
            visible: false,
            load: false,
            extendedGoal: this.props?.goalIdToOpen
                ? [this.props?.goalIdToOpen]
                : [],
            goalModal: false,
            calenderSyncVisible: false,
            isDefaultCalender: false,
            selectedReminderData: null,
            selectedGoalData: null,
            showReminderPopup: false,
            isLoading: false,
            successPopup: false,
            successMessage: '',
            hideCustomReminderCheckbox: false,
            showTooltip: false,
        }
        this.onPressReminderItem = this.onPressReminderItem.bind(this)
        this.showSuccessPopup = this.showSuccessPopup.bind(this)
    }

    componentDidMount() {
        this.props.setReminderSearchText('')
    }

    onPressReminderItem(goalData, selectedReminder) {
        if (selectedReminder?.reminder_type !== 'custom') {
            this.setState({
                showReminderPopup: true,
                selectedReminderData: goalData?.active_reminders?.length
                    ? goalData?.active_reminders
                    : null,
                selectedGoalData: goalData,
                hideCustomReminderCheckbox: true,
            })
        } else {
            this.props.prefillCustomReminderForm(selectedReminder)
            this.props.setSelectedGoal(goalData)
            Actions.push('CreateReminder', { selectedReminder })
        }
    }

    onSearchTextChange = (value) => {
        this.props.searchReminder(0, 10, value)
    }

    async onCreateOrUpdateReminder(isCustomSelected) {
        const { selectedReminderData, selectedGoalData } = this.state
        if (selectedReminderData && selectedGoalData) {
            this.setState({ isLoading: true })
            await this.props.updateReminder(
                selectedReminderData,
                selectedGoalData
            )
        } else if (selectedGoalData) {
            this.setState({ isLoading: true })
            await this.props.createNewReminder(selectedGoalData?._id)
        }
        this.props.fetchReminderGoals()
        this.props.refreshMyUserGoals()
        this.setState({ isLoading: false })
        if (isCustomSelected) {
            this.props.setSelectedGoal(selectedGoalData)
            Actions.push('CreateReminder')
        }
    }

    async showSuccessPopup(message) {
        if (message) {
            this.setState({ successPopup: true, successMessage: message })
            setTimeout(() => {
                this.setState({
                    successPopup: false,
                })
            }, 5000)
        }
    }

    renderEmptyView() {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No Reminders found</Text>
            </View>
        )
    }

    _renderHeader = (props) => {
        return <ReminderTabButton props={props} />
    }

    _renderScene = SceneMap({
        forme: () => (
            <SelfReminder
                onPressReminderItem={this.onPressReminderItem}
                showSuccessPopup={this.showSuccessPopup}
                initialExtendedGoal={this.state.extendedGoal}
            />
        ),
        forother: () => <ReminderForOther />,
    })

    render() {
        const { reminderGoals, reminderSearchText } = this.props
        const {
            isLoading,
            showTooltip,
            successPopup,
            successMessage,
        } = this.state
        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <SafeAreaView style={{ backgroundColor: color.GM_BLUE }} />
                <SafeAreaView style={styles.safeAreaView}>
                    <LoadingModal visible={isLoading} />
                    <View style={styles.container}>
                        {successPopup && (
                            <ReminderSuccessView
                                onClose={() => {}}
                                message={successMessage}
                            />
                        )}
                        <View style={styles.container}>
                            <View style={styles.headerContainer}>
                                <Ionicons
                                    onPress={() => Actions.pop()}
                                    name="chevron-back"
                                    size={26}
                                    color="#FFF"
                                />
                                <Text style={styles.headerText}>
                                    Reminder Dashboard
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ visible: true })
                                    }}
                                >
                                    <Ionicons
                                        name="ios-ellipsis-horizontal"
                                        size={26}
                                        color="#FFF"
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.searchView}>
                                <ReminderSearchBar
                                    value={reminderSearchText}
                                    onChangeText={this.onSearchTextChange}
                                    placeholder={'Search'}
                                />
                            </View>
                            <TabView
                                navigationState={this.props.reminderTab}
                                renderScene={this._renderScene}
                                renderTabBar={this._renderHeader}
                                useNativeDriver
                                swipeEnabled={false}
                            />
                            <Overlay
                                visible={this.state.visible}
                                onBackdropPress={() => {
                                    this.setState({ visible: false })
                                }}
                                overlayStyle={{
                                    borderRadius: 10,
                                    alignSelf: 'flex-end',
                                    position: 'absolute',
                                    top: scale(100),
                                }}
                            >
                                <View style={styles.modalContainer}>
                                    {/*<TouchableOpacity*/}
                                    {/*    onPress={() => {*/}
                                    {/*        this.setState({*/}
                                    {/*            visible: false,*/}
                                    {/*            isDefaultCalender: false,*/}
                                    {/*            calenderSyncVisible: true,*/}
                                    {/*        })*/}
                                    {/*    }}*/}
                                    {/*    style={styles.elementStyle}*/}
                                    {/*>*/}
                                    {/*    <Image*/}
                                    {/*        source={global.ASSETS.SYNC}*/}
                                    {/*        style={styles.iconStyle}*/}
                                    {/*    />*/}
                                    {/*    <Text style={styles.modalText}>*/}
                                    {/*        Sync All*/}
                                    {/*    </Text>*/}
                                    {/*</TouchableOpacity>*/}
                                    {/*<Divider style={styles.divider} />*/}
                                    <TouchableOpacity
                                        onPress={() => [
                                            Actions.push('ArchiveScreen'),
                                            this.setState({
                                                visible: false,
                                            }),
                                        ]}
                                        style={styles.elementStyle}
                                    >
                                        <Image
                                            source={global.ASSETS.ARCHIVE}
                                            style={styles.iconStyle}
                                        />
                                        <Text style={styles.modalText}>
                                            View Archives
                                        </Text>
                                    </TouchableOpacity>
                                    {/*<Divider style={styles.divider} />*/}
                                    {/*<TouchableOpacity*/}
                                    {/*    onPress={() => {*/}
                                    {/*        this.setState({*/}
                                    {/*            visible: false,*/}
                                    {/*            isDefaultCalender: true,*/}
                                    {/*            calenderSyncVisible: true,*/}
                                    {/*        })*/}
                                    {/*    }}*/}
                                    {/*    style={styles.elementStyle}*/}
                                    {/*>*/}
                                    {/*    <Image*/}
                                    {/*        source={*/}
                                    {/*            global.ASSETS*/}
                                    {/*                .SELECT_CALENDAR*/}
                                    {/*        }*/}
                                    {/*        style={styles.iconStyle}*/}
                                    {/*    />*/}
                                    {/*    <Text style={styles.modalText}>*/}
                                    {/*        Select Default Calendar*/}
                                    {/*    </Text>*/}
                                    {/*</TouchableOpacity>*/}
                                </View>
                            </Overlay>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                                this.props.resetReminderField()
                                this.props.resetCustomReminderForms()
                                this.setState({ showReminderForPopup: true })
                            }}
                            style={styles.fabStyle}
                        >
                            <Ionicons
                                style={styles.fabButtonStyle}
                                name="ios-add-outline"
                                size={35}
                                color="#fff"
                            />
                        </TouchableOpacity>

                        <Overlay
                            visible={this.state.goalModal}
                            onRequestClose={() => {
                                this.setState({ goalModal: false })
                            }}
                            overlayStyle={{
                                backgroundColor: '#fff',
                                width: 270,
                                height: 250,
                                borderRadius: 10,
                                alignItems: 'center',
                                // bottom: 0,
                                // borderTopLeftRadius: scale(10),
                                // borderTopRightRadius: scale(10),
                            }}
                        >
                            <View>
                                <Ionicons
                                    onPress={() => {
                                        this.setState({ goalModal: false })
                                    }}
                                    style={{ alignSelf: 'flex-end' }}
                                    name="close"
                                    size={25}
                                    color="#111"
                                />
                                <View
                                    style={[
                                        styles.modalContainer,
                                        { marginTop: 30 },
                                    ]}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ goalModal: false })
                                            this.goalModalFoReminderRef.open()
                                        }}
                                        style={[
                                            styles.goalModalTitleStyle,
                                            {
                                                backgroundColor:
                                                    color.GM_BLUE_DEEP,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.modalTitleText,
                                                { color: '#fff' },
                                            ]}
                                        >
                                            Existing Goal
                                        </Text>
                                    </TouchableOpacity>
                                    <Divider style={styles.divider} />
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ goalModal: false })
                                            // const pageId = constructPageId('user')
                                            Actions.push('createGoalModal')
                                        }}
                                        style={styles.goalModalTitleStyle}
                                    >
                                        <Text style={styles.modalTitleText}>
                                            New Goal
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Overlay>
                        <AttachGoal
                            onRef={(ref) => (this.goalModalFoReminderRef = ref)}
                            title="Create Reminder for which goal?"
                            onSelect={(item) => {
                                this.setState({
                                    showReminderPopup: true,
                                    hideCustomReminderCheckbox: false,
                                    selectedReminderData: item?.active_reminders
                                        ?.length
                                        ? item?.active_reminders
                                        : null,
                                    selectedGoalData: item,
                                })
                            }}
                            onOpen={() => {
                                if (Platform.OS === 'android') {
                                    setAdjustNothing()
                                }
                            }}
                            onClose={() => {
                                if (Platform.OS === 'android') {
                                    setAdjustResize()
                                }
                            }}
                        />
                        <ReminderPopup
                            isVisible={this.state.showReminderPopup}
                            onClose={(isButtonClicked, isCustomSelected) => {
                                this.setState({
                                    showReminderPopup: false,
                                })
                                if (isButtonClicked) {
                                    this.setState({
                                        checkDateForReminder: true,
                                    })
                                    this.onCreateOrUpdateReminder(
                                        isCustomSelected
                                    ).then()
                                }
                            }}
                            reminderData={this.state.selectedReminderData}
                            endDate={this.state.selectedGoalData?.end}
                            startDate={this.state.selectedGoalData?.start}
                            isHideCustomReminder={
                                this.state.hideCustomReminderCheckbox
                            }
                        />
                        <ReminderForPopup
                            isVisible={this.state.showReminderForPopup}
                            onClose={(isButtonClicked, selectedFor) => {
                                this.setState({
                                    showReminderForPopup: false,
                                })
                                if (isButtonClicked) {
                                    if (selectedFor === 1) {
                                        this.setState({
                                            goalModal: true,
                                        })
                                    } else {
                                        this.props.setCustomReminderForms({
                                            reminder_for: selectedFor,
                                        })
                                        Actions.push('CreateReminder')
                                    }
                                }
                            }}
                        />
                        <SyncCalender
                            isVisible={this.state.calenderSyncVisible}
                            onClose={() => {
                                this.setState({ calenderSyncVisible: false })
                            }}
                            calendar={this.state.isDefaultCalender}
                        />
                        {reminderGoals.length > 0 && showTooltip && (
                            <ProfileInfoTooltip
                                text={
                                    "Tap on reminder to edit it.\nSwipe left to archive.\nSwipe right to 'Mark as Done' or reveal other shortcuts!"
                                }
                                width={'78%'}
                                height={150}
                                top={180}
                                left={50}
                                infoKey={'reminder_dashboard'}
                                image={MESSAGE_UI3}
                                padding={15}
                                crossTop={25}
                                crossRight={20}
                            />
                        )}
                    </View>
                </SafeAreaView>
            </MenuProvider>
        )
    }
}

const styles = ScaledSheet.create({
    safeAreaView: {
        flex: 1,
    },
    searchView: {
        height: 62,
        width: '100%',
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
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
        color: '#FFF',
        fontFamily: text.FONT_FAMILY.BOLD,
    },
    emptyText: {
        fontSize: '16@s',
        color: '#000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    goalModalTitleStyle: {
        borderWidth: 1,
        borderColor: color.GM_BLUE_DEEP,
        borderRadius: 5,
        width: 220,
        height: 45,
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#27AE60',
        borderRadius: 10,
        width: '95%',
        height: 50,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        width: '95%',
        marginTop: 10,
        justifyContent: 'center',
        borderRadius: 100,
        height: 35,
    },
    publicText: {
        fontWeight: '600',
        fontSize: '11@s',
        color: '#FFF',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    UPBORDER: {
        borderWidth: '2@s',
        marginTop: '10@s',
        alignSelf: 'center',
        borderColor: '#C4C4C4',
        width: '40@s',
        borderRadius: '32@s',
    },
    CROSSBAG: {
        alignSelf: 'flex-end',
        width: '26@s',
        height: '26@s',
        marginHorizontal: '20@s',
        // bottom: '5@s',
    },
    setReminderstext: {
        fontSize: '16@s',
        fontWeight: '600',
        color: '#000000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        bottom: 10,
    },
    modalTitleText: {
        color: color.GM_BLUE_DEEP,
        textAlign: 'center',
        fontWeight: '500',
        fontSize: '18@s',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    fabStyle: {
        position: 'absolute',
        bottom: '20@s',
        right: '20@s',
        backgroundColor: color.GM_BLUE,
        width: '56@s',
        height: '56@s',
        borderRadius: 50,
        justifyContent: 'center',
    },
    fabButtonStyle: {
        alignSelf: 'center',
    },

    modalContainer: {
        backgroundColor: '#fff',
        // width: '300@s',
        padding: '10@s',
    },
    modalText: {
        fontSize: '18@s',
        fontWeight: '500',
        marginHorizontal: '15@s',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    iconStyle: {
        width: '25@s',
        height: '25@s',
    },
    elementStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    listHeaderContainer: {
        paddingHorizontal: '15@s',
        flexDirection: 'row',
        alignItems: 'center',
        // marginTop: '10@s',
        paddingTop: '10@s',
        borderLeftColor: color.GM_BLUE_DEEP,
        paddingBottom: '10@s',
    },
    listHeaderText: {
        fontSize: '20@s',
        fontWeight: '600',
        color: '#000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateTextStyle: {
        fontWeight: '400',
        fontSize: '16@s',
        marginHorizontal: '5@s',
        fontFamily: text.FONT_FAMILY.REGULAR,
    },

    divider: {
        marginTop: '10@s',
    },

    // overlayStyle: {
    //     position: 'absolute',
    //     bottom: 0,
    //     borderRadius: '16@s',
    // },
    goalTitleText: {
        fontSize: '14@s',
        fontWeight: '400',
        fontFamily: text.FONT_FAMILY.REGULAR,
    },
})

const mapStateToProps = (state) => {
    const { userId } = state.user
    const {
        reminderGoals,
        reminderGoalLoading,
        isAvailableReminderGoals,
        reminderTab,
        reminderSearchText,
    } = state.reminder
    return {
        userId,
        reminderGoals,
        reminderGoalLoading,
        isAvailableReminderGoals,
        reminderTab,
        reminderSearchText,
    }
}

export default connect(mapStateToProps, {
    fetchReminderGoals,
    resetReminderField,
    resetCustomReminderForms,
    createNewReminder,
    updateReminder,
    refreshMyUserGoals,
    setSelectedGoal,
    prefillCustomReminderForm,
    setCustomReminderForms,
    setReminderSelectedTabIndex,
    setReminderSearchText,
    searchReminder,
})(withNavigation(ReminderDashboard))
