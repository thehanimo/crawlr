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
  Modal,
  FlatList,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Triangle from 'react-native-triangle';
import Icon from 'react-native-vector-icons/Feather';

import {COLORS} from '../../global/colors';
import {RegularText, BoldText, MediumText} from '../../Components/Text';
import {PrimaryButton} from '../../Components/Button';
import styled from 'styled-components';
import {API, getTimeSince} from '../../global/constants';
import Header from '../../Components/Header';
import {getData} from '../../global/localStorage';
import {IconOutline} from '@ant-design/icons-react-native';

const {height, width} = Dimensions.get('window');

const SecondaryProfileImage = styled.View`
  height: 24px;
  width: 24px;
  border-radius: 12px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
`;

const SmallProfileImage = styled.View`
  height: 20px;
  width: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
`;

const CheckIcon = styled.View`
  height: 16px;
  width: 16px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
  position: absolute;
  top: -3px;
  left: -3px;
`;

const ReplyButton = styled.TouchableOpacity`
  height: 26px;
  width: 95px;
  border-radius: 34px;
  box-shadow: 0px 3px 10px #5ccbed4d;
  background-color: #5ccbed;
  padding-horizontal: 16px;
  flex-direction: row;
  align-items: center;
`;

const textStyle = {
  minHeight: 36,
  width: width - 32,
  paddingHorizontal: 12,
  paddingTop: 8,
  paddingBottom: 8,
  borderRadius: 18,
  backgroundColor: '#fff',
  color: '#000',
  fontSize: 14,
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Quicksand-Medium',
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 0},
  shadowOpacity: 0.16,
  shadowRadius: 6,
  marginHorizontal: 16,
  marginTop: 20,
};

const replyStyle = {
  width: width - 32,
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 18,
  borderBottomRightRadius: 0,
  backgroundColor: '#fff',
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 0},
  shadowOpacity: 0.16,
  shadowRadius: 6,
  marginHorizontal: 16,
  marginTop: 20,
};

