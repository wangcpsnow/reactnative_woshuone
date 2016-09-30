import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    Image
} from 'react-native';

var styles = StyleSheet.create({
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

var Config = require("../config");
var Url = Config.host + '/comments/?comment_approved=1&comment_POST_ID=';

var Comment = React.createClass({
	getInitialState(){
        return {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            loaded: false
        }
    },
    componentWillReceiveProps(nextProps) {
    	this.fetchData(nextProps.post_id);
    },
	componentDidMount(){

    },
	fetchData(post_id) {
	    var url = Url;
	    url += post_id;
	    fetch(url)
	     .then((res) => {
	        try{
	            res = JSON.parse(res._bodyInit);
	            this.setState({
	                dataSource: this.state.dataSource.cloneWithRows(res),
	                loaded: true
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
	render() {
		if(!this.state.loaded){
           	return(
                <Image style={styles.loading} source={require('./imgs/load_comment.gif')} />
          	);
        };
        if(!this.state.dataSource.getRowCount()){
        	return (
        		<Text style={{fontWeight: 'bold'}}>暂无评论...</Text>
        	);
        }
        return (
        	<View>
        		<Text style={{fontWeight: 'bold'}}>评论列表:</Text>
	            <ListView
	                dataSource={this.state.dataSource}
	                renderRow={this.renderComment}
	                enableEmptySections
	            />
        	</View>
        );
	}
});

module.exports = Comment;