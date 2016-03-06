'use strict';

import React, {
  Text,
  View,
  StyleSheet,
  ListView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Component,
  ScrollView,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

let styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor:'#333333',
  },
  face: {
    width:60,
    height:60,
    borderRadius:30,
    backgroundColor:'white',
  },
  header:{
    padding:10,
    flex:1,
    backgroundColor:'#f6f6f6',
    color:'#80bd00',
  }
});

import Fmt from './Fmt';
import Topic from './Topic';

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar_url: props.avatar_url,
      create_at:'',
      score:0,
      recent_topics:[],
      recent_replies:[],
      renderPlaceholderOnly: true
    };
  }

  componentWillMount() {
    this.load();
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({renderPlaceholderOnly: false});
    });
  }

  load() {
    let url = `https://cnodejs.org/api/v1/user/${this.props.loginname}`;
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          avatar_url: res.data.avatar_url,
          create_at: res.data.create_at,
          score: res.data.score,
          recent_topics: res.data.recent_topics,
          recent_replies: res.data.recent_replies,
        });
      })
      .catch(error => {
        console.log(error);
      })
      .done();
  }

  _openTopic(topic) {
    this.props.navigator.push({
      component: Topic,
      passProps: { topic: {content:'', ...topic} },
      whiteStatus: true,
    });
  }

  renderRow(topic) {
    return (
      <TouchableOpacity key={topic.id} onPress={this._openTopic.bind(this, topic)}>
        <View overflow='hidden' style={{flexDirection:'row', padding:8, flex:1, borderBottomWidth:1, borderBottomColor:'#f0f0f0', backgroundColor:'white',}}>
          <View style={{marginRight:10, marginLeft:4}}>
            <Image style={{width:36, height:36, borderRadius:18, marginBottom:8, backgroundColor:'#f0f0f0'}} source={{uri:Fmt.fixFaceUrl(topic.author.avatar_url)}}/>
          </View>
          <View style={{flex:1}}>
            <View style={{flexDirection:'row', paddingTop:0, paddingBottom:5}}>
              <Text numberOfLines={2} style={{fontSize:16, flex:1, }}>{topic.title}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text style={{color:'#999', fontSize:12, padding:0}}>{topic.author.loginname}</Text>
              <View style={{flex:1}}/>
              <Text style={{color:'#999', fontSize:12, padding:0}}>{Fmt.dateDiff(topic.last_reply_at)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderReplies() {
    let x = [];
    this.state.recent_replies.map((i) => {x.push(this.renderRow(i))})
    return x;
  }

  renderTopics() {
    let x = [];
    this.state.recent_topics.map((i) => {x.push(this.renderRow(i))})
    return x;
  }

  _renderPlaceholderView() {
    return (
      <View style={{flex:1, backgroundColor:'white', flexDirection:'column'}}>
        <View style={{backgroundColor:'#333333', height:20,}}/>
        <View style={{flex:1, justifyContent:'center', alignItems:'center', }}>
          <ActivityIndicatorIOS color="grey" size="large" />
        </View>
      </View>
    );
  }

  render() {
    if (this.state.renderPlaceholderOnly) {
      return this._renderPlaceholderView();
    }

    return (
      <View style={styles.container}>

        <ScrollView>

        <View style={{alignItems:'center', justifyContent:'center', backgroundColor:'#333333', paddingTop:8}}>
          <Image style={styles.face} source={{uri:this.state.avatar_url}}></Image>
          <Text style={{color:'white'}}>{this.props.loginname}</Text>
        </View>
        <View style={{flexDirection:'row', backgroundColor:'#333333', paddingTop:10}}>
          <Text style={{color:'white', margin:10}}>注册时间: {this.state.create_at.substring(0,10)}</Text>
          <View style={{flex:1}}/>
          <Text style={{color:'white', margin:10}}>积分: {this.state.score}</Text>
        </View>

        <View style={{backgroundColor:'white',}}>
          <Text style={styles.header}>最近回复</Text>
          {this.renderReplies()}
        </View>

        <View style={{backgroundColor:'white',}}>
          <Text style={styles.header}>最近发布</Text>
          {this.renderTopics()}
        </View>

        <View style={{height:80, backgroundColor:'white'}}>
        </View>
        </ScrollView>
        <TouchableOpacity onPress={() => this.props.navigator.pop()}
                          style={{position:'absolute', left:10, bottom:10, width:60, height:60, borderRadius:30,
                          backgroundColor:'rgba(38,38,38,0.4)'}}>
          <Image style={{width:30, height:30, marginTop:15, marginLeft:15, tintColor:'rgba(255,255,255,0.7)'}}  source={require('./img/back-512.png')}/>
        </TouchableOpacity>
      </View>
    );
  }
}