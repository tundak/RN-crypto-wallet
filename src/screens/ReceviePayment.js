import React, {Component} from 'react';
import { StyleSheet, Text,Button, View, TouchableOpacity, Alert, Keyboard,BackHandler,AsyncStorage,ToastAndroid,Clipboard } from 'react-native';
import { Input, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../components/Loader';
import { _API_URL, _API_TOKEN } from '../config.js';
import stylesgb from "../Style";
import { _retrieveData} from '../utils/Helper';
import QRCode from 'react-native-qrcode-svg';



export default class ReceviePayment extends Component< {
  }> {

static navigationOptions = {
    headerStyle: {
      backgroundColor: '#3589ad',
    },
    headerTintColor: '#fff',
    title: 'Recevie Payment',
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
      public_key: 'kk',
      user_id: '',
      api_token: '',
    }
  }

  _copyClipboard = () => {
    Clipboard.setString( (this.state.wallet_type=='BTC' ? this.state.btc_address: this.state.eth_address)  );
    ToastAndroid.showWithGravityAndOffset( 'Copied to clipboard', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 120 );
  }

  async componentDidMount() {
    var data = await _retrieveData();
    if(data=='logout'){
        this.setState( {
        loading: false
      } );
      AsyncStorage.clear();
      Actions.login();
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


  render() {
    return (
    <View style={ styles.container }>
      <Loader loading={ this.state.loading } />
      <View style={ this.state.loading ? styles.hideStyle : styles.showStyle }>
        <View style={ styles.qrBar }>
          <QRCode value={ (this.state.wallet_type=='BTC' ? this.state.btc_address: this.state.eth_address) }
                  size={ 170 }
                  logoSize={ 40 } />
        </View>
        <View style={ styles.lableBar }>
          <Text style={ styles.lableQr }>
            Scan QR code to get your {this.state.wallet_type} address
          </Text>
        </View>
        <View style={ styles.lableBar }>
          <Text style={ styles.lableText }>
           {this.state.wallet_type} Wallet Address
          </Text>
        </View>
        <View style={ styles.inputBar }>
          <Input inputStyle={ styles.inputBox }
          		inputContainerStyle={{ borderBottomWidth: 0 }}
                 value={ (this.state.wallet_type=='BTC' ? this.state.btc_address: this.state.eth_address) }
                 underlineColorAndroid='transparent'
                 valueTextColor="#fff"
                 selectionColor="#fff"
                 multiline={ true }
                 numberOfLines={ 3 }
                 editable={ false }
                 rightIcon={ <Icon size={ 21 }
                                   onPress={ this._copyClipboard }
                                   color='#fff'
                                   name='copy' /> } />
        </View>
      </View>
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
    display: 'none',
  },
  showStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrBar: {
    backgroundColor: '#FFF',
    marginTop: 40,
    height: 210,
    width: 210,
    justifyContent: 'center',
    alignItems: 'center',
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
  lableQr: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Quicksand-Medium',
    marginBottom: 10,
  },

  inputBox: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    marginVertical: 5,
    height: 73,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBar: {
    width: '93%',
    backgroundColor: '#3589ad',
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  }

} );
