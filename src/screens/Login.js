import React, {Component} from 'react';
import { StyleSheet, Text,Button, View, StatusBar, TouchableOpacity, Alert, Keyboard,AsyncStorage} from 'react-native';
import { Input, Avatar } from 'react-native-elements';
import Logo from '../components/Logo';
import Loader from '../components/Loader';
import { _API_URL, _API_TOKEN } from '../config.js';
import stylesgb from "../Style";


export default class LoginScreen extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      loading: false,
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
    const {email, password} = this.state;
  
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const reg2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z0-9_~\-!@#\$%\^&\*\(\)]{8,}$/;
  if ( email.trim() == '' ) {
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

    fetch( _API_URL + 'login', {
      method: 'POST',
      timeout:45000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': _API_TOKEN,
      },
      body: JSON.stringify( {
        email: email,
        password: password,

      } )

    } ).then( (response) => response.json() )
      .then( (responseJson) => {
        if ( responseJson.status === true ) {

           try {
             AsyncStorage.setItem( 'user_data', JSON.stringify( responseJson.result ) );
             AsyncStorage.setItem( 'btc_address', responseJson.result.btc_address);
             AsyncStorage.setItem( 'eth_address', responseJson.result.eth_address);
             AsyncStorage.setItem( 'wallet_type', 'BTC');
            this.props.navigation.navigate('Dashboard');

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
              Login
            </Text>
          </View>

      <View style={ stylesgb.inputBar }>
        <Input inputStyle={ stylesgb.inputBox }
        	   inputContainerStyle={{ borderBottomWidth: 1,borderBottomColor:'#ffffff' }}
               placeholder="Email"
               placeholderTextColor="#ffffff"
               selectionColor="#ffffff"
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
               selectionColor="#ffffff"
               placeholderTextColor="#ffffff"
               onChangeText={ value => this.setState( {
                                password: value
                              } ) }
               ref={ (input) => this.password = input }
               />
      </View>
      <View style={ stylesgb.button }>
        <TouchableOpacity onPress={ this._onSubmit }>
          <Text style={ stylesgb.buttonText }>
            Login
          </Text>
        </TouchableOpacity>
      </View>
   
   <View style={ stylesgb.signupTextCont }>
     <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
          <Text style={ stylesgb.forgotText }>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
          <Text style={ stylesgb.forgotText }>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View> 
    </View>
    )
  }
}


