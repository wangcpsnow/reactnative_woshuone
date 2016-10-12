/*
 * title: 获取所有文章分类
 * author: wangchunpeng
 * time: 2016-10-12
 */

import React from 'react';

var utils = require("./utils");
var Config = require("../config");
var url = Config.host + '/terms'

module.exports = {
	async terms(){
		var result = await fetch(url);
		return JSON.parse(result._bodyInit);	
	}
}