/** @format */

import io from 'socket.io-client'
import { SOCKET_IO_URL_DEV } from '../../../config'
import { getChatVideoProgress } from '../../redux/modules/chat/ChatRoomActions'
import { getVideoProgress } from '../../redux/modules/feed/comment/CommentActions'
import { getPostVideoProgress } from '../../redux/modules/feed/post/PostActions'

let socket = null
let token = ''

const getSocket = () => {
    return socket !== null ? socket : initialize(token)
}

const initialize = async () => {
    try {
        console.log('initialize socket')
        // const xAuthToken = await getData('auth_token')
        if (socket !== null) return socket
        socket = io(SOCKET_IO_URL_DEV, {
            transports: ['websocket'],
            jsonp: false,
            reconnectionAttempts: Infinity, // just in case default behavior changes
            autoConnect: true, // same as above
        })

        socket.on('connect', () => {
            console.log('connection established')
        })

        getVideoProgress(socket)
        getChatVideoProgress(socket)
        getPostVideoProgress(socket)

        socket.on('connect_error', (err) => {
            console.log(`connect_error due to ${err.message}`)
        })

        return socket
    } catch (error) {
        console.log('ERRORR', error)
    }
}

const disconnect = () => {
    if (socket === null) return

    socket.disconnect(true)
    socket = null
}
export default { initialize, getSocket, disconnect }
