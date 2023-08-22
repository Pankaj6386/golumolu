import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'

const ChevronIcon = ({ isExpanded }) => {
    return (
        <Ionicons
            size={20}
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            color={'#374957'}
        />
    )
}

export default ChevronIcon
