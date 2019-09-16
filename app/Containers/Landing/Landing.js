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

const {height, width} = Dimensions.get('window');
export default class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: null,
    };
  }
  authenticate(accessToken) {
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
          this.setState({accessToken: ''}, () => {
            NavigationService.navigate('login', {
              profile: responseJson,
            });
          });
        }
      })
      .catch(error => {
        this.setState({accessToken: ''});
      });
  }

  onLoginPress = () => {
    this.props.navigation.setParams({accessToken: ''});
    this.setState({accessToken: ''});
    Linking.openURL(API + '/auth/app/linkedin');
  };
  render() {
    if (
      this.props.navigation.getParam('accessToken', null) &&
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
          <Image
            source={require('crawlr/assets/images/bg.png')}
            style={{
              height,
              width,
              backgroundColor: COLORS.BG,
              position: 'absolute',
              bottom: -50,
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
        {accessToken !== '' && (
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
