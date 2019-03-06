import React, {Component} from 'react';
import { StyleSheet, Text,Button, View, TouchableOpacity, Alert, Keyboard,BackHandler,AsyncStorage } from 'react-native';
import { Input, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../components/Loader';
import { _API_URL, _API_TOKEN,_API_URL_WALLET_BTC,_API_URL_WALLET_ETH } from '../config.js';
import stylesgb from "../Style";
import { _retrieveData} from '../utils/Helper';
import ActionSheet from 'react-native-actionsheet';

const options = [
  <Text style={ { color: '#999', fontSize: 16, fontFamily: 'Quicksand-Medium' } }>
    BTC Wallet
  </Text>,
  <Text style={ { color: '#999', fontSize: 16, fontFamily: 'Quicksand-Medium' } }>
    ETH Wallet
  </Text>,
  <Text style={ { color: '#da2854', fontSize: 16, fontFamily: 'Quicksand-Bold' } }>
    Cancel
  </Text>,
]

export default class Dashboard extends Component< {
  }> {

  constructor( props ) {
    super( props );
    this.state = {
      loading: true,
      amount: '0',
    }
  }


 static navigationOptions = () => ({
    header: null,
  });


  async componentWillMount() {
   
  }

 async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
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

     if ( (this.state.wallet_type=='BTC' && this.state.btc_address!=null) || (this.state.wallet_type=='ETH' && this.state.eth_address!=null) ) {

      if(this.state.wallet_type=='BTC'){
        var url=_API_URL_WALLET_BTC+this.state.btc_address;
      }else{
        var url=_API_URL_WALLET_ETH+this.state.eth_address;
      }
      await fetch( url, {
        method: 'GET',
        timeout:45000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      } ).then( (response) => response.json() )
        .then( (responseJson) => {
          this.setState({
              loading: false
            });
          if(responseJson.balance){

              if(responseJson.balance > 0 && this.state.wallet_type=='BTC'){
                var balance=(parseInt(responseJson.balance)/(100000000));
              }else if(responseJson.balance > 0 && this.state.wallet_type=='ETH'){
                var balance=(parseInt(responseJson.balance)/(1000000000000000000));
              }else{
                var balance=0;
              }
               this.setState({
                  amount: balance
                });
              
          }else{
           this.setState( {
              loading: false
            });   
          }
        }).catch((error) => {
            this.setState( {
              loading: false
            });
      });

    } else {
      this.setState( {
        loading: false
      } );
    }
}

onBackButtonPressed() {
    return true;
}

showActionSheet = () => {
    this.ActionSheet.show()
  }

  setActionSheet = (index) =>{
      if(index==0){
        AsyncStorage.setItem('wallet_type','BTC');
        this.props.navigation.push('Dashboard'); 

      }else if(index==1){
         AsyncStorage.setItem('wallet_type','ETH');
         this.props.navigation.push('Dashboard'); 
         
      }

  }

  goRecevie = () => {

    if ( this.state.wallet_type =='BTC' && this.state.btc_address==null ) {
      Alert.alert( 'Please create or pair your BTC wallet.' );
      return false;
    }

    if ( this.state.wallet_type =='ETH' && this.state.eth_address==null ) {
      Alert.alert( 'Please create or pair your ETH wallet.' );
      return false;
    }
    this.props.navigation.navigate('ReceviePayment');
  }

   goSell = () => {

    if ( this.state.wallet_type =='BTC' && this.state.btc_address==null ) {
      Alert.alert( 'Please create or pair your BTC wallet.' );
      return false;
    }

    if ( this.state.wallet_type =='ETH' && this.state.eth_address==null ) {
      Alert.alert( 'Please create or pair your ETH wallet.' );
      return false;
    }
    this.props.navigation.navigate('SendPayment', { token: new Date() });
  }


  render() {
    return (
    <View style={ styles.container }>
     <Loader loading={ this.state.loading } />

  <View style={ styles.topBar }>
  <TouchableOpacity onPress={() => this.props.navigation.navigate('Menu')}>
     <Icon 
    size={30}
  name='bars'
  color='#fff'
/>
</TouchableOpacity>
 <Avatar containerStyle={{marginTop:-30}} overlayContainerStyle={ { backgroundColor: 'transparent' } }
            size={ 100 }
            source={ require( '../images/logobp.png' ) } />

<TouchableOpacity onPress={ this.showActionSheet }>
 <Avatar overlayContainerStyle={ { backgroundColor: 'transparent' } }
            size={ 35 }
            source={ require( '../images/choose.png' ) } />
  </TouchableOpacity>
</View>

<View style={styles.logoCont}>
 <Avatar containerStyle={{marginTop:0}} overlayContainerStyle={ { backgroundColor: 'transparent' } }
            size={ 60 }
            source={ (this.state.wallet_type=='BTC' ? require( '../images/btc.png' ) : require( '../images/eth.png' )) } />
</View>

<ActionSheet ref={ o => this.ActionSheet = o }
                     title={ <View style={{backgroundColor: '#3589ad',width:'100%', paddingVertical: 14, justifyContent: 'center',
    alignItems: 'center'}}><Text style={ { color: '#fff', fontSize: 20, fontFamily: 'Quicksand-Bold' } }>
                              Choose one from below
                             </Text></View> }
                     options={ options }
                     cancelButtonIndex={ 2 }

                     onPress={ (index) => {
                                 this.setActionSheet( index )
                               } }
                      />

<View style={ styles.numCont }>
<Text style={ styles.numText }> {this.state.amount}</Text>
</View>

<View style={ styles.numCont }>
<Text style={ styles.numText2 }>Current Available {this.state.wallet_type}</Text>
<Text style={{color:'#fff'}}>{(this.state.wallet_type=='BTC' ? this.state.btc_address : this.state.eth_address)}</Text>
</View>

<View style={ styles.buttonBar }>
 <TouchableOpacity onPress={ this.goRecevie }>
<View style={ styles.button }>

<Icon style={{marginTop:3,marginRight:5}} 
    size={20}
  name='chevron-up'
  color='#7fb0c8'
/>
       
          <Text style={ stylesgb.buttonTextDash }>
            Receive
          </Text>
      
      </View>
 </TouchableOpacity> 
  <View style={ styles.button }>
   <Icon style={{marginTop:8}} 
    size={20}
  name='chevron-right'
  color='#7fb0c8'
/>
  <Icon style={{marginTop:3,marginRight:5}} 
    size={20}
  name='chevron-left'
  color='#7fb0c8'
/>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')}>
          <Text style={ stylesgb.buttonTextDash }>
            Exchange
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={ this.goSell }>
    <View style={ styles.button }>
    <Icon style={{marginTop:3,marginRight:5}} 
    size={20}
  name='chevron-down'
  color='#7fb0c8'
/>
        
          <Text style={ stylesgb.buttonTextDash }>
            Send
          </Text>
       
      </View>
       </TouchableOpacity>
</View>
<View style={{marginTop:20}}>
</View>

<View style={ styles.numCont }>
<Text style={ styles.numText }> Price</Text>
</View>

<View style={ styles.numCont }>
<Text style={ styles.numText2 }>Daily updated 04 August, 2018</Text>
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
  logoCont:{
    alignItems: 'center',
    justifyContent: 'center',
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
   buttonBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginTop:30,
    marginLeft:10,
    marginRight:10,
    
  },
   numCont: {
    alignItems: 'center',
    justifyContent: 'center',
  },
   numText: {
    color: '#ffffff',
    fontSize: 30,
    marginTop: 15,
  },
  numText2:{
    color: '#ffffff',
    fontSize: 15,
    marginTop: 10,
  },
   button: {
    backgroundColor: '#ffffff',
     flexDirection: 'row',
    borderRadius: 10,
    marginTop: 20,
    paddingVertical: 10,
    paddingLeft:5,
    paddingRight:12,
  }

} );