'use strict';

// var React = require('react-native');
import React, { Component } from 'react';

import { 
    StyleSheet, ListView, 
    Text,View,Image,
    ScrollView,TouchableOpacity,
    Navigator,RefreshControl 
} from 'react-native';

// 组件样式
var styles = StyleSheet.create({
    loading :{
        marginTop : 10,
        flex : 1,
        justifyContent: 'center', alignItems: 'center',
        // height : 21,
        resizeMode: Image.resizeMode.contain
    },
    listView : {
        backgroundColor: "#ddd",
        marginTop: 30
    },
    row: {
        borderColor: 'silver',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor : 'white',
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    title: {
        lineHeight: 20,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    time: {
        textAlign: "right",
        color: "silver",
        marginBottom: 10
    }
});

var Config = require("../config"),
    itemRow = require("./item"),
    pageIndex = 1,
    API =  Config.host + '/posts?post_status="publish"&pageIndex=',
    results = [],
    hasAllLoad = false;


module.exports = React.createClass({
    //object在组件被挂载之前调用。状态化的组件应该实现这个方法，返回初始的state数据。
    getInitialState(props) {
        return {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            loaded: false,
            isRefreshing: false,
            isLoadingMore: false
        };
    },
    //只调用一次，在render之后调用
    componentDidMount() {
        this.fetchData();
    },
    //render 之前调用 
    //之所以取nextProps的值而不直接取this.props.cateId 是因为componentWillReceiveProps的更新早于props的更新
    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps");
    },
    //拉取数据
    fetchData: function(cateId) {
        console.log("URL:"+ API,pageIndex);
        this.setState({
            isLoadingMore: true
        });
        fetch(API + pageIndex)
        .then((response) => {
            try{
                response = JSON.parse(response._bodyInit);
                if(response.length < 10){
                    hasAllLoad = true;
                }
                results = results.concat(response);
                
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(results),
                    loaded: true,
                    isLoadingMore: false
                });
                console.log("URL ok");
                pageIndex++;
            }catch(err){
                var res = [{
                    post_title: "数据错误"
                }];
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(res),
                    loaded: true,
                    isLoadingMore: false
                });
            }
        })
        .catch((error) => {
            console.error(error);
        })
    },
    _onRefresh: function() {
        console.log("加载更多");
        if(this.state.isRefreshing){
            return;
        }
        this.setState({isRefreshing: true});
        setTimeout(() => {
            var res = [{
                post_title: "数据错误loadmore"
            }];
            this.setState({
                isRefreshing: false
            });
        }, 2000);
    },
    _toEnd: function(){
        console.log("加载toEnd？",this.state.isLoadingMore);
        if(this.state.isLoadingMore){
            return;
        }
        console.log("加载toEnd");
        this.fetchData();
    },
    _renderFooter: function(){
        console.log("加载footer");
        return (
            <Text style={{textAlign: "center",paddingBottom: 10}}>
                {hasAllLoad ? "全部加载完成..." : "正在加载中..."}
            </Text>
        );
    },
    //渲染列表
    renderListView : function(){
        //先展示加载中的菊花
        // if(!this.state.loaded){
        //     return(
        //         <Image style={styles.loading} source={require('./imgs/loading.gif')} />
        //     );
        // };
        return(
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                style={styles.listView}
                enableEmptySections

                onEndReached={ this._toEnd }
                onEndReachedThreshold={10}
                renderFooter={ this._renderFooter }
            />
        );
    },
    renderRow: function(item){
        var date = new Date(item.post_date || 0);
        date = date.toLocaleDateString();
        return (
            <View style={styles.row}>
                <TouchableOpacity onPress={()=>{this.onPressRow(item,date)}}>
                    <Text style={styles.title}>{item.post_title}</Text>  
                </TouchableOpacity>
                <Text style={styles.time}>{date}</Text>
            </View>
        )
    },
    onPressRow(item,date) {
        // console.log(item);
        const { navigator } = this.props;
        // console.log(navigator);
        if(navigator) {
            navigator.push({
                name: 'itemRow',
                component: itemRow,
                params: {
                    data: item,
                    date: date
                }
            })
        }
    },
	render() {
		return (
            this.renderListView()
        );
	}
})