import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Dimensions,
  SafeAreaView,
  Modal,
  Linking,
} from 'react-native';
import LottieView from 'lottie-react-native';

import {COLORS} from '../../global/colors';
import {RegularText, BoldText} from '../../Components/Text';
import {PrimaryButton} from '../../Components/Button';
import {API} from '../../global/constants';
import NavigationService from '../../../NavigationService';
import {storeData} from '../../global/localStorage';

const {height, width} = Dimensions.get('window');
export default class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      isAuthenticating: false,
    };
  }
  authenticate(accessToken) {
    if (this.state.isAuthenticating) return;
    this.setState({isAuthenticating: true}, () => {
      fetch(API + `/auth/linkedin/callback/${accessToken}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson) {
            this.props.navigation.setParams({accessToken: ''});
            if (responseJson.JWT) {
              storeData('JWT', responseJson.JWT).then(() => {
                storeData('UserID', responseJson.UserID).then(() =>
                  this.setState(
                    {accessToken: '', isAuthenticating: false},
                    () => {
                      NavigationService.navigate('connect');
                    },
                  ),
                );
              });
            } else {
              this.setState({accessToken: '', isAuthenticating: false}, () => {
                NavigationService.navigate('login', {
                  profile: responseJson,
                });
              });
            }
          }
        })
        .catch(error => {
          this.setState({accessToken: '', isAuthenticating: false});
        });
    });
  }

  onLoginPress = () => {
    this.props.navigation.setParams({accessToken: ''});
    this.setState({accessToken: ''});
    Linking.openURL(API + '/auth/app/linkedin');
  };
  render() {
    if (
      this.props.navigation.getParam('accessToken', '') &&
      !this.state.accessToken
    ) {
      this.setState({
        accessToken: this.props.navigation.getParam('accessToken', ''),
      });
    }
    const {accessToken} = this.state;
    if (accessToken !== '') this.authenticate(accessToken);
    return (
      <React.Fragment>
        <SafeAreaView style={{backgroundColor: COLORS.BG, flex: 1}}>
          <LottieView
            source={require('../../global/waves.json')}
            style={{
              height: width * 1.5,
              width,
              position: 'absolute',
              bottom: 20,
            }}
            autoPlay
            loop
          />
          <View
            style={{
              backgroundColor: '#0277B2',
              width,
              height: width * 0.4,
              position: 'absolute',
              bottom: 0,
            }}
          />
          <SafeAreaView
            style={{
              alignItems: 'center',
              flex: 1,
            }}>
            <View style={{paddingTop: height / 6}}>
              <RegularText size={60} textAlign="center">
                crawlr
              </RegularText>
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                alignItems: 'center',
              }}>
              <PrimaryButton onPress={this.onLoginPress}>
                <Image
                  source={require('crawlr/assets/images/in-logo.png')}
                  style={{height: 24, width: 24, marginRight: 8}}
                />
                <RegularText size={20} textAlign="center">
                  Continue with LinkedIn
                </RegularText>
              </PrimaryButton>
              <View style={{width: 200, marginTop: 60}}>
                <RegularText size={11} textAlign="center">
                  By continuing, you agree to our{' '}
                  <BoldText size={11}>Terms and Conditions</BoldText>
                </RegularText>
              </View>
            </View>
          </SafeAreaView>
        </SafeAreaView>
        {this.state.isAuthenticating && (
          <View
            style={{
              backgroundColor: COLORS.BG + 'BB',
              height,
              width,
              position: 'absolute',
            }}>
            <LottieView
              source={require('../../global/loader.json')}
              autoPlay
              loop
            />
          </View>
        )}
      </React.Fragment>
    );
  }
}
