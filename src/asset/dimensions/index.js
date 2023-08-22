import {
    widthPercentageToDP,
    heightPercentageToDP,
    IOSStatusBar,
} from './windowDimensions'

const Size = (num) =>
    Math.sqrt(
        heightPercentageToDP('100%') * heightPercentageToDP('100%') +
            widthPercentageToDP('100%') * widthPercentageToDP('100%')
    ) *
    (num / 100)
const hp = (num) => heightPercentageToDP(`${num}%`)
const wp = (num) => widthPercentageToDP(`${num}%`)
const IOS = IOSStatusBar() > 20 ? 0 : IOSStatusBar()
export { Size, hp, wp, IOS }
