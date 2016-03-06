'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
  StatusBarIOS,
} from 'react-native';

import NavX from './NavX';
import TopicList from './TopicList';
import User from './User'
import Login from './Login'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MainTabBar from './MainTabBar'
import Store from './Store';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    };

    Store.init();
  }

  static childContextTypes = {
    activeTab: React.PropTypes.number,
  };

  getChildContext() {
    return {
      activeTab: this.state.activeTab
    };
  }

  _onUserPress() {
    this.props.navigator.push({
      component: Store.get('accesstoken') ? User : Login,
      passProps: {
        loginname: 'chenxiaohu',
        avatar_url: 'https://avatars.githubusercontent.com/u/1464440?v=3&s=120',
      },
      whiteStatus:true,
    });
  }

  componentDidMount() {
    StatusBarIOS.setStyle(1);
  }

  _onChangeTab(e) {
    if (e.i != this.state.activeTab) {
      this.setState({activeTab: e.i});
    }
  }

  render() {
    return (
      <ScrollableTabView
        contentProps={{scrollsToTop:false}}
        initialPage={0}
        onChangeTab={this._onChangeTab.bind(this)}
        renderTabBar={() => <MainTabBar onPress={this._onUserPress.bind(this)}/>}>
        <TopicList idx={0} tabLabel="最新" navigator={this.props.navigator}/>
        <TopicList idx={1} tabLabel="精华" navigator={this.props.navigator}/>
        <TopicList idx={2} tabLabel="分享" navigator={this.props.navigator}/>
        <TopicList idx={3} tabLabel="问答" navigator={this.props.navigator}/>
        <TopicList idx={4} tabLabel="招聘" navigator={this.props.navigator}/>
      </ScrollableTabView>
    );
  }
}

class CNodeJS extends Component {

  _navigatorDidFocus(e) {
    StatusBarIOS.setStyle(1);
    //StatusBarIOS.setStyle(e.data.route.whiteStatus? 1 : 1);
  }

  render() {
    let sc = Navigator.SceneConfigs.FloatFromRight;
    sc.gestures.pop.edgeHitWidth = 500;
    return (
      <NavX
        sceneStyle={{overflow: 'visible'}}
        initialRoute={{component: App, whiteStatus: false}}
        ref={navigator => {
          navigator && navigator.navigationContext.addListener('didfocus', this._navigatorDidFocus);
        }}
        configureScene={() => {
          return sc;
        }}
        renderScene={(route, navigator) => {
          if (route.component) {
            return <route.component navigator={navigator} {...route.passProps}/>;
          }
        }}
      />
    );
  }
}

AppRegistry.registerComponent('CNodeJS', () => CNodeJS);
