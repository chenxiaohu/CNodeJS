'use strict';

import React,{
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Navigator,
  TouchableOpacity,
  ActivityIndicatorIOS,
  Animated,
  WebView,
}  from 'react-native';

import Fmt from './Fmt';
import User from './User';
import Reply from './Reply';

export default class Topic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topic:props.topic,
    };
  }

  onGust(e) {
    let en = e;
    if (this._gust != en) {
      this._gust = en;
      if (en == 'move') {
        console.log('disable webview scroll....')
        this.refs._webView.refs['webview'].setNativeProps({scrollEnabled: false});
      } else if (en == 'release') {
        console.log('enable webview scroll....')
        this.refs._webView.refs['webview'].setNativeProps({scrollEnabled: true});
      }
    }
  }

  componentWillUnmount() {
    this._gustListener.remove();
  }

  componentWillMount() {
    this._gustListener = this.props.navigator.addGustListener('onGust', this.onGust, this);
    this.load();
  }

  load(toEnd) {
    let url = `https://cnodejs.org/api/v1/topic/${this.props.topic.id}`;

    console.log(url);

    fetch(url)
      .then(res => res.json())
      .then(res => {
        if (toEnd) {
          this.setState({topic:res.data, toEnd: true, showReply: false});
        } else {
          this.setState({topic:res.data});
        }
      })
      .catch(error => {console.log(error)})
      .done();
  }

  replies() {
    if (!this.state.topic.replies) return '';

    let x = [];
    for (let r of this.state.topic.replies) {
      x.push(
        `<div style="background-color: #d9ebb3; margin: 0 5px; display: flex; flex-flow: row; border-top-left-radius: 10px; border-top-right-radius: 10px;">
          <a href="https://cnodejs.org/user/${r.author.loginname}">
          <img style="border-radius: 50%; margin: 5px; width: 30px; height: 30px; background-color: white;" src="${Fmt.fixFaceUrl(r.author.avatar_url)}"/></a>
          <span style="color:white; padding-top: 10px;"><a href="https://cnodejs.org/user/${r.author.loginname}" style="color:grey" >${r.author.loginname}</a></span>
          <a href="https://cnodejs.org/reply/${r.id}/${r.author.loginname}" style="display: flex; flex:1;-webkit-tap-highlight-color:rgba(0,0,0,0);"></a>
          <span style="color:grey; padding: 10px 10px 0 0;">${Fmt.dateDiff(r.create_at)}</span>
        </div>`
      );
      x.push( r.content );
    }
    return x.join('');
  }

  _onShouldStartLoadWithRequest(e) {
    if (e.url.indexOf('https://cnodejs.org/user/') == 0) {
      setImmediate(() => {
        this.props.navigator.push( {
            component: User,
            passProps: {
              loginname: e.url.substring(25),
            },
          })
        });
      return false;
    }
    if (e.url.indexOf('https://cnodejs.org/topic/') == 0) {
      setImmediate(() => {
        this.props.navigator.push({
          component: Topic,
          passProps: {
            topic: {id: e.url.substring(26)}
          },
        });
      })
      return false;
    }
    if (e.url.indexOf('https://cnodejs.org/reply/') == 0) {
      this.setState({showReply:true, replyTo:e.url.substring(51), replyId: e.url.substring(26,50)});
      return false;
    }
    /*
    if (e.navigationType && e.navigationType == 5 && e.url.indexOf('http://') == 0) {
      return true;
    } else {
      if (e.url.indexOf('pcautoclub://comment/') == 0) {
        this.openComment(this.props.article);
      }
    }
    */
    return true;
  }

  reloadToEnd() {
    this.load(true);
  }

  render() {
    let topic = this.state.topic;
    if (!topic.author) {
      return null;
    }

    let toEnd = '';
    if (this.state.toEnd) {
      toEnd = ' onLoad="javascript:document.getElementsByTagName(\'BODY\')[0].scrollTop=document.getElementsByTagName(\'BODY\')[0].scrollHeight;"'
    }

    let html = `<html><head>${markdownCss}</head><body${toEnd}>

    <div style="background-color: #333333; display: flex; flex-flow:row;">
      <a href="https://cnodejs.org/user/${topic.author.loginname}">
      <img style="border-radius: 50%; margin: 10px; width: 60px; height: 60px;background-color: white;" src="${Fmt.fixFaceUrl(topic.author.avatar_url)}"/>
      </a>
      <div style="flex: 1; flex-flow: column; display: flex;">
        <div style="font-weight: bold; font-size:18px; color:white; padding: 5px 5px 0 0; min-height: 30px;">${topic.title}</div>
        <div style="display:flex; flex:1;"></div>
        <div style="color:white; padding-bottom: 5px;">
          <a href="https://cnodejs.org/user/${topic.author.loginname}" style="color:white" >${topic.author.loginname}</a> - ${Fmt.dateDiff(topic.create_at)}
        </div>
      </div>
    </div>
    ${topic.content}
    ${this.replies()}
    <div style="height:50px;"></div>
    </body></html>`;

    return (
      <View style={styles.container}>
        <WebView
          ref="_webView"
          automaticallyAdjustContentInsets
          style={{backgroundColor:'#333333'}}
          source={{html:html, baseUrl:'https://cnodejs.org/topicx/'+ topic.id}}
          onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest.bind(this)}
        />
        <TouchableOpacity onPress={() => this.props.navigator.pop()}
                          style={{position:'absolute', left:10, bottom:10, width:60, height:60, borderRadius:30,
                          backgroundColor:'rgba(38,38,38,0.4)'}}>
          <Image style={{width:30, height:30, marginTop:15, marginLeft:15, tintColor:'rgba(255,255,255,0.7)'}}  source={require('./img/back-512.png')}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setState({showReply:true, replyTo:null})}
          style={{position:'absolute', right:10, bottom:10, width:60, height:60, borderRadius:30, backgroundColor:'rgba(128,189,0,0.6)',}}>
          <Image style={{width:30, height:30, marginTop:8, marginLeft:8, tintColor:'rgba(255,255,255,0.7)'}}  source={require('./img/chat-512.png')}/>
          <Text style={{position:'absolute', top:36,left:25, color:'white'}}>{topic.reply_count}</Text>
        </TouchableOpacity>
        {this.state.showReply ? <Reply parent={this} replyTo={this.state.replyTo} replyId={this.state.replyId}/> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    paddingTop:20,
    backgroundColor:'#333333',
  }
});



