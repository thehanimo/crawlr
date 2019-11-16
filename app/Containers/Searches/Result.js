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
import ResultItem from './ResultItem';
import ResultImage from './ResultImage';

const {height, width} = Dimensions.get('window');
const PrimaryProfileImage = styled.View`
  height: 80px;
  width: 80px;
  border-radius: 40px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
  margin-bottom: 26px;
`;

export default class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
    };
  }

  componentWillMount = () => {
    this.setState({result: this.props.navigation.getParam('result', {})});
  };

  componentDidMount = () => {
    this.fetchDataNextPage();
  };

  fetchDataNextPage = () => {
    getData('JWT').then(jwt => {
      if (!jwt) NavigationService.navigate('landing');
      fetch(API + `/search?searchID=${this.state.result._id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: jwt,
        },
      })
        .then(response => response.json())
        .then(responseData => {
          this.setState({resultArray: responseData.result});
        })
        .catch(err => alert(err));
    });
  };

  renderResultItem = ({item, index}) => (
    <ResultItem
      item={item}
      isImage={item.title === 'Images'}
      setImRef={c => {
        this.imRef = c;
      }}
      triggerRenderingHack={() => {
        if (this.imRef && this.imRef.state.open) {
          this.imRef.close();
          setTimeout(() => {
            this.imRef.open();
          }, 50);
        }
      }}
    />
  );

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

    if (this.state.result.status === 'P')
      status = <IconOutline name="ellipsis" size={26} color="#8E8E8E" />;
    else if (this.state.result.status === 'D')
      status = <IconOutline name="check-circle" size={26} color="#2ECC71" />;
    else if (this.state.result.status === 'ERR')
      status = <IconOutline name="close-circle" size={26} color="#E74C3C" />;
    else if (this.state.result.status === 'W')
      status = <IconOutline name="warning" size={26} color="#FED000" />;
    return (
      <SafeAreaView
        style={{
          backgroundColor: COLORS.BG,
          flex: 1,
        }}>
        <Header
          title="Search Result"
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
            zIndex: 2,
          }}
        />
        <FlatList
          data={this.state.resultArray}
          ListHeaderComponent={
            <View style={{padding: 16, flexDirection: 'row', marginBottom: 16}}>
              <RegularText
                numberOfLines={1}
                addStyle={{maxWidth: width - 56, marginRight: 2}}
                size={22}>
                {this.state.result.searchQuery}
              </RegularText>
              {status}
            </View>
          }
          ListEmptyComponent={
            <View style={{height: 200, width: 200, alignSelf: 'center'}}>
              <LottieView
                source={require('../../global/loader.json')}
                autoPlay
                loop
              />
            </View>
          }
          renderItem={this.renderResultItem}
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {y: this.state.scrollY}}},
          ])}
        />
      </SafeAreaView>
    );
  }
}
