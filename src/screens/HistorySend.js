import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity,TouchableHighlight, Alert, ListView, Dimensions, AsyncStorage } from 'react-native';
import Loader from '../components/Loader';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { _retrieveData, errorLable, chechInternet } from '../utils/Helper.js';
import { _ORBIT_URL } from '../config.js';
import BottomNavi from '../components/BottomNavi';
import { Input, Avatar } from 'react-native-elements';
import HistoryRow from '../components/HistoryRow';
import Toast, { DURATION } from 'react-native-easy-toast';
import fetch from 'react-native-fetch-polyfill';

export default class HistorySend extends Component< {
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
      backgroundColor: '#41b3ff',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontFamily: 'Quicksand-Bold',
      color: '#fff',
      marginRight: '22%',
      fontSize: 20,
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
      Actions.login();
      return false;
    }
    this.setState( {
      user_id: data[ 'user_id' ],
      api_token: data[ 'api_token' ],
      public_key: data[ 'public_key' ],
    } );

    if ( this.state.public_key != '' ) {
      var isConnected = await chechInternet();
      if ( !isConnected ) {
        var msg = errorLable( 'No Internet Connection' );
        this.refs.toastErr.show( msg, 3000 );
        this.setState( {
          loading: false
        } );
        return false;
      }
      await fetch( _ORBIT_URL + 'accounts/' + this.state.public_key + '/payments?limit=50&order=desc', {
        method: 'GET',
        timeout:45000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }).then( (response) => response.json() )
        .then( (responseJson) => {

          if ( responseJson._embedded ) {
            var records = responseJson._embedded.records;
            var rowLen = records.length;
            var dataSourceSend = [];
            var k=0;
            records.map( (data, i) => {
              if ( data.type == 'create_account' && data.source_account == this.state.public_key ) {
                dataSourceSend.push( {
                  amount: data.starting_balance.toString().match( /^-?\d+(?:\.\d{0,2})?/ )[ 0 ],
                  account: data.account,
                  created_at: data.created_at,
                  row_id: k,
                } );
                k++;
              } else if ( data.type == 'payment' && data.source_account == this.state.public_key ) {
                dataSourceSend.push( {
                  amount: data.amount.toString().match( /^-?\d+(?:\.\d{0,2})?/ )[ 0 ],
                  account: data.to,
                  created_at: data.created_at,
                  row_id: k,
                } );
                k++;
              }

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
          }).catch((error) => {
          //alert(JSON.stringify(error));
          var msg = errorLable('Server not responding please try again later.');
        this.refs.toastErr.show(msg, 3000);
        this.setState( {
          loading: false
        } );
      } );

    }

  }

  goHistory = () => {
    Actions.historyReceive();
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
        <View style={ styles.topBar }>
          <View style={ styles.tobBarSend }>
            <Text style={ styles.tobBarText1 }>
              Send
            </Text>
            <Avatar size={ 28 }
                    rounded
                    source={ require( '../images/receive-icon.png' ) } />
          </View>
          <Text style={ styles.separator }></Text>
           <TouchableHighlight style={ styles.tobBarSend } onPress={this.goHistory} underlayColor="#082338">
          <View style={{flexDirection:'row'}}>
              <Text  style={ styles.tobBarText1 }>
                Receive
              </Text>
              <Avatar  size={ 28 }
                    rounded
                    source={ require( '../images/send-icon.png' ) } />
            
          </View>
          </TouchableHighlight>
        </View>
        <View style={ styles.borderBottom }></View>
        <View style={ { marginVertical: 5 } }></View>
        <View style={ { height: Dimensions.get( 'window' ).height - 211 } }>
          { this.state.dataSource.getRowCount() ? list_view : empty_msg }
        </View>
      </View>
      <Toast ref="toastErr"
             style={ { backgroundColor: '#da2854', borderRadius: 0, width: '100%' } }
             position='top'
             positionValue={ 0 }
             fadeInDuration={ 750 }
             fadeOutDuration={ 1000 }
             opacity={ 1 } />
      <BottomNavi activeTab='wallet' />
    </View>
    )
  }
}

const styles = StyleSheet.create( {
  container: {
    backgroundColor: '#050e20',
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
