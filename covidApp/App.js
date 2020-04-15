import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%',
  },
});

export default () => (
  <MapView
    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
    style={styles.map}
    region={{
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    }}
  />
);
