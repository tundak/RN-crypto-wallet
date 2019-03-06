import React, {Component} from 'react';
import { StyleSheet, Text,Button, View, TouchableOpacity, Alert, Dimensions,Keyboard,BackHandler,AsyncStorage,ToastAndroid,Clipboard,ScrollView } from 'react-native';
import { Input, Avatar,CheckBox } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loader from '../components/Loader';
import { _API_URL, _API_TOKEN } from '../config.js';
import stylesgb from "../Style";
import { _retrieveData} from '../utils/Helper';

export default class Pair extends Component< {
  }> {


  constructor( props ) {
    super( props );
    this.state = {
      loading: false,
      wallet_type: '',
      address:'',
      public_key: '',
      private_key: '',
      user_id: 0,
      api_token: '',

    }
    this._onScan = this._onScan.bind(this);
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#3589ad',
    },
    headerTintColor: '#fff',
    title: 'Pair Wallet',
    headerTitleStyle: {
      color: '#fff',
      marginRight: '22%',
      textAlign: 'center',
      flex: 1,
    },
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

    if(data[ 'wallet_type' ]=='ETH'){
      var public_key='ok';
    }else{
      var public_key='';
    }
    this.setState( {
      user_id: data[ 'user_id' ],
      api_token: data[ 'api_token' ],
      wallet_type: data[ 'wallet_type' ],
      public_key: public_key,
    } );
  }



 componentWillReceiveProps =( props ) => {
  if(props.navigation.state.params.field_type=='address'){
     this.setState( {
        address: props.navigation.state.params.address,
      } );
   }else if(props.navigation.state.params.field_type=='public_key'){
     this.setState( {
        public_key: props.navigation.state.params.address,
      } );
  }else if(props.navigation.state.params.field_type=='private_key'){
     this.setState( {
        private_key: props.navigation.state.params.address,
      } );
}
 }
  

   _onSubmit = async () => {
    Keyboard.dismiss();
    const {address, user_id, api_token, wallet_type, public_key,private_key} = this.state;
    if ( address.trim() == '' ) {
      Alert.alert( 'The address field is required.' );
      return false;
    }

    if ( public_key.trim() == '' &&  wallet_type=='BTC') {
      Alert.alert( 'The public key field is required.' );
      return false;
    }

    if ( private_key.trim() == '' ) {
      Alert.alert( 'The private key field is required.' );
      return false;
    }
  
    this.setState( {
      loading: true
    } );

    fetch( _API_URL + 'importWallet', {
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
        address: address,
        wallet_type: wallet_type,
        public_key: public_key,
        private_key:private_key,
      } )

    } ).then( (response) => response.json() )
      .then( (responseJson) => {
        if ( responseJson.status === true ) {
          try {
            Alert.alert(responseJson.msg);

            if(this.state.wallet_type=='BTC'){
               AsyncStorage.setItem( 'btc_address',address);
             }else{
              AsyncStorage.setItem( 'eth_address', address);
             } 

            this.props.navigation.push('Dashboard'); 
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


   _onScan(field_type){
     Keyboard.dismiss();
     this.props.navigation.navigate('QrScanner',{'field_type':field_type});
  }

 

 render() {

    return (
    <View style={ styles.container }>
    <ScrollView style={{height:Dimensions.get( 'window' ).height-200}}>
      <Loader loading={ this.state.loading } />
      <View style={ this.state.loading ? styles.hideStyle : styles.showStyle }>
       
         <View style={ styles.lableBar }>
          <Text style={ styles.lableText }>
            {this.state.wallet_type} Address
          </Text>
        </View>
        <View style={ styles.inputBar }>
          <Input inputStyle={ styles.inputBox }
                  inputContainerStyle={{ borderBottomWidth: 0 }}
                 value={ this.state.address}
                 valueTextColor="#fff"
                 selectionColor="#fff"
                 multiline={ true }
                 numberOfLines={ 3 }
                  rightIcon={ <AntDesign size={ 21 }
                                   onPress={() => this._onScan('address')}
                                   color='#fff'
                                   name='scan1' /> }
                 onChangeText={ value => this.setState( {
                                  address: value
                                } ) } />
        </View>

       
        <View style={[styles.lableBar,{ display:(this.state.wallet_type=='ETH' ? 'none' : 'flex')}]}>
          <Text style={ styles.lableText }>
            BTC Public Key
          </Text>
        </View>
        <View style={[styles.inputBar,{ display:(this.state.wallet_type=='ETH' ? 'none' : 'flex')}]}>
          <Input inputStyle={ styles.inputBox }
                  inputContainerStyle={{ borderBottomWidth: 0 }}
                 value={ this.state.public_key}
                 valueTextColor="#fff"
                 selectionColor="#fff"
                 multiline={ true }
                 numberOfLines={ 3 }
                  rightIcon={ <AntDesign size={ 21 }
                                  onPress={() => this._onScan('public_key')}
                                   color='#fff'
                                   name='scan1' /> }
                 onChangeText={ value => this.setState( {
                                  public_key: value
                                } ) } />
        </View> 
         

         <View style={ styles.lableBar }>
          <Text style={ styles.lableText }>
            {this.state.wallet_type} Private Key
          </Text>
        </View>
        <View style={ styles.inputBar }>
          <Input inputStyle={ styles.inputBox }
                  inputContainerStyle={{ borderBottomWidth: 0 }}
                 value={ this.state.private_key}
                 valueTextColor="#fff"
                 selectionColor="#fff"
                 multiline={ true }
                 numberOfLines={ 3 }
                  rightIcon={ <AntDesign size={ 21 }
                                   onPress={() => this._onScan('private_key')}
                                   color='#fff'
                                   name='scan1' /> }
                 onChangeText={ value => this.setState( {
                                  private_key: value
                                } ) } />
        </View>
        
        <View style={ stylesgb.button }>
          <TouchableOpacity>
            <Text onPress={ this._onSubmit } style={ stylesgb.buttonText }>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginBottom:20}}></View>
      </View>
      </ScrollView>
     </View>
    )
  }
}

const styles = StyleSheet.create( {
  container: {
    backgroundColor: '#379eb6',
    flex: 1,
  },
  hideStyle: {
   justifyContent: 'center',
    alignItems: 'center',
  },
  showStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lableBar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  lableText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Quicksand-Medium',
  },
  inputBox: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Quicksand-Light',
    height: 73,

  },
  inputBar: {
    width: '88%',
    backgroundColor: '#3589ad',
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  }
} );