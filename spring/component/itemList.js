'use strict';

// var React = require('react-native');
import React, { Component } from 'react';

import { StyleSheet, ListView, Text,View,Image,ScrollView,TouchableOpacity,Navigator } from 'react-native';

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

var API = 'http://api.woshuone.com/posts?post_status="publish"';
var itemRow = require("./item");


module.exports = React.createClass({
    //object在组件被挂载之前调用。状态化的组件应该实现这个方法，返回初始的state数据。
    getInitialState(props) {
        return {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            loaded: false
        };
    },
    //只调用一次，在render之后调用
    componentDidMount() {
        this.fetchData();
    },
    //render 之前调用 
    //之所以取nextProps的值而不直接取this.props.cateId 是因为componentWillReceiveProps的更新早于props的更新
    componentWillReceiveProps(nextProps) {
        //猫头先转
        // this.setState({
        //     loaded : false
        // })
    },
    //拉取数据
    fetchData: function(cateId) {
        fetch(API)
        .then((response) => {
            try{
                response = JSON.parse(response._bodyInit)
                // console.log(response)
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(response),
                    loaded: true
                });
            }catch(err){
                var res = [{
                    post_title: "数据错误"
                }];
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(res),
                    loaded: true
                });
            }
        })
        .catch((error) => {
            console.error(error);
        })
    },

    //渲染列表
    renderListView : function(){
        //先展示加载中的菊花
        if(!this.state.loaded){
            return(
                <Image style={styles.loading} source={require('./imgs/loading.gif')} />
          );
        };
        return(
            <ScrollView>
                <ListView contentInset={{top: -64}}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    style={styles.listView}
                    enableEmptySections
                />
            </ScrollView>
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