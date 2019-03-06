import React, {Component} from 'react';
import { StyleSheet, Text,Button, View, StatusBar, TouchableOpacity, Alert, Keyboard,ScrollView,Dimensions,AsyncStorage } from 'react-native';
import { Input, Avatar } from 'react-native-elements';
import AntIcon from "react-native-vector-icons/AntDesign";
import Logo from '../components/Logo';
import Loader from '../components/Loader';
import { _API_URL, _API_TOKEN } from '../config.js';
import stylesgb from "../Style";
import TouchID from 'react-native-touch-id';
import ToggleSwitch from 'toggle-switch-react-native'
import { _retrieveData} from '../utils/Helper';

const optionalConfigObject = {
  unifiedErrors: false ,
  passcodeFallback: false 
}

export default class Settings extends Component< {
  }> {

   static navigationOptions = {
    headerStyle: {
      backgroundColor: '#3589ad',
    },
    headerTintColor: '#fff',
    title: 'Settings',
    headerTitleStyle: {
      color: '#fff',
      marginRight: '22%',
      textAlign: 'center',
      flex: 1,
    },
  }

  constructor( props ) {
    super( props );

    this.touchOnOff = this.touchOnOff.bind(this);
    this.state = {
      loading: false,
      email: '',
      password: '',
      hidesavekey:true,
      touchSupported:false,
      touchIdLogin:false,
      savedpin:'',
    }

      TouchID.isSupported(optionalConfigObject)
      .then(biometryType => {
        this.setState( {
        touchSupported: true
      } );
      })
      .catch(error => {
        
      });
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
        savedpin: data['savedpin'],
      } );

    if(data['touchIdLoginStatus']=='ok'){
    this.setState( {
      touchIdLogin: true,
     
    } );
  }
  }

componentWillReceiveProps = async ( props ) => {
 this.setState( {
        savedpin: await AsyncStorage.getItem('savedpin'),
      } );
 }

touchOnOff(){

  if(this.state.touchIdLogin){

    AsyncStorage.setItem('touchIdLoginStatus',' ');
    this.setState( {
          touchIdLogin: false
        } );
  }else{

    if(this.state.savedpin==null){
      Alert.alert('Please set MPIN frist.');
      return false;
    }
    this.setState( {
          touchIdLogin: true
        } );
    AsyncStorage.setItem('touchIdLoginStatus','ok');
  }
}

signout = async () => {
   try {
            await AsyncStorage.clear();
            this.props.navigation.navigate('Login');

          } catch (error) {
            alert('Something went wrong please try again later!');
          }
}

  render() {
    return (
    <View style={ styles.container }>
      <ScrollView style={{height:Dimensions.get( 'window' ).height-200}}>
      <Loader loading={ this.state.loading } />
      <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfile')}>
        <View style={ styles.textCont }>
        
          <Text style={ styles.titleText }>
            Edit Profile
          </Text>
          <AntIcon 
    size={21}
  name='caretright'
  color='#fff'
/>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.props.navigation.navigate('ChangePassword')}>
        <View style={ styles.textCont }>
        
          <Text style={ styles.titleText }>
            Change Password
          </Text>
          <AntIcon 
    size={21}
  name='caretright'
  color='#fff'
/>
        </View>
      </TouchableOpacity>

       <TouchableOpacity onPress={() => this.props.navigation.navigate('GeneratePin')}>
        <View style={ styles.textCont }>
        
          <Text style={ styles.titleText }>
            Set MPIN
          </Text>
          <AntIcon 
    size={21}
  name='caretright'
  color='#fff'
/>
        </View>
      </TouchableOpacity>
 <View style={[styles.textCont,{ display:(this.state.touchSupported ? 'flex' : 'none')}]}>
  <Text style={ styles.titleTextID }>
            Touch ID Login
          </Text> 
<ToggleSwitch
    isOn={this.state.touchIdLogin}
    onColor='green'
    offColor='#da2854'
    label=''
    size='medium'
    onToggle={ (isOn) => this.touchOnOff() }
/>
</View>

      <TouchableOpacity onPress={ this.signout }>
        <View style={ styles.textCont }>
        
          <Text  style={ styles.titleLogout }>
            Logout
          </Text>
           <AntIcon 
    size={21}
  name='logout'
  color='#da2854'
/>

        </View>
      </TouchableOpacity>
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
  hideStyle:{
    display:'none',
  },
  textCont: {
    flexGrow: 1,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: .7,
    borderBottomColor: '#fff',
    flexDirection: 'row',

  },
  textCont2: {
    flexGrow: 1,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: .7,
    borderBottomColor: '#fff',
    flexDirection: 'row',
    marginLeft: -15

  },
  titleText: {
    color: '#fff',
    width: '67%',
    fontSize: 18,
    fontFamily: 'Quicksand-Light',
    justifyContent: 'center',
    marginLeft: 15,
  },
   titleTextID: {
    color: '#fff',
    width: '58%',
    fontSize: 18,
    fontFamily: 'Quicksand-Light',
    justifyContent: 'center',
    marginLeft: 15,
  },
  titleLogout: {
    color: '#da2854',
    fontSize: 18,
    width: '67%',
    fontFamily: 'Quicksand-Bold',
    justifyContent: 'center',
    marginLeft: 15,
  }
} );
