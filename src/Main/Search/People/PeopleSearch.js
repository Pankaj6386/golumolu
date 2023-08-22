/** @format */

import React, { Component } from 'react'
import { View, FlatList, Dimensions, Text } from 'react-native'
import { connect } from 'react-redux'

// Components
import SearchUserCard from './SearchUserCard'
import EmptyResult from '../../Common/Text/EmptyResult'

import * as _ from 'underscore'

// actions
import {
    refreshSearchResult,
    onLoadMore,
} from '../../../redux/modules/search/SearchActions'

import { ActivityIndicator } from 'react-native-paper'
import { loadMoreUsers, getAllAccounts } from '../../../actions'
import PYMKCard from '../../MeetTab/PYMKCard'

// tab key
const key = 'people'
const DEBUG_KEY = '[ Component PeopleSearch ]'

import { default_style, color } from '../../../styles/basic'

class PeopleSearch extends Component {
    constructor(props) {
        super(props)
        this.onEndReachedCalledDuringMomentum = true
        this.state = {}
    }

    _keyExtractor = (item) => item._id

    async componentDidMount() {
        this.props.getAllAccounts()
    }
    componentDidUpdate(prevProps, prevState) {
        // if (
        //     this.props.data.length === 0 &&
        //     !this.props.searchContent &&
        //     !this.props.loading
        // ) {
        //     this.props.getAllAccounts()
        // }
    }

    handleRefresh = () => {
        console.log(`${DEBUG_KEY} Refreshing tab: `, key)
        // Only refresh if there is content
        if (
            this.props.searchContent &&
            this.props.searchContent.trim() !== ''
        ) {
            this.props.refreshSearchResult(key)
        } else {
            this.props.getAllAccounts()
        }
    }

    handleOnLoadMore = () => {
        if (
            !this.props.searchContent ||
            this.props.searchContent.trim() === ''
        ) {
            // this.props.onLoadMore(key)

            this.props.loadMoreUsers()
            return
        } else {
            this.props.onLoadMore(key)
            return
        }

        // if (this.props.shouldPreload) {
        //     this.props.loadPreloadData(TYPE)
        //     return
        // }

        // console.log(`${DEBUG_KEY} Loading more for tab: `, key)
    }

    // preHandleOnLoadMore = () => {
    //     console.log(`${DEBUG_KEY} Loading more for tab: `, key)
    //     this.props.loadMoreUsers()
    // }

    // handleOnLoadMoreAccounts = ({ distanceFromEnd }) => {
    //     if (!this.onEndReachedCalledDuringMomentum) {
    //         this.props.loadMoreUsers()
    //         this.onEndReachedCalledDuringMomentum = true
    //     }
    // }

    renderItem = ({ item, index }) => {
        return (
            <SearchUserCard
                {...this.props}
                item={item}
                onSelect={this.props.onSelect}
                type={this.props.type}
            />
            // <PYMKCard
            //     user={item}
            //     index={index}
            //     hideOptions
            //     requests={this.state.requestsSent}
            // />
        )
    }

    renderTitle = (initialSuggestion, searchSuggestion, query) => () => {
        console.log(initialSuggestion)
        return initialSuggestion | searchSuggestion ? (
            <View>
                {searchSuggestion ? (
                    <Text
                        style={{
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingBottom: 5,
                            ...default_style.normalText_1,
                            textAlign: 'center',
                            color: color.GM_RED,
                            fontWeight: 'bold',
                        }}
                    >
                        Sorry — "{query}" not found.{'\n'}Perhaps you might be
                        interested in these:
                    </Text>
                ) : null}
                <Text
                    style={{
                        padding: 20,
                        paddingBottom: 20,
                        ...default_style.goalTitleText_1,
                        fontWeight: 'bold',
                    }}
                >
                    {searchSuggestion
                        ? 'Suggested People'
                        : 'People You May Know'}
                </Text>
            </View>
        ) : null
    }

    render() {
        const { height } = Dimensions.get('window')
        // let SortedObjs = _.sortBy(this.props.data, 'name')
        const objs = this.props.data.filter((e) => !e.name.includes('Test'))
        const initialSuggestion =
            (!this.props.searchContent ||
                this.props.searchContent.trim() === '') &&
            (!this.props.loading || this.props.data.length != 0)
        console.log('Suggested', initialSuggestion)
        return (
            <View style={{ flex: 1, height: height }}>
                {this.props.data.length === 0 &&
                this.props.searchContent &&
                !this.props.loading ? (
                    <EmptyResult text={'No Results'} />
                ) : (
                    <FlatList
                        data={objs}
                        renderItem={this.renderItem}
                        keyExtractor={this._keyExtractor}
                        onEndReached={this.handleOnLoadMore}
                        onEndReachedThreshold={0.5}
                        onRefresh={this.handleRefresh}
                        refreshing={this.props.loading}
                        ListHeaderComponent={this.renderTitle(
                            initialSuggestion,
                            this.props.isSuggested,
                            this.props.searchContent.trim()
                        )}
                        keyboardShouldPersistTaps="always"
                    />
                )}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { people, searchContent } = state.search
    const { token } = state.user
    let refreshing, loading, data, isSuggested
    // const { data, refreshing, loading } = people

    const { allUser, loading: peopleLoading } = state.account

    if (!searchContent || searchContent.trim() === '') {
        // Display preload data when search content is null and shouldPreload is true

        data = allUser
        // refreshing = tribes.preload.refreshing
        loading = peopleLoading
    } else {
        data = people.data
        refreshing = people.refreshing
        loading = people.loading
        isSuggested = people.isSuggested
    }

    return {
        people,
        data,
        refreshing,
        loading,
        searchContent,
        allUser,
        peopleLoading,
        isSuggested,
    }
}

export default connect(mapStateToProps, {
    refreshSearchResult,

    loadMoreUsers,
    onLoadMore,
    getAllAccounts,
})(PeopleSearch)
