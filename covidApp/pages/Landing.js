import React from 'react';
import {View, StyleSheet} from 'react-native';
import Geocode from 'react-geocode';
import Geolocation from 'react-native-geolocation-service';
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
    flexDirection: 'column',
  },
  header: {
    flex: 1.7,
  },
  mainData: {
    flex: 10,
  },
  footer: {
    flex: 1,
  },
  segment: {
    marginBottom: 10,
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
        latitudeDelta: 0.09,
        longitudeDelta: 0.9,
      },
      cases: 0,
    };

    Geocode.setApiKey('');
    Geocode.setLanguage('en');

    this.handleSegmentChange = this.handleSegmentChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.setCurrentLocation = this.setCurrentLocation.bind(this);
    this.getCases = this.getCases.bind(this);
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

  handleCountryChange = () => {
    if (this.state.search === '') {
      return;
    }

    Geocode.fromAddress(this.state.search).then(
      response => {
        const {lat, lng} = response.results[0].geometry.location;
        this.setState({
          region: {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.92,
            longitudeDelta: 0.0421,
          },
        });
      },
      error => {
        console.error(error);
      },
    );

    this.getCases(this.state.search);

    this.setState({country: this.state.search});
    this.setState({search: ''});
  };

  getCases(country) {
    fetch(
      'https://api.covid19api.com/total/country/' +
        country +
        '/status/confirmed?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        return responseData[responseData.length - 1];
      })
      .then(data => {
        this.setState({cases: data.Cases});
      })

      .catch(err => {
        console.log('fetch error' + err);
      });
  }

  setCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
        Geocode.fromLatLng(
          String(position.coords.latitude),
          String(position.coords.longitude),
        ).then(
          response => {
            let address = '';

            for (var addressParse in response.results[0].address_components) {
              if (
                response.results[0].address_components[
                  addressParse
                ].types.includes('country')
              ) {
                address =
                  response.results[0].address_components[addressParse]
                    .long_name;
              }
            }

            address = response.results[0].address_components[3].long_name;
            const apiAddress = address.replace(' ', '-');
            this.setState({country: address}, this.getCases(apiAddress));
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

  render() {
    return (
      <Container style={styles.container}>
        <View style={styles.header}>
          <Header searchBar rounded>
            <Item>
              <Icon name="ios-search" />
              <Input
                placeholder="Country"
                onChangeText={this.handleSearchChange}
                value={this.state.search}
              />
              <Button transparent onPress={this.setCurrentLocation}>
                <Icon name="pin" />
              </Button>
            </Item>
            <Button transparent onPress={this.handleCountryChange}>
              <Text>Search</Text>
            </Button>
          </Header>
        </View>
        {this.state.activeSeg === 'map' ? (
          <Map
            style={styles.mainData}
            location={this.state.region}
            country={this.state.country}
            cases={this.state.cases}
          />
        ) : (
          <DataDisplay style={styles.mainData} country={this.state.country} />
        )}
        <Segment style={styles.footer}>
          <Button
            first
            style={styles.segment}
            onPress={this.handleSegmentChange}
            active={this.state.activeSeg === 'map' ? true : false}>
            <Text>Map</Text>
          </Button>
          <Button
            style={styles.segment}
            onPress={this.handleSegmentChange}
            active={this.state.activeSeg === 'data' ? true : false}>
            <Text>Data</Text>
          </Button>
        </Segment>
      </Container>
    );
  }
}

export default Landing;
