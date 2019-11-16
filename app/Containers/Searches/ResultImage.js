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
  Linking,
} from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Feather';
import Carousel from 'react-native-snap-carousel';

const {height, width} = Dimensions.get('window');
const PrimaryProfileImage = styled.TouchableOpacity`
  height: 80px;
  width: 80px;
  border-radius: 40px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
  margin-bottom: 26px;
  background-color: white;
  justify-content: center;
`;

export default class ResultImage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderCarousel = ({item, index}) => (
    <View>
      <PrimaryProfileImage onPress={() => Linking.openURL(item.url)}>
        <Icon
          name="image"
          size={24}
          color="#8D8D8D"
          style={{position: 'absolute', alignSelf: 'center'}}
        />
        <Image
          source={{uri: item.url}}
          style={{
            height: 80,
            width: 80,
            borderRadius: 80,
          }}
        />
      </PrimaryProfileImage>
    </View>
  );

  render() {
    return (
      <Carousel
        data={this.props.data}
        renderItem={this.renderCarousel}
        sliderWidth={width}
        itemWidth={100}
        itemHeight={100}
        enableMomentum
        hasParallaxImages
        contentContainerCustomStyle={{
          paddingVertical: 50,
          paddingTop: 10,
          justifyContent: 'center',
          maxHeight: 110,
        }}
        inactiveSlideOpacity={0.5}
        inactiveSlideScale={0.7}
        activeAnimationType="spring"
      />
    );
  }
}
