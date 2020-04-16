import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Row} from 'native-base';

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'column',
    flex: 1,
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: '4%',
    flex: 1,
  },
});
class DataDisplay extends React.Component {
  render() {
    return (
      <View style={this.props.style}>
        <View style={styles.mainView}>
          <Text style={styles.header}>{this.props.country}</Text>
        </View>
      </View>
    );
  }
}

export default DataDisplay;
