import React from 'react';
import { Input, Avatar } from 'react-native-elements';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

export default class AuthLoading extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const savedpin = await AsyncStorage.getItem('savedpin');
    const value = await AsyncStorage.getItem('user_data');
    const touchIdLoginStatus = await AsyncStorage.getItem('touchIdLoginStatus');
    if(value){
    var stringify = JSON.parse(value);
    var user_id = stringify['user_id'];
    var api_token = stringify['api_token'];
     if (user_id && api_token) {

      if(savedpin !=null || touchIdLoginStatus=='ok'){
        this.props.navigation.navigate('App2');
      }else{
        this.props.navigation.navigate('App' );
      }
      

    }else{
      this.props.navigation.navigate('Auth');
    }
  }else{
    this.props.navigation.navigate('Auth');
  }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <Avatar containerStyle={{marginTop:0}} overlayContainerStyle={ { backgroundColor: 'transparent' } }
            size={ 200 }
            source={ require( '../images/logobp.png' ) } />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#379eb6',
  },
});