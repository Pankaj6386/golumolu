/** @format */

import moment from 'moment'

const weekData = {
    '1': 'first',
    '2': 'second',
    '3': 'third',
    '4': 'fourth',
    '5': 'fifth',
}

const dayNames = {
    '0': 'Sunday',
    '1': 'Monday',
    '2': 'Tuesday',
    '3': 'Wednesday',
    '4': 'Thursday',
    '5': 'Friday',
    '6': 'Saturday',
}

const monthData = {
    '1': 'January',
    '2': 'February',
    '3': 'March',
    '4': 'April',
    '5': 'May',
    '6': 'June',
    '7': 'July',
    '8': 'August',
    '9': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
}

const helperMethods = {
    /**
     * @param Date // date from which difference is to calculated.
     * @param String// selects the return value type either days or weeks
     * @returns the difference in days or week
     */
    getTimeDifference(date, valueType) {
        let a = moment(date)
        let b = moment(Date.now())
        return b.diff(a, valueType)
    },
    /**
     * @param Array // array with multiple values
     * @returns any random value from the array
     */
    getRandomValue(array) {
        return array[Math.floor(Math.random() * array.length)]
    },
    /**
     * @param String // mongoose object ID as string
     * @returns date encoded in mongoose object ID
     */
    getObjectIdTime(id) {
        let timeStamp = parseInt(id.substr(0, 8), 16) * 1000
        return new Date(timeStamp)
    },
    /**
     * Ex Input: 'Hey there, {{getUserName}}!' --> Ex Output: 'Hey there, Revanth Sakthi!'
     * @param  text - predefined string with variables outlined by {{variableName}}
     * @param  user - user object contains all the info about the user
     * @returns {string} - string with all variables evaluated
     */
    parseExpressionAndEval(text, user) {
        if (!text) return ''
        let left = []
        let right = text
        while (right.indexOf('{{') != -1) {
            let oI = right.indexOf('{{')
            let cI = right.indexOf('}}', oI)
            const variable = right.substring(oI + 2, cI)
            left.push(right.substring(0, oI))
            // console.log('\nFunction name from variable methods:', variable)
            if (variable in variableMethods) {
                let res = variableMethods[variable](user)
                left.push(res)
            } else {
                left.push(variable)
            }
            right = right.substring(cI + 2)
        }
        return left.join('') + right
    },
}

