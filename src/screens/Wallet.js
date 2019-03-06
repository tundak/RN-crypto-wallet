import React, {Component} from 'react';
import { StyleSheet, Text,Button, View,  TouchableOpacity, Alert, Keyboard,AsyncStorage } from 'react-native';
import { Input, Avatar,CheckBox } from 'react-native-elements';
import Logo from '../components/Logo';
import Loader from '../components/Loader';
import { _API_URL, _API_TOKEN } from '../config.js';
import stylesgb from "../Style";
import { _retrieveData} from '../utils/Helper';

export default class Wallet extends Component< {
  }> {

  constructor( props ) {
    super( props );
    this.state = {
      loading: false,
      checked: false,
       user_id: '',
      api_token: ''
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
      wallet_type: data[ 'wallet_type' ],
      btc_address: data[ 'btc_address' ],
      eth_address: data[ 'eth_address' ],
    } );
  }
 static navigationOptions = {
    headerStyle: {
      backgroundColor: '#3589ad',
    },
    headerTintColor: '#fff',
    title: 'Wallet',
    headerTitleStyle: {
      color: '#fff',
      marginRight: '22%',
      textAlign: 'center',
      flex: 1,
    },
  }

   goPair = () => {
    const {checked, user_id, api_token,btc_address,eth_address,wallet_type} = this.state;
      if ( wallet_type =='BTC' && btc_address!=null ) {
      Alert.alert( 'Your BTC wallet already created or paired.' );
      return false;
    }

    if ( wallet_type =='ETH' && eth_address!=null ) {
      Alert.alert( 'Your ETH wallet already created or paired.' );
      return false;
    }

    if ( checked === false ) {
      Alert.alert( 'You must agree to the terms and conditions.' );
      return false;
    }
    this.props.navigation.navigate('Pair');
  }

  _onSubmit = async () => {
    
    Keyboard.dismiss();
    const {checked, user_id, api_token,btc_address,eth_address,wallet_type} = this.state;
    if ( wallet_type =='BTC' && btc_address!=null ) {
      Alert.alert( 'Your BTC wallet already created or paired.' );
      return false;
    }

    if ( wallet_type =='ETH' && eth_address!=null ) {
      Alert.alert( 'Your ETH wallet already created or paired.' );
      return false;
    }

    if ( checked === false ) {
      Alert.alert( 'You must agree to the terms and conditions.' );
      return false;
    }



    this.setState( {
      loading: true
    } );

    fetch( _API_URL + 'createWallet', {
      method: 'POST',
      timeout:45000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': _API_TOKEN,
      },
      body: JSON.stringify( {
         user_id: this.state.user_id,
         api_token: this.state.api_token,
         wallet_type: this.state.wallet_type

      } )

    } ).then( (response) => response.json() )
      .then( (responseJson) => {
        if ( responseJson.status === true ) {


          try {
            Alert.alert(responseJson.msg);

            if(this.state.wallet_type=='BTC'){
               AsyncStorage.setItem( 'btc_address', responseJson.result.address);
             }else{
              AsyncStorage.setItem( 'eth_address', responseJson.result.address);
             } 

             this.props.navigation.push('Dashboard'); 

          } catch (error) {
            Alert.alert('Something went wrong please try again later!');
          }
        } else {
          Alert.alert(responseJson.msg);
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
    <View style={ styles.container }>
     <Loader loading={ this.state.loading } />
     <Logo/>
       
       <View style={ stylesgb.headerCont }>
        <Text style={ stylesgb.forgotText } h1>
          Biometric Payment System Token
        </Text>
      </View>
    
      
      <View style={ styles.middleBar }>

<TouchableOpacity onPress={ this._onSubmit }>
<View  style={ styles.middleBarInner }>

<Text style={ styles.innerText }> Create a </Text>
<Text style={ styles.innerText }> New {this.state.wallet_type} Wallet</Text>
</View>
</TouchableOpacity>
<View style={{marginLeft:20}}></View>

<TouchableOpacity onPress={ this.goPair }>
<View style={ styles.middleBarInner2 }>
<Text style={ styles.innerText }> Pair / Recover</Text>
<Text style={ styles.innerText }> a {this.state.wallet_type} Wallet</Text>
</View>
</TouchableOpacity>

</View>
<View>
<CheckBox title='I  accept the terms & conditions.'
                      checked={ this.state.checked }
                      containerStyle={ styles.checkboxCoun2 }
                      textStyle={ styles.checkboxText }
                      uncheckedColor='#fff'
                      checkedColor='#fff'
                       onPress={ () => this.setState( {
                                checked: !this.state.checked
                              } ) }
                       />
</View>
{/*
<View style={ styles.bottomCont }>


<Text  style={ styles.bottomText }>Last update on </Text> 
<Text style={ styles.bottomText2 }>update notes</Text>
<View style={{marginLeft:10}}></View>
<Text  style={ styles.bottomText }>Current vesion 1.1.4</Text>
</View>
*/}


    </View>

    )
  }
}


const styles = StyleSheet.create( {
  container: {
    backgroundColor: '#379eb6',
    flex: 1,
    alignItems: 'center',
  },
   middleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginTop:10,  
  },
  middleBarInner:{
     backgroundColor: '#fff',
     width:120,
     height:120,
     alignItems: 'center',
    justifyContent: 'center',

  },
  middleBarInner2:{
     backgroundColor: '#a1dae1',
     width:120,
     height:120,
     alignItems: 'center',
    justifyContent: 'center',
      
  },
   innerText: {
    fontSize: 14,
    color: '#8fbbd0',
  },
  checkboxCoun2: {
    backgroundColor: '#379eb6',
    borderWidth: 0,
    marginVertical: 0,
  },
  checkboxText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'normal',

  },
  bottomCont:{
   flexDirection: 'row',
   marginTop:10,
  },
  bottomText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'normal',

  },
  bottomText2: {
    color: '#3dc1c6',
    fontSize: 10,
    fontWeight: 'normal',
    textDecorationLine:'underline',

  }
  

} );