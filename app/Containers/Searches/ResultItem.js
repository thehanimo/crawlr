import React, {Component} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TextInput,
  StatusBar,
  Image,
  Dimensions,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {COLORS} from '../../global/colors';
import {RegularText, BoldText, MediumText} from '../../Components/Text';
import {PrimaryButton} from '../../Components/Button';
import styled from 'styled-components';
import {API} from '../../global/constants';
import Header from '../../Components/Header';
import {SearchCard} from '../../Components/SearchCard';
import {IconOutline} from '@ant-design/icons-react-native';
import {getData} from '../../global/localStorage';

const {height, width} = Dimensions.get('window');

const PrimaryProfileImage = styled.View`
  height: 146px;
  width: 146px;
  border-radius: 146px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 26px;
`;

export default class ResultItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropDownHeight: null,
      currHeight: null,
      isOpen: true,
    };
  }

  close = () => {
    Animated.timing(this.state.currHeight, {
      toValue: 0,
    }).start(() => this.setState({isOpen: false}));
  };

  open = () => {
    Animated.timing(this.state.currHeight, {
      toValue: this.state.dropDownHeight,
    }).start(() => this.setState({isOpen: true}));
  };

  toggleHeight = () => {
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  render() {
    if (this.state.currHeight) {
      var op = this.state.currHeight.interpolate({
        inputRange: [0, this.state.dropDownHeight],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      });
      var spin = this.state.currHeight.interpolate({
        inputRange: [0, this.state.dropDownHeight],
        outputRange: ['270deg', '360deg'],
      });
    } else {
      op = 1;
      spin = '270deg';
    }
    const {item} = this.props;
    return (
      <View style={{paddingHorizontal: 16, paddingBottom: 26}}>
        <TouchableOpacity onPress={this.toggleHeight}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
            {item.Icon.Feather ? (
              <Icon
                name={item.Icon.name}
                size={16}
                color="#000"
                style={{paddingTop: 2}}
              />
            ) : (
              <IconOutline
                name={item.Icon.name}
                size={16}
                color="#000"
                style={{paddingTop: 2}}
              />
            )}
            <View style={{width: 4}} />
            <MediumText size={18}>{item.title}</MediumText>
            <Animated.View
              style={{
                transform: [{rotate: spin}],
                justifyContent: 'center',
                alignItems: 'center',
                height: 20,
                width: 20,
                marginTop: 2,
              }}>
              <Icon name={'chevron-down'} size={20} color="#000" />
            </Animated.View>
          </View>
        </TouchableOpacity>
        <Animated.View
          style={{
            height: this.state.currHeight,
            overflow: 'hidden',
            opacity: op,
          }}
          onLayout={event => {
            if (this.state.dropDownHeight) return;
            var {x, y, width, height} = event.nativeEvent.layout;
            this.setState({
              dropDownHeight: height,
              currHeight: new Animated.Value(height),
            });
          }}>
          {item.content.map(data => (
            <View style={{marginBottom: 6}}>
              <RegularText
                size={14}
                onPress={data.link ? () => Linking.openURL(data.link) : null}
                color={data.link ? '#07689F' : '#000'}
                addStyle={{textDecorationLine: data.link ? 'underline' : null}}>
                {data.body}
                <MediumText size={14}> {data.secondaryBody}</MediumText>
              </RegularText>
            </View>
          ))}
        </Animated.View>
      </View>
    );
  }
}
