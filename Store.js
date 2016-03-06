'use strict';

import {AsyncStorage} from 'react-native';

var data = {};

export default class Store {

  static get(key) {
    return data[key];
  }

  static set(key, value) {
    data[key] = value;
    AsyncStorage.setItem('data', JSON.stringify(data)).done();
  }

  static init() {
    AsyncStorage.getItem('data')
      .then((_data) => {
        if (_data) {
          data = JSON.parse(_data);
        }
      })
      .done();
  }

}

