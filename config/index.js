/** @format */

const GOOGLE_RECAPTCHA_KEY = '6LfijMoUAAAAABgvJzDwK4m947RbG-jjSfbmFaOV'
const SENTRY_CONFIG = {
    DNS: 'https://e8ba02e422f349b4a2c76c8882392ae4@sentry.io/1860637',
    AUTH_TOKEN:
        '024df661dcbe47f2ab23672121179ad6ad707f1b3ccc43aa8ce9683015061c33',
}
const SEGMENT_CONFIG = {
    IOS_WRITE_KEY: 'Us6yuw9KLihsRmpihcB5OXTYwT4GDq75',
    ANDROID_WRITE_KEY: 'Us6yuw9KLihsRmpihcB5OXTYwT4GDq75',
}

const GOOGLE_LOGIN = {
    iosClientId: 'Us6yuw9KLihsRmpihcB5OXTYwT4GDq75',
    androidClientId: 'Us6yuw9KLihsRmpihcB5OXTYwT4GDq75',
}

const API_URL = 'https://api.d.goalmogul.com/api/' //live server
const API_URL_DEV = 'https://api.d.goalmogul.com/api/' // dev server
// const API_URL_DEV = 'http://localhost:8080/api/' // dev server

const SOCKET_IO_URL = 'https://api.d.goalmogul.com/' // live server to connect socket
const SOCKET_IO_URL_DEV = 'https://api.d.goalmogul.com/' // dev server to connect socket
// const SOCKET_IO_URL_DEV = 'http://localhost:8080/' // dev server to connect socket

export {
    GOOGLE_RECAPTCHA_KEY,
    SENTRY_CONFIG,
    SEGMENT_CONFIG,
    API_URL,
    API_URL_DEV,
    SOCKET_IO_URL,
    SOCKET_IO_URL_DEV,
    GOOGLE_LOGIN,
}
