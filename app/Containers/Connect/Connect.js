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
import Icon from 'react-native-vector-icons/Feather';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import {COLORS} from '../../global/colors';
import {RegularText, BoldText, MediumText} from '../../Components/Text';
import {PrimaryButton} from '../../Components/Button';
import styled from 'styled-components';
import {API, getTimeSince} from '../../global/constants';
import Header from '../../Components/Header';
import {getData} from '../../global/localStorage';
import AddQuestion from './AddQuestion';
import {IconOutline} from '@ant-design/icons-react-native';
import Triangle from 'react-native-triangle';
import NavigationService from '../../../NavigationService';

const {height, width} = Dimensions.get('window');
const SecondaryProfileImage = styled.View`
  height: 24px;
  width: 24px;
  border-radius: 12px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
  elevation: 5;
`;

export default class Connect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fetching: false,
      refreshing: false,
      showAddQuestion: false,
      checkedOnce: false,
      scrollY: new Animated.Value(0),
      showActionModal: false,
      actionY: 0,
      actionableQuestion: null,
      actionableQuestionIndex: null,
      isDeletingQuestion: false,
    };
    this.page = 1;
  }
  componentWillUnmount() {
    this._sub.remove();
  }

  componentDidMount() {
    this._sub = this.props.navigation.addListener('didFocus', () => {
      this.fetchDataNextPage(true, true);
    });
    getData('UserID').then(uid => this.setState({UserID: uid}));
  }

  fetchDataNextPage = (initial, untilCurrentPage) => {
    if (untilCurrentPage) var untilPage = this.page;
    if (initial) {
      if (untilCurrentPage) {
        var untilPage = this.page;
      } else this.page = 1;
    } else {
      if (this.state.refreshing || this.state.fetching) return;
    }
    getData('JWT').then(jwt => {
      if (!jwt) {
        NavigationService.navigate('landing');
        return;
      }
      fetch(
        API +
          `/question/all?pageNo=${this.page}&untilPage=${
            untilPage ? untilPage + 1 : null
          }`,
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
          if (responseData.data && responseData.data.length !== 0) {
            this.page += 1;
            var data = this.state.data;
            var newData;
            if (responseData.pageNo === 1 || responseData.untilPage)
              newData = responseData.data;
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
        .catch(err => alert(err));
    });
  };

  renderNewsLoader = () =>
    !this.state.checkedOnce ? (
      <LottieView
        source={require('../../global/connect.json')}
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
    );

  onAddQuestion = () => {
    this.setState(
      {data: [], showAddQuestion: false, checkedOnce: false},
      () => {
        this.fetchDataNextPage(true);
      },
    );
  };

  onAddQuestionCancel = () => {
    this.setState({showAddQuestion: false});
  };

  renderFooter = () => {
    if (!this.state.fetching) return <View style={{height: 100}}></View>;
    return (
      <View style={{height: 100}}>
        <ActivityIndicator style={{color: '#000', marginTop: 15}} />
      </View>
    );
  };

  renderQuestion = ({item, index}) => {
    let firstname = item.fullName.split(' ')[0];
    if (!item.replies) replies = 'No replies yet';
    else if (item.replies === 1) replies = '1 reply';
    else replies = `${item.replies} replies`;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={{marginTop: 10, marginBottom: 30, paddingHorizontal: 16}}
        onPress={() => {
          this.props.navigation.push('question', {item});
        }}
        onLongPress={evt => this.handlePress(evt, item, index)}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <SecondaryProfileImage>
            <Image
              source={{uri: item.image}}
              style={{
                height: 24,
                width: 24,
                borderRadius: 12,
                backgroundColor: 'white',
              }}></Image>
            {!item.image && (
              <View
                style={{
                  position: 'absolute',
                  height: 24,
                  width: 24,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <IconOutline name="user" size={12} color="#8E8E8E" />
              </View>
            )}
          </SecondaryProfileImage>
          <View style={{width: 6}} />
          <MediumText size={12}>
            {firstname}
            <RegularText size={12}> asks</RegularText>
          </MediumText>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={evt =>
                this.handlePress(evt, item, index, (isLight = true))
              }
              style={{backgroundColor: 'transparent'}}>
              <Icon name="more-horizontal" size={18} />
            </TouchableOpacity>
          </View>
        </View>
        <MediumText addStyle={{marginLeft: 20}}>{item.question}</MediumText>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 20,
            marginTop: 4,
          }}>
          <RegularText size={10}>{replies}</RegularText>
          <View
            style={{
              width: 65,
              alignItems: 'flex-end',
            }}>
            <RegularText size={10}>{getTimeSince(item.timestamp)}</RegularText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  handlePress = (evt, item, index, isLight) => {
    this.setState({
      showActionModal: true,
      actionY: evt.nativeEvent.pageY,
      actionableQuestion: item,
      actionableQuestionIndex: index,
    });
    ReactNativeHapticFeedback.trigger(isLight ? 'impactLight' : 'impactHeavy', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  };

  renderActions = () => {
    var X = width - 108,
      Y = this.state.actionY;

    if (Y > height / 2) {
      Y = Y - 86;
      bottom = false;
    } else {
      Y = Y + 24;
      bottom = true;
    }
    return (
      <React.Fragment>
        {this.state.isDeletingQuestion ? (
          <LottieView
            source={require('../../global/white-loader.json')}
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
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 4,
                paddingHorizontal: 8,
              }}
              onPress={() => {
                const item = this.state.actionableQuestion;
                this.setState(
                  {
                    showActionModal: false,
                    actionY: 0,
                    actionableQuestion: null,
                    actionableQuestionIndex: null,
                  },
                  () => {
                    this.props.navigation.push('question', {
                      item,
                    });
                  },
                );
              }}>
              <Icon name="edit" size={16} />
              <View style={{flex: 1}}>
                <MediumText size={14} textAlign="center">
                  Reply
                </MediumText>
              </View>
            </TouchableOpacity>
            {this.state.actionableQuestion &&
              this.state.UserID === this.state.actionableQuestion.askerID && (
                <React.Fragment>
                  <View
                    style={{height: 1, flex: 1, backgroundColor: '#000000BB'}}
                  />
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 4,
                      paddingHorizontal: 8,
                    }}
                    onPress={this.deleteQuestion}>
                    <Icon name="trash-2" size={16} color="#E74C3C" />
                    <View style={{flex: 1}}>
                      <MediumText size={14} textAlign="center" color="#E74C3C">
                        Delete
                      </MediumText>
                    </View>
                  </TouchableOpacity>
                </React.Fragment>
              )}
            <View
              style={[
                {position: 'absolute', right: 8},
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

  deleteQuestion = () => {
    this.setState({isDeletingQuestion: true});
    getData('JWT').then(jwt => {
      if (!jwt) NavigationService.navigate('landing');
      fetch(API + `/question?QuestionID=${this.state.actionableQuestion.id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: jwt,
        },
      })
        .then(() => {
          var {data} = this.state;
          data.splice(this.state.actionableQuestionIndex, 1);
          this.setState(
            {
              showActionModal: false,
              actionY: 0,
              actionableQuestion: null,
              actionableQuestionIndex: null,
              isDeletingQuestion: false,
            },
            () => this.fetchDataNextPage(true, true),
          );
        })
        .catch(() => NavigationService.navigate('landing'));
    });
  };

  render() {
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
          title="Connect"
          showPlusButton
          onPlusButtonPress={() => this.setState({showAddQuestion: true})}
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
            paddingTop: 20,
          }}
          ListEmptyComponent={this.renderNewsLoader}
          ListFooterComponent={this.renderFooter}
          renderItem={this.renderQuestion}
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {y: this.state.scrollY}}},
          ])}
        />
        <Modal
          transparent
          visible={this.state.showAddQuestion}
          animationType="fade">
          <AddQuestion
            onAdd={this.onAddQuestion}
            onCancel={this.onAddQuestionCancel}
          />
        </Modal>
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
              if (!this.state.isDeletingQuestion)
                this.setState({
                  showActionModal: false,
                  actionY: 0,
                  actionableQuestion: null,
                  actionableQuestionIndex: null,
                });
            }}>
            {this.renderActions()}
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    );
  }
}
