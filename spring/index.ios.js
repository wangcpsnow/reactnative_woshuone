

import React, { Component } from 'react';
import { AppRegistry, ListView, Text, View,StyleSheet } from 'react-native';

var styles = StyleSheet.create({
	itemlist: {
		// backgroundColor: '#ddd',
		// paddingTop: 20
	}
});
var ItemList = require('./component/itemList');

class ListViewBasics extends Component {
  // 初始化模拟数据
  render() {
    return (
      <ItemList style={styles.itemlist}/>
    );
  }
}

// 注册应用(registerComponent)后才能正确渲染
// 注意：只把应用作为一个整体注册一次，而不是每个组件/模块都注册
AppRegistry.registerComponent('spring', () => ListViewBasics);
