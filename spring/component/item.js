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
    },
    comment: {
        borderTopWidth: 1,
        borderColor: "silver",
        marginTop: 10
    },
    cm_author: {
        color: "red",
        marginTop: 5
    },
    cm_content: {
        marginTop: 5,
        marginBottom: 5
    },
    cm_time: {
        color: "silver",
        textAlign: "right"
    }
});

// import Markdown from 'react-native-simple-markdown';
import HTMLView from 'react-native-htmlview';

var Url = 'http://api.woshuone.com/comments/?comment_approved=1&comment_POST_ID=';

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
        this.fetchComments();
   },
   fetchComments() {
        var data = this.props.data,
            post_id = data['ID'],
            url = Url;
        url += post_id;
        fetch(url)
         .then((res) => {
            try{
                res = JSON.parse(res._bodyInit);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(res)
                });
            }catch(err){
                console.log("评论数据解析错误:"+err.message);
            }
         })
         .catch((error) => {
            console.error(error);
         });
   },
   renderComment(comment) {
        var date = new Date(comment.comment_date || 0);
        date = date.toLocaleDateString();
        return (
            <View style={styles.comment}>
                <Text style={styles.cm_author}>
                    {comment.comment_author} -- {comment.comment_author_email}
                </Text>
                <Text style={styles.cm_content}>{comment.comment_content}</Text>
                <Text style={styles.cm_time}>{date}</Text>
            </View>
        )
   },
   render(){
        var data = this.state.data,
            date = this.state.date;
        return (
            <ScrollView style={styles.item}>
                <Text style={styles.header}>{data.post_title}</Text>
                <Text style={styles.time}>{date} -- {data.comment_count}条回复</Text>
                <HTMLView value={data.post_content}/>
                
                <Text style={{fontWeight: 'bold'}}>评论列表:</Text>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderComment}
                    enableEmptySections
                />
            </ScrollView>
        );
   } 
});