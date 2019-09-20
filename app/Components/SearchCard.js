import React from 'react';
import {TouchableOpacity, View, Animated} from 'react-native';
import styled from 'styled-components';
import {RegularText, MediumText} from './Text';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';

export class SearchCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: new Animated.Value(55),
      isOpen: false,
    };
  }
  toggleHeight = () => {
    if (this.state.isOpen) {
      Animated.timing(this.state.height, {
        toValue: 55,
      }).start(() => this.setState({isOpen: false}));
    } else {
      Animated.timing(this.state.height, {
        toValue: 100,
      }).start(() => this.setState({isOpen: true}));
    }
  };

  render() {
    let status;

    if (this.props.pending)
      status = <IconOutline name="ellipsis" size={26} color="#8E8E8E" />;
    else if (this.props.done)
      status = <IconOutline name="check-circle" size={26} color="#2ECC71" />;
    else if (this.props.error)
      status = <IconOutline name="close-circle" size={26} color="#E74C3C" />;
    else if (this.props.warning)
      status = <IconOutline name="warning" size={26} color="#FED000" />;
    return (
      <TouchableOpacity onPress={this.toggleHeight}>
        <Animated.View
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.1,
            shadowRadius: 1.65,
            height: this.state.height,
            width: 320,
            borderRadius: 10,
            marginVertical: 10,
            paddingHorizontal: 16,
            paddingTop: 14,
            backgroundColor: '#fff',
            alignSelf: 'center',
            flexDirection: 'row',
          }}>
          <RegularText
            size={16}
            addStyle={{width: 260, paddingTop: 4}}
            numberOfLines={1}>
            {this.props.text}
          </RegularText>
          {status}
        </Animated.View>
      </TouchableOpacity>
    );
  }
}
