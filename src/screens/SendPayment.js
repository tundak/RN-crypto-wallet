import React, {Component} from 'react';
import { StyleSheet, Text,Button, View, TouchableOpacity, Alert, Dimensions,Keyboard,BackHandler,AsyncStorage,ToastAndroid,Clipboard,ScrollView } from 'react-native';
import { Input, Avatar,CheckBox } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loader from '../components/Loader';
import { _API_URL, _API_TOKEN } from '../config.js';
import stylesgb from "../Style";
import { _retrieveData} from '../utils/Helper';


export default class SendPayment extends Component< {
  }> {

  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#3589ad',
    },
    headerTintColor: '#fff',
    title: 'Send Payment',
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
      address:'',
      user_id: '',
      api_token: '',
      amount: '',
      checked: false,
    }
  }

componentWillReceiveProps =( props ) => {
 this.setState( {
        address: props.navigation.state.params.address,
      } );
 }
  
  _onScan = () => {
     Keyboard.dismiss();
     this.props.navigation.navigate('QrScanner',{field_type:'payment'});
  }


async componentDidMount() {
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
      loading: false,
    } );
  }

   _onSubmit = async () => {
    Keyboard.dismiss();
    const {address, user_id, api_token, wallet_type, amount,checked} = this.state;
    if ( address.trim() == '' ) {
      Alert.alert( 'The address field is required.' );
      return false;
    }
    if ( !amount ) {
      Alert.alert( 'The amount field is required.' );
      return false;
    } else if ( Number( amount ) == 0 ) {
      Alert.alert( 'Amount can only be a positive number.' );
      return false;
    } else if ( amount.charAt( 0 ) === '-' ) {
      Alert.alert( 'Amount can only be a positive number.' );
      return false;
    } else if ( !amount.match( /^[0-9]*(\.[0-9]+){0,1}$/g ) ) {
      Alert.alert( 'Amount can only contain numbers and a period for the decimal point.' );
      return false;
    } 

     if ( checked === false ) {
      Alert.alert( 'You must agree to the terms and conditions.' );
      return false;
    }

  
    this.setState( {
      loading: true
    } );

    fetch( _API_URL + 'payment', {
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
        to: address,
        wallet_type: wallet_type,
        amount: amount,
      } )

    } ).then( (response) => response.json() )
      .then( (responseJson) => {
        if ( responseJson.status === true ) {
          try {
            Alert.alert(responseJson.msg);
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

  render() {

    return (
    <View style={ styles.container }>
    <ScrollView style={{height:Dimensions.get( 'window' ).height-200}}>
      <Loader loading={ this.state.loading } />
      <View style={ this.state.loading ? styles.hideStyle : styles.showStyle }>
        <View style={ { marginTop: 10 } } />
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
                                   onPress={ this._onScan }
                                   color='#fff'
                                   name='scan1' /> }
                 onChangeText={ value => this.setState( {
                                  address: value
                                } ) } />
        </View>
        <View style={ { marginTop: 10 } } />
        <View style={ styles.lableBar }>
          <Text style={ styles.lableText2 }>
            Amount
          </Text>
        </View>
        <View style={ styles.inputBar2 }>
          <Input inputStyle={ styles.inputBox3 }
                 inputContainerStyle={{ borderBottomWidth: 1,borderBottomColor:'#ffffff' }}
                 valueTextColor="#fff"
                 selectionColor="#fff"
                 keyboardType="numeric"
                 value={ this.state.amount }
                 onChangeText={ value => this.setState( {
                                  amount: value
                                } ) } />
        </View>
        <View style={{marginBottom:10}}></View>
        <View style={ styles.inputBarCheck }>
          <CheckBox title='I agree to the'
                    checked={ this.state.checked }
                    containerStyle={ styles.checkboxCoun }
                    textStyle={ styles.checkboxText }
                    uncheckedColor='#fff'
                    checkedColor='#fff'
                    onPress={ () => this.setState( {
                                checked: !this.state.checked
                              } ) } />
          <TouchableOpacity>
          <Text style={ styles.headerTextOtp4 }>
            Terms & Conditions
            { ' ' }
          </Text>
          </TouchableOpacity>
        </View>
        <View style={ stylesgb.button }>
          <TouchableOpacity>
            <Text onPress={ this._onSubmit } style={ stylesgb.buttonText }>
              Send Payment
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
  hideStyle2: {
   display:'none',
  },
  showStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox2: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
  },
  inputBar2: {
    flexDirection: 'row',
    width: '95%',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox3: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center'
  },
  lableBar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  lableText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Quicksand-Medium',
    marginBottom: 10,
  },
  lableText2: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Quicksand-Medium',
    marginBottom: 0,
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
  },
  inputBarCheck: {
    width: '98%',
    flexDirection: 'row',

  },
  checkboxCoun: {
    backgroundColor: '#379eb6',
    borderWidth: 0,
    marginVertical: 0,
    marginRight:-17,
  },
  checkboxText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Quicksand-Medium',
    fontWeight: 'normal',

  },
  headerTextOtp4: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 13,
    color: '#fff',
    marginTop:13,
  }

} );
