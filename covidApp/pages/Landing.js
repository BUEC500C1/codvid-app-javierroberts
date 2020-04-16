import React from 'react';
import {View, StyleSheet} from 'react-native';
import Geocode from 'react-geocode';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flex: 1.7,
  },
  map: {
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
        latitude: 42.3510693,
        longitude: -71.129794,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      cases: 0,
      active: false,
    };
    this.handleSegmentChange = this.handleSegmentChange.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
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
    Geocode.setApiKey('');
    Geocode.setLanguage('en');
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

    fetch(
      'https://api.covid19api.com/country/' +
        this.state.search +
        '/status/confirmed/live?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z',
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
        console.log(responseData[0]);
        return responseData[0];
      })
      .then(data => {
        this.setState({cases: data.Cases});
        console.log('cases: ' + data.Cases);
      })

      .catch(err => {
        console.log('fetch error' + err);
      });

    this.setState({country: this.state.search});
    this.setState({search: ''});
    if (this.state.active === false) {
      this.setState({active: true});
    }
  };

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
              <Icon name="pin" />
            </Item>
            <Button transparent onPress={this.handleCountryChange}>
              <Text>Search</Text>
            </Button>
          </Header>
        </View>
        <Map
          style={styles.map}
          location={this.state.region}
          country={this.state.country}
          cases={this.state.cases}
          active={this.state.active}
        />
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
