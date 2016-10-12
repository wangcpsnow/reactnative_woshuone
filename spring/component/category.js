/*
 * author: wangchunpeng
 * time: 2016-10-11
 * title: 获取文章分类
 */

import React from 'react';
import {
    Text,
    StyleSheet
} from 'react-native';

var styles = StyleSheet.create({
	cates: {
		marginBottom: 20,
		color: "silver",
		textAlign: "right"
	}
});

var Config = require("../config");
var Url_all = Config.host + '/terms',
	Url = Config.host + '/postterms/?object_id=',
	Data_All = [],
	cates = [];
// var Term = require("./categorys"),
// 	Data_All = Term.terms();


module.exports = React.createClass({
	getInitialState(){
        return {
            loaded: false,
            cates: []
        }
    },
    componentDidMount() {
    	fetch(Url_all)
    	 .then((res) => {
    	 	try{
	            Data_All = JSON.parse(res._bodyInit);
	            this.setState({loaded: true});
	        }catch(err){
	            console.log("评论数据解析错误:"+err.message);
	        }
    	 }).catch((err) => {
    	 	console.error(err)
    	 })
    },
	componentWillReceiveProps(nextProps) {
    	this.fetchData(nextProps.post_id);
    },
	fetchData(post_id) {
	    var url = Url;
	    url += post_id;
	    fetch(url)
	     .then((res) => {
	     	cates = [];
	        try{        
	        	res = JSON.parse(res._bodyInit);
	            this._getRes(res);
	        }catch(err){
	            console.log("评论数据解析错误:"+err.message);
	        }
	     })
	     .catch((error) => {
	        console.error(error);
	     });
	},
	_getRes(data) {
		data.map(r => {
        	for(var i=0,l=Data_All.length;i<l;i++){
        		var item = Data_All[i];
        		if(item.term_id == r.term_taxonomy_id){
        			cates.push(item.name);
        		}
        	}
        });
        this.setState({cates: cates});
    },
	render() {
		//最终还是使用state，这样在state变化的时候，会再次render
		var category = this.state.cates.join(",");
		return (
			<Text style={styles.cates}>分类:{category}</Text>
		);
	}
});