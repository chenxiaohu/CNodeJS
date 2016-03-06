'use strict';

import React,{
  ActivityIndicatorIOS,
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
  Linking,
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

export default class Login extends Component {
    constructor(props) {
      super(props);
      console.log(Store.get('accesstoken'));
      this.state = {
        accesstoken: Store.get('accesstoken') || '',
        //hint:'验证失败, 请仔细检查输入是否正确!'
      };
    }

  _onCommit() {
    let text = this.state.accesstoken;
    if (!text) {
      this.setState({hint:'请输入合法的Access Token!'});
      return;
    }

    let body = 'accesstoken=' + text;
    fetch('https://cnodejs.org/api/v1/accesstoken', {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:body })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        Store.set('accesstoken', text);
        this.props.navigator.pop();
      } else {
        console.log(res)
        this.setState({hint:'验证失败, 请仔细检查输入是否正确!'});
      }
    })
    .catch(err => {
      this.setState({hint:'验证失败, 请仔细检查输入是否正确!'});
    })
    .done();

  }

  _onOpenWeb() {
    Linking.openURL('https://cnodejs.org/signin');
  }

  hint() {
    if (this.state.hint) {
      return (
        <View style={{marginLeft:10, marginRight:10, height:30, alignItems:'center', justifyContent:'center', backgroundColor:'#ccc'}}>
          <Text style={{color:'red'}}>{this.state.hint}</Text>
        </View>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection:'row', height: 38, borderWidth:0, borderColor:'white', paddingTop:0}}>
          <TouchableOpacity style={styles.button} onPress={() => this.props.navigator.pop()}>
            <Text style={{color:'white', fontSize:15}}>关闭</Text>
          </TouchableOpacity>
          <Text style={{flex:1, textAlign: 'center', color:'white', fontSize:18, fontWeight:'bold', paddingTop:9}}>用户登录</Text>
          <TouchableOpacity style={styles.button} onPress={this._onCommit.bind(this)}>
            <Text style={{color:'white', fontSize:15}}>提交</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex:1, backgroundColor:'white'}}>
          <TextInput
            style={{padding:8, paddingTop:2, margin:10, height: 36, backgroundColor:'#fff', fontSize:16, borderRadius:5, borderBottomWidth:1, borderBottomColor:'grey',}}
            onChangeText={(text) => this.setState({accesstoken: text})} multiline={true}
            placeholder="请输入 Access Token" autoFocus={true} value={this.state.accesstoken}
          />
          {this.hint()}
          <Text style={{margin:10}}>请首先通过浏览器登录cnodejs, 登录后, 在设置页面最下面可以看到自己的Access Token, 输入并提交即可:)</Text>
          <TouchableOpacity style={{margin:10, alignItems:'center', height:40, justifyContent:'center',
                                    borderRadius:8, backgroundColor:'#80bd00'}}
                            onPress={this._onOpenWeb.bind(this)}>
            <Text style={{color:'white', fontSize:16}}>点击这里去登录获取AccessToken</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

}