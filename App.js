import React, {Component} from 'react';
import {Linking, Platform} from 'react-native';

import {Application} from './router';
import NavigationService from './NavigationService';

export default class App extends Component {
  componentDidMount() {
    if (Platform.OS === 'android') {
      Linking.getInitialURL()
        .then(url => {
          if (url) {
            this.handleOpenURL(url);
          }
        })
        .catch(err => console.error('An error occurred', err));
    }
    Linking.addEventListener('url', this.handleOpenURL);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }
  handleOpenURL = event => {
    this.navigate(event.url);
  };
  navigate = url => {
    const route = url.replace(/.*?:\/\//g, '');
    const routeName = route.split('/')[0];
    const msg = route.split('/').splice(1);
    let accessToken = '';
    if (routeName == 'login') {
      accessToken = msg[0];
      NavigationService.navigate('landing', {
        accessToken: accessToken,
      });
    }
  };

  render() {
    return (
      <Application
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}
