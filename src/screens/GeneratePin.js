import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Keyboard, AsyncStorage } from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';
import stylesgb from "../Style";

export default class GeneratePin extends Component< {
  }> {

  constructor( props ) {
    super( props );

    this.state = {
      originalpass: '',
      repeatpass: '',
    }
  }

static navigationOptions = {
    headerStyle: {
      backgroundColor: '#3589ad',
    },
    headerTintColor: '#fff',
    title: 'Generate Pin',
    headerTitleStyle: {
      color: '#fff',
      marginRight: '22%',
      textAlign: 'center',
      flex: 1,
    },
  }


  _orgpin = async (code) => {
      this.setState({originalpass: code});
  }

  _reptpin = async (code) => {
    this.setState({repeatpass: code});
    
  }

   _onSubmit = async () => {
    Keyboard.dismiss();
    if(!this.state.originalpass){
       Alert.alert('The MPIN field is required!');
       return false;
    }
    if(this.state.originalpass ==this.state.repeatpass){
          try {
            await AsyncStorage.setItem('savedpin', this.state.originalpass);
             Alert.alert('MPIN set successfully!');
            this.props.navigation.navigate('Settings',{refresh:'ok'});
          } catch (error) {
            // Error saving data
            Alert.alert('Something went wrong please try again later!');
          }
    }else{
      //error toast pin mismatch
      Alert.alert('Confirmation MPIN mismatch!');
    }
    
  }

render() {
    return (
    <View style={ stylesgb.container }>
        <View>
            <Text style={ styles.forgotText }>
              Generate Login MPIN 
            </Text>
        </View>
        <View style={ { height: 70 } }>
            <CodeInput
              ref="orginalpin"
              keyboardType="numeric"
              secureTextEntry
              codeLength={4}
              className='border-b'
              autoFocus={false}
              codeInputStyle={{ fontWeight: '800' }}
              onFulfill={(code) => this._orgpin(code)}
            />
            </View>
             <View >
            <Text style={ styles.forgotText }>
              Confirm MPIN
            </Text>
        </View>
        <View style={ { height: 70 } }>
            <CodeInput
              ref="repetpin"
              keyboardType="numeric"
              secureTextEntry
              codeLength={4}
              className='border-b'
              autoFocus={false}
              codeInputStyle={{ fontWeight: '800' }}
              onFulfill={(code) => this._reptpin(code)}
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
    )
  }
}

const styles = StyleSheet.create( {
 
  forgotText: {
    color: '#fff',
    fontSize: 20,
    marginVertical: 4,
    fontFamily: 'Quicksand-Bold',
  }
} );
