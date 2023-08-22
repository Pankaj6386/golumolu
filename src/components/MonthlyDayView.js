import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { scale } from 'react-native-size-matters'
import { color, text } from '../styles/basic'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Divider } from 'react-native-elements'

const monthData = []
for (let i = 1; i <= 31; i++) {
    monthData.push({ id: i, number: i })
}

const MonthlyDayView = ({
    isVisible,
    onToggleVisible,
    selectedMonthDay,
    onChangeDate,
}) => {
    return (
        <View>
            <TouchableOpacity
                onPress={() => onToggleVisible && onToggleVisible()}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 16,
                    width: '100%',
                    backgroundColor: 'white',
                }}
            >
                <Text style={styles.repet}>Each</Text>
                <Ionicons
                    name={
                        isVisible
                            ? 'caret-down-outline'
                            : 'caret-forward-outline'
                    }
                    color={isVisible ? '#828282' : '#DADADA'}
                    style={{ marginLeft: 6 }}
                    size={20}
                />
            </TouchableOpacity>
            <Divider style={styles.modalDivider} />
            <View style={styles.daysContainer}>
                {isVisible
                    ? monthData.map((item) => (
                          <View
                              key={'month' + item.id}
                              style={{
                                  width: scale(45),
                                  marginTop: scale(10),
                                  alignItems: 'center',
                                  justifyContent: 'center',
                              }}
                          >
                              <>
                                  <TouchableOpacity
                                      onPress={() => {
                                          if (
                                              selectedMonthDay.includes(
                                                  item.id
                                              ) &&
                                              selectedMonthDay.length !== 1
                                          ) {
                                              onChangeDate(
                                                  selectedMonthDay.filter(
                                                      (value) =>
                                                          value !== item.id
                                                  )
                                              )
                                          } else {
                                              onChangeDate([
                                                  ...new Set([
                                                      ...selectedMonthDay,
                                                      item.id,
                                                  ]),
                                              ])
                                          }
                                      }}
                                      style={[
                                          styles.MonthContainer,
                                          {
                                              backgroundColor: selectedMonthDay.includes(
                                                  item.id
                                              )
                                                  ? color.GM_BLUE_DEEP
                                                  : null,
                                              borderColor: selectedMonthDay.includes(
                                                  item.id
                                              )
                                                  ? color.GM_BLUE_DEEP
                                                  : '#828282',
                                          },
                                      ]}
                                  >
                                      <Text
                                          style={[
                                              styles.daysTextStyle,
                                              {
                                                  color: selectedMonthDay.includes(
                                                      item.id
                                                  )
                                                      ? '#fff'
                                                      : '#828282',
                                              },
                                          ]}
                                      >
                                          {item.number}
                                      </Text>
                                  </TouchableOpacity>
                              </>
                          </View>
                      ))
                    : null}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    daysContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
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
    repet: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    modalDivider: {
        width: '150%',
        marginTop: 16,
        alignSelf: 'center',
    },
})
export default MonthlyDayView
