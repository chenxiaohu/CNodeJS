'use strict';

import React,{
  ActivityIndicatorIOS,
  Alert,
  Animated,
  Component,
  Dimensions,
  Image,
  Navigator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  WebView,
  SegmentedControlIOS,
}  from 'react-native';

import Store from './Store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#333333',
    paddingTop:20,
  },

  button: {
    alignItems:'center',
    justifyContent:'center',
    paddingLeft:10,
    paddingRight:10,
  }

});


export default class SendTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {title:'', content:'', tab: '分享'};
  }

  getTabCode() {
    switch (this.state.tab) {
      case '招聘':
        return 'job';
      case '问答':
        return 'ask';
      default:
        return 'share';
    }
  }

  _onCommit() {
    if (this.state.title.length < 10) {
      Alert.alert('标题需要10个字以上');
      return;
    }
    if (this.state.content.length < 5) {
      Alert.alert('内容需要5个字以上');
      return;
    }
    let url = 'https://cnodejs.org/api/v1/topics';
    let body = `accesstoken=${Store.get('accesstoken')}&tab=${this.getTabCode()}&title=${encodeURIComponent(this.state.title)}&content=${encodeURIComponent(this.state.content)}`;
    fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:body,
      })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        if (res.success) {
          this.props.navigator.pop();
          this.props.parent.refresh();
        } else {
          // TODO need Toast??
        }
      })
      .catch(error => {
        console.log(error);
        // TODO need Toast??
      })
      .done();
  }

  render() {
    let title = this.state.title;
    let content = this.state.content;
    return (
      <View style={styles.container}>
        <View style={{flexDirection:'row', height: 38, borderWidth:0, borderColor:'white', paddingTop:0}}>
          <TouchableOpacity style={styles.button} onPress={() => this.props.navigator.pop()}>
            <Text style={{color:'white', fontSize:15}}>关闭</Text>
          </TouchableOpacity>
          <Text style={{flex:1, textAlign: 'center', color:'white', fontSize:18, fontWeight:'bold', paddingTop:9}}>发表主题</Text>
          <TouchableOpacity style={styles.button} onPress={this._onCommit.bind(this)}>
            <Text style={{color:'white', fontSize:15}}>提交</Text>
          </TouchableOpacity>
        </View>
        <View style={{backgroundColor:'rgb(220,220,220)', flex:1}}>

        <Select style={{paddingLeft:10, paddingRight:10, marginTop: 10, flexDirection:'row'}} tab={this.state.tab}
                onSelect={(tab) => this.setState({tab:tab})}/>

        <TextInput
          style={{padding:8, paddingTop:2, margin:10, height: 36, backgroundColor:'#fff', fontSize:16, borderRadius:5, borderBottomWidth:1, borderBottomColor:'grey',}}
          onChangeText={(text) => this.setState({title: text})} multiline={true}
          placeholder="标题10字以上" autoFocus={true}
        />
        <TextInput
          style={{paddingLeft:8, paddingRight:8, paddingTop:2, marginLeft:10, marginRight:10, height: 220, borderRadius:5,
          borderWidth:0, borderColor: '#80bd00', backgroundColor:'#fff', fontSize:16,borderBottomWidth:1, borderBottomColor:'grey',}}
          onChangeText={(text) => this.setState({content: text})}
          placeholder="内容" multiline={true}
        />
        </View>
      </View>
    );
  }
}

class Select extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={this.props.style}>
        <TouchableOpacity style={[styles.button, {backgroundColor: this.props.tab == '分享'?'#fff':'#b1b1b1', paddingTop:10, paddingBottom:10, borderRadius:5,
            borderBottomWidth:1, borderBottomColor:'grey',}]}
                          onPress={() => this.props.onSelect('分享')}>
          <Text style={{color: this.props.tab == '分享'?'#000':'#fff', fontSize:16}}>分享</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: this.props.tab == '问答'?'#fff':'#b1b1b1', paddingTop:10, paddingBottom:10, marginLeft:10, borderRadius:5,borderBottomWidth:1, borderBottomColor:'grey', }]}
                          onPress={() => this.props.onSelect('问答')}>
          <Text style={{color: this.props.tab == '问答'?'#000':'#fff', fontSize:16}}>问答</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: this.props.tab == '招聘'?'#fff':'#b1b1b1', paddingTop:10, paddingBottom:10, marginLeft:10, borderRadius:5, borderBottomWidth:1, borderBottomColor:'grey',}]}
                          onPress={() => this.props.onSelect('招聘')}>
          <Text style={{color: this.props.tab == '招聘'?'#000':'#fff', fontSize:16}}>招聘</Text>
        </TouchableOpacity>
      </View>
    );
  }
}