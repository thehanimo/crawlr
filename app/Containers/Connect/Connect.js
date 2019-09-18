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
import {API} from '../../global/constants';
import Header from '../../Components/Header';

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

export default class Connect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
    };
  }

  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: COLORS.BG,
          flex: 1,
        }}>
        <Header title="Connect" showPlusButton shadow />
        <View style={{height: 100, width: 100, backgroundColor: 'red'}}></View>
      </SafeAreaView>
    );
  }
}
