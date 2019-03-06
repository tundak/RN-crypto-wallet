import React, {Component} from 'react';
import { StyleSheet, Text,Button, View, StatusBar, TouchableOpacity, Alert, Keyboard,ScrollView,Dimensions,AsyncStorage } from 'react-native';
import { Input, Icon } from 'react-native-elements';
import Logo from '../components/Logo';
import Loader from '../components/Loader';
import { _API_URL, _API_TOKEN } from '../config.js';
import stylesgb from "../Style";
import { _retrieveData} from '../utils/Helper';


export default class EditProfile extends Component< {
  }> {

 static navigationOptions = {
    headerStyle: {
      backgroundColor: '#3589ad',
    },
    headerTintColor: '#fff',
    title: 'Edit Profile',
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
      loading: true,
      full_name: '',
      email: '',
      user_id: 0,
      api_token: '',

    }
  }

  async componentWillMount() {
    var data = await _retrieveData();
    if(data=='logout'){
        this.setState( {
        loading: false
      } );
      AsyncStorage.clear();
      this.props.navigation.navigate('Login');
      return false;
    }
    this.setState( {
      user_id: data[ 'user_id' ],
      api_token: data[ 'api_token' ],
      email: data[ 'uemail' ],
    } );

     await fetch( _API_URL + 'getProfile', {
      method: 'POST',
      timeout:45000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': _API_TOKEN,
      },
      body: JSON.stringify( {
        user_id: this.state.user_id,
        api_token: this.state.api_token

      } )

    } ).then( (response) => response.json() )
      .then( (responseJson) => {
        if ( responseJson.status === true ) {
          try {

            this.setState( {
              full_name: responseJson.result.name,
            } );

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
 
  }

  _onSubmit = async () => {
    Keyboard.dismiss();
    const {full_name, user_id, api_token} = this.state;
    if ( full_name.trim() == '' ) {
      Alert.alert( 'The full name field is required.' );
      return false;
    } 
  
    this.setState( {
      loading: true
    } );

    fetch( _API_URL + 'updateProfile', {
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
        full_name: full_name,
      } )

    } ).then( (response) => response.json() )
      .then( (responseJson) => {
        if ( responseJson.status === true ) {
          try {
            Alert.alert(responseJson.msg);
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
                 value={ this.state.full_name }
                 ref={ (input) => this.full_name = input }
                 valueTextColor="#fff"
                 selectionColor="#fff"
                 onChangeText={ value => this.setState( {
                                  full_name: value
                                } ) }
                 leftIcon={ <Text style={ styles.lableText }>
                             Full Name
                            </Text> } />
        </View>
        <View style={ stylesgb.inputBar }>
          <Input inputStyle={ stylesgb.inputBox }
                  inputContainerStyle={{ borderBottomWidth: 1,borderBottomColor:'#ffffff' }}
                 value={ this.state.email }
                 valueTextColor="#fff"
                 selectionColor="#fff"
                 editable={ false }
                 selectTextOnFocus={ false }
                 leftIcon={ <Text style={ styles.lableText }>
                              Email
                            </Text> }
                 rightIcon={ <Icon size={ 21 }
                                     color='#fff'
                                      name='lock'
                                     containerStyle={ { marginLeft: -15, marginBottom: 10 } } /> }
                />
        </View>

          <View style={ stylesgb.button }>
            <TouchableOpacity onPress={ this._onSubmit }>
              <Text style={ stylesgb.buttonText }>
                Save
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
