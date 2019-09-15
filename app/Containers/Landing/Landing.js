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
} from 'react-native';
import {COLORS} from '../../global/colors';
import {RegularText, BoldText} from '../../Components/Text';
import {PrimaryButton} from '../../Components/Button';

const {height, width} = Dimensions.get('window');
export default class Landing extends Component {
  render() {
    return (
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
            <PrimaryButton>
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
    );
  }
}
