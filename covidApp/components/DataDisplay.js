import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {DatePicker} from 'native-base';

const styles = StyleSheet.create({
  dataContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  header: {
    marginTop: '5%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 50,
    fontFamily: 'AppleSDGothicNeo-Bold',
    color: 'silver',
  },
  infoContainer: {
    flex: 2,
  },
  dataRow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataRowText: {
    fontSize: 25,
    color: 'silver',
  },
  creditContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditImage: {
    width: 400,
    height: 100,
  },
  creditArrow: {
    marginLeft: '50%',
  },
});
class DataDisplay extends React.Component {
  render() {
    return (
      <View style={this.props.style}>
        <LinearGradient
          style={styles.dataContainer}
          colors={['#7b4397', '#dc2430']}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{this.props.country}</Text>
            <Text style={{flex: 1}}> </Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.dataRow}>
              <Text style={styles.dataRowText}>
                Active cases: {this.props.data.active}
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataRowText}>
                confirmed cases: {this.props.data.confirmed}
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataRowText}>
                recovered cases: {this.props.data.recovered}
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataRowText}>
                deaths: {this.props.data.deaths}
              </Text>
            </View>
          </View>
          <View style={styles.creditContainer}>
            <Image
              style={styles.creditImage}
              source={require('../images/jhu-logo.png')}
            />

            <Image
              style={styles.creditArrow}
              source={require('../images/source-arrow.png')}
            />
          </View>
        </LinearGradient>
      </View>
    );
  }
}

export default DataDisplay;
