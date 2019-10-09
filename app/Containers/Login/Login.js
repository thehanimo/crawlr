import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  StatusBar,
  Image,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import {COLORS} from '../../global/colors';
import {RegularText, BoldText, MediumText} from '../../Components/Text';
import {PrimaryButton} from '../../Components/Button';
import styled from 'styled-components';
import {API} from '../../global/constants';
import {storeData} from '../../global/localStorage';
import NavigationService from '../../../NavigationService';
import {IconOutline} from '@ant-design/icons-react-native';

const {height, width} = Dimensions.get('window');

const PrimaryProfileImage = styled.View`
  height: 146px;
  width: 146px;
  border-radius: 146px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 26px;
  elevation: 15;
`;

const PrimaryTextInput = styled.TextInput`
  height: 36px;
  width: ${width - 32}px;
  border-radius: 36px;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  font-family: Quicksand-Regular;
  padding-horizontal: 16px;
  elevation: 5;
`;

export const GoButton = styled.TouchableOpacity`
  height: 62px;
  width: 62px;
  border-radius: 62px;
  box-shadow: 0px 3px 6px #0000004d;
  background-color: #5ccbed;
  justify-content: center;
  align-items: center;
  elevation: 10;
`;

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      fullName: '',
      showLoader: false,
      showDone: false,
    };
  }

  componentWillMount = () => {
    const {fullName} = this.props.navigation.getParam('profile', {});
    this.setState({fullName});
  };

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
      this.setState({image: `data:${image.mime};base64,${image.data}`});
    });
  };

  confirm = () => {
    var {fullName} = this.state;
    fullName = fullName.trim();
    if (!fullName) return;
    this.setState({showLoader: true});
    var profile = this.props.navigation.getParam('profile', {});
    profile.fullName = fullName;
    if (this.state.image) profile.image = this.state.image;
    fetch(API + `/auth/confirm`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    })
      .then(response => response.json())
      .then(responseJson => {
        storeData('JWT', responseJson.JWT).then(() => {
          storeData('UserID', responseJson.UserID).then(() =>
            this.setState({showDone: true}, () => {
              ReactNativeHapticFeedback.trigger('notificationSuccess', {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              });
            }),
          );
        });
      })
      .catch(error => {
        alert(error);
      });
  };

  render() {
    const profile = this.props.navigation.getParam('profile', {});
    let firstname = this.state.fullName.split(' ')[0];
    if (firstname.length > 11) firstname = firstname.slice(0, 10) + '...';
    return (
      <React.Fragment>
        <ScrollView
          contentContainerStyle={{
            backgroundColor: COLORS.BG,
            flex: 1,
          }}
          scrollEnabled={false}
          keyboardShouldPersistTaps="handled">
          <SafeAreaView
            style={{
              backgroundColor: COLORS.BG,
              flex: 1,
            }}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <View style={{alignItems: 'center'}}>
                <PrimaryProfileImage>
                  <Image
                    source={{uri: this.state.image || profile.image}}
                    style={{
                      height: 146,
                      width: 146,
                      borderRadius: 146,
                      backgroundColor: 'white',
                    }}
                  />
                  {!this.state.image && !profile.image && (
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
                  )}
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
                  size={firstname.length > 11 ? 24 : 32}
                  textAlign="center"
                  addStyle={{marginHorizontal: 16}}
                  numberOfLines={2}>
                  Welcome{' '}
                  <MediumText size={firstname.length > 11 ? 24 : 32}>
                    {firstname}
                    {'! 🎉'}
                  </MediumText>
                </RegularText>
              </View>
              <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={Platform.OS === 'ios' ? -40 : 0}>
                <View style={{marginHorizontal: 16, marginTop: 40}}>
                  <RegularText>Confirm your details for us!</RegularText>
                  <View style={{marginTop: 20}}>
                    <MediumText size={16}>Name</MediumText>
                    <PrimaryTextInput
                      defaultValue={profile.fullName}
                      onChangeText={text => this.setState({fullName: text})}
                      style={{marginTop: 15}}
                    />
                  </View>
                  <View style={{marginTop: 34}}>
                    <MediumText size={16}>Email</MediumText>
                    <PrimaryTextInput
                      defaultValue={profile.email}
                      editable={false}
                      style={{marginTop: 15}}
                    />
                  </View>
                </View>
                <View style={{height: height / 6}} />
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    alignSelf: 'center',
                  }}>
                  <GoButton onPress={this.confirm}>
                    <BoldText size={26} color={'#fff'}>
                      Go
                    </BoldText>
                  </GoButton>
                </View>
              </KeyboardAvoidingView>
            </View>
          </SafeAreaView>
        </ScrollView>
        {this.state.showLoader && (
          <View
            style={{
              backgroundColor: COLORS.BG + 'BB',
              height,
              width,
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this.state.showDone ? (
              <LottieView
                source={require('../../global/done.json')}
                autoPlay
                loop={false}
                style={{
                  height: 200,
                  width: 200,
                }}
                onAnimationFinish={() =>
                  setTimeout(() => {
                    NavigationService.navigate('connect');
                  }, 1700)
                }
              />
            ) : (
              <LottieView
                source={require('../../global/loader.json')}
                autoPlay
                loop
              />
            )}
          </View>
        )}
      </React.Fragment>
    );
  }
}
