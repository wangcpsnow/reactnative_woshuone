import React, { Component } from 'react';
import { AppRegistry,StyleSheet,Navigator } from 'react-native';

var styles = StyleSheet.create({

});
var ItemList = require('./component/itemList');

class ListViewBasics extends Component {
  // 初始化模拟数据
  render() {
  	let defaultName = 'itemList';
  	let defaultComponent = ItemList;
    return (
      <Navigator
	      initialRoute={{ name: defaultName, component: defaultComponent }}
	      configureScene={(route) => {
	        return Navigator.SceneConfigs.HorizontalSwipeJump;
	      }}
	      renderScene={(route, navigator) => {
	        let Component = route.component;
	        return <Component {...route.params} navigator={navigator} />
	      }} />
    );
  }
}

// 注册应用(registerComponent)后才能正确渲染
// 注意：只把应用作为一个整体注册一次，而不是每个组件/模块都注册
AppRegistry.registerComponent('spring', () => ListViewBasics);
