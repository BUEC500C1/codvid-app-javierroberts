import React from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

class Map extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MapView
        region={this.props.location}
        style={this.props.style}
        onLongPress={this.props.handleMapPress}
        showsUserLocation={true}>
        {this.props.markers.map((marker, i) => (
          <Marker
            key={i}
            coordinate={marker.coordinate}
            title={marker.title}
            description={'Active cases: ' + String(marker.description)}
            onCalloutPress={this.props.onMarkerPress}
          />
        ))}
      </MapView>
    );
  }
}

export default Map;
