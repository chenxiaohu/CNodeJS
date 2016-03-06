'use strict';

import React, {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  DeviceEventEmitter,
  Animated,
  TouchableOpacity,
} from 'react-native';

import Store from './Store';

class Button extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={this.props.style} >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

export default class Reply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kbHeight: 0,
    };
    this._animatedValue = new Animated.Value(0);
  }

  componentWillMount () {
    DeviceEventEmitter.once('keyboardWillShow', this.keyboardWillShow.bind(this))
  }

  keyboardWillShow (e) {
    this.setState({kbHeight: e.endCoordinates.height});
    let x = e.endCoordinates.height;
    Animated.timing(this._animatedValue, { toValue: x, duration: 300 }).start();
  }

  closeSelf() {
    this.props.parent.setState({showReply:false});
  }

  send() {
    let url = `http://cnodejs.org/api/v1/topic/${this.props.parent.props.topic.id}/replies`;
    console.log(url);
    if (!this.state.text || this.state.text + '' == '') {
      Alert.alert('内容必须输入');
      return;
    }
    let body = `accesstoken=${Store.get('accesstoken')}&content=${encodeURIComponent(this.state.text)}`;
    if (this.props.replyTo) {
      body = body + '&reply_id=' + this.props.replyId;
    }

    //console.log(body);

    fetch(url, {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:body })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.success) {
          this.props.parent.reloadToEnd();
        } else {
          Alert.alert('提交失败', res);
        }
      })
      .catch(error => {
        console.log(error);
        Alert.alert('提交失败', error);
      })
      .done();
  }

  render() {
    //<View style={{height:deviceHeight, backgroundColor:'rgba(0,0,0,0.28)'}}></View>
    return (
      <View style={[styles.reply, ]}>
        <View style={{flex:1, flexDirection:'row', height: 44, backgroundColor:'#333333'}}>
          <Button onPress={this.closeSelf.bind(this)}>
            <Text style={{padding:15, fontSize:16, color:'#fff'}}>取消</Text>
          </Button>
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontSize:18, color:'#fff'}}>{this.props.replyTo? '回复'+this.props.replyTo:'回复主题'}</Text>
          </View>
          <Button onPress={this.send.bind(this)}>
            <Text style={{padding:15, fontSize:16, color:'#fff'}}>提交</Text>
          </Button>
        </View>
        <Animated.View style={{marginBottom:this._animatedValue, }}>
          <TextInput
            editable={true}
            multiline={true}
            autoFocus={true}
            defaultValue={this.props.replyTo? '@'+this.props.replyTo+' ':''}
            style={{height: 100, backgroundColor:'rgba(220,220,220,1)',
              padding:10, fontSize:16}}
            onChangeText={(text) => this.setState({text})} value={this.state.text}>
          </TextInput>
        </Animated.View>
      </View>
    );
  }
}


let deviceWidth = Dimensions.get('window').width;

let styles = StyleSheet.create({

  reply: {
    position:'absolute',
    left: 0,
    bottom: 0,
    width: deviceWidth,
    //backgroundColor:'rgba(240,240,240,1)',
    flex:1,
  },
});

