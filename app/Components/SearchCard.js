import React from 'react';
import {TouchableOpacity, View, Animated} from 'react-native';
import styled from 'styled-components';
import {RegularText, MediumText} from './Text';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';

const ActionButton = styled.TouchableOpacity`
  height: 24px;
  width: 80px;
  border-radius: 34px;
  box-shadow: 0px 0px 10px #0000004d;
  background-color: #e74c3c;
  padding-horizontal: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  elevation: 5;
`;

export class SearchCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: new Animated.Value(55),
      buttonOpacity: new Animated.Value(0),
      isOpen: false,
    };
  }
  toggleHeight = () => {
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  close = () => {
    Animated.stagger(200, [
      Animated.timing(this.state.buttonOpacity, {
        toValue: 0,
      }),
      Animated.timing(this.state.height, {
        toValue: 55,
      }),
    ]).start(() => this.setState({isOpen: false}));
  };

  open = () => {
    this.props.onRef(this);
    Animated.stagger(300, [
      Animated.timing(this.state.height, {
        toValue: 100,
      }),
      Animated.timing(this.state.buttonOpacity, {
        toValue: 1,
      }),
    ]).start(() => this.setState({isOpen: true}));
  };

  render() {
    if (
      this.props.currentlyOpenIndex !== 'NotAnIndex' &&
      this.props.index !== this.props.currentlyOpenIndex
    ) {
      this.close();
    }
    let status;

    if (this.props.status === 'P')
      status = <IconOutline name="ellipsis" size={26} color="#8E8E8E" />;
    else if (this.props.status === 'D')
      status = <IconOutline name="check-circle" size={26} color="#2ECC71" />;
    else if (this.props.status === 'ERR')
      status = <IconOutline name="close-circle" size={26} color="#E74C3C" />;
    else if (this.props.status === 'C')
      status = <IconOutline name="warning" size={26} color="#FED000" />;
    return (
      <TouchableOpacity
        onPress={
          this.props.status === 'P' || this.props.mainError
            ? this.toggleHeight
            : () => {
                this.props.onRef(this);
                this.props.onPress();
              }
        }>
        <Animated.View
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            height: this.state.height,
            width: 320,
            borderRadius: 10,
            marginVertical: 10,
            paddingHorizontal: 16,
            paddingTop: 14,
            backgroundColor: '#fff',
            alignSelf: 'center',
          }}>
          <View style={{flexDirection: 'row'}}>
            <RegularText
              size={16}
              addStyle={{width: 260, paddingTop: 4}}
              numberOfLines={1}>
              {this.props.text}
            </RegularText>
            {status}
          </View>
          <Animated.View
            style={{
              paddingTop: 16,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              opacity: this.state.buttonOpacity,
            }}>
            {this.props.mainError ? (
              <RegularText
                size={12}
                color={this.props.status === 'C' ? '#fbc02d' : '#e74c3c'}
                numberOfLines={2}>
                {this.props.mainError}
              </RegularText>
            ) : (
              <ActionButton
                onPress={() => {
                  this.props.onCancel();
                }}>
                <RegularText size={12} color="#fff">
                  Cancel
                </RegularText>
              </ActionButton>
            )}
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}
