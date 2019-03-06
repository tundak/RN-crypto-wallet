import React, {Component} from 'react';
import { StyleSheet, Text,Button, View, StatusBar, TouchableOpacity, Alert,ScrollView,Dimensions, Keyboard,AsyncStorage,Clipboard,ToastAndroid} from 'react-native';
import { Input, Avatar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Logo from '../components/Logo';
import Loader from '../components/Loader';
import { _API_URL, _API_TOKEN } from '../config.js';
import stylesgb from "../Style";

export default class GenerateKey extends Component< {
  }> {


  constructor( props ) {
    super( props );
    this.state = {
      loading: false,
      public_key: '',
      private_key: '',
      checked: false,
      user_id: 0,
      api_token: '',
      pdfPath: '',
      mykeyval: 'demo',
      pubbase64: '',
      privbase64: '',
      btngenkey: false,
      btndwkey: true
    }
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#3589ad',
    },
    headerTintColor: '#fff',
    title: 'Create a New Wallet',
    headerTitleStyle: {
      color: '#fff',
      marginRight: '22%',
      textAlign: 'center',
      flex: 1,
    },
  }

  goManageKey = () => {
    Actions.manageKey();
  }

  
  _copyClipboardPub = () => {
    Clipboard.setString( this.state.public_key );
    ToastAndroid.showWithGravityAndOffset( 'Copied to clipboard', ToastAndroid.SHORT, ToastAndroid.CENTER, 25, 120 );
  }

  _copyClipboardPri = () => {
    Clipboard.setString( this.state.private_key );
    ToastAndroid.showWithGravityAndOffset( 'Copied to clipboard', ToastAndroid.SHORT, ToastAndroid.CENTER, 25, 120 );
  }


  render() {
    return (
    <View style={ styles.container }>
    <ScrollView style={{height:Dimensions.get( 'window' ).height-200}}>
      <Loader loading={ this.state.loading } />
      <View style={ styles.lableBar }>
        <Text style={ styles.lableText }>
          Public key
        </Text>
      </View>
      <View style={ styles.inputBar }>
        <Input inputStyle={ styles.inputBox }
               inputContainerStyle={{ borderBottomWidth: 0 }}
               valueTextColor="#fff"
               selectionColor="#fff"
               multiline={ true }
               value={ this.state.public_key }
               numberOfLines={ 3 }
               editable={ false }
               onChangeText={ value => this.setState( {
                                public_key: value
                              } ) }
               rightIcon={ <Icon size={ 21 }
                                 onPress={ this._copyClipboardPub }
                                 color='#fff'
                                 name='copy' /> } />
      </View>
      <View style={ styles.lableBar }>
        <Text style={ styles.lableText }>
          Private key
        </Text>
      </View>
      <View style={ styles.inputBar }>
        <Input inputStyle={ styles.inputBox }
               inputContainerStyle={{ borderBottomWidth: 0 }}
               valueTextColor="#fff"
               selectionColor="#fff"
               multiline={ true }
               value={ this.state.private_key }
               numberOfLines={ 3 }
               editable={ false }
               onChangeText={ value => this.setState( {
                                private_key: value
                              } ) }
               rightIcon={ <Icon size={ 21 }
                                 onPress={ this._copyClipboardPri }
                                 color='#fff'
                                 name='copy' /> } />
      </View>
      <Text style={ styles.infoText }>
        <Text style={{color:'#fff'}}>Public Key </Text> > You receive BTC that others send to this address
      </Text>
      <Text style={ styles.infoText }>
        <Text style={{color:'#fff'}}>Private Key </Text> > You sign the transaction to send BTC using a this key
      </Text>

      <Text style={ styles.infoText }>
        <Text style={{color:'#da2854'}}>Important Note</Text> > You are yourself responsible for your private key, we have no way to retrieve your private keys if you lose. We advise you to print and keep a copy offline.
      </Text>
       <View style={ styles.button }>
        <TouchableOpacity onPress={ this._onSubmit }>
          <Text style={ stylesgb.buttonText }>
            Generate Key
          </Text>
        </TouchableOpacity>
      </View>
   
      <View style={{marginBottom:20}}></View>
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
  ccstyle: {
    height: 0,
    opacity: 0,

  },
  lableBar: {
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,

  },
  lableText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Quicksand-Light',
    marginLeft: '6%',
  },
  inputBox: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 5,
    height: 73,


  },
  inputBar: {
    width: '88%',
    marginLeft: '6%',
    backgroundColor: '#3589ad',
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
    button: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginTop: 25,
    paddingVertical: 12,
    marginLeft: '5%',
  },
  buttomBar: {
    flexDirection: 'row',
    width: '93%',
    marginLeft: '6%',
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'Quicksand-Bold',
  },
  buttonTextCancel: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Quicksand-Bold',
  },
  infoText: {
    marginTop: 20,
    width: '88%',
    marginLeft: '6%',
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Quicksand-Medium',
  }
} );
