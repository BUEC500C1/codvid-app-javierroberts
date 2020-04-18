import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

import Landing from './pages/Landing';
import DismissKeyboard from './components/DismissKeyboard';

class App extends React.Component {
  render() {
    return <Landing />;
  }
}

export default App;
