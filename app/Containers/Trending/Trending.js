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
  Modal,
} from 'react-native';
import LottieView from 'lottie-react-native';
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

export default class Trending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: false,
      checkedOnce: false,
      scrollY: new Animated.Value(0),
      isSearching: false,
    };
  }

  componentDidMount = () => {
    this.fetchTrending();
  };

  fetchTrending = () => {
    getData('JWT').then(jwt => {
      if (!jwt) NavigationService.navigate('landing');
      fetch(API + `/trending`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: jwt,
        },
      })
        .then(response => response.json())
        .then(responseData => {
          this.setState({
            data: responseData.data,
            refreshing: false,
            checkedOnce: true,
          });
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

  renderTrending = ({item, index}) => {
    return (
      <SearchCard
        text={item.searchQuery}
        onPress={() => {}}
        points={item.points}
        onRef={marker => {
          if (this.state.openMarker && this.state.openMarker !== marker)
            this.state.openMarker.close();
          this.setState({openMarker: marker});
        }}
        setSearching={state => this.setState({isSearching: state})}
      />
    );
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
      <React.Fragment>
        <SafeAreaView
          style={{
            backgroundColor: COLORS.BG,
            flex: 1,
          }}>
          <Header title="Trending" />

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
            data={this.state.data}
            refreshing={this.state.refreshing}
            onRefresh={() => {
              this.setState({refreshing: true});
              this.fetchTrending();
            }}
            style={{
              flex: 1,
              paddingTop: 20,
            }}
            ListEmptyComponent={
              !this.state.checkedOnce ? (
                <LottieView
                  source={require('../../global/chart.json')}
                  autoPlay
                  loop
                  style={{height: 300, width: 300, alignSelf: 'center'}}
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
            renderItem={this.renderTrending}
            keyExtractor={(item, index) => index.toString()}
            onScroll={Animated.event([
              {nativeEvent: {contentOffset: {y: this.state.scrollY}}},
            ])}
          />
        </SafeAreaView>
        <Modal transparent visible={this.state.isSearching}>
          <View
            style={{
              backgroundColor: '#FFFFFFB3',
              width,
              height,
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 3,
            }}>
            <LottieView
              source={require('../../global/loader.json')}
              autoPlay
              loop
            />
          </View>
        </Modal>
      </React.Fragment>
    );
  }
}
