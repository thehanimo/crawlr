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
} from 'react-native';
import {COLORS} from '../../global/colors';
import {RegularText, BoldText, MediumText} from '../../Components/Text';
import {PrimaryButton} from '../../Components/Button';
import styled from 'styled-components';

const {height, width} = Dimensions.get('window');

const PrimaryProfileImage = styled.View`
  height: 146px;
  width: 146px;
  border-radius: 146px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 26px;
`;

const PrimaryTextInput = styled.TextInput`
  height: 36px;
  width: ${width - 32}px;
  border-radius: 36px;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  font-family: Quicksand-Regular;
  padding-horizontal: 16px;
`;

export const GoButton = styled.TouchableOpacity`
  height: 62px;
  width: 62px;
  border-radius: 62px;
  box-shadow: 0px 3px 10px #5ccbed4d;
  background-color: #5ccbed;
  justify-content: center;
  align-items: center;
`;

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
    };
  }
  render() {
    const profile = this.props.navigation.getParam('profile', {});
    let firstname = profile.fullName.split(' ')[0];
    if (firstname.length > 17) firstname = firstname.slice(0, 16) + '...';
    return (
      <SafeAreaView
        style={{
          backgroundColor: COLORS.BG,
          flex: 1,
        }}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{alignItems: 'center'}}>
            <PrimaryProfileImage>
              <Image
                source={{uri: profile.image}}
                style={{height: 146, width: 146, borderRadius: 146}}
              />
            </PrimaryProfileImage>
            <RegularText
              size={firstname.length > 14 ? 24 : 32}
              textAlign="center"
              addStyle={{marginHorizontal: 16}}
              numberOfLines={2}>
              Welcome{' '}
              <MediumText size={firstname.length > 14 ? 24 : 32}>
                {firstname}
                {'! 🎉'}
              </MediumText>
            </RegularText>
          </View>

          <View style={{marginHorizontal: 16, marginTop: 40}}>
            <RegularText>Confirm your details for us!</RegularText>
            <View style={{marginTop: 20}}>
              <MediumText size={16}>Name</MediumText>
              <PrimaryTextInput
                defaultValue={profile.fullName}
                editable={false}
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
          <View style={{position: 'absolute', bottom: 0, alignSelf: 'center'}}>
            <GoButton>
              <BoldText size={26} color={'#fff'}>
                Go
              </BoldText>
            </GoButton>
          </View>
        </View>
        {/* <SafeAreaView
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          <View style={{position: 'absolute', bottom: 0}}>
            <GoButton>
              <BoldText size={26} color={'#fff'}>
                Go
              </BoldText>
            </GoButton>
          </View>
        </SafeAreaView> */}
      </SafeAreaView>
    );
  }
}
