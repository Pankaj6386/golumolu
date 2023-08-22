/** @format */

// This is a tab for General search
import React, { Component } from 'react'
import { View, FlatList, Dimensions, Text } from 'react-native'
import { connect } from 'react-redux'

// Components
import PostSearchCard from './PostSearchCard'
import EmptyResult from '../../Common/Text/EmptyResult'
import { MenuProvider } from 'react-native-popup-menu'

// actions
import {
    refreshSearchResult,
    onLoadMore,
    refreshPreloadData,
    loadPreloadData,
} from '../../../redux/modules/search/SearchActions'
import * as _ from 'lodash'

import { loadMorePosts } from '../../../actions'
import { default_style, color } from '../../../styles/basic'

// ../Post/PostPreviewCard/PostPreviewCard
import PostPreviewCard from '../../Post/PostPreviewCard/PostPreviewCard'
// import PostPreviewBody from '../../Post/PostPreviewCard/PostPreviewBody'

// tab key
const TYPE = 'Post' // Used for preload function
const key = 'post'
const DEBUG_KEY = '[ Component PostSearch ]'

class PostSearch extends Component {
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
            keyToUse = 'posts'
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
        if (
            !this.props.searchContent ||
            this.props.searchContent.trim() === ''
        ) {
            // this.props.onLoadMore(key)

            this.props.loadMorePosts()
            return
        } else {
            this.props.onLoadMore(key)
            return
        }
    }

    preHandleOnLoadMore = () => {
        console.log(`${DEBUG_KEY} Loading more for tab: `, key)
        this.props.loadMorePosts()
    }

    // {/* <PostSearchCard
    //     item={item}
    //     type={this.props.type}
    //     callback={this.props.callback}
    //     onItemSelect={this.props.onItemSelect}
    //     hideJoinButton={this.props.hideJoinButton}
    // /> */}
    renderItem = ({ item }) => {
        // console.log('ITEMMM', item)
        return (
            // <View style={{'borderBottomColor':"#DADADA",'borderBottomStyle':"solid",borderBottomWidth:"2"}}>
            <PostPreviewCard item={item} />
            // </View>
            // {/* <Text>
            //     Hello123
            // </Text> */}
            // <PostPreviewBody
            //     item={item}
            // />
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
                    Suggested Posts
                </Text>
            </View>
        ) : null
    }

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
                <MenuProvider
                    customStyles={{ backdrop: styles.backdrop }}
                    skipInstanceCheck={true}
                >
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
                </MenuProvider>
            </View>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { post, searchContent } = state.search

    // console.log('STATEEEE SEARCHHH', state.search)
    let refreshing, loading, data, isSuggested

    const { allPosts, loading: postsLoading } = state.account

    const { shouldPreload } = props

    // if (shouldPreload && (!searchContent || searchContent.trim() === '')) {
    if (!searchContent || searchContent.trim() === '') {
        // Display preload data when search content is null and shouldPreload is true

        // data = tribes.preload.data
        data = allPosts
        // refreshing = tribes.preload.refreshing
        // loading = tribes.preload.loading
        loading = postsLoading
    } else {
        data = post.data
        refreshing = post.refreshing
        loading = post.loading
        isSuggested = post.isSuggested
    }

    return {
        post,
        data,
        refreshing,
        loading,
        searchContent,
        allPosts,
        postsLoading,
        isSuggested,
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: color.GM_BACKGROUND,
    },
    tabContainer: {
        padding: 8,
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
}
export default connect(mapStateToProps, {
    refreshSearchResult,
    onLoadMore,
    refreshPreloadData,
    loadPreloadData,
    loadMorePosts,
    // getAllAccounts,
})(PostSearch)
