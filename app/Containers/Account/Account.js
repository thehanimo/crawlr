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

import {COLORS} from '../../global/colors';
import {RegularText, BoldText, MediumText} from '../../Components/Text';
import {PrimaryButton} from '../../Components/Button';
import styled from 'styled-components';
import {API} from '../../global/constants';
import Header from '../../Components/Header';
import {getData, storeData} from '../../global/localStorage';
import NavigationService from '../../../NavigationService';
import CountBanner from './CountBanner';
import {IconOutline} from '@ant-design/icons-react-native';
import EditBio from './EditBio';

const {height, width} = Dimensions.get('window');

const PrimaryProfileImage = styled.View`
  height: 146px;
  width: 146px;
  border-radius: 146px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 26px;
`;

const GetPremiumButton = styled.TouchableOpacity`
  height: 34px;
  width: 128px;
  border-radius: 34px;
  box-shadow: 0px 3px 5px #fbc02d4d;
  background-color: #fbc02d;
  padding-horizontal: 16px;
  flex-direction: row;
  align-items: center;
`;

const LogoutButton = styled.TouchableOpacity`
  height: 34px;
  width: 128px;
  border-radius: 34px;
  box-shadow: 0px 3px 5px #e74c3c4d;
  background-color: #e74c3c;
  padding-horizontal: 16px;
  flex-direction: row;
  align-items: center;
`;

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      showEditBio: false,
      isLoading: true,
    };
  }

  logout = () => {
    storeData('JWT', '');
    NavigationService.navigate('landing');
  };

  getProfileImage = () => {
    getData('JWT').then(jwt => {
      if (!jwt) NavigationService.navigate('landing');
      fetch(API + `/users`, {
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

  onEditBioClose = newBio => {
    if (newBio === this.state.profile.bio) {
      this.setState({showEditBio: false});
    } else {
      this.setState({showEditBio: false, isLoading: true}, () => {
        getData('JWT').then(jwt => {
          if (!jwt) NavigationService.navigate('landing');
          fetch(API + `/users/bio`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: jwt,
            },
            body: JSON.stringify({
              bio: newBio,
            }),
          }).then(() => this.setState({profile: null}));
        });
      });
    }
  };

  render() {
    const {profile, isLoading} = this.state;
    if (!profile) this.getProfileImage();
    return (
      <SafeAreaView
        style={{
          backgroundColor: COLORS.BG,
          flex: 1,
        }}>
        <Header title="My Account" />
        {!isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 50,
            }}>
            <PrimaryProfileImage>
              <Image
                source={{uri: profile.image}}
                style={{height: 146, width: 146, borderRadius: 146}}
              />
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
            <TouchableOpacity
              onPress={() => this.setState({showEditBio: true})}>
              <MediumText
                size={12}
                textAlign="center"
                color={profile.bio ? COLORS.TEXT : '#8d8d8d'}
                addStyle={{marginHorizontal: 16, marginTop: 16}}
                numberOfLines={2}>
                {profile.bio || 'Write a bio..'}
              </MediumText>
            </TouchableOpacity>
            <CountBanner
              searches={profile.searches}
              questions={profile.questions}
              replies={profile.replies}
            />
            <View style={{position: 'absolute', bottom: 0, right: 30}}>
              <LogoutButton
                onPress={this.logout}
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                }}>
                <IconOutline name="poweroff" color={'#fff'} size={18} />
                <View style={{width: 2}} />
                <RegularText color="#fff" size={14}>
                  Log out
                </RegularText>
              </LogoutButton>
            </View>

            <View style={{position: 'absolute', bottom: 0, left: 30}}>
              <GetPremiumButton
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                }}>
                <IconOutline name="star" color={'#000'} size={18} />
                <View style={{width: 2}} />
                <RegularText color="#000" size={14}>
                  Get Premium
                </RegularText>
              </GetPremiumButton>
            </View>
            <Modal
              transparent
              visible={this.state.showEditBio}
              animationType="fade">
              <EditBio default={profile.bio} onClose={this.onEditBioClose} />
            </Modal>
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