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
  Animated,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {COLORS} from '../../global/colors';
import {RegularText, BoldText, MediumText} from '../../Components/Text';
import {PrimaryButton} from '../../Components/Button';
import styled from 'styled-components';
import {API} from '../../global/constants';
import Header from '../../Components/Header';
import {SearchCard} from '../../Components/SearchCard';
import NavigationService from '../../../NavigationService';
import {getData} from '../../global/localStorage';

const {height, width} = Dimensions.get('window');

const PrimaryProfileImage = styled.View`
  height: 146px;
  width: 146px;
  border-radius: 146px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 26px;
`;

export default class Searches extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: false,
      fetching: false,
      checkedOnce: false,
      scrollY: new Animated.Value(0),
    };
    this.page = 1;
  }

  componentDidMount = () => {
    this.fetchDataNextPage(true, true);
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: [],
      refreshing: false,
      fetching: false,
      checkedOnce: false,
      scrollY: new Animated.Value(0),
    });
    this.fetchDataNextPage(true, true);
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
          `/search/all?pageNo=${this.page}&untilPage=${
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
          if (initial) var checkedOnce = {checkedOnce: true};
          else checkedOnce = {};
          if (
            (responseData.data && responseData.data.length !== 0) ||
            responseData.pageNo === 1 ||
            responseData.untilPage
          ) {
            this.page += 1;
            var data = this.state.data;
            var newData;
            if (responseData.pageNo === 1 || responseData.untilPage)
              newData = responseData.data;
            else newData = data.concat(responseData.data);
            if (this.state.openMarker && this.state.refreshing)
              this.state.openMarker.close();
            this.setState({
              data: newData,
              fetching: false,
              refreshing: false,
              ...checkedOnce,
            });
          } else {
            this.setState({
              fetching: false,
              refreshing: false,
              ...checkedOnce,
            });
          }
        })
        .catch(err => alert(err));
    });
  };

  renderFooter = () => {
    if (!this.state.fetching) return <View style={{height: 100}}></View>;
    return (
      <View style={{height: 100}}>
        <ActivityIndicator style={{color: '#000', marginTop: 15}} />
      </View>
    );
  };

  renderSearch = ({item, index}) => {
    return (
      <SearchCard
        text={item.searchQuery}
        status={item.status}
        mainError={item.MAIN_ERROR}
        onPress={() =>
          item.MAIN_ERROR
            ? null
            : this.props.navigation.push('result', {result: item})
        }
        onCancel={() => this.onCancel(item._id, index)}
        onRef={marker => {
          if (this.state.openMarker && this.state.openMarker !== marker)
            this.state.openMarker.close();
          this.setState({openMarker: marker});
        }}
      />
    );
  };

  onCancel = (id, index) => {
    const item = this.props.navigation.getParam('item', {});
    getData('JWT').then(jwt => {
      if (!jwt) NavigationService.navigate('landing');
      fetch(API + `/search/cancel?id=${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: jwt,
        },
      })
        .then(() => {
          var {data} = this.state;
          data[index].status = 'C';
          data[index].MAIN_ERROR = 'You cancelled this search';
          this.setState({data});
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
        <Header title="My Searches" />
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
            zIndex: 2,
          }}
        />
        <FlatList
          extraData={this.state}
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
          ListEmptyComponent={
            !this.state.checkedOnce ? (
              <LottieView
                source={require('../../global/search.json')}
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
          ListFooterComponent={this.renderFooter}
          renderItem={this.renderSearch}
          keyExtractor={(item, index) => index.toString()}
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {y: this.state.scrollY}}},
          ])}
        />
      </SafeAreaView>
    );
  }
}
