/** @format */

import { Dimensions, Platform } from 'react-native'

export default {
    AUTHTOKEN: 'AUTH', // for auth in app and key for async storage
    USER_DATA: 'USER_DATA', //Key for storing data
    API_TOKEN: 'API_TOKEN',
    USER_ID: 'USER_ID',
    REMINDER_ID: 'REMINDER_ID',
    GOAL_NAME: 'GOAL_NAME',
    DUE_DATE: '',
    VOICE: '',
    DONE_ARRAY: [],
    ARCHIVE_ARRAY: [],
    // DONE_ARRAY:[],

    ASSETS: {
        SYNC: require('./assets/sync.png'),
        ARCHIVE: require('./assets/archive.png'),
        SELECT_CALENDAR: require('./assets/selectCalendar.png'),
        RECOVER: require('./assets/recover.png'),
        CHECK: require('./assets/check.png'),
        UNCHECK: require('./assets/uncheck.png'),
        LION: require('./assets/lion.png'),
        CALENDAR: require('./assets/calendar.png'),
        SMS: require('./assets/sms.png'),
        EMAIL: require('./assets/email.png'),
        BELL: require('./assets/push.png'),
        PICK_IMAGE: require('./assets/pickImage.png'),
        EMOJI: require('./assets/emoji.png'),
        VOICE: require('./assets/voice.png'),
        RIGHTCLICK: require('./assets/check1.png'),
        BOX: require('./assets/uncheck1.png'),
        FILES: require('./assets/files.png'),
        PLUS: require('./assets/plus.png'),
        DONE: require('./assets/done.png'),
        MORE: require('./assets/more.png'),
        ARCHIVE1: require('./assets/archive1.png'),
        SOUND: require('./assets/sound.png'),
        SHARE: require('./assets/share.png'),
        SHAPE: require('./assets/shape.png'),
        HAND: require('./assets/hand.png'),
        SATH: require('./assets/sath.png'),
        CAL: require('./assets/goal.png'),
        CROSS: require('./assets/cross.png'),
        CROSSBAG: require('./assets/crossbag.png'),
        DRFT: require('./assets/drft.png'),
        MSG: require('./assets/msg.png'),
        LEFTKEY: require('./assets/leftkey.png'),
        RIGHTKEY: require('./assets/rightkey.png'),
        GOALPLUS: require('./assets/goalplus.png'),
        TIMER: require('./assets/timer.png'),
        PLAY: require('./assets/play.png'),
        VIDEO_ICON: require('./assets/video_icon.png'),
        GOAL_ICON: require('./assets/goal_icon.png'),
    },
}
