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
  TouchableOpacity,
} from 'react-native';
import {RegularText, BoldText, MediumText} from '../../Components/Text';

const {height, width} = Dimensions.get('window');

export default class CountBanner extends Component {
  render() {
    return (
      <View
        style={{
          width: width,
          marginTop: 16,
          marginBottom: 32,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{width: width / 3}}>
          <MediumText
            size={20}
            textAlign="center"
            addStyle={{marginHorizontal: 16, marginTop: 16}}
            numberOfLines={1}>
            {this.props.searches || '0'}
          </MediumText>
          <RegularText
            size={14}
            textAlign="center"
            addStyle={{marginHorizontal: 16}}
            numberOfLines={1}>
            {this.props.searches === 1 ? 'Search' : 'Searches'}
          </RegularText>
        </View>

        <TouchableOpacity
          style={{width: width / 3}}
          activeOpacity={1}
          onPress={this.props.onQuestionPress}>
          <MediumText
            size={20}
            textAlign="center"
            addStyle={{marginHorizontal: 16, marginTop: 16}}
            numberOfLines={1}>
            {this.props.questions || '0'}
          </MediumText>
          <RegularText
            size={14}
            textAlign="center"
            addStyle={{marginHorizontal: 16}}
            numberOfLines={1}>
            {this.props.questions === 1 ? 'Question' : 'Questions'}
          </RegularText>
        </TouchableOpacity>

        <View style={{width: width / 3}}>
          <MediumText
            size={20}
            textAlign="center"
            addStyle={{marginHorizontal: 16, marginTop: 16}}
            numberOfLines={1}>
            {this.props.karma || '0'}
          </MediumText>
          <RegularText
            size={14}
            textAlign="center"
            addStyle={{marginHorizontal: 16}}
            numberOfLines={1}>
            {'Karma'}
          </RegularText>
        </View>
      </View>
    );
  }
}
