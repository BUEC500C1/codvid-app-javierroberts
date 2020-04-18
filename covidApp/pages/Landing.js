import React from 'react';
import {View, Keyboard, ScrollView, StyleSheet} from 'react-native';
import Geocode from 'react-geocode';
import Geolocation from 'react-native-geolocation-service';
import LinearGradient from 'react-native-linear-gradient';
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Item,
  Input,
  Segment,
} from 'native-base';

import Map from '../components/Map';
import DataDisplay from '../components/DataDisplay';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1.9,
  },

  mainData: {
    flex: 10,
  },
  data: {
    flex: 1,
  },
  footer: {
    flex: 1.3,
  },
  segmentRight: {
    marginBottom: 10,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#7b4397',
  },
  segmentLeft: {
    marginBottom: 10,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#7b4397',
  },
  segmentText: {
    fontWeight: '700',
    color: 'white',
  },
  background: {
    flexDirection: 'column',
    flex: 1,
  },
  test: {
    height: '100%',
    width: '100%',
  },
  test2: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  searchText: {
    color: 'silver',
  },
});

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSeg: 'map',
      country: '',
      search: '',
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 60,
        longitudeDelta: 60,
      },
      data: {
        active: 0,
        recovered: 0,
        deaths: 0,
        confirmed: 0,
      },
      wrongSearch: false,
      markers: [],
    };

    Geocode.setApiKey('');
    Geocode.setLanguage('en');

    this.handleSegmentChange = this.handleSegmentChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.setCurrentLocation = this.setCurrentLocation.bind(this);
    this.getCases = this.getCases.bind(this);
    this.getSegmentStyle = this.getSegmentStyle.bind(this);
    this.setCountry = this.setCountry.bind(this);
    this.handleMapPress = this.handleMapPress.bind(this);
  }

  handleSegmentChange = () => {
    if (this.state.activeSeg === 'map') {
      this.setState({activeSeg: 'data'});
    } else {
      this.setState({activeSeg: 'map'});
    }
  };

  handleSearchChange = search => {
    this.setState({search: search});
  };

  handleMapPress = location => {
    const lat = location.nativeEvent.coordinate.latitude;
    const long = location.nativeEvent.coordinate.longitude;
    Geocode.fromLatLng(String(lat), String(long)).then(
      response => {
        let shortAddress = '';
        let address = '';
        let longAddress = '';
        for (var addressParse in response.results[0].address_components) {
          if (
            response.results[0].address_components[addressParse].types.includes(
              'country',
            )
          ) {
            longAddress =
              response.results[0].address_components[addressParse].long_name;

            if (longAddress.length > 15) {
              address = longAddress.split(' ');

              for (var i in address) {
                shortAddress += address[i][0];
                console.log('SHORT ADDRESS: ' + shortAddress);
              }
            } else {
              shortAddress = longAddress;
            }
          }
        }

        const apiAddress = longAddress.replace(' ', '-');

        this.setState(
          {
            country: longAddress,
            shortCountry: shortAddress,
            region: {
              latitude: lat,
              longitude: long,
              latitudeDelta: 60,
              longitudeDelta: 60,
            },
          },
          () => {
            this.getCases(apiAddress, true, lat, long);
          },
        );
      },
      error => {
        console.log('ERROR');
        this.setState({wrongSearch: true});
      },
    );
  };

  setMarker = (latitude, longitude) => {
    this.setState({
      markers: [
        ...this.state.markers,
        {
          coordinate: {
            latitude: latitude,
            longitude: longitude,
          },
          title: this.state.shortCountry,
          description: this.state.data.active,
        },
      ],
    });
  };

  handleCountryChange = () => {
    Keyboard.dismiss();
    if (this.state.search === '') {
      return;
    }

    console.log('SEARCH: ' + this.state.search);

    Geocode.fromAddress(this.state.search).then(
      response => {
        this.setState({wrongSearch: false});
        const {lat, lng} = response.results[0].geometry.location;
        this.setState(
          {
            region: {
              latitude: lat,
              longitude: lng,
            },
          },
          this.setCountry,
        );
      },
      error => {
        this.setState({wrongSearch: true});
        this.setState({search: ''});
      },
    );
  };

  setCountry() {
    let longAddress = this.state.search;
    let shortAddress = '';
    let address = '';

    if (longAddress.length > 15) {
      address = longAddress.split(' ');

      for (var i in address) {
        shortAddress += address[i][0];
        console.log('SHORT ADDRESS: ' + shortAddress);
      }
    } else {
      shortAddress = longAddress;
    }

    this.setState({
      country: this.state.longAddress,
      shortCountry: shortAddress,
    });
    this.setState({search: ''});
  }

  getCases(country, marker, latitude, longitude) {
    if (this.state.wrongSearch === false) {
      console.log('TRYING TO GET CASES');
      fetch('https://api.covid19api.com/live/country/' + country, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          return response.json();
        })
        .then(responseData => {
          return responseData[responseData.length - 1];
        })
        .then(data => {
          this.setState((prevState, props) => {
            return {
              data: {
                active: data.Active,
                recovered: data.Recovered,
                confirmed: data.Confirmed,
                deaths: data.Deaths,
              },
            };
          });

          marker && this.setMarker(latitude, longitude);
        })

        .catch(err => {
          this.setState({wrongSearch: true});
          console.log('fetch error' + err);
        });
    }
  }

  setCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 60,
            longitudeDelta: 60,
          },
        });
        Geocode.fromLatLng(
          String(position.coords.latitude),
          String(position.coords.longitude),
        ).then(
          response => {
            let shortAddress = '';
            let address = '';
            let longAddress = '';

            for (var addressParse in response.results[0].address_components) {
              if (
                response.results[0].address_components[
                  addressParse
                ].types.includes('country')
              ) {
                longAddress =
                  response.results[0].address_components[addressParse]
                    .long_name;
                if (longAddress.length > 15) {
                  address = longAddress.split(' ');

                  for (var i in address) {
                    shortAddress += address[i][0];
                    console.log('SHORT ADDRESS: ' + shortAddress);
                  }
                } else {
                  shortAddress = longAddress;
                }
              }
            }

            const apiAddress = longAddress.replace(' ', '-');
            this.setState(
              {country: longAddress, shortCountry: shortAddress},
              this.getCases(apiAddress),
            );
          },
          error => {
            console.error(error);
          },
        );
      },
      error => console.log(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  componentDidMount() {
    this.setCurrentLocation();
  }

  getSegmentStyle = (name, style) => {
    if (this.state.activeSeg === name) {
      return {...style, ...{backgroundColor: '#7b4397'}};
    } else {
      return style;
    }
  };

  render() {
    return (
      <Container style={styles.container}>
        <View style={styles.header}>
          <LinearGradient style={styles.test} colors={['#3d72b4', '#7b4397']}>
            <Header transparent={true} searchBar rounded>
              <Item>
                <Icon name="ios-search" />

                <Input
                  placeholder={
                    this.state.wrongSearch ? 'Country not found!' : 'Country'
                  }
                  onChangeText={this.handleSearchChange}
                  value={this.state.search}
                />

                <Button transparent onPress={this.setCurrentLocation}>
                  <Icon name="pin" />
                </Button>
              </Item>
              <Button transparent onPress={this.handleCountryChange}>
                <Text style={styles.searchText}>Search</Text>
              </Button>
            </Header>
          </LinearGradient>
        </View>
        <View style={styles.mainData}>
          {this.state.activeSeg === 'map' ? (
            <Map
              style={styles.data}
              location={this.state.region}
              country={this.state.shortCountry}
              cases={this.state.data.active}
              handleMapPress={this.handleMapPress}
              markers={this.state.markers}
              onRegionChange={this.onRegionChange}
            />
          ) : (
            <DataDisplay
              style={styles.data}
              country={this.state.shortCountry}
              data={this.state.data}
            />
          )}
        </View>

        <Segment style={styles.footer}>
          <LinearGradient style={styles.test2} colors={['#dc2430', '#b35d62']}>
            <Button
              first
              style={this.getSegmentStyle('map', styles.segmentLeft)}
              onPress={this.handleSegmentChange}>
              <Text style={styles.segmentText}>Map</Text>
            </Button>
            <Button
              style={this.getSegmentStyle('data', styles.segmentRight)}
              onPress={this.handleSegmentChange}>
              <Text style={styles.segmentText}>Data</Text>
            </Button>
          </LinearGradient>
        </Segment>
      </Container>
    );
  }
}

export default Landing;
