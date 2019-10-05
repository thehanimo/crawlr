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

const {height, width} = Dimensions.get('window');

export default class EditBio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      bio: '',
    };
  }

  componentDidMount = () => {
    this.setState({
      bio: this.props.default,
    });
    this.textInput.focus();
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
        <Header
          title="Write your bio"
          showX
          onPressX={() => this.props.onClose(this.state.bio)}
        />
        <TouchableOpacity
          style={{
            position: 'relative',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            this.props.onClose(this.props.default);
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
            defaultValue={this.state.bio}
            onChangeText={text => this.setState({bio: text})}
            autoCorrect={false}
            onSubmitEditing={() => {
              this.props.onClose(this.state.bio);
            }}
            onBlur={() => {
              this.props.onClose(this.props.default);
            }}
          />
        </TouchableOpacity>
        <TextInput />
      </SafeAreaView>
    );
  }
}
