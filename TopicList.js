import React from 'react-native';

let {
  Text,
  View,
  StyleSheet,
  ListView,
  Image,
  TouchableOpacity,
  RefreshControl,
  StatusBarIOS,
  } = React;

let styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

import Topic from './Topic';
import Fmt from './Fmt';
import SendTopic from './SendTopic';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class TopicList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource:this.newDs(),
      isRefreshing:false,
      refreshingTitle:'下拉刷新',
      more:true,
      page:1,
      scrollsToTop: props.idx === 0,
    };
  }

  static contextTypes = {
    activeTab: React.PropTypes.number.isRequired
  };

  newDs() {
    return new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  }

  componentWillMount() {
    StatusBarIOS.setStyle(0);
    this.refresh();
    console.log('componentWillMount on Content #' + this.props.idx);
  }

  buildUrl(page) {
    let url = 'https://cnodejs.org/api/v1/topics';
    switch (this.props.idx) {
      case 1: url += '?tab=good'; break;
      case 2: url += '?tab=share'; break;
      case 3: url += '?tab=ask'; break;
      case 4: url += '?tab=job'; break;
      default: url += '?'
    }
    url += '&page='+page+'&limit=20';
    return url;
  }

  refresh() {
    this.setState({isRefreshing: true});
    let url = this.buildUrl(1);
    fetch(url)
      .then(res => res.json())
      .then(res => {
        let data = res.data.map(i => {i.key = i.id; return i});
        console.log(url);
        this.setState({
          data: data,
          dataSource: this.state.dataSource.cloneWithRows(data),
          isRefreshing: false,
          page: 1,
          more:data.length == 20,
        });
      })
      .catch(error => {
        console.log(error)
      })
      .done();
  }

  loadMore() {
    if (!this.state.more) return;
    console.log('MORE--------------');

    let url = this.buildUrl(this.state.page + 1);
    console.log("FETCH:", url);

    fetch(url)
      .then(res => res.json())
      .then(res => {
        let data = res.data.map(i => {i.key = i.id; return i});
        console.log('FETCH-ROWS:', data.length);

        let oldData = this.state.data;
        for (let x of data) {
          oldData.push(x);
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(oldData),
          total: res.total,
          page: this.state.page + 1,
          more: res.data.length == 20,
        });
      })
      .catch(error => {
        console.log(error);
        this.setState(
          {
            loadError: true,
          });
      })
      .done();
  }

  componentDidMount() {
    console.log('componentDidMount on Content #' + this.props.idx);
  }

  tag(topic) {
    if (topic.top) {
      return(
        <Text style={{backgroundColor:'#80bd00', color:'white', fontSize:12, padding:2}}>置顶</Text>
      );
    } else {
      let type;
      if (topic.tab == 'ask' && this.props.idx != 3) {
        type = '问答';
      } else if (topic.tab == 'job' && this.props.idx != 4) {
        type = '招聘';
      } else {
        return null;
      }

      return (
        <Text style={{backgroundColor:'#d9ebb3', color:'white', fontSize:12, padding:2,}}>{type}</Text>
      );
    }
  }

  pick(topic) {
    if (topic.good) {
      return(
        <Text style={{backgroundColor:'#eb6420', color:'white', fontSize:12, padding:2}}>精华</Text>
      );
    }
    return null;
  }

  _openTopic(topic) {
    this.props.navigator.push({
      component: Topic,
      passProps: { topic: topic },
      whiteStatus: true,
    });
  }

  _renderRow(topic) {
    //{this.pick(topic)}
    //<Text style={{color:'#999', fontSize:12, padding:2}}>{this.Fmt.dateDiff(topic.create_at)}</Text>
    return (
      <TouchableOpacity onPress={this._openTopic.bind(this, topic)}>
        <View overflow='hidden' style={{flexDirection:'row', padding:8, flex:1, borderBottomWidth:1, borderBottomColor:'#f0f0f0'}}>
          <View style={{marginRight:10, marginLeft:4}}>
            <Image style={{width:36, height:36, borderRadius:18, marginBottom:8, backgroundColor:'#ddd'}} source={{uri:Fmt.fixFaceUrl(topic.author.avatar_url)}}/>
          </View>
          <View style={{flex:1}}>
            <View style={{flexDirection:'row'}}>
              <Text style={{color:'#999', fontSize:12, padding:0}}>{topic.author.loginname}</Text>
              <View style={{flex:1}}/>
              {this.pick(topic)}
              {this.tag(topic)}
            </View>
            <View style={{flexDirection:'row', paddingTop:0, paddingBottom:5}}>
              <Text numberOfLines={2} style={{fontSize:16, flex:1, }}>{topic.title}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text style={{color:'#999', fontSize:12, padding:0}}>{topic.visit_count}阅读</Text>
              <Text style={{color:'#999', fontSize:12, padding:0}}>/ {topic.reply_count}回复</Text>
              <View style={{flex:1}}/>
              <Text style={{color:'#999', fontSize:12, padding:0}}>{Fmt.dateDiff(topic.last_reply_at)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  _onRefresh() {
    this.refresh();
  }


  _renderFooter() {
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center', padding: 10}}>
        <Text style={{color:'grey'}}>{this.state.more ? '查看更多' : '没有更多了'}</Text>
      </View>
    );
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.activeTab == this.props.idx) {
      this.setState({scrollsToTop: true});
    } else {
      this.setState({scrollsToTop: false});
    }
  }

  _onSendTopic() {
    this.props.navigator.push({
      component: SendTopic,
      passProps: { idx : this.props.idx, parent: this},
      whiteStatus: true,
    });
  }

  render() {
    console.log('render on Content #' + this.props.idx);
    return (
      <View style={[styles.container, {flex:1}]}>
        <ListView
          scrollsToTop={this.state.scrollsToTop}
          scrollIndicatorInsets={{top: 0}}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          onEndReached={(event) => this.loadMore() }
          onEndReachedThreshold={0}
          renderFooter={this._renderFooter.bind(this)}
          refreshControl={
            <RefreshControl
              style={{backgroundColor:'rgba(10,10,10,0.06)'}}
              onRefresh={this._onRefresh.bind(this)}
              refreshing={this.state.isRefreshing}
              title='下拉刷新'
              //tintColor="#ff0000"
              colors={['#ff000000','#00ff0000','#0000ff00']}
              progressBackgroundColor="#ffff0000"
            />
          }
        >
        </ListView>
        <TouchableOpacity
          onPress={this._onSendTopic.bind(this)}
              style={{position:'absolute', right:20, bottom:20, width:60, height:60, borderRadius:30,
              backgroundColor:'rgba(128,189,0,0.6)',}}>
          <Image style={{width:30, height:30, marginTop:15, marginLeft:15, tintColor:'rgba(255,255,255,0.7)'}}  source={require('./img/edit-512.png')}/>
        </TouchableOpacity>
      </View>
    );
  }
}
