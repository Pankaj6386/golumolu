/** @format */

import * as React from 'react'
import {
    View,
    useWindowDimensions,
    Text,
    // Dimensions,
    TouchableOpacity,
} from 'react-native'
import { TabView, TabBar } from 'react-native-tab-view'
import { DropDownHolder } from '../Common/Modal/DropDownModal'
import Calendar from './Calender'
import BookingSlot from './DaySlot'
// const windowHeight = Dimensions.get('window').height

export default function TimePickers({ time, setTime, onConfirmButtonPress }) {
    const layout = useWindowDimensions()

    const [index, setIndex] = React.useState(0)
    const [selectedDays, setselectedDays] = React.useState([])
    const [selectedDates, setselectedDates] = React.useState()
    const [routes] = React.useState([
        { key: 'first', title: 'Weekly' },
        { key: 'second', title: 'Monthly' },
    ])

    const handleConfirmButton = () => {
        // console.log('DATESSSS', selectedDates)
        if (selectedDays.length === 0) {
            return setTimeout(() => {
                DropDownHolder.alert(
                    'error',
                    '',
                    'You must select at least one day and time in order to continue.'
                )
            }, 500)
        } else if (selectedDays.length >= 1 && selectedDates != undefined) {
            return setTimeout(() => {
                DropDownHolder.alert(
                    'error',
                    '',
                    'Please select either Weekly check-in days or Monthly check-in dates. Unable to select both types.'
                )
            }, 500)
        } else {
            onConfirmButtonPress()
        }
    }

    const renderTabs = ({ route }) => {
        switch (route.key) {
            case 'first':
                return (
                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <BookingSlot
                            onSelect={(days) => {
                                setselectedDays(days)
                            }}
                        />
                    </View>
                )

            case 'second':
                return (
                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <Calendar
                            onSelect={(dates) => {
                                setselectedDates(dates)
                            }}
                        />
                    </View>
                )
        }
    }

    const _handleChangeTab = (index) => {
        setIndex(index)
    }

    const renderTabBar = (props) => {
        // const { routes } = state
        return (
            <TabBar
                renderLabel={({ route, focused, color }) => (
                    <Text
                        style={{
                            color: focused ? 'white' : '#828282',
                            marginBottom: 20,
                            bottom: 3,
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: focused ? '400' : '300',
                        }}
                    >
                        {route.title}
                    </Text>
                )}
                {...props}
                indicatorStyle={{
                    backgroundColor: '#42C0F5',
                    height: 34,
                    borderRadius: 30,
                }}
                style={{
                    backgroundColor: '#F2F2F2',
                    borderRadius: 50,
                    width: '90%',
                    height: 34,
                    justifyContent: 'center',
                    alignSelf: 'center',
                }}
            />
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white', marginTop: 12 }}>
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderTabs}
                onIndexChange={_handleChangeTab}
                initialLayout={{ width: layout.width }}
            />

            <TouchableOpacity
                style={{
                    backgroundColor: '#42C0F5',
                    width: '90%',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    height: 40,
                    borderColor: '#42C0F5',
                    borderWidth: 2,
                    borderRadius: 5,
                    marginBottom: 15,
                }}
                onPress={handleConfirmButton}
            >
                <Text
                    style={{
                        textAlign: 'center',
                        color: 'white',
                        fontSize: 20,
                        fontWeight: '500',
                    }}
                >
                    Confirm
                </Text>
            </TouchableOpacity>
        </View>
    )
}
