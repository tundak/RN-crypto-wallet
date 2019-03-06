import React, {Component} from 'react';
import { StyleSheet, Text,Button, View, TouchableOpacity, Alert, Keyboard,BackHandler } from 'react-native';
import { Input, Avatar,Icon } from 'react-native-elements';
import AntIcon from "react-native-vector-icons/AntDesign";
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../components/Loader';
import { _API_URL, _API_TOKEN } from '../config.js';
import stylesgb from "../Style";
import { _retrieveData} from '../utils/Helper';

export default class Menu extends Component< {
  }> {

  constructor( props ) {
    super( props );
    this.state = {
      loading: false,
      email: ''
    }
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
    } );
  }
  goHistory = () => {

    if ( this.state.wallet_type =='BTC' && this.state.btc_address==null ) {
      Alert.alert( 'Please create or pair your BTC wallet.' );
      return false;
    }

    if ( this.state.wallet_type =='ETH' && this.state.eth_address==null ) {
      Alert.alert( 'Please create or pair your ETH wallet.' );
      return false;
    }
    this.props.navigation.navigate('HistoryReceive');
  }

 static navigationOptions = () => ({
    header: null,
  });

  render() {
    return (
    <View style={ styles.container }>
     <Loader loading={ this.state.loading } />

  <View style={ styles.topBar }>
   <TouchableOpacity onPress={() => this.props.navigation.push('Dashboard')}>
     <Icon containerStyle={{marginTop:20}}
    size={30}
  name='close'
  color='#3899b4'
/>
</TouchableOpacity>
 <Avatar containerStyle={{marginTop:-30}} overlayContainerStyle={ { backgroundColor: 'transparent' } }
            size={ 120 }
            source={ require( '../images/blue-big.png' ) } />

      <Icon 
    size={30}
  name='close'
  color='#eeeeee'
/>

</View>

<View style={ styles.middleBar }>
<TouchableOpacity onPress={() => this.props.navigation.navigate('Wallet')}>
<View  style={ styles.middleBarInner }>
<AntIcon 
    size={40}
  name='wallet'
  color='#3899b4'
/>
<Text> Wallets</Text>
</View>
</TouchableOpacity>
<View style={ styles.middleBarInner }>
<MaterialCommunityIcons 
    size={40}
  name='currency-eur'
  color='#3899b4'
/>
<Text> Currency</Text>
</View>
<View style={ styles.middleBarInner }>
<Entypo 
    size={40}
  name='tools'
  color='#3899b4'
/>
<Text> Tools</Text>
</View>
</View>


<View style={ styles.middleBar }>
<TouchableOpacity onPress={this.goHistory}>
<View  style={ styles.middleBarInner }>
<Icon 
    size={40}
  name='history'
  color='#3899b4'
/>
<Text> History</Text>
</View>
</TouchableOpacity>
<View style={ styles.middleBarInner }>
<Ionicons 
    size={40}
  name='md-help-buoy'
  color='#3899b4'
/>
<Text> Help</Text>
</View>
<View style={ styles.middleBarInner }>
<Entypo 
    size={40}
  name='news'
  color='#3899b4'
/>
<Text> News</Text>
</View>
</View>

<View style={ styles.middleBar }>
<TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')}>
<View  style={ styles.middleBarInner }>
<AntIcon 
    size={40}
  name='setting'
  color='#3899b4'
/>
<Text> Settings</Text>
</View>
</TouchableOpacity>
<View style={ styles.middleBarInner }>
<AntIcon 
    size={40}
  name='infocirlceo'
  color='#3899b4'
/>
<Text> About</Text>
</View>
<View style={ styles.middleBarInner2 }>

</View>
</View>

    </View>

    )
  }
}


const styles = StyleSheet.create( {
  container: {
    backgroundColor: '#eeeeee',
    flex: 1,
  },
   topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginTop:30,
    marginLeft:30,
    marginRight:30,
    
  }
  ,
   middleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginTop:20,
    marginLeft:30,
    marginRight:30,

    
  },
  middleBarInner:{
     backgroundColor: '#fff',
     borderRadius: 5,
     width:90,
     height:90,
     alignItems: 'center',
    justifyContent: 'center',
  },
  middleBarInner2:{
     backgroundColor: '#eeeeee',
     borderRadius: 5,
     width:90,
     height:90,
     alignItems: 'center',
    justifyContent: 'center',
  }
  

} );