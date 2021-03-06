import React from 'react';
import {
  View,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {COLORS} from '../global/colors';
import {IconOutline} from '@ant-design/icons-react-native';
import Icon from 'react-native-vector-icons/Feather';
import {RegularText, BoldText, MediumText} from './Text';

const {height, width} = Dimensions.get('window');

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View
        style={{
          paddingTop: 13,
          paddingBottom: 25,
          backgroundColor: COLORS.BG,
          zIndex: 3,
        }}>
        <MediumText textAlign="center">{this.props.title}</MediumText>
        {this.props.showPlusButton && (
          <TouchableOpacity
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
              backgroundColor: '#2ECC71',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              marginTop: 10,
              right: 16,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.3,
              shadowRadius: 2.65,
            }}
            onPress={this.props.onPlusButtonPress}>
            <IconOutline name="plus" color="#fff" size={20} />
          </TouchableOpacity>
        )}
        {this.props.showX && (
          <TouchableOpacity
            onPress={this.props.onPressX}
            style={{
              position: 'absolute',
              top: -2,
              marginTop: 14.5,
              right: 16,
            }}>
            <Icon name="x" size={24} color="#000" />
          </TouchableOpacity>
        )}
        {this.props.showXLeft && (
          <TouchableOpacity
            onPress={this.props.onPressXLeft}
            style={{
              position: 'absolute',
              top: -2,
              marginTop: 14.5,
              left: 16,
            }}>
            <Icon name="x" size={24} color="#000" />
          </TouchableOpacity>
        )}
        {this.props.showBack && (
          <TouchableOpacity
            onPress={this.props.onPressBack}
            style={{
              position: 'absolute',
              top: -2,
              marginTop: 14.5,
              left: 16,
            }}>
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
        )}
        {this.props.showCheck && (
          <TouchableOpacity
            onPress={this.props.onPressCheck}
            style={{
              position: 'absolute',
              marginTop: 14.5,
              right: 16,
            }}>
            <Icon name="check" size={24} color="#000" />
          </TouchableOpacity>
        )}
        {this.props.showRefresh && (
          <TouchableOpacity
            onPress={this.props.onPressRefresh}
            style={{
              position: 'absolute',
              marginTop: 14.5,
              right: 16,
            }}>
            <Icon name="rotate-cw" size={24} color="#000" />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
