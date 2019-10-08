import React from 'react';
import {
  View,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {BottomTabBar} from 'react-navigation-tabs';
import styled from 'styled-components';
import LottieView from 'lottie-react-native';

import {COLORS} from '../global/colors';
import {IconOutline} from '@ant-design/icons-react-native';
import {RegularText, MediumText} from './Text';
import Header from './Header';
import {TextInput} from 'react-native-gesture-handler';

const {height, width} = Dimensions.get('window');

const SearchBar = styled.TextInput`
  height: 50px;
  width: ${width - 32}px;
  border-radius: 50px;
  box-shadow: 0px 3px 10px #ff7e674d;
  background-color: #fff;
  font-family: Quicksand-Regular;
  padding-horizontal: 16px;
`;

const SearchButton = styled.TouchableOpacity`
  height: 34px;
  width: 128px;
  border-radius: 34px;
  box-shadow: 0px 3px 5px #ff7e674d;
  background-color: #ff7e67;
  padding-horizontal: 16px;
  flex-direction: row;
  align-items: center;
`;

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchOpen: false,
    };
  }
  render() {
    return (
      <View>
        <BottomTabBar
          {...this.props}
          style={{
            backgroundColor: COLORS.ACCENT,
            borderTopColor: 'transparent',
            shadowColor: COLORS.ACCENT,
            shadowOffset: {
              width: 0,
              height: -3,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}></BottomTabBar>
        <View
          style={{
            backgroundColor: 'transparent',
            height: 100,
            width: 105,
            position: 'absolute',
            alignSelf: 'center',
          }}
        />
        <TouchableOpacity
          onPress={() => this.setState({isSearchOpen: true})}
          style={{
            backgroundColor: '#FF7E67',
            height: 62,
            width: 62,
            borderRadius: 62,
            top: -31,
            alignSelf: 'center',
            position: 'absolute',
            shadowColor: '#FF7E67',
            shadowOffset: {
              width: 0,
              height: -3,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IconOutline name="search" color={'#fff'} size={34} />
        </TouchableOpacity>

        <Modal visible={this.state.isSearchOpen} animationType="slide">
          <SafeAreaView style={{flex: 1, backgroundColor: COLORS.BG}}>
            <Header
              title="Search"
              showX
              onPressX={() => this.setState({isSearchOpen: false})}
            />
            <LottieView
              source={require('../global/waves.json')}
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
                height: width * 0.3,
                position: 'absolute',
                bottom: 0,
              }}
            />
            <View style={{marginHorizontal: 16, alignItems: 'center'}}>
              <View style={{position: 'absolute', top: height / 8}}>
                <RegularText textAlign="center">
                  Get in-depth info of a <MediumText>domain,</MediumText>
                </RegularText>
                <RegularText textAlign="center">
                  Verify an <MediumText>email address</MediumText> or
                </RegularText>
                <RegularText textAlign="center">
                  just type in a <MediumText>username!</MediumText>
                </RegularText>
              </View>
              <KeyboardAvoidingView
                behavior={'position'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0}
                style={{position: 'absolute', top: height / 2.5}}>
                <View>
                  <SearchBar
                    placeholder="Search for a domain, email or a username…"
                    autoCapitalize={false}
                    autoCorrect={false}
                    keyboardShouldPersistTaps={'handled'}
                  />
                  <SearchButton
                    style={{
                      alignSelf: 'flex-end',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <IconOutline name="search" color={'#fff'} size={18} />
                    <View style={{width: 2}} />
                    <RegularText color="#fff" size={14}>
                      Search
                    </RegularText>
                  </SearchButton>
                </View>
              </KeyboardAvoidingView>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}
