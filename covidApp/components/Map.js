import React from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

class Map extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <MapView region={this.props.location} style={this.props.style}>
        {this.props.active && (
          <Marker
            coordinate={this.props.location}
            title={this.props.country}
            description={'Confirmed cases: ' + String(this.props.cases)}
            isPreselected={true}
          />
        )}
      </MapView>
    );
  }
}

export default Map;
