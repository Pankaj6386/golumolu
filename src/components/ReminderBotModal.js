import React, { useState, Component, useCallback } from 'react'
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    Platform,
    Image,
} from 'react-native'
import Modal from 'react-native-modal'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import Constants from 'expo-constants'
import { color, text } from '../styles/basic'
import { Size, wp as WP, hp as HP } from '../asset/dimensions'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import global from '../../global'
import moment from 'moment'

function ReminderBotModal(props) {
    const reminderMessages = [
        {
            id: 1,
            type: 'minutes',
        },
        {
            id: 2,
            type: 'hours',
        },
        {
            id: 3,
            type: 'tomorrow',
        },
        {
            id: 4,
            type: '1week',
        },
        {
            id: 5,
            type: '2week',
        },
        // {
        //     id: 6,
        //     type: 'custom',
        // },
    ]

    const [reminderList, setReminderList] = useState(reminderMessages)
    const [minutes, setMinutes] = useState('')
    const [hours, setHours] = useState('')
    const [tomorrowDate, setTomorrowDate] = useState(new Date())
    const [customDate, setCustomDate] = useState(new Date())
    const [selectedType, setSelectedType] = useState('')
    const [customTime, setCustomTime] = useState(new Date())
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [isCustomDatePickerVisible, setCustomDatePickerVisible] = useState(
        false
    )
    const [selectedItem, setSelectedItem] = useState(null)
    const [showCustomFields, setShowCustomFields] = useState(false)
    // console.log('reminderUpdateData', JSON.parse(props?.reminderUpdateData))

    const showDatePicker = () => {
        setDatePickerVisibility(true)
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false)
    }

    const showCustomDatePicker = () => {
        setCustomDatePickerVisible(true)
    }

    const hideCustomDatePicker = () => {
        setCustomDatePickerVisible(false)
    }

    const handleConfirm = (date) => {
        console.log('A date has been picked: ', date)
        let newDate = new Date(date)
        newDate.setDate(newDate.getDate() + 1)
        let updatedDate = newDate.toISOString()
        setTomorrowDate(updatedDate)
        hideDatePicker()
    }

    // const handleConfirmDate = (date) => {
    //     console.log('A date has been picked: ', date)
    //     setCustomDatePickerVisible(date)
    //     hideCustomDatePicker()
    // }
    const renderOptions = (item) => {
        const isSelected = item.id === selectedItem
        return (
            <>
                <View style={styles.optContainer}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setSelectedItem(item.id)
                            setSelectedType(item.type)
                            if (item.type === 'custom') {
                                setShowCustomFields(true)
                            } else {
                                setShowCustomFields(false)
                            }
                        }}
                    >
                        <Icon
                            name={
                                isSelected
                                    ? 'radio-button-checked'
                                    : 'radio-button-unchecked'
                            }
                            style={
                                isSelected
                                    ? styles.btnChecked
                                    : styles.btnUnchecked
                            }
                        />
                    </TouchableWithoutFeedback>
                </View>
            </>
        )
    }

    const handleConfirmPress = () => {
        const currentDate = new Date()
        const newMinutes = new Date(
            new Date().getTime() + minutes * 60000
        ).toISOString()
        const newHours = new Date(
            currentDate.getTime() + hours * 3600000
        ).toISOString()
        const oneWeekLater = new Date(
            currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
        ).toISOString()
        const twoWeekLater = new Date(
            currentDate.getTime() + 14 * 24 * 60 * 60 * 1000
        ).toISOString()

        let updatedDate
        if (selectedType === 'minutes') {
            updatedDate = newMinutes
        } else if (selectedType === 'hours') {
            updatedDate = newHours
        } else if (selectedType === 'tomorrow') {
            updatedDate = tomorrowDate
        } else if (selectedType === '1week') {
            updatedDate = oneWeekLater
        } else if (selectedType === '2week') {
            updatedDate = twoWeekLater
        } else {
            return null
        }
        props.handleReminderUpdate(updatedDate)
        props.onClose()
    }

    const renderItem = ({ item }) => {
        switch (item.type) {
            case 'minutes':
                return (
                    <>
                        <View style={styles.itemContainer}>
                            {renderOptions(item)}
                            <Text
                                style={{
                                    fontSize: 20,
                                    marginLeft: WP(5),
                                }}
                            >
                                In
                            </Text>
                            <TextInput
                                onChangeText={(val) => {
                                    const parsedMinutes = parseInt(val)
                                    if (!isNaN(parsedMinutes)) {
                                        setMinutes(parsedMinutes)
                                    }
                                }}
                                placeholder="10"
                                value={minutes}
                                placeholderTextColor={
                                    color.TEXT_COLOR.PLACEHOLDER_COLOR
                                }
                                keyboardType="numeric"
                                style={styles.textInput}
                            />
                            <Text
                                style={{
                                    fontSize: 20,
                                    marginHorizontal: WP(3),
                                }}
                            >
                                minutes
                            </Text>
                        </View>
                    </>
                )
            case 'hours':
                return (
                    <>
                        <View style={styles.itemContainer}>
                            {renderOptions(item)}
                            <Text
                                style={{
                                    fontSize: 20,
                                    marginLeft: WP(5),
                                }}
                            >
                                In
                            </Text>
                            <TextInput
                                onChangeText={(val) => {
                                    const parsedMinutes = parseInt(val)
                                    if (!isNaN(parsedMinutes)) {
                                        setHours(parsedMinutes)
                                    }
                                }}
                                placeholder="1"
                                value={hours}
                                keyboardType="numeric"
                                placeholderTextColor={
                                    color.TEXT_COLOR.PLACEHOLDER_COLOR
                                }
                                style={styles.textInput}
                            />
                            <Text
                                style={{
                                    fontSize: 20,
                                    marginHorizontal: WP(3),
                                }}
                            >
                                hour(s)
                            </Text>
                        </View>
                    </>
                )
            case 'tomorrow':
                return (
                    <>
                        <View style={styles.itemContainer}>
                            {renderOptions(item)}
                            <Text style={styles.itemText}>Tomorrow at</Text>
                            <TouchableOpacity
                                onPress={showDatePicker}
                                style={styles.pickerStyle}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        textAlign: 'center',
                                    }}
                                >
                                    {moment(tomorrowDate).format('hh:mm A')}
                                </Text>

                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="time"
                                    date={new Date()}
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                />
                            </TouchableOpacity>
                        </View>
                    </>
                )
            case '1week':
                return (
                    <>
                        <View style={styles.itemContainer}>
                            {renderOptions(item)}
                            <Text style={styles.itemText}>In 1 week</Text>
                        </View>
                    </>
                )
            case '2week':
                return (
                    <>
                        <View style={styles.itemContainer}>
                            {renderOptions(item)}
                            <Text style={styles.itemText}>In 2 weeks</Text>
                        </View>
                    </>
                )

            // case 'custom':
            //     return (
            //         <>
            //             <View style={styles.itemContainer}>
            //                 {renderOptions(item)}
            //                 <Text style={styles.itemText}>Custom</Text>
            //             </View>
            //         </>
            //     )
            default:
                return null
        }
    }

    return (
        <>
            <Modal
                backdropColor={'black'}
                propagateSwipe
                backdropOpacity={0.2}
                animationInTiming={400}
                isVisible={props.isVisible}
                onBackdropPress={() => props.onClose()}
                onSwipeComplete={() => props.onClose()}
                swipeDirection={'down'}
                style={{
                    marginTop: Constants.statusBarHeight + 20,
                    borderRadius: 15,
                    margin: 0,
                }}
            >
                <View style={styles.modalView}>
                    <View
                        style={{
                            ...styles.modalContainerStyle,
                        }}
                    >
                        <View
                            style={{
                                marginVertical: 10,
                                alignSelf: 'center',
                            }}
                        >
                            <View
                                style={{
                                    width: 50,
                                    height: 4,
                                    borderRadius: 5,
                                    backgroundColor: 'lightgray',
                                }}
                            />
                        </View>
                        <Text style={styles.topHeading}>Remind Me Later</Text>
                        <View>
                            <FlatList
                                data={reminderList}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id.toString()}
                                onEndReachedThreshold={0}
                                contentContainerStyle={{ marginTop: 10 }}
                                ListFooterComponent={() => {
                                    return <></>
                                }}
                                ListHeaderComponent={() => (
                                    <View
                                        style={styles.itemSepratorStyle}
                                    ></View>
                                )}
                                ItemSeparatorComponent={() => (
                                    <View
                                        style={styles.itemSepratorStyle}
                                    ></View>
                                )}
                            />
                        </View>

                        {/* {showCustomFields ? (
                            <>
                                <View style={styles.listFooterStyle}>
                                    <Text style={styles.footerText}>
                                        Remind me again at this specific time:
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        ...styles.footerText,
                                        padding: 4,
                                        marginLeft: WP(2),
                                        marginTop: HP(1),
                                    }}
                                >
                                    Date:
                                </Text>
                                <TouchableOpacity
                                    onPress={showCustomDatePicker}
                                    style={{
                                        ...styles.pickerStyle,
                                        width: WP(40),
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-evenly',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                ...styles.footerText,
                                                padding: 0,
                                                fontSize: 17,
                                            }}
                                        >
                                            {moment(customDate).format(
                                                'MM-DD-yyyy'
                                            )}
                                        </Text>

                                        <DateTimePickerModal
                                            isVisible={
                                                isCustomDatePickerVisible
                                            }
                                            mode="date"
                                            display={
                                                Platform.OS === 'ios'
                                                    ? 'inline'
                                                    : 'default'
                                            }
                                            minimumDate={new Date()}
                                            date={Date.now()}
                                            onConfirm={handleConfirmDate}
                                            onCancel={hideCustomDatePicker}
                                        />

                                        <Image
                                            style={{
                                                height: HP(6),
                                                width: WP(6),
                                                resizeMode: 'contain',
                                            }}
                                            source={global.ASSETS.CALENDAR}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        ...styles.footerText,
                                        padding: 4,
                                        marginLeft: WP(2),
                                        marginTop: HP(1),
                                    }}
                                >
                                    Time:
                                </Text>
                                <TouchableOpacity
                                    onPress={showDatePicker}
                                    style={{
                                        ...styles.pickerStyle,
                                        width: WP(40),
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-evenly',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                ...styles.footerText,
                                                padding: 0,
                                                fontSize: 17,
                                            }}
                                        >
                                            {moment(tomorrowDate).format(
                                                'hh:mm A'
                                            )}
                                        </Text>

                                        <DateTimePickerModal
                                            isVisible={isDatePickerVisible}
                                            mode="time"
                                            date={new Date()}
                                            onConfirm={handleConfirm}
                                            onCancel={hideDatePicker}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </>
                        ) : null} */}
                        <TouchableOpacity
                            style={{}}
                            onPress={handleConfirmPress}
                            disabled={selectedType === '' ? true : false}
                        >
                            <View
                                style={{
                                    ...styles.confirmButton,
                                    backgroundColor:
                                        selectedType === ''
                                            ? 'lightgrey'
                                            : '#42C0F5',
                                }}
                            >
                                <Text style={styles.confirmButtonText}>
                                    {`Confirm`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: 'white',
        position: 'absolute',
        width: '100%',
        bottom: 0,
        borderRadius: 5,
    },
    modalContainerStyle: {
        backgroundColor: 'white',
        paddingHorizontal: wp(4.26),
        borderRadius: 15,
        padding: 5,
        height: hp(60),
    },
    itemSepratorStyle: {
        borderWidth: 0.5,
        borderColor: '#F1EEEE',
    },
    itemContainer: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        width: WP(15),
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#E4E9F2',
        padding: 15,
        fontSize: 16,
        alignSelf: 'center',
        marginLeft: WP(3),
        textAlign: 'center',
    },
    pickerStyle: {
        height: HP(6),
        width: WP(30),
        borderWidth: 0.5,
        marginHorizontal: WP(5),
        borderRadius: 5,
        justifyContent: 'center',
        borderColor: '#F1EEEE',
    },
    itemText: {
        fontSize: 20,
        marginLeft: WP(5),
    },
    topHeading: {
        textAlign: 'center',
        fontFamily: text.FONT_FAMILY.BOLD,
        fontSize: 18,
    },
    listFooterStyle: {
        backgroundColor: '#F7F7F7',
        height: HP(10),
        width: WP(100),
        // marginBottom: HP(8),
    },
    footerText: {
        color: '#999999',
        fontSize: 14,
        fontFamily: 'SFProDisplay-Regular',
        fontWeight: '400',
        padding: HP(2),
    },
    optContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: hp(0.85),
    },
    confirmButton: {
        width: WP(90),
        height: 40,
        borderRadius: 3,
        backgroundColor: '#42C0F5',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        // position: 'absolute',
        top: HP(3),
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'SFProDisplay-Semibold',
        fontWeight: '400',
    },
    btnChecked: {
        color: color.GM_BLUE,
        fontSize: hp(2.5),
    },
    btnUnchecked: {
        color: '#BDBDBD',
        fontSize: hp(2.5),
    },
})

export default ReminderBotModal
