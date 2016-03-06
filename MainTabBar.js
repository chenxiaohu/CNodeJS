'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Image,
  } = React;


var styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:20,
    backgroundColor:'#333333',
  },

  tabs: {
    height: 58,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    backgroundColor:'#333333',
  },
});

var MainTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    underlineColor : React.PropTypes.string,
    backgroundColor : React.PropTypes.string,
    activeTextColor : React.PropTypes.string,
    inactiveTextColor : React.PropTypes.string,
  },

  renderTabOption(name, page) {
    var isTabActive = this.props.activeTab === page;
    var activeTextColor = this.props.activeTextColor || "white";
    var inactiveTextColor = this.props.inactiveTextColor || "#bbb";
    return (
      <TouchableOpacity style={[styles.tab]} key={name} onPress={() => this.props.goToPage(page)}>
        <View>
          <Text style={{color: isTabActive ? activeTextColor : inactiveTextColor, fontSize: isTabActive ? 15 : 14,
            fontWeight: isTabActive ? 'bold' : 'normal', backgroundColor:'#333333', padding:5, borderRadius:0}}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  },

  renderLeftButton() {
    return (
      <TouchableOpacity style={[styles.tab]} key={0} onPress={this.props.onPress}>
        <Image resizeMode={Image.resizeMode.stretch} style={{width:25, height:25, backgroundColor:'#333333', tintColor:'#bbb',}}
               source={require('./img/user.png')}/>
      </TouchableOpacity>
    );
  },

  render() {
    return (
      <View>
        <View style={[styles.tabs]}>
          {this.renderLeftButton()}
          {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        </View>
      </View>
    );
  },
});

module.exports = MainTabBar;
