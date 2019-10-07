import React, {Component} from 'react';
import {
  Modal,
  View,
  Dimensions,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {COLORS} from '../../global/colors';
import Header from '../../Components/Header';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import LottieView from 'lottie-react-native';
import {getData} from '../../global/localStorage';
import NavigationService from '../../../NavigationService';
import {API} from '../../global/constants';

const {height, width} = Dimensions.get('window');

export default class AddQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      question: '',
    };
  }

  componentDidMount = () => {
    this.textInput.focus();
  };

  onAdd = () => {
    var {question} = this.state;
    question = question.trim();
    if (!question) {
      this.props.onCancel();
      return;
    }
    this.setState({isLoading: true});
    getData('JWT').then(jwt => {
      if (!jwt) NavigationService.navigate('landing');
      fetch(API + `/question`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: jwt,
        },
        body: JSON.stringify({
          question: question,
        }),
      })
        .then(() => {
          this.setState({isLoading: false});
          this.props.onAdd();
        })
        .catch(() => NavigationService.navigate('landing'));
    });
  };

  render() {
    const textStyle = {
      width: width - 32,
      marginHorizontal: 16,
      opacity: 1,
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#000',
      fontSize: 20,
      fontFamily: 'Quicksand-Medium',
      marginBottom: height / 8,
    };
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.BG}}>
        {this.state.isLoading ? (
          <LottieView
            source={require('../../global/loader.json')}
            autoPlay
            loop
          />
        ) : (
          <React.Fragment>
            <Header
              title="Ask a question"
              showXLeft
              showCheck
              onPressXLeft={() => this.props.onCancel()}
              onPressCheck={() => this.onAdd()}
            />
            <TouchableOpacity
              style={{
                position: 'relative',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.props.onCancel();
              }}
              activeOpacity={1}>
              <AutoGrowingTextInput
                maxLength={100}
                returnKeyType="done"
                scrollEnabled={false}
                style={textStyle}
                selectionColor="black"
                ref={node => {
                  this.textInput = node;
                }}
                onChangeText={text => this.setState({question: text})}
                autoCorrect={false}
                onSubmitEditing={() => {
                  this.onAdd();
                }}
                onBlur={() => {
                  this.props.onCancel();
                }}
              />
            </TouchableOpacity>
            <TextInput />
          </React.Fragment>
        )}
      </SafeAreaView>
    );
  }
}
