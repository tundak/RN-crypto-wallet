import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Keyboard, AsyncStorage } from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';
import TouchID from 'react-native-touch-id';
import {Icon } from 'react-native-elements';
import stylesgb from "../Style";
import Logo from '../components/Logo';

const optionalConfigObject = {
  unifiedErrors: false,
  passcodeFallback: false, 
};

export default class VerifyPin extends Component< {
  }> {

  constructor(props) {
    super(props);
    this.state = {
      fail_count: 0
    }
  }

static navigationOptions = () => ({
    header: null,
  });


async componentDidMount() {
    const touchIdLoginStatus = await AsyncStorage.getItem('touchIdLoginStatus');
    if(touchIdLoginStatus=='ok'){
      TouchID.isSupported(optionalConfigObject)
      .then(biometryType => {
        TouchID.authenticate('Unlock your BPST', optionalConfigObject)
          .then(success => {
            this.props.navigation.navigate('Dashboard');
          })
          .catch(error => {
            Alert.alert('Authentication Failed');
          });
      }).catch(error => {
          });
    }
   
  }

   _checkpin = async (code) => {
    Keyboard.dismiss();

    const block_15min = await AsyncStorage.getItem('block_15min');
    if(this.state.fail_count == 3 || block_15min =='yes'){

        const timeblocked = await AsyncStorage.getItem('blocked_login');
        let blocktime = (new Date().getTime()-timeblocked)/1000;
        if(blocktime < 900){
           Alert.alert('You are blocked for 15 minutes!');
            return false;
        }else{
            await AsyncStorage.removeItem('blocked_login');
            await AsyncStorage.removeItem('block_15min');
            this.setState({ fail_count: 0})
        }
    }

     try {
        const logpin = await AsyncStorage.getItem('savedpin');
            if (logpin == code) {
              this.props.navigation.navigate('Dashboard');
            }else{
              this.refs.loginpcode.clear();
              this.setState({ fail_count: this.state.fail_count + 1})
              let remaining_atmpt = 3-this.state.fail_count;
              Alert.alert('Please enter valid MPIN! '+remaining_atmpt+' attempts remaining.');
              

                if(this.state.fail_count == 3){
                    AsyncStorage.setItem('blocked_login', JSON.stringify(new Date().getTime()));
                    AsyncStorage.setItem('block_15min', 'yes');
                    Alert.alert('You are blocked for 15 minutes!');
                }

            }
       } catch (error) {
         // Error retrieving data
          Alert.alert('Something went wrong please try again later!');
       }

  }

   resetHere = async () => {
      Alert.alert(
      'Reset MPIN?',
      'By reset MPIN you have to login again',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Yes,Reset',
          onPress: () => this.resetlocalStore()
        },
      ],
      {
        cancelable: false
      }
    )
  }

  resetlocalStore(){
     Keyboard.dismiss();
    AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  }


   render() {
    return (
    <View style={ stylesgb.container }>
     <Logo/>

    <Icon size={ 50 }
                                     color='#fff'
                                      name='lock'
                                     containerStyle={ { marginLeft: -15, marginBottom: 10 } } />
     
        <View >
            <Text style={ styles.forgotText }>
              Enter MPIN
            </Text>
        </View>
        <View style={ { height: 100 } }>
        <CodeInput
            ref="loginpcode"
            keyboardType="numeric"
            secureTextEntry
            codeLength={4}
            className='border-b'
            codeInputStyle={{ fontWeight: '800' }}
            onFulfill={(code) => this._checkpin(code)}
          />
           </View>

             <View style={ styles.resendCount }>
          <Text style={ styles.headerTextOtp3 }>
            Forgot MPIN?
          </Text>
          <TouchableOpacity onPress={ this.resetHere }>
            <Text style={ styles.headerTextOtp }>
              { ' ' }Reset Here
            </Text>
          </TouchableOpacity>
        </View>
    </View>
    )
  }

}

const styles = StyleSheet.create( {
  forgotText: {
    color: '#fff',
    fontSize: 20,
    marginTop: 15,
    fontFamily: 'Quicksand-Bold',
  },
  resendCount: {
    marginTop: 20,
    flexDirection: 'row',
  },
  headerTextOtp: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 16,
    color: '#41b3ff',
  },
  headerTextOtp3: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    color: '#fff',
  }
} );
