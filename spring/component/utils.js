/*
 * title: 工具集
 * author: wangchunpeng
 * time: 2016-10-12
 */

import React from 'react';

var utils = {
	ajax(url,options,callback){
		fetch(url,options)
			.then((res) => {
				callback(res);
			})
			.catch((error) => {
				console.error(error);
			});
	}
}

module.exports = utils;