export default class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fetching: false,
      refreshing: false,
      checkedOnce: false,
      reply: '',
      scrollY: new Animated.Value(0),
      showActionModal: false,
      actionY: 0,
      actionX: 0,
      actionableReplyID: null,
      isVerifyingReply: false,
    };
    this.page = 1;
  }

  componentDidMount() {
    this.fetchDataNextPage(true);
  }
  componentWillMount() {
    getData('UserID').then(uid => this.setState({UserID: uid}));
  }

  fetchDataNextPage = (initial, untilCurrentPage, isDelete) => {
    const item = this.props.navigation.getParam('item', {});
    if (untilCurrentPage) var untilPage = this.page;
    if (initial) {
      if (untilCurrentPage) {
        var untilPage = this.page;
        this.page -= 1;
      } else this.page = 1;
    }
    getData('JWT').then(jwt => {
      if (!jwt) NavigationService.navigate('landing');
      fetch(
        API +
          `/reply?pageNo=${this.page}&questionID=${item.id}&untilPage=${untilPage}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: jwt,
          },
        },
      )
        .then(response => response.json())
        .then(responseData => {
          if (responseData.data.length !== 0 || isDelete) {
            this.page += 1;
            var data = this.state.data;
            var newData;
            if (initial) newData = responseData.data;
            else newData = data.concat(responseData.data);
            this.setState({
              data: newData,
              fetching: false,
              refreshing: false,
              checkedOnce: true,
            });
          } else {
            this.setState({
              fetching: false,
              refreshing: false,
              checkedOnce: true,
            });
          }
        })
        .catch(() => NavigationService.navigate('landing'));
    });
  };

  postReply = () => {
    this.setState({data: [], checkedOnce: false});
    this.textInput.clear();
    this.textInput.blur();
    const item = this.props.navigation.getParam('item', {});
    var {reply} = this.state;
    reply = reply.trim();
    if (!reply) return;
    getData('JWT').then(jwt => {
      if (!jwt) NavigationService.navigate('landing');
      fetch(API + `/reply`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: jwt,
        },
        body: JSON.stringify({
          reply: reply,
          QuestionID: item.id,
        }),
      })
        .then(() => {
          this.setState({
            reply: '',
            refreshing: true,
          });
          this.fetchDataNextPage(true);
        })
        .catch(() => NavigationService.navigate('landing'));
    });
  };

  renderHeader = () => {
    const item = this.props.navigation.getParam('item', {});
    return (
      <React.Fragment>
        <RegularText
          addStyle={{marginHorizontal: 16, width: width - 32}}
          size={26}>
          {item.question}
        </RegularText>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 16,
            marginTop: 16,
          }}>
          <SecondaryProfileImage>
            <Image
              source={{uri: item.image}}
              style={{height: 24, width: 24, borderRadius: 12}}></Image>
          </SecondaryProfileImage>
          <View style={{width: 6}} />
          <MediumText size={12}>{item.fullName}</MediumText>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
            }}>
            <RegularText size={10}>{getTimeSince(item.timestamp)}</RegularText>
          </View>
        </View>
        <View
          style={{
            width: width - 32,
            height: 0.2,
            backgroundColor: '#8E8E8E',
            marginHorizontal: 16,
            marginTop: 20,
          }}
        />

        <AutoGrowingTextInput
          maxLength={100}
          scrollEnabled={false}
          style={textStyle}
          selectionColor="black"
          ref={node => {
            this.textInput = node;
          }}
          onChangeText={text => this.setState({reply: text})}
          onSubmitEditing={() => {}}
          onBlur={() => {}}
          placeholder={'Your reply...'}
          allowFontScaling={false}
        />
        <ReplyButton
          style={{
            alignSelf: 'flex-end',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 8,
            marginRight: 16,
          }}
          onPress={this.postReply}>
          <RegularText color="#fff" size={14}>
            Reply
          </RegularText>
        </ReplyButton>
      </React.Fragment>
    );
  };

  handlePress = (evt, item) => {
    if (this.state.UserID !== item.UserID) {
      ReactNativeHapticFeedback.trigger('notificationError', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
      return;
    }
    this.setState({
      showActionModal: true,
      actionY: evt.nativeEvent.pageY,
      actionX: evt.nativeEvent.pageX,
      actionableReplyID: item.id,
    });
    ReactNativeHapticFeedback.trigger('impactHeavy', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  };

  renderReply = ({item, index}) => (
    <React.Fragment>
      <TouchableOpacity
        activeOpacity={0.7}
        style={replyStyle}
        onLongPress={evt => this.handlePress(evt, item)}>
        <MediumText size={14}>{item.reply}</MediumText>
        {item.isVerified && (
          <CheckIcon>
            <IconOutline
              name="check-circle"
              size={18}
              color={'#2ECC71'}
              style={{marginTop: -0.75, marginLeft: -0.75}}
            />
          </CheckIcon>
        )}
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginHorizontal: 16,
          marginTop: 16,
        }}>
        <RegularText size={10}>{getTimeSince(item.timestamp)}</RegularText>
        <View style={{width: 12}} />
        <SmallProfileImage>
          <Image
            source={{uri: item.image}}
            style={{height: 20, width: 20, borderRadius: 10}}></Image>
        </SmallProfileImage>
        <View style={{width: 6}} />
        <MediumText size={12}>{item.fullName}</MediumText>
      </View>
    </React.Fragment>
  );

  renderFooter = () => {
    if (!this.state.fetching) return <View style={{height: 100}}></View>;
    return (
      <View style={{height: 100}}>
        <ActivityIndicator style={{color: '#000', marginTop: 15}} />
      </View>
    );
  };

  renderActions = () => {
    var X = this.state.actionX - 50,
      Y = this.state.actionY;

    if (Y > height / 2) {
      Y = Y - 86;
      bottom = false;
    } else {
      Y = Y + 24;
      bottom = true;
    }

    if (X < 16) X = 16;
    else if (X > width - 116) X = width - 116;

    const question = this.props.navigation.getParam('item', {});
    return (
      <React.Fragment>
        {this.state.isVerifyingReply ? (
          <LottieView
            source={require('../../global/loader.json')}
            autoPlay
            loop
          />
        ) : (
          <View
            style={{
              width: 100,
              position: 'absolute',
              backgroundColor: '#E5E5EACC',
              borderRadius: 8,
              top: Y,
              left: X,
              paddingVertical: 4,
            }}>
            {this.state.UserID === question.askerID && (
              <React.Fragment>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                  }}
                  onPress={this.verifyReply}>
                  <IconOutline name="check-circle" size={16} />
                  <View style={{flex: 1}}>
                    <MediumText size={14} textAlign="center">
                      Verify
                    </MediumText>
                  </View>
                </TouchableOpacity>
                <View
                  style={{height: 1, flex: 1, backgroundColor: '#000000BB'}}
                />
              </React.Fragment>
            )}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 4,
                paddingHorizontal: 8,
              }}
              onPress={this.deleteReply}>
              <Icon name="trash-2" size={16} color="#E74C3C" />
              <View style={{flex: 1}}>
                <MediumText size={14} textAlign="center" color="#E74C3C">
                  Delete
                </MediumText>
              </View>
            </TouchableOpacity>
            <View
              style={[
                {position: 'absolute', left: 50 - 8},
                bottom ? {top: -8} : {bottom: -8},
              ]}>
              <Triangle
                width={16}
                height={8}
                color={'#E5E5EACC'}
                direction={bottom ? 'up' : 'down'}
              />
            </View>
          </View>
        )}
      </React.Fragment>
    );
  };

  verifyReply = () => {
    this.setState({isVerifyingReply: true});
    const item = this.props.navigation.getParam('item', {});
    getData('JWT').then(jwt => {
      if (!jwt) NavigationService.navigate('landing');
      fetch(API + `/reply/verify`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: jwt,
        },
        body: JSON.stringify({
          ReplyID: this.state.actionableReplyID,
          QuestionID: item.id,
        }),
      })
        .then(() => {
          this.setState({
            isVerifyingReply: false,
            showActionModal: false,
            actionY: 0,
            actionX: 0,
            actionableReplyID: null,
          });
          this.fetchDataNextPage(true, true);
        })
        .catch(() => NavigationService.navigate('landing'));
    });
  };

  deleteReply = () => {
    this.setState({isVerifyingReply: true});
    const item = this.props.navigation.getParam('item', {});
    getData('JWT').then(jwt => {
      if (!jwt) NavigationService.navigate('landing');
      fetch(API + `/reply/delete`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: jwt,
        },
        body: JSON.stringify({
          ReplyID: this.state.actionableReplyID,
          QuestionID: item.id,
        }),
      })
        .then(() => {
          this.setState({
            isVerifyingReply: false,
            showActionModal: false,
            actionY: 0,
            actionX: 0,
            actionableReplyID: null,
          });
          this.fetchDataNextPage(true, true, true);
        })
        .catch(() => NavigationService.navigate('landing'));
    });
  };

  render() {
    const item = this.props.navigation.getParam('item', {});
    if (!item.replies) replies = 'No replies yet';
    else if (item.replies === 1) replies = '1 reply';
    else replies = `${item.replies} replies`;

    const shadowRadius = this.state.scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 5],
      extrapolate: 'clamp',
    });
    const shadowOpacity = this.state.scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 0.15],
      extrapolate: 'clamp',
    });
    const shadowHeight = this.state.scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 2.5],
      extrapolate: 'clamp',
    });
    return (
      <SafeAreaView
        style={{
          backgroundColor: COLORS.BG,
          flex: 1,
        }}>
        <Header
          title="Replies"
          showBack
          onPressBack={() => this.props.navigation.goBack()}
        />
        <Animated.View
          style={{
            height: 10,
            width,
            backgroundColor: COLORS.BG,
            marginTop: -10,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: shadowHeight},
            shadowOpacity,
            shadowRadius,
          }}
        />
        <FlatList
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListHeaderComponent={this.renderHeader}
          renderItem={this.renderReply}
          data={this.state.data}
          refreshing={this.state.refreshing}
          onRefresh={() => {
            this.setState({refreshing: true});
            this.fetchDataNextPage(true);
          }}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            this.setState({fetching: true});
            this.fetchDataNextPage();
          }}
          style={{
            flex: 1,
          }}
          ListFooterComponent={this.renderFooter}
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {y: this.state.scrollY}}},
          ])}
          ListEmptyComponent={
            !this.state.checkedOnce ? (
              <LottieView
                source={require('../../global/loader.json')}
                autoPlay
                loop
                style={{height: 200, width: 200, alignSelf: 'center'}}
              />
            ) : (
              <View>
                <LottieView
                  source={require('../../global/lonely-whale.json')}
                  autoPlay
                  loop
                  style={{height: 200, width: 200, alignSelf: 'center'}}
                />
                <View style={{marginTop: -40}}>
                  <MediumText size={14} textAlign="center">
                    It's so lonely here <MediumText size={26}>💭</MediumText>
                  </MediumText>
                </View>
              </View>
            )
          }
        />
        <Modal
          transparent
          visible={this.state.showActionModal}
          animationType="fade">
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: '#000000' + 'BB',
              height,
              width,
              position: 'absolute',
            }}
            onPress={() => {
              if (!this.state.isVerifyingReply)
                this.setState({
                  showActionModal: false,
                  actionY: 0,
                  actionX: 0,
                  actionableReplyID: null,
                });
            }}>
            {this.renderActions()}
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    );
  }
}
