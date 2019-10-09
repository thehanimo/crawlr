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

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      showEditBio: false,
      isLoading: true,
      image: '',
    };
  }

  chooseImage = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      includeBase64: true,
      cropperCircleOverlay: true,
      compressImageMaxHeight: 500,
      forceJpg: true,
    }).then(image => {
      this.onEditImageClose(`data:${image.mime};base64,${image.data}`);
    });
  };

  logout = () => {
    storeData('JWT', '');
    storeData('UserID', '');
    NavigationService.navigate('landing');
  };

  getProfileImage = () => {
    getData('JWT').then(jwt => {
      if (!jwt) NavigationService.navigate('landing');
      fetch(API + `/user`, {
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
          fetch(API + `/user`, {
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

  onGetPremium = paymentID => {
    this.setState({isLoading: true}, () => {
      getData('JWT').then(jwt => {
        if (!jwt) NavigationService.navigate('landing');
        fetch(API + `/user`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: jwt,
          },
          body: JSON.stringify({
            paymentID,
          }),
        }).then(() => this.setState({profile: null}));
      });
    });
  };

  onEditImageClose = newImg => {
    this.setState({isLoading: true}, () => {
      getData('JWT').then(jwt => {
        if (!jwt) NavigationService.navigate('landing');
        fetch(API + `/user`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: jwt,
          },
          body: JSON.stringify({
            image: newImg,
          }),
        }).then(() => this.setState({profile: null}));
      });
    });
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
        <Header
          title="My Account"
          showRefresh
          onPressRefresh={() =>
            this.setState({isLoading: true}, this.getProfileImage)
          }
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
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 0,
                  backgroundColor: 'white',
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
                }}
                onPress={this.chooseImage}>
                <IconOutline name="edit" />
              </TouchableOpacity>
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
              karma={profile.karma}
            />
            <View style={{position: 'absolute', bottom: 0, right: width / 30}}>
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

            <View style={{position: 'absolute', bottom: 0, left: width / 30}}>
              {profile.isPremiumUser ? (
                <View style={{width: 128, height: 34}} />
              ) : (
                <GetPremiumButton
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}
                  onPress={() => {
                    var options = {
                      description: 'Premium User Subscription',
                      image: 'https://crawlr-api.herokuapp.com/logo.jpg',
                      currency: 'INR',
                      key: 'rzp_test_1DP5mmOlF5G5ag',
                      amount: '50000',
                      name: 'crawlr Inc.',
                      prefill: {
                        email: profile.email,
                        contact: '',
                        name: profile.fullName,
                      },
                      theme: {color: COLORS.PRIMARY},
                    };
                    RazorpayCheckout.open(options)
                      .then(data => {
                        this.onGetPremium(data.razorpay_payment_id);
                      })
                      .catch(error => {
                        if (error.code && error.code === 2) {
                          alert(`We didn't receive your payment. 🙁`);
                        } else {
                          alert(`Oops! Something went wrong.. 🤔`);
                        }
                      });
                  }}>
                  <IconOutline name="star" color={'#000'} size={18} />
                  <View style={{width: 2}} />
                  <RegularText color="#000" size={14}>
                    Get Premium
                  </RegularText>
                </GetPremiumButton>
              )}
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
