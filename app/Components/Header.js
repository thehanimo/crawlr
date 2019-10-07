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
          zIndex: 2,
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
              marginTop: 14.5,
              right: 16,
            }}>
            <IconOutline name="close" size={24} />
          </TouchableOpacity>
        )}
        {this.props.showXLeft && (
          <TouchableOpacity
            onPress={this.props.onPressXLeft}
            style={{
              position: 'absolute',
              marginTop: 14.5,
              left: 16,
            }}>
            <IconOutline name="close" size={24} />
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
            <IconOutline name="check" size={24} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
