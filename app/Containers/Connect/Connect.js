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
} from 'react-native';
import LottieView from 'lottie-react-native';
import {COLORS} from '../../global/colors';
import {RegularText, BoldText, MediumText} from '../../Components/Text';
import {PrimaryButton} from '../../Components/Button';
import styled from 'styled-components';
import {API, getTimeSince} from '../../global/constants';
import Header from '../../Components/Header';
import {getData} from '../../global/localStorage';
import AddQuestion from './AddQuestion';
import {TouchableOpacity} from 'react-native-gesture-handler';

const {height, width} = Dimensions.get('window');

const SecondaryProfileImage = styled.View`
  height: 24px;
  width: 24px;
  border-radius: 12px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
`;

export default class Connect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fetching: false,
      refreshing: false,
      showAddQuestion: false,
      scrollY: 0,
    };
    this.page = 1;
  }

  componentDidMount() {
    this.fetchDataNextPage(true);
  }

  fetchDataNextPage = initial => {
    if (initial) {
      this.page = 1;
    }
    getData('JWT').then(jwt => {
      if (!jwt) NavigationService.navigate('landing');
      fetch(API + `/question/all?pageNo=${this.page}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: jwt,
        },
      })
        .then(response => response.json())
        .then(responseData => {
          if (responseData.data.length !== 0) {
            this.page += 1;
            var data = this.state.data;
            var newData;
            if (initial) newData = responseData.data;
            else newData = data.concat(responseData.data);
            this.setState({data: newData, fetching: false, refreshing: false});
          } else {
            this.setState({fetching: false, refreshing: false});
          }
        })
        .catch(() => NavigationService.navigate('landing'));
    });
  };

  renderNewsLoader = () => (
    <LottieView
      source={require('../../global/connect.json')}
      autoPlay
      loop
      style={{height: 200, width: 200, alignSelf: 'center'}}
    />
  );

  onAddQuestion = () => {
    this.setState({data: [], showAddQuestion: false}, () => {
      this.fetchDataNextPage(true);
    });
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
    if (item.replies === 1) replies = 'No replies yet';
    else if (!item.replies) replies = '1 reply';
    else replies = `${item.replies} replies`;
    return (
      <TouchableOpacity style={{marginVertical: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <SecondaryProfileImage>
            <Image
              source={{uri: item.image}}
              style={{height: 24, width: 24, borderRadius: 12}}></Image>
          </SecondaryProfileImage>
          <View style={{width: 6}} />
          <MediumText size={12}>
            {firstname}
            <RegularText size={12}> asks</RegularText>
          </MediumText>
        </View>
        <MediumText addStyle={{marginLeft: 20}}>{item.question}</MediumText>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 20,
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

  render() {
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
        <FlatList
          data={this.state.data}
          refreshing={this.state.refreshing}
          onRefresh={() => {
            this.setState({refreshing: true});
            this.fetchDataNextPage(true);
          }}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            this.setState({fetching: false});
            this.fetchDataNextPage();
          }}
          style={{
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: 20,
          }}
          ListEmptyComponent={this.renderNewsLoader}
          ListFooterComponent={this.renderFooter}
          renderItem={this.renderQuestion}
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
      </SafeAreaView>
    );
  }
}
