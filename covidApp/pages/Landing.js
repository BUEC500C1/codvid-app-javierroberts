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
    borderLeftWidth: 1.5,
    borderColor: '#7b4397',
  },
  segmentMiddle: {
    marginBottom: 10,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 1.5,
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
      shortCountry: '',
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
      dataWorld: {
        active: 0,
        recovered: 0,
        deaths: 0,
        confirmed: 0,
      },
      wrongSearch: false,
      markers: [],
    };

    Geocode.setApiKey('AIzaSyApD6qtWWYHtpWKawkixBWGcF8yzjo98CE');
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

  handleSegmentChange = segment => {
    if (segment === 'map') {
      this.setState({activeSeg: 'map'});
    } else if (segment === 'data') {
      this.setState({activeSeg: 'data'});
    } else {
      this.setState({activeSeg: 'world'});
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
    console.log('setting marker');
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
        const {lat, lng} = response.results[0].geometry.location;
        let country = '';
        let region = '';
        for (var i in response.results[0].address_components) {
          if (
            response.results[0].address_components[i].types.includes('country')
          ) {
            country = response.results[0].address_components[i].long_name;
          }
        }

        console.log('Fdasf ' + country);
        this.setState({
          region: {
            latitude: lat,
            longitude: lng,
          },
        });
        this.getCases(country);
        this.setCountry(country);
      },
      error => {
        return;
      },
    );
  };

  setCountry(country) {
    let longAddress = country;
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
    this.setState({wrongSearch: false});
    console.log('TRYING TO GET CASES ' + country);
    if (country === 'world') {
      fetch('https://api.covid19api.com/world/total', {
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
          return responseData;
        })
        .then(data => {
          if (data === undefined) {
            this.setState({wrongSearch: true});
            return;
          }
          this.setState((prevState, props) => {
            return {
              dataWorld: {
                active:
                  data.TotalConfirmed - data.TotalRecovered - data.TotalDeaths,
                recovered: data.TotalRecovered,
                confirmed: data.TotalConfirmed,
                deaths: data.TotalDeaths,
              },
            };
          });
        })

        .catch(err => {
          this.setState({wrongSearch: true});
          console.log('fetch error' + err);
        });
    } else {
      fetch('https://api.covid19api.com/total/country/' + country, {
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
          if (data === undefined) {
            this.setState({wrongSearch: true});
            return;
          }
          this.setState((prevState, props) => {
            return {
              data: {
                active: data.Confirmed - data.Recovered - data.Deaths,
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
    let mainComponent;
    switch (this.state.activeSeg) {
      case 'map':
        mainComponent = (
          <Map
            style={styles.data}
            location={this.state.region}
            country={this.state.shortCountry}
            cases={this.state.data.active}
            handleMapPress={this.handleMapPress}
            markers={this.state.markers}
            onRegionChange={this.onRegionChange}
            onMarkerPress={() => {
              this.setState({activeSeg: 'data'});
            }}
          />
        );
        break;

      case 'data':
        mainComponent = (
          <DataDisplay
            style={styles.data}
            country={this.state.shortCountry}
            data={this.state.data}
          />
        );
        break;
      case 'world':
        mainComponent = (
          <DataDisplay
            style={styles.data}
            country={'World'}
            data={this.state.dataWorld}
          />
        );
        break;
    }
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
              <Button
                transparent
                onPress={() => {
                  this.handleCountryChange();
                  this.state.activeSeg === 'world'
                    ? this.setState({activeSeg: 'data'})
                    : null;
                }}>
                <Text style={styles.searchText}>Search</Text>
              </Button>
            </Header>
          </LinearGradient>
        </View>
        <View style={styles.mainData}>{mainComponent}</View>

        <Segment style={styles.footer}>
          <LinearGradient style={styles.test2} colors={['#dc2430', '#b35d62']}>
            <Button
              first
              style={this.getSegmentStyle('map', styles.segmentLeft)}
              onPress={() => {
                this.handleSegmentChange('map');
              }}>
              <Text style={styles.segmentText}>Map</Text>
            </Button>
            <Button
              style={this.getSegmentStyle('data', styles.segmentMiddle)}
              onPress={() => {
                this.handleSegmentChange('data');
              }}>
              <Text style={styles.segmentText}>Country</Text>
            </Button>
            <Button
              style={this.getSegmentStyle('world', styles.segmentRight)}
              onPress={() => {
                this.handleSegmentChange('world');
                this.getCases('world');
              }}>
              <Text style={styles.segmentText}>World</Text>
            </Button>
          </LinearGradient>
        </Segment>
      </Container>
    );
  }
}

export default Landing;
