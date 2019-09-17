import React from 'react';
import {Text, Dimensions} from 'react-native';
import {COLORS} from '../global/colors';

const {width} = Dimensions.get('window');

export const RegularText = props => (
  <Text
    style={{
      fontSize: props.size || 20,
      color: props.color || COLORS.TEXT,
      fontFamily: 'Quicksand-Regular',
      textAlign: props.textAlign || 'left',
      ...props.addStyle,
    }}
    onPress={props.onPress}
    {...props}>
    {props.children}
  </Text>
);

export const BoldText = props => (
  <Text
    style={{
      fontSize: props.size || 20,
      color: props.color || COLORS.TEXT,
      fontFamily: 'Quicksand-Bold',
      textAlign: props.textAlign || 'left',
      ...props.addStyle,
    }}
    onPress={props.onPress}
    {...props}>
    {props.children}
  </Text>
);

export const MediumText = props => (
  <Text
    style={{
      fontSize: props.size || 20,
      color: props.color || COLORS.TEXT,
      fontFamily: 'Quicksand-Medium',
      textAlign: props.textAlign || 'left',
      ...props.addStyle,
    }}
    onPress={props.onPress}
    {...props}>
    {props.children}
  </Text>
);
