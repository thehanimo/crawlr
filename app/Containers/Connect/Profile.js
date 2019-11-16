import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  StatusBar,
  Image,
  Modal,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RazorpayCheckout from 'react-native-razorpay';

import {COLORS} from '../../global/colors';
import {RegularText, BoldText, MediumText} from '../../Components/Text';
import {PrimaryButton} from '../../Components/Button';
import styled from 'styled-components';
import {API} from '../../global/constants';
import Header from '../../Components/Header';
import {getData, storeData} from '../../global/localStorage';
import NavigationService from '../../../NavigationService';
import CountBanner from '../Account/CountBanner';
import {IconOutline} from '@ant-design/icons-react-native';

const {height, width} = Dimensions.get('window');

const PrimaryProfileImage = styled.View`
  height: 146px;
  width: 146px;
  border-radius: 146px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 26px;
  elevation: 15;
  background-color: white;
`;

const GetPremiumButton = styled.TouchableOpacity`
  height: 34px;
  width: 128px;
  border-radius: 34px;
  box-shadow: 0px 0px 10px #0000004d;
  background-color: #fbc02d;
  padding-horizontal: 16px;
  flex-direction: row;
  align-items: center;
  elevation: 5;
`;

const LogoutButton = styled.TouchableOpacity`
  height: 34px;
  width: 128px;
  border-radius: 34px;
  box-shadow: 0px 0px 10px #0000004d;
  background-color: #e74c3c;
  padding-horizontal: 16px;
  flex-direction: row;
  align-items: center;
  elevation: 5;
`;

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      isLoading: true,
      image: '',
    };
  }

  getProfileImage = () => {
    const uid = this.props.navigation.getParam('uid', false);
    if (!uid) this.props.navigation.goBack();
    getData('JWT').then(jwt => {
      if (!jwt) NavigationService.navigate('landing');
      fetch(API + `/user?uid=${uid}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: jwt,
        },
      })
        .then(response => response.json())
        .then(profile => this.setState({profile, isLoading: false}))
        .catch(() => NavigationService.navigate('landing'));
    });
  };

  render() {
    const {profile, isLoading} = this.state;
    const uid = this.props.navigation.getParam('uid', false);
    if (!profile) this.getProfileImage();
    return (
      <SafeAreaView
        style={{
          backgroundColor: COLORS.BG,
          flex: 1,
        }}>
        <Header
          title="Profile"
          showRefresh
          onPressRefresh={() =>
            this.setState({isLoading: true}, this.getProfileImage)
          }
          showBack
          onPressBack={() => this.props.navigation.goBack()}
        />
        {!isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 50,
            }}>
            <PrimaryProfileImage>
              <View
                style={{
                  position: 'absolute',
                  height: 146,
                  width: 146,
                  borderRadius: 146,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <IconOutline name="user" size={80} color="#8E8E8E" />
              </View>
              <Image
                source={{uri: profile.image}}
                style={{
                  height: 146,
                  width: 146,
                  borderRadius: 146,
                }}
              />
              {profile.isPremiumUser && (
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 10,
                    backgroundColor: '#fbc02d',
                    height: 30,
                    width: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 15,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 10,
                  }}>
                  <IconOutline name="star" />
                </TouchableOpacity>
              )}
            </PrimaryProfileImage>
            <RegularText
              size={26}
              textAlign="center"
              addStyle={{marginHorizontal: 16}}
              numberOfLines={1}>
              {profile.fullName}
            </RegularText>
            <RegularText
              size={12}
              textAlign="center"
              addStyle={{marginHorizontal: 16}}
              numberOfLines={1}>
              {profile.email}
            </RegularText>
            <View>
              <MediumText
                size={12}
                textAlign="center"
                color={profile.bio ? COLORS.TEXT : '#8d8d8d'}
                addStyle={{marginHorizontal: 16, marginTop: 16}}
                numberOfLines={2}>
                {profile.bio}
              </MediumText>
            </View>
            <CountBanner
              searches={profile.searches.length}
              questions={profile.questions}
              karma={profile.karma}
              onQuestionPress={() =>
                this.props.navigation.push('connect', {uid})
              }
            />
          </View>
        ) : (
          <LottieView
            source={require('../../global/loader.json')}
            autoPlay
            loop
          />
        )}
      </SafeAreaView>
    );
  }
}