const variableMethods = {
    /**
     * @param String - string which contains full name of user
     * @returns first name of the user
     */
    firstNameCaps(user) {
        if (user.user.name) {
            // console.log('This is the user:', user)
            let path = user?.user?.name?.split(/(\s+)/).filter(function (e) {
                return e.trim().length > 0
            })
            return path[0].toUpperCase()
        } else return
    },
    /**
     * @param String - string which contains full name of user
     * @returns first name of the user
     */
    firstname(user) {
        if (user.user.name) {
            // console.log('This is the user:', user)
            let path = user?.user?.name?.split(/(\s+)/).filter(function (e) {
                return e.trim().length > 0
            })
            return path[0]
        } else return
    },
    /**
     * @param String - string which contains full name of user
     * @returns first name of the user
     */
    getFirstName(name) {
        let path = name?.split(/(\s+)/).filter(function (e) {
            return e.trim().length > 0
        })
        return path ? path[0] : null
    },

    createArray(number, interval = 1) {
        let tempArray = []
        for (let i = 1; i <= number; i++) {
            if (i % interval === 0) {
                tempArray.push(i + '')
            }
        }
        return tempArray
    },
    getReminderMinutes() {
        return ['5', '10', '15', '20', '30', '60', '120']
    },
    millisToMinutesAndSeconds(millis) {
        const minutes = Math.floor(millis / 60000)
        const seconds = ((millis % 60000) / 1000).toFixed(0)
        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    },
    numberSuffix(number) {
        const d = Number(number)
        if (d > 3 && d < 21) return `${d}th`
        switch (d % 10) {
            case 1:
                return `${d}st`
            case 2:
                return `${d}nd`
            case 3:
                return `${d}rd`
            default:
                return `${d}th`
        }
    },
    createCurrentDateWith(hours, minutes, initDate) {
        const date = initDate ? new Date(initDate) : new Date()
        date.setHours(hours, minutes)
        return date
    },
    getSelectedYearlyText(week, day, month) {
        return `${weekData[week] || 'first'} ${dayNames[day] || 'Month'} in ${
            monthData[month] || 'January'
        }`
    },
    convertDateToAmOrPm(date, isAm) {
        const newDate = moment(date)
        if (newDate.format('A') === 'AM' && isAm) {
            return newDate.toDate()
        } else if (newDate.format('A') === 'AM' && !isAm) {
            return newDate.clone().add(12, 'hours')
        }
        if (newDate.format('A') === 'PM' && !isAm) {
            return newDate.toDate()
        } else if (newDate.format('A') === 'PM' && isAm) {
            return newDate.clone().subtract(12, 'hours')
        }
    },
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    },
    getExceptDateText(exceptionDates) {
        if (Array.isArray(exceptionDates)) {
            return exceptionDates
                .map((item) => {
                    if (
                        moment(item.fromDate).isValid() &&
                        moment(item.toDate).isValid()
                    ) {
                        const fromDate = moment(item.fromDate).format(
                            'MMMM DD, YYYY'
                        )
                        const toDate = moment(item.toDate).format(
                            'MMMM DD, YYYY'
                        )
                        return `${fromDate} to ${toDate}`
                    }
                    return ''
                })
                .join('; ')
        }
        return ''
    },

    getExceptTimeText(exceptionTimes) {
        if (Array.isArray(exceptionTimes)) {
            return exceptionTimes
                .map((item) => {
                    const fromTime = moment(item?.fromTime)
                    const toTime = moment(item?.toTime)
                    if (fromTime && item.fromTime) {
                        const fromTimeText = fromTime.format('hh:mma')
                        const toTimeText = toTime.format('hh:mma')
                        return `${fromTimeText} to ${toTimeText}`
                    }
                    return ''
                })
                .join('; ')
        }
        return ''
    },
    getReminderTimeForCustom({
        type,
        startDate,
        everyWeek,
        weeklySelectedDays,
        monthlySelectedDays,
        everyMonth,
        customEvery,
        everyMonthWeekDay,
        monthlyWeekDay,
        customEveryUnit,
        exceptionDates,
        exceptionTimes,
        everyYear,
        yearlyWeek,
        yearlyDay,
        yearlyMonth,
    }) {
        const date = moment(startDate)
        const tempMonthlyDays = Array.isArray(monthlySelectedDays)
            ? [...monthlySelectedDays]
            : []
        const selectedMonthDays = tempMonthlyDays
            .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
            .map((item) => variableMethods.numberSuffix(item))
            .join(', ')
        const exceptDateText = Array.isArray(exceptionDates)
            ? variableMethods.getExceptDateText(exceptionDates)
            : ''
        const finalExceptDateText = exceptDateText
            ? `except from ${exceptDateText}`
            : ''
        const exceptTimeText = Array.isArray(exceptionTimes)
            ? variableMethods.getExceptTimeText(exceptionTimes)
            : ''
        const finalExceptTimeText = exceptTimeText
            ? `except from ${exceptTimeText}`
            : ''
        switch (type) {
            case 'never':
                return `On ${date.format('MMMM DD, YYYY | HH:mm A')}`
            case 'daily':
                return `Daily at ${date.format('HH:mm A')}`
            case 'weekly':
                const selectedWeekDays = Array.isArray(weeklySelectedDays)
                    ? weeklySelectedDays
                          .map((item) => dayNames[item])
                          .join(', ')
                    : ''
                return `Every ${
                    everyWeek !== '1' ? `${everyWeek} weeks on ` : ''
                }${selectedWeekDays} at ${date.format('HH:mm A')}`
            case 'monthly':
                if (everyMonthWeekDay && monthlyWeekDay) {
                    return `Every ${
                        everyMonth !== '1' ? everyMonth + ' ' : ''
                    }month${everyMonth !== '1' ? 's' : ''} on the ${
                        weekData[everyMonthWeekDay]
                    } ${dayNames[monthlyWeekDay]} at ${date.format('HH:mm A')}`
                }
                return `Every ${
                    everyMonth !== '1' ? everyMonth + ' ' : ''
                }month${
                    everyMonth !== '1' ? 's' : ''
                } on the ${selectedMonthDays} at ${date.format('HH:mm A')}`

            case 'yearly':
                return `Every ${everyYear !== '1' ? everyYear + ' ' : ''}year${
                    everyYear !== '1' ? 's' : ''
                } on ${date.format('MMMM DD [at] HH:mm A')}`
            case 'custom':
                switch (customEveryUnit) {
                    case 'day':
                        if (customEvery === '1') {
                            return `Daily at ${date.format(
                                'HH:mm A'
                            )} ${finalExceptDateText}`
                        }
                        return `Every ${customEvery} days at ${date.format(
                            'HH:mm A'
                        )} ${finalExceptDateText}`
                    case 'week':
                        const selectedWeekDays = Array.isArray(
                            weeklySelectedDays
                        )
                            ? weeklySelectedDays
                                  .map((item) => dayNames[item])
                                  .join(', ')
                            : ''
                        return `Every ${
                            customEvery !== '1'
                                ? `${customEvery} weeks on `
                                : ''
                        }${selectedWeekDays} at ${date.format(
                            'HH:mm A'
                        )} ${finalExceptDateText}`

                    case 'hour':
                        return `Every ${
                            customEvery !== '1' ? customEvery + ' ' : ''
                        }hour${
                            customEvery !== '1' ? 's' : ''
                        } ${finalExceptTimeText}`
                    case 'minute':
                        return `Every ${customEvery} minutes ${finalExceptTimeText}`
                    case 'month':
                        if (everyMonthWeekDay && monthlyWeekDay) {
                            return `Every ${
                                customEvery !== '1' ? customEvery + ' ' : ''
                            }month${customEvery !== '1' ? 's' : ''} on the ${
                                weekData[everyMonthWeekDay]
                            } ${dayNames[monthlyWeekDay]} at ${date.format(
                                'HH:mm A'
                            )}`
                        }
                        return `Every ${
                            customEvery !== '1' ? customEvery : ''
                        } month${
                            customEvery !== '1' ? 's' : ''
                        } on the ${selectedMonthDays} at ${date.format(
                            'HH:mm A'
                        )}`
                    case 'year':
                        return `Every ${
                            customEvery !== '1' ? customEvery + ' ' : ''
                        }year${
                            customEvery !== '1' ? 's' : ''
                        } on the ${variableMethods.getSelectedYearlyText(
                            yearlyWeek,
                            yearlyDay,
                            yearlyMonth
                        )} at ${date.format('HH:mm A')}`
                    default:
                        return 'Reminder: '
                }

            default:
                return 'Reminder: '
        }
    },

    isValidEmail(email) {
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
        return reg.test(email)
    },
    isValidPhoneNumber(number) {
        const removeSpaceNumber = number.replace(/ /g, '')
        const reg = /^(\+?\d{1,3}\s?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        return reg.test(removeSpaceNumber)
    },
}

module.exports = {
    getTimeDifference: helperMethods.getTimeDifference,
    getRandomValue: helperMethods.getRandomValue,
    getObjectIdTime: helperMethods.getObjectIdTime,
    parseExpressionAndEval: helperMethods.parseExpressionAndEval,
    firstNameCaps: variableMethods.firstNameCaps,
    getFirstName: variableMethods.getFirstName,
    createArray: variableMethods.createArray,
    millisToMinutesAndSeconds: variableMethods.millisToMinutesAndSeconds,
    numberSuffix: variableMethods.numberSuffix,
    getReminderMinutes: variableMethods.getReminderMinutes,
    createCurrentDateWith: variableMethods.createCurrentDateWith,
    getSelectedYearlyText: variableMethods.getSelectedYearlyText,
    convertDateToAmOrPm: variableMethods.convertDateToAmOrPm,
    capitalizeFirstLetter: variableMethods.capitalizeFirstLetter,
    getReminderTimeForCustom: variableMethods.getReminderTimeForCustom,
    isValidEmail: variableMethods.isValidEmail,
    isValidPhoneNumber: variableMethods.isValidPhoneNumber,
}
