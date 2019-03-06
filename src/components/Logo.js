import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';

export default class Logo extends Component< {
  }> {
  render() {
    return (
    <View style={ styles.container }>
      <Image style={ { width: 150, height: 150 } } source={ require( '../images/logobp.png' ) } />
    </View>
    )
  }
}

const styles = StyleSheet.create( {
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 20
  }
} );
