import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import {RegularText, MediumText} from './Text';
import {IconFill} from '@ant-design/icons-react-native';

export const StyledCard = styled.TouchableOpacity`
  height: 55px;
  width: 320px;
  border-radius: 10px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
  margin-vertical: 10px;
  padding: 16px;
  background-color: #fff;
  align-items: center;
  align-self: center;
  flex-direction: row;
  justify-content: space-between;
`;

export const TrendingCard = props => (
  <StyledCard onPress={props.onPress}>
    <RegularText size={16} addStyle={{width: 220}} numberOfLines={1}>
      {props.text}
    </RegularText>
    <View style={{flexDirection: 'row'}}>
      <IconFill name="trophy" size={26} color="#FBC02D" />
      <View style={{width: 4}} />
      <MediumText color="#FBC02D" addStyle={{width: 40}}>
        {props.score}
      </MediumText>
    </View>
  </StyledCard>
);
