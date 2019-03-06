import React, {Component} from 'react';
import { StyleSheet, Text,Button, View, StatusBar, TouchableOpacity, Alert, Keyboard,ScrollView,Dimensions,AsyncStorage } from 'react-native';
import { Input, Icon } from 'react-native-elements';
import Logo from '../components/Logo';
import Loader from '../components/Loader';
import { _API_URL, _API_TOKEN } from '../config.js';
import stylesgb from "../Style";
import { _retrieveData} from '../utils/Helper';

export default class ChangePassword extends Component< {
  }> {

 static navigationOptions = {
    headerStyle: {
      backgroundColor: '#3589ad',
    },
    headerTintColor: '#fff',
    title: 'Change Password',
    headerTitleStyle: {
      color: '#fff',
      marginRight: '22%',
      textAlign: 'center',
      flex: 1,
    },
  }
  constructor( props ) {
    super( props );
    this.state = {
      loading: false,
      old_password: '',
      new_password: '',
      confirm_password: '',
      user_id: 0,
      api_token: '',
    }
  }


  async componentWillMount() {
    var data = await _retrieveData();
    if(data=='logout'){
      AsyncStorage.clear();
      this.props.navigation.navigate('Login');
      return false;
    }
    this.setState( {
      user_id: data[ 'user_id' ],
      api_token: data[ 'api_token' ]
    } );
  }

  _onSubmit = async () => {
    Keyboard.dismiss();
    const {old_password, new_password, confirm_password, user_id, api_token} = this.state;
    if ( old_password.trim() == '' ) {
      Alert.alert( 'The current password field is required.' );
      return false;
    } else if ( new_password == '' ) {
      Alert.alert( 'The password field is required.' );
      return false;
    } else if ( confirm_password == '' ) {
      Alert.alert( 'The confirm password field is required.' );
      return false;
    } else if ( new_password != confirm_password ) {
      Alert.alert( 'Confirm password do not match.' );
      return false;
    }

    this.setState( {
      loading: true
    } );

    fetch( _API_URL + 'changePassword', {
      method: 'POST',
      timeout:45000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': _API_TOKEN,
      },
      body: JSON.stringify( {
        user_id: user_id,
        api_token: api_token,
        old_password: old_password,
        new_password: new_password,
        confirm_password: confirm_password,

      } )

    } ).then( (response) => response.json() )
      .then( (responseJson) => {
        if ( responseJson.status === true ) {
          try {
            Alert.alert(responseJson.msg);
            this.props.navigation.navigate('Settings');
          } catch (error) {
            Alert.alert('Something went wrong please try again later!');
          }
        } else {

          if ( responseJson.msg == 'logout' ) {
            AsyncStorage.clear();
           this.props.navigation.navigate('Login');
          } else {
            Alert.alert(responseJson.msg);
          }
        }
        this.setState( {
          loading: false
        } );
      } ).catch( (error) => {
      Alert.alert('Something went wrong please try again later!');
      this.setState( {
        loading: false
      } );
    } );

  };

  render() {
    return (
    <View style={ stylesgb.container }>
    <ScrollView style={{height:Dimensions.get( 'window' ).height-200}}>
      <Loader loading={ this.state.loading } />
       <View style={ this.state.loading ? styles.hideStyle : styles.showStyle }>
      <View style={ { marginTop: 20 } }></View>
      <View style={ stylesgb.inputBar }>
        <Input inputStyle={ stylesgb.inputBox }
              inputContainerStyle={{ borderBottomWidth: 1,borderBottomColor:'#ffffff' }}
               placeholder="Current Password"
               selectionColor="#fff"
               placeholderTextColor="#fff"
               selectionColor="#fff"
               secureTextEntry={ true }
               onChangeText={ value => this.setState( {
                                old_password: value
                              } ) }
               onSubmitEditing={ () => this.new_password.focus() } />
      </View>
      <View style={ stylesgb.inputBar }>
        <Input inputStyle={ stylesgb.inputBox }
              inputContainerStyle={{ borderBottomWidth: 1,borderBottomColor:'#ffffff' }}
               ref={ (input) => this.new_password = input }
               placeholder="New Password"
               selectionColor="#fff"
               secureTextEntry={ true }
               placeholderTextColor="#fff"
               selectionColor="#fff"
               onChangeText={ value => this.setState( {
                                new_password: value
                              } ) }
               onSubmitEditing={ () => this.confirm_password.focus() } />
      </View>
      <View style={ stylesgb.inputBar }>
        <Input inputStyle={ stylesgb.inputBox }
               ref={ (input) => this.confirm_password = input }
               inputContainerStyle={{ borderBottomWidth: 1,borderBottomColor:'#ffffff' }}
               secureTextEntry={ true }
               placeholder="Retype New Password"
               selectionColor="#fff"
               placeholderTextColor="#fff"
               selectionColor="#fff"
               selectionColor="#fff"
               onChangeText={ value => this.setState( {
                                confirm_password: value
                              } ) } />
      </View>
        <View style={ stylesgb.button }>
          <TouchableOpacity onPress={ this._onSubmit }>
            <Text style={ stylesgb.buttonText }>
              Update
            </Text>
          </TouchableOpacity>
        </View>
        </View>
        </ScrollView>
    </View>

    )
  }
}

const styles = StyleSheet.create( {
  hideStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  showStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lableText: {
    color: '#fff',
    fontSize: 16,
    width: 80,
    marginLeft: -15,
    marginBottom: 5,
    fontFamily: 'Quicksand-Light',
  }
} );


