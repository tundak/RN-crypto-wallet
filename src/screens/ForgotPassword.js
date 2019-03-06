import React, {Component} from 'react';
import { StyleSheet, Text,Button, View, StatusBar, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { Input, Avatar } from 'react-native-elements';
import Logo from '../components/Logo';
import Loader from '../components/Loader';
import { _API_URL, _API_TOKEN } from '../config.js';
import stylesgb from "../Style";

export default class ForgotPassword extends Component< {
  }> {

  constructor( props ) {
    super( props );
    this.state = {
      loading: false,
      email: ''
    }
  }


 static navigationOptions = () => ({
    header: null,
  });

  _onSubmit = async () => {

    Keyboard.dismiss();
    const {email} = this.state;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if ( email.trim() == '' ) {
      Alert.alert( 'The email field is required.' );
      return false;
    } else if ( !reg.test( email ) === true ) {
      Alert.alert( 'The email must be a valid email address.' );
      return false;
    }
    this.setState( {
      loading: true
    } );

    fetch( _API_URL + 'forgotPassword', {
      method: 'POST',
      timeout:45000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': _API_TOKEN,
      },
      body: JSON.stringify( {
        email: email

      } )

    } ).then( (response) => response.json() )
      .then( (responseJson) => {
        if ( responseJson.status === true ) {
          try {
            alert( responseJson.msg );
            this.props.navigation.navigate('Login')
            
          } catch (error) {
             alert( 'Something went wrong please try again later!' );
          }
        } else {

           alert( responseJson.msg );
        }
        this.setState( {
          loading: false
        } );
      } ).catch( (error) => {
       alert( 'Server not responding please try again later.' );
      this.setState( {
        loading: false
      } );
    } );

  };

  render() {
    return (
    <View style={ stylesgb.container }>
     <Loader loading={ this.state.loading } />
     <Logo/>
        <View style={ stylesgb.headerCont }>
            <Text style={ stylesgb.headerText } h1>
          FORGOT PASSWORD?
        </Text>
      </View>
       <View style={ stylesgb.headerCont }>
        <Text style={ stylesgb.forgotText } h1>
          Enter your email to receive a password reset link.
        </Text>
      </View>
      <View style={ stylesgb.inputBar }>
        <Input inputStyle={ stylesgb.inputBox }
              inputContainerStyle={{ borderBottomWidth: 1,borderBottomColor:'#ffffff' }}
               placeholder="Email"
               placeholderTextColor="#fff"
               selectionColor="#fff"
               keyboardType="email-address"
               onChangeText={ value => this.setState( {
                                email: value
                              } ) }
                />
      </View>
      <View style={ stylesgb.button }>
        <TouchableOpacity onPress={ this._onSubmit }>
          <Text  style={ stylesgb.buttonText }>
            Send Reset Link
          </Text>
        </TouchableOpacity>
      </View>
       <View style={ stylesgb.signupTextCont }>
        <TouchableOpacity onPress={() => this.props.navigation.pop()}>
          <Text style={ stylesgb.forgotText }>
            Login
          </Text>
        </TouchableOpacity>
      </View> 
    </View>

    )
  }
}

