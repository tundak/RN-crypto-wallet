import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import RNBeep from 'react-native-a-beep';


export default class QrScanner extends Component< {
  }> {

   static navigationOptions = {
    headerStyle: {
      backgroundColor: '#3589ad',
    },
    headerTintColor: '#fff',
    title: 'Qr Scanner',
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
      private_key: '',
      field_type:props.navigation.state.params.field_type,
    }
  }


  onSuccess = (e) => {
    RNBeep.beep();

     if(this.state.field_type=='payment'){
    this.props.navigation.navigate('SendPayment', {
        address: e.data,
        field_type:this.state.field_type,
        time:new Date()
    } ); 
    }else{
      this.props.navigation.navigate('Pair', {
        address: e.data,
        field_type:this.state.field_type,
        time:new Date()
    } ); 
    }
 
  }

  cancelClick = () => {

    this.props.navigation.pop();
   
  }

  render() {
    return (
    <View style={ styles.container }>
      <View style={ styles.rectangleContainer }>
        <View style={ styles.rectangle }>
          <QRCodeScanner markerStyle={{borderColor:'#da2854'}} showMarker={true} style={ styles.qrCode } onRead={ this.onSuccess.bind( this ) } />
        </View>
        <View style={ styles.lableBar }>
          <Text style={ styles.lableText }>
            Scan the QR code you want to send to.
          </Text>
        </View>
        <View style={ styles.cancelButton }>
          <TouchableOpacity onPress={ this.cancelClick }>
            <Text style={ styles.cancelButtonText }>
              Cancel
            </Text>
          </TouchableOpacity>
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
  lableBar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lableText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Quicksand-Medium',
  },
  qrCode: {
    alignItems: 'center',
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: 320,
    backgroundColor: 'transparent',
  },

  cancelButton: {
    width: 250,
    backgroundColor: '#da2854',
    marginTop: 20,
    paddingVertical: 8
  },
  cancelButtonText: {
    fontSize: 20,
    alignItems: 'center',
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'Quicksand-Bold',
  }
} );
