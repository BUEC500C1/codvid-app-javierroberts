import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

import Landing from './pages/Landing';

class App extends React.Component {
  render() {
    return <Landing />;
  }
}

export default App;
