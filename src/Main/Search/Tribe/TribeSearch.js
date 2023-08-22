/** @format */

// This is a tab for General search
import React, { Component } from 'react'
import { View, FlatList, Dimensions, Text } from 'react-native'
import { connect } from 'react-redux'

// Components
import TribeSearchCard from './TribeSearchCard'
import EmptyResult from '../../Common/Text/EmptyResult'

// actions
import {
    refreshSearchResult,
    onLoadMore,
    refreshPreloadData,
    loadPreloadData,
} from '../../../redux/modules/search/SearchActions'
import * as _ from 'lodash'

import { loadMoreTribes } from '../../../actions'
import { default_style, color } from '../../../styles/basic'

// tab key
const TYPE = 'Tribe' // Used for preload function
const key = 'tribes'
const DEBUG_KEY = '[ Component TribeSearch ]'

class TribeSearch extends Component {
    constructor(props) {
        super(props)
        this.onEndReachedCalledDuringMomentum = true
        this.state = {}
    }

    componentDidMount() {
        if (this.props.shouldPreload) {
            this.props.refreshPreloadData(TYPE)
        }
        // this.props.getAllAccounts()
    }

    _keyExtractor = (item) => item._id

    handleRefresh = () => {
        console.log(`${DEBUG_KEY} Refreshing search`)
        let keyToUse = key
        if (this.props.type !== 'GeneralSearch') {
            keyToUse = 'myTribes'
        }

        // Only refresh if there is content
        if (
            this.props.searchContent &&
            this.props.searchContent.trim() !== ''
        ) {
            this.props.refreshSearchResult(keyToUse)
            return
        }

        if (this.props.shouldPreload) {
            this.props.refreshPreloadData(TYPE)
            return
        }
    }

    handleOnLoadMore = () => {
        // let keyToUse = key
        // if (this.props.type !== 'GeneralSearch') {
        //     keyToUse = 'myTribes'
        // }

        // if (
        //     this.props.searchContent &&
        //     this.props.searchContent.trim() !== ''
        // ) {
        //     this.props.onLoadMore(keyToUse)
        //     return
        // }

        // if (this.props.shouldPreload) {
        //     this.props.loadPreloadData(TYPE)
        //     return
        // }
        if (
            !this.props.searchContent ||
            this.props.searchContent.trim() === ''
        ) {
            // this.props.onLoadMore(key)

            this.props.loadMoreTribes()
            return
        } else {
            this.props.onLoadMore(key)
            return
        }
    }

    preHandleOnLoadMore = () => {
        console.log(`${DEBUG_KEY} Loading more for tab: `, key)
        this.props.loadMoreTribes()
    }

    renderItem = ({ item }) => {
        // console.log('ITEMMM', item)
        return (
            <TribeSearchCard
                item={item}
                type={this.props.type}
                callback={this.props.callback}
                onItemSelect={this.props.onItemSelect}
                hideJoinButton={this.props.hideJoinButton}
            />
        )
    }

    suggestedHeader = (initialSuggestion, searchSuggestion, query) => () => {
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
                    Suggested Tribes
                </Text>
            </View>
        ) : null
    }

    // renderFlatList = (item) => {
    //     if (
    //         this.props.data.length === 0 &&
    //         !this.props.searchContent &&
    //         !this.props.loading
    //     ) {
    //         return (
    //             <FlatList
    //                 data={this.props.allTribes}
    //                 renderItem={this.renderItem}
    //                 keyExtractor={(item, index) => 'key' + index}
    //                 ListHeaderComponent={this.suggestedHeader}
    //                 onEndReached={this.preHandleOnLoadMore}
    //                 refreshing={this.props.tribesLoading}
    //                 onEndReachedThreshold={0.5}
    //                 keyboardShouldPersistTaps="always"
    //             />
    //         )
    //     } else if (
    //         this.props.data.length === 0 &&
    //         this.props.searchContent &&
    //         !this.props.loading
    //     ) {
    //         return <EmptyResult text={'No Results'} />
    //     } else {
    //         return (
    //             <FlatList
    //                 data={this.props.data}
    //                 renderItem={this.renderItem}
    //                 keyExtractor={this._keyExtractor}
    //                 onEndReached={this.handleOnLoadMore}
    //                 onEndReachedThreshold={0.5}
    //                 // onRefresh={this.handleRefresh}
    //                 // refreshing={this.props.loading}
    //                 keyboardShouldPersistTaps="always"
    //             />
    //         )
    //     }
    // }

    render() {
        const { height } = Dimensions.get('window')
        const objs = this.props.data
        // let SortedObjs = _.sortBy(this.props.data, function (o) {
        //     return new Date(o.created)
        // })

        // let tribes = SortedObjs.reverse()

        // console.log('TIREREERA', tribes)
        const initialSuggestion =
            (!this.props.searchContent ||
                this.props.searchContent.trim() === '') &&
            (!this.props.loading || this.props.data.length != 0)
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
                        ListHeaderComponent={this.suggestedHeader(
                            initialSuggestion,
                            this.props.isSuggested,
                            this.props.searchContent.trim()
                        )}
                        onEndReached={this.handleOnLoadMore}
                        onEndReachedThreshold={0.5}
                        onRefresh={this.handleRefresh}
                        refreshing={this.props.loading}
                        keyboardShouldPersistTaps="always"
                    />
                )}
            </View>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { tribes, searchContent } = state.search

    // console.log('STATEEEE SEARCHHH', state.search)
    let refreshing, loading, data, isSuggested

    const { allTribes, loading: tribesLoading } = state.account

    const { shouldPreload } = props

    // if (shouldPreload && (!searchContent || searchContent.trim() === '')) {
    if (!searchContent || searchContent.trim() === '') {
        // Display preload data when search content is null and shouldPreload is true

        // data = tribes.preload.data
        data = allTribes
        // refreshing = tribes.preload.refreshing
        // loading = tribes.preload.loading
        loading = tribesLoading
    } else {
        data = tribes.data
        refreshing = tribes.refreshing
        loading = tribes.loading
        isSuggested = tribes.isSuggested
    }

    return {
        tribes,
        data,
        refreshing,
        loading,
        searchContent,
        allTribes,
        tribesLoading,
        isSuggested,
    }
}

export default connect(mapStateToProps, {
    refreshSearchResult,
    onLoadMore,
    refreshPreloadData,
    loadPreloadData,
    loadMoreTribes,
    // getAllAccounts,
})(TribeSearch)
