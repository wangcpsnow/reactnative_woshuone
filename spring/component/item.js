import React from 'react';
import {
    View,
    Navigator,
    TouchableOpacity,
    Text,
    StyleSheet,
    ScrollView,
    ListView
} from 'react-native';

var styles = StyleSheet.create({
    item: {
        paddingTop: 30,
        paddingLeft:10,
        paddingRight:10
    },
    header: {
        fontWeight: "bold",
        fontSize: 20
    },
    time: {
        textAlign: "right",
        color: "silver",
        marginBottom: 10,
        marginTop: 10
    }
});

// import Markdown from 'react-native-simple-markdown';
import HTMLView from 'react-native-htmlview';

var Comment = require("./comment");

module.exports = React.createClass({
   getInitialState(props){
        return {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            data: "",
            date: ""
        }
   },
   componentDidMount(){
        this.setState({
            data: this.props.data,
            date: this.props.date
        });
   },
   render(){
        var data = this.state.data,
            date = this.state.date;
        return (
            <ScrollView style={styles.item}>
                <Text style={styles.header}>{data.post_title}</Text>
                <Text style={styles.time}>{date} -- {data.comment_count}条回复</Text>
                <HTMLView value={data.post_content}/>
                
                <Comment post_id={data.ID}></Comment>
            </ScrollView>
        );
   } 
});