const markdownCss = `<style>

body {
   font-size: 16px;
   line-height: 1.6;
   padding-top: 0px;
   padding-bottom: 0px;
   background-color: white;
   padding: 0px;
   margin:0;
   font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;
   }

body  div.markdown-text {
  overflow: hidden;
  margin:10px !important;
}

body > *:first-child {
   margin-top: 0 !important; }
body > *:last-child {
   margin-bottom: 0 !important; }

* {word-wrap:break-word;}

a {
   color: #80bd00;
   text-decoration:none;}
a.absent {
   color: #cc0000; }
a.anchor {
   display: block;
   padding-left: 30px;
   margin-left: -30px;
   cursor: pointer;
   position: absolute;
   top: 0;
   left: 0;
   bottom: 0; }

h1, h2, h3, h4, h5, h6 {
   margin: 20px 0 10px;
   padding: 0;
   font-weight: bold;
   -webkit-font-smoothing: antialiased;
   cursor: text;
   position: relative; }

h1:hover a.anchor, h2:hover a.anchor, h3:hover a.anchor, h4:hover a.anchor, h5:hover a.anchor, h6:hover a.anchor {
   text-decoration: none; }

h1 tt, h1 code {
   font-size: inherit; }

h2 tt, h2 code {
   font-size: inherit; }

h3 tt, h3 code {
   font-size: inherit; }

h4 tt, h4 code {
   font-size: inherit; }

h5 tt, h5 code {
   font-size: inherit; }

h6 tt, h6 code {
   font-size: inherit; }

h1 {
   font-size: 28px;
   color: black; }

h2 {
   font-size: 24px;
   border-bottom: 1px solid #cccccc;
   color: black; }

h3 {
   font-size: 18px; }

h4 {
   font-size: 16px; }

h5 {
   font-size: 14px; }

h6 {
   color: #777777;
   font-size: 14px; }

p, blockquote, ul, ol, dl, li, table, pre {
   margin: 15px 0; }

hr {
   border: 0 none;
   color: #cccccc;
   height: 4px;
   padding: 0;
}

body > h2:first-child {
   margin-top: 0;
   padding-top: 0; }
body > h1:first-child {
   margin-top: 0;
   padding-top: 0; }
body > h1:first-child + h2 {
   margin-top: 0;
   padding-top: 0; }
body > h3:first-child, body > h4:first-child, body > h5:first-child, body > h6:first-child {
   margin-top: 0;
   padding-top: 0; }

a:first-child h1, a:first-child h2, a:first-child h3, a:first-child h4, a:first-child h5, a:first-child h6 {
   margin-top: 0;
   padding-top: 0; }

h1 p, h2 p, h3 p, h4 p, h5 p, h6 p {
   margin-top: 0; }

li p.first {
   display: inline-block; }
li {
   margin: 0; }
ul, ol {
   padding-left: 28px; }

ul :first-child, ol :first-child {
   margin-top: 0; }

dl {
   padding: 0; }
dl dt {
   font-size: 14px;
   font-weight: bold;
   font-style: italic;
   padding: 0;
   margin: 15px 0 5px; }
dl dt:first-child {
   padding: 0; }
dl dt > :first-child {
   margin-top: 0; }
dl dt > :last-child {
   margin-bottom: 0; }
dl dd {
   margin: 0 0 15px;
   padding: 0 15px; }
dl dd > :first-child {
   margin-top: 0; }
dl dd > :last-child {
   margin-bottom: 0; }

blockquote {
   border-left: 4px solid #dddddd;
   padding: 0 15px;
   color: #777777; }
blockquote > :first-child {
   margin-top: 0; }
blockquote > :last-child {
   margin-bottom: 0; }

table {
   overflow-y: hidden;
   overflow-x: hidden;
   width:100%;
   padding: 0;border-collapse: collapse; }
table tr {
   border-top: 1px solid #cccccc;
   background-color: white;
   margin: 0;
   padding: 0; }
table tr:nth-child(2n) {
   background-color: #f8f8f8; }
table tr th {
   font-weight: bold;
   border: 1px solid #cccccc;
   margin: 0;
   padding: 6px 13px; }
table tr td {
   border: 1px solid #cccccc;
   margin: 0;
   padding: 6px 13px; }
table tr th :first-child, table tr td :first-child {
   margin-top: 0; }
table tr th :last-child, table tr td :last-child {
   margin-bottom: 0; }

img {
   max-width: 100%; }

span.frame {
   display: block;
   overflow: hidden; }
span.frame > span {
   border: 1px solid #dddddd;
   display: block;
   float: left;
   overflow: hidden;
   margin: 13px 0 0;
   padding: 7px;
   width: auto; }
span.frame span img {
   display: block;
   float: left; }
span.frame span span {
   clear: both;
   color: #333333;
   display: block;
   padding: 5px 0 0; }
span.align-center {
   display: block;
   overflow: hidden;
   clear: both; }
span.align-center > span {
   display: block;
   overflow: hidden;
   margin: 13px auto 0;
   text-align: center; }
span.align-center span img {
   margin: 0 auto;
   text-align: center; }
span.align-right {
   display: block;
   overflow: hidden;
   clear: both; }
span.align-right > span {
   display: block;
   overflow: hidden;
   margin: 13px 0 0;
   text-align: right; }
span.align-right span img {
   margin: 0;
   text-align: right; }
span.float-left {
   display: block;
   margin-right: 13px;
   overflow: hidden;
   float: left; }
span.float-left span {
   margin: 13px 0 0; }
span.float-right {
   display: block;
   margin-left: 13px;
   overflow: hidden;
   float: right; }
span.float-right > span {
   display: block;
   overflow: hidden;
   margin: 13px auto 0;
   text-align: right; }

code, tt {
   margin: 0 2px;
   padding: 0 5px;
   border: 1px solid #eaeaea;
   background-color: #f8f8f8;
   border-radius: 3px; }

pre code {
   margin: 0;
   padding: 0;
   white-space: pre;
   border: none;
   background: transparent; }

.highlight pre {
   background-color: #f8f8f8;
   border: 1px solid #cccccc;
   font-size: 13px;
   line-height: 19px;
   overflow: auto;
   padding: 6px 10px;
   border-radius: 3px; }

pre {
   background-color: #f8f8f8;
   border: 1px solid #cccccc;
   font-size: 13px;
   line-height: 19px;
   overflow: auto;
   padding: 6px 10px;
   border-radius: 3px; }
pre code, pre tt {
   background-color: transparent;
   border: none; }

sup {
   font-size: 0.83em;
   vertical-align: super;
   line-height: 0;
}
* {
	 -webkit-print-color-adjust: exact;
}
@media screen and (min-width: 914px) {
   body {
      width: 854px;
      margin:0 auto;
   }
}
@media print {
	 pre {
		  page-break-inside: avoid;
	 }
	 pre {
		  word-wrap: break-word;
	 }
}
</style>
`;
