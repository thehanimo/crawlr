import React, {Component} from 'react';
import {Linking, Platform, View, Dimensions, Text} from 'react-native';
import LottieView from 'lottie-react-native';

import {Application} from './router';
import NavigationService from './NavigationService';
import {COLORS} from './app/global/colors';
import {getData} from './app/global/localStorage';

const {height, width} = Dimensions.get('window');
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }
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
    getData('JWT').then(data => {
      this.setState({isLoading: false});
      if (data) NavigationService.navigate('connect');
    });
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
      <React.Fragment>
        {this.state.isLoading ? (
          <View
            style={{
              backgroundColor: COLORS.BG + 'BB',
              height,
              width,
              position: 'absolute',
            }}>
            <LottieView
              source={require('./app/global/loader.json')}
              autoPlay
              loop
            />
          </View>
        ) : (
          <Application
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        )}
      </React.Fragment>
    );
  }
}
