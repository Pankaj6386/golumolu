/** @format */

import React from 'react'

// Components
import PeopleCard from '../../Common/PeopleCard'
import PeopleCardDetail from '../../Common/PeopleCardDetail'
import Check from '../../../Common/Check'
import DelayedButton from '../../../Common/Button/DelayedButton'

const UserCard = (props) => {
    const { item, onCardPress, selected, statusComponent, disable } = props
    return (
        <DelayedButton
            activeOpacity={0.1}
            onPress={() => onCardPress(item)}
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
            }}
            disabled={disable}
        >
            <Check selected={selected} />
            <PeopleCard>
                <PeopleCardDetail item={item} />
            </PeopleCard>
            {statusComponent && statusComponent}
        </DelayedButton>
    )
}

export default UserCard
