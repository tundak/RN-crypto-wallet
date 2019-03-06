import React, {Component} from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Alert, Keyboard, ToastAndroid,PermissionsAndroid,Linking,Platform } from 'react-native';
import { Input, Avatar } from 'react-native-elements';
import Logo from '../components/Logo';
import Loader from '../components/Loader';
import { _API_URL, _API_TOKEN } from '../config.js';
import stylesgb from "../Style";

export default class SignupScreen extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      loading: false,
      full_name: '',
      email: '',
      password: '',
      push_token:'',
  
    }
  }

  static navigationOptions = () => ({
    header: null,
  });


_onSubmit = async () => {
   
    Keyboard.dismiss();
    const {full_name, email, password} = this.state;
  
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const reg2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z0-9_~\-!@#\$%\^&\*\(\)]{8,}$/;
    if ( full_name == '' ) {
      Alert.alert( 'The full name field is required.' );
      return false;
    } else if ( email.trim() == '' ) {
      Alert.alert( 'The email field is required.' );
      return false;
    } else if ( !reg.test( email ) === true ) {
      Alert.alert( 'The email must be a valid email address.' );
      return false;
    } else if ( password == '' ) {
      Alert.alert( 'The password field is required.' );
      return false;
    } 

    this.setState( {
      loading: true
    } );

    fetch( _API_URL + 'signUp', {
      method: 'POST',
      timeout:45000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': _API_TOKEN,
      },
      body: JSON.stringify( {
        full_name: full_name,
        email: email,
        password: password,

      } )

    } ).then( (response) => response.json() )
      .then( (responseJson) => {
        if ( responseJson.status === true ) {
         alert( responseJson.msg );
         this.props.navigation.pop();
        } else {
          alert( responseJson.msg );
        }
        this.setState( {
          loading: false
        } );
      } ).catch( (error) => {
        alert(error);
     // alert( 'Server not responding please try again later.' );
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
              SIGN UP
            </Text>
          </View>

        <View style={ stylesgb.inputBar }>
            <Input inputStyle={ stylesgb.inputBox }
                   inputContainerStyle={{ borderBottomWidth: 1,borderBottomColor:'#ffffff' }}
                   placeholder="Full Name"
                   selectionColor="#fff"
                   placeholderTextColor="#fff"
                   onSubmitEditing={ () => this.email.focus() }
                   onChangeText={ value => this.setState( {
                                    full_name: value
                                  } ) }
                   />
          </View>

      <View style={ stylesgb.inputBar }>
        <Input inputStyle={ stylesgb.inputBox }
               inputContainerStyle={{ borderBottomWidth: 1,borderBottomColor:'#ffffff' }}
               placeholder="Email"
               placeholderTextColor="#fff"
               selectionColor="#fff"
               keyboardType="email-address"
               ref={ (input) => this.email = input }
                   onSubmitEditing={ () => this.password.focus() }
                   onChangeText={ value => this.setState( {
                                    email: value
                                  } ) }
                />
      </View>
      <View style={ stylesgb.inputBar }>
        <Input inputStyle={ stylesgb.inputBox }
               inputContainerStyle={{ borderBottomWidth: 1,borderBottomColor:'#ffffff' }}
               placeholder="Password"
               secureTextEntry={ true }
               selectionColor="#fff"
               placeholderTextColor="#fff"
               onChangeText={ value => this.setState( {
                                password: value
                              } ) }
               ref={ (input) => this.password = input }
               />
      </View>
      <View style={ stylesgb.button }>
        <TouchableOpacity onPress={ this._onSubmit }>
          <Text style={ stylesgb.buttonText }>
            Register
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
