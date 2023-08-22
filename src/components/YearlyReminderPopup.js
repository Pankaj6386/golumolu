import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView,
    Image,
} from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import { scale } from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Divider } from 'react-native-elements'
import { Picker } from '@react-native-picker/picker'
import { text } from '../styles/basic'
import global from '../../global'
import { getSelectedYearlyText } from '../Utils/HelperMethods'
import YearlyOnTheView from './YearlyOnTheView'

const YearlyReminderPopup = ({ isVisible, onClose }) => {
    const refRBSheet = useRef(null)
    const [category, setCategory] = useState({
        every: true,
        onThe: true,
    })

    useEffect(() => {
        if (isVisible) {
            refRBSheet.current?.open()
        }
    }, [isVisible])

    const [everyWeek, setEveryWeek] = useState('1')
    const [selectedWeek, setSelectedWeek] = useState('1')
    const [selectedDay, setSelectedDay] = useState('1')
    const [selectedMonth, setSelectedMonth] = useState('1')

    const onPressCategory = useCallback((key) => {
        setCategory((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }))
    }, [])

    const onCloseBottomSheet = useCallback(() => {
        onClose && onClose(everyWeek, selectedWeek, selectedDay, selectedMonth)
    }, [onClose, everyWeek, selectedWeek, selectedDay, selectedMonth])

    return (
        <RBSheet
            ref={(ref) => (refRBSheet.current = ref)}
            closeOnDragDown={true}
            dragFromTopOnly={true}
            closeOnPressMask={true}
            customStyles={{
                container: {
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                    height: '90%',
                },
            }}
            animationType={'slide'}
            onClose={onCloseBottomSheet}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        refRBSheet.current?.close()
                    }}
                >
                    <Image
                        style={styles.iconStyle}
                        source={global.ASSETS.LEFTKEY}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Repeat</Text>
                <View style={styles.iconStyle} />
            </View>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 16,
                    paddingBottom: 20,
                }}
                bounces={false}
            >
                <View>
                    <TouchableOpacity
                        onPress={() => onPressCategory('every')}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: scale(20),
                        }}
                    >
                        <Text style={styles.repet}>Every</Text>
                        <Ionicons
                            name={
                                category?.every
                                    ? 'caret-down-outline'
                                    : 'caret-forward-outline'
                            }
                            color={category?.every ? '#828282' : '#DADADA'}
                            size={20}
                            style={{ marginLeft: 6 }}
                        />
                    </TouchableOpacity>
                    <Divider style={styles.modalDivider} />
                    {category?.every ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-evenly',
                                height: 235,
                                alignSelf: 'center',
                                overflow: 'hidden',
                            }}
                        >
                            <Divider />
                            <Picker
                                style={{ width: scale(100) }}
                                selectedValue={everyWeek}
                                onValueChange={(itemValue) => {
                                    setEveryWeek(itemValue)
                                }}
                            >
                                <Picker.Item label="1" value="1" />
                                <Picker.Item label="2" value="2" />
                                <Picker.Item label="3" value="3" />
                                <Picker.Item label="4" value="4" />
                                <Picker.Item label="5" value="5" />
                                <Picker.Item label="6" value="6" />
                                <Picker.Item label="7" value="7" />
                            </Picker>
                            <Divider />
                            <Text style={[styles.NOTIFICATION]}>
                                {everyWeek === '1' ? `year` : `years`}
                            </Text>
                            <Divider />
                        </View>
                    ) : null}

                    <View
                        style={{
                            backgroundColor: '#D1D3D9',
                            width: '120%',
                            alignSelf: 'center',
                            height: scale(50),
                        }}
                    >
                        <Text
                            style={{
                                marginHorizontal: scale(35),
                                fontSize: scale(15),
                            }}
                        >
                            Reminder will be sent every{' '}
                            {everyWeek === '1'
                                ? everyWeek + ' ' + `year`
                                : everyWeek + ' ' + `years`}{' '}
                            on the{' '}
                            {getSelectedYearlyText(
                                selectedWeek,
                                selectedDay,
                                selectedMonth
                            )}
                        </Text>
                    </View>
                    <YearlyOnTheView
                        isVisible={category.onThe}
                        onToggleVisible={() => onPressCategory('onThe')}
                        selectedWeek={selectedWeek}
                        onSelectedWeek={setSelectedWeek}
                        selectedDay={selectedDay}
                        onSelectedDay={setSelectedDay}
                        selectedMonth={selectedMonth}
                        onSelectedMonth={setSelectedMonth}
                    />
                </View>
            </ScrollView>
        </RBSheet>
    )
}
const styles = StyleSheet.create({
    repet: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    modalDivider: {
        width: '150%',
        marginTop: 10,
        alignSelf: 'center',
    },
    NOTIFICATION: {
        marginHorizontal: 16,
        fontSize: 16,
        fontWeight: '500',
        color: '#777777',
        textAlignVertical: 'center',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    MonthContainer: {
        borderWidth: 0.6,
        borderRadius: 40,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#828282',
        // backgroundColor: 'red',
    },
    daysTextStyle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#828282',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    header: {
        height: 30,
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        textAlignVertical: 'center',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    iconStyle: {
        height: 16,
        width: 16,
        resizeMode: 'contain',
    },
})
export default YearlyReminderPopup
