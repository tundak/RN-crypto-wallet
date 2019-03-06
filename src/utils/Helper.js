import React, { Component } from 'react';
import { AsyncStorage} from 'react-native';


export const _retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem('user_data');
    var stringify = JSON.parse( value );
    var user_id = stringify['user_id'];
    var full_name = stringify['full_name'];
    var email = stringify['uemail'];
    var api_token = stringify['api_token'];
    stringify['btc_address'] = await AsyncStorage.getItem('btc_address');
    stringify['eth_address'] = await AsyncStorage.getItem('eth_address');
    stringify['wallet_type'] = await AsyncStorage.getItem('wallet_type');
    stringify['savedpin'] = await AsyncStorage.getItem('savedpin');
    stringify['touchIdLoginStatus'] = await AsyncStorage.getItem('touchIdLoginStatus');
    if ( user_id && api_token ) {
      return stringify;
    } else {
      return 'logout';
    }

  } catch (error) {
    return 'logout';
  }
}


