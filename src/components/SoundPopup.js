import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    FlatList,
    Dimensions,
    Platform,
    NativeModules,
} from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Divider } from 'react-native-elements'
import { color, text } from '../styles/basic'
import RNFS from 'react-native-fs'
import { Audio } from 'expo-av'

const windowWidth = Dimensions.get('screen').width

const soundData = [
    {
        name: 'None',
        file: '',
    },
    {
        name: 'Default',
        file: '',
    },
    {
        name: 'Alert',
        file: require('../../assets/notificationAudios/Alert.mp3'),
    },
    {
        name: 'Announcement',
        file: require('../../assets/notificationAudios/Announcement.mp3'),
    },
    {
        name: 'Count',
        file: require('../../assets/notificationAudios/Count.mp3'),
    },
    {
        name: 'Gong',
        file: require('../../assets/notificationAudios/Gong.mp3'),
    },
    {
        name: 'Old-Phone',
        file: require('../../assets/notificationAudios/Old-Phone.mp3'),
    },
    {
        name: 'Ping',
        file: require('../../assets/notificationAudios/Ping.mp3'),
    },
    {
        name: 'Prompt',
        file: require('../../assets/notificationAudios/Prompt.mp3'),
    },
    {
        name: 'Uh-oh',
        file: require('../../assets/notificationAudios/Uh-oh.mp3'),
    },
]

const SoundPopup = ({ isVisible, onClose, selectedState }) => {
    const refRBSheet = useRef(null)
    const [notificationData, setNotificationData] = useState([])
    const [selectedSound, setSelectedSound] = useState('Default')
    const buttonClick = useRef(false)
    const previousAudio = useRef()
    const allAudioPlayer = useRef({})

    useEffect(() => {
        if (isVisible) {
            refRBSheet.current?.open()
            buttonClick.current = false
            setSelectedSound(selectedState?.sound)
        }
    }, [isVisible])

    useEffect(() => {
        if (Platform.OS === 'ios') {
            Audio.setAudioModeAsync({ playsInSilentModeIOS: true }).then()
            Audio.setIsEnabledAsync(true).then()
            let defaultSound = null
            const otherSounds = []
            const noneSound = { name: 'None' }
            RNFS.readDir(RNFS.MainBundlePath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
                .then((result) => {
                    result
                        .filter((file) => file?.name?.includes('.aiff'))
                        .forEach((item) => {
                            const fileName = item?.name.replace('.aiff', '')
                            allAudioPlayer.current[fileName] = new Audio.Sound()
                            allAudioPlayer?.current[fileName]?.loadAsync({
                                uri: 'file://' + item?.path,
                            })
                            if (fileName === 'Default') {
                                defaultSound = { ...item, name: fileName }
                            } else {
                                otherSounds.push({ ...item, name: fileName })
                            }
                        })
                    otherSounds.sort((a, b) => a.name > b.name)
                    setNotificationData([
                        noneSound,
                        defaultSound,
                        ...otherSounds,
                    ])
                })
        } else {
            for (let i = 0; i < soundData.length; i++) {
                const soundInfo = soundData[i]
                const name = soundInfo?.name
                const file = soundInfo?.file
                if (name === 'Default') {
                    continue
                }
                allAudioPlayer.current[name] = new Audio.Sound()
                allAudioPlayer?.current[name]?.loadAsync(file)
            }
        }
    }, [])

    const onCloseBottomSheet = useCallback(() => {
        onClose && onClose(buttonClick.current ? selectedSound : null)
    }, [onClose, selectedSound])

    const onPressNotification = useCallback(async (file) => {
        try {
            const fileName = file.name
            setSelectedSound(fileName)
            if (fileName?.toLowerCase().includes('none')) {
                return
            }
            if (previousAudio.current?._loaded) {
                await previousAudio.current.stopAsync()
            }
            if (Platform.OS === 'ios' || fileName !== 'Default') {
                if (allAudioPlayer.current[fileName]._loaded) {
                    await allAudioPlayer?.current[fileName]?.playAsync()
                }
                previousAudio.current = allAudioPlayer?.current[fileName]
            } else {
                const { NotificationSoundModule } = NativeModules
                NotificationSoundModule.playDefaultNotificationSound()
            }
        } catch (e) {
            console.error('Error in play sound', e)
        }
    }, [])

    return (
        <RBSheet
            ref={(ref) => (refRBSheet.current = ref)}
            closeOnDragDown={false}
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
            <View style={styles.mainviewoverly}>
                <View style={styles.soundAllView}>
                    <TouchableOpacity
                        onPress={() => refRBSheet.current?.close()}
                    >
                        <Ionicons name="close" size={30} />
                    </TouchableOpacity>
                    <Text style={styles.soundtext}>Sounds</Text>
                    <Ionicons
                        onPress={() => {
                            buttonClick.current = true
                            refRBSheet.current?.close()
                        }}
                        name="ios-checkmark"
                        size={30}
                        color={color.GM_BLUE_DEEP}
                    />
                </View>

                <Divider style={styles.divider1} />
            </View>
            <Divider style={styles.divider1} />
            <Text style={styles.sounds}>Sounds</Text>
            <Divider style={styles.divider1} />
            <FlatList
                data={Platform.OS === 'ios' ? notificationData : soundData}
                keyExtractor={(item) => item.soundID}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 20,
                }}
                renderItem={({ item }) => {
                    return (
                        <View
                            style={{
                                flex: 1,
                                marginLeft: 20,
                                borderBottomWidth: 1,
                                borderBottomColor: 'rgba(0,0,0,.1)',
                            }}
                        >
                            <TouchableOpacity
                                style={styles.noneandimgview}
                                onPress={() => {
                                    onPressNotification(item).then()
                                }}
                            >
                                {selectedSound === item.name ? (
                                    <Ionicons
                                        name="ios-checkmark-outline"
                                        size={25}
                                        color={color.GM_BLUE_DEEP}
                                    />
                                ) : null}
                                <Text style={styles.none}>{item.name}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }}
            />
        </RBSheet>
    )
}
const styles = StyleSheet.create({
    mainviewoverly: {
        width: windowWidth,
    },
    soundAllView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 10,
    },
    soundtext: {
        color: '#000C19',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: text.FONT_FAMILY.MEDIUM,
    },
    divider1: {
        backgroundColor: '#0000001A',
        marginTop: 10,
    },
    sideset: {
        marginTop: 10,
    },
    defaultview: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
    },

    Defaulttext: {
        fontSize: 16,
        fontWeight: '400',
        color: '#0000004D',
        marginHorizontal: 10,
        fontFamily: text.FONT_FAMILY.REGULAR,
    },
    noneandimgview: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    none: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
        marginHorizontal: 10,
        fontFamily: text.FONT_FAMILY.MEDIUM,
        marginVertical: 12,
    },
    sounds: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
        fontFamily: text.FONT_FAMILY.MEDIUM,
        marginLeft: 20,
    },
    box: {
        width: 20,
        height: 20,
    },
})
export default SoundPopup
