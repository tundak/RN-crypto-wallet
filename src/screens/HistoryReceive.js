import React, {Component} from 'react';
import { StyleSheet, Text,Button, View, TouchableOpacity, Alert, Dimensions,Keyboard,BackHandler,AsyncStorage,ToastAndroid,Clipboard,ScrollView,ListView } from 'react-native';
import { Input, Avatar,CheckBox } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loader from '../components/Loader';
import { _API_URL, _API_TOKEN ,_API_URL_WALLET_ETH,_API_URL_WALLET_BTC} from '../config.js';
import stylesgb from "../Style";
import { _retrieveData} from '../utils/Helper';

import HistoryRow from '../components/HistoryRow';

export default class HistoryReceive extends Component< {
  }> {


  constructor( props ) {
    super( props );
    const ds = new ListView.DataSource( {
      rowHasChanged: (r1, r2) => r1 !== r2
    } );
    this.state = {
      loading: true,
      public_key: '',
      checked: false,
      user_id: 0,
      api_token: '',
      dataSource: ds.cloneWithRows( [] ),
    }
  }

 static navigationOptions = {
    headerStyle: {
      backgroundColor: '#3589ad',
    },
    headerTintColor: '#fff',
    title: 'History',
    headerTitleStyle: {
      color: '#fff',
      marginRight: '22%',
      textAlign: 'center',
      flex: 1,
    },
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
          if ( responseJson.txrefs ) {
            var records = responseJson.txrefs;
            var rowLen = records.length;
            var dataSourceSend = [];
            var k=0;
            records.map( (data, i) => {
              dataSourceSend.push( {
                  amount: (this.state.wallet_type=='BTC' ? data.value/100000000 : data.value/1000000000000000000 ),
                  tx_hash: data.tx_hash,
                  created_at: data.confirmed,
                  row_id: k,
                  wallet_type: this.state.wallet_type,
                  tx_output_n: data.tx_output_n,
                } );
                k++;

              if ( rowLen == i + 1 ) {
                this.setState( {
                  dataSource: this.state.dataSource.cloneWithRows( dataSourceSend )
                } );
              }

            } )

          }
          this.setState( {
            loading: false
          } );
        } ).catch( (error) => {

        this.setState( {
          loading: false
        } );
           Alert.alert('Something went wrong please try again later!');
      } );


  }



  render() {
    const list_view = <ListView style={ styles.listCount }
                                contentContainerStyle={ styles.listCount }
                                dataSource={ this.state.dataSource }
                                renderRow={ (data) => <HistoryRow {...data} /> }
                                />;
    const empty_msg = <View style={ styles.emptyBar }>
                        <Text style={ styles.emptyText }>
                          No record found.
                        </Text>
                      </View>

    return (
    <View style={ styles.container }>
      <Loader loading={ this.state.loading } />
      <View style={ this.state.loading ? styles.hideStyle : null }>
        <View style={ styles.borderBottom }></View>
          { this.state.dataSource.getRowCount() ? list_view : empty_msg } 
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
    width: '100%',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050e20',

  },
 hideStyle: {
    display: 'none',
  },
  tobBarSend: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
    flexDirection: 'row',
  },
  tobBarText1: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    marginRight: 20,

  },
  separator: {
    height: 55,
    borderRightWidth: 1,
    borderRightColor: '#41b3ff',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#41b3ff',
    width: '50%',
    marginLeft: '50%',
  },
  separatorList: {
    borderBottomWidth: .5,
    borderBottomColor: '#41b3ff',
    marginVertical: 5,
  },
  listCount: {
    width: '100%',
  },
  hideStyle: {
    display: 'none',
  },
  emptyBar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
  }
} );
