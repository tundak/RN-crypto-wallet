import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Input, Avatar } from 'react-native-elements';
import Moment from 'moment';
Moment.locale( 'en' );
const styles = StyleSheet.create( {
  container: {
    flex: 1,
  },
  dateTimeCount: {
    flexDirection: 'row',
    marginVertical: 7,
  },
  dateText: {
    fontSize: 12,
    color: '#41b3ff',
    fontFamily: 'Quicksand-Medium',
    marginRight: 2,
  },
  dateTimeText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Quicksand-Medium',
  },
  dateTimeTextNew: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Quicksand-Medium',
    width:'85%',
  },
  addressText: {
    fontSize: 11,
    color: '#fff',
    width: '55%',
    fontFamily: 'Quicksand-Medium',
  },
  amountCount: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '35%',
  },
  amountText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Quicksand-Medium',
    marginRight: 5,

  }
} );

const HistoryRow = (props) => (
   <View style={ { backgroundColor: (props.row_id % 2 == 0) ? '#082338' : '#050e20' } }>
    <View style={ { width: '96%', marginLeft: '2%', marginVertical: 5 } }>
    <View style={ styles.dateTimeCount }>
      <Text style={ styles.dateText }>
        Date{' '}
      </Text>
      <Text style={ styles.dateTimeTextNew }>
        { Moment( props.created_at ).format( 'LLL' ) }
      </Text>
      <Avatar containerStyle={{marginTop:0}} overlayContainerStyle={ { backgroundColor: 'transparent' } }
            size={ 18}
            source={ (props.tx_output_n==0 ? require( '../images/send-icon.png') : require( '../images/receive-icon.png' )) } />
    </View>
    <View style={ styles.dateTimeCount }>
    <Text style={ styles.dateText }>
        Hash{' '}
      </Text>
      <Text style={ styles.addressText }>
        { props.tx_hash }
      </Text>
      <View style={ styles.amountCount }>
        <Text style={ styles.amountText }>
          { props.amount }
        </Text>
        <Text style={ styles.dateText }>
          { props.wallet_type }
        </Text>
      </View>
    </View>
  </View>
   </View>
);

export default HistoryRow;
