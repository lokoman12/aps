import React from 'react';
import {
  Image,
  NativeSyntheticEvent,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {
  YaMap,
  Animation,
  CameraPosition,
  Circle,
  Marker,
  Point,
  Geocoder,
} from 'react-native-yamap';
import { USER,  LOCATION, MINUS, PLUS, NIGHT, SUN } from '../../assets/index';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsBlock: {
    position: 'absolute',
    right: 20,
    bottom: 40,
  },
  buttonWrapper: {
    marginTop: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 2,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
  },
  addressWrapper: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
  },
  address: {
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 2,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
  },
  addressText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

YaMap.init("571ca694-da48-4c42-88f5-5311d3541d72");


type State = {
  marker?: Point;
  polyline: Point[];
  night: boolean;
  address?: string;
};
const initialState: State = {
  marker: undefined,
  polyline: [],
  night: false,
  address: undefined,
};

export default class Map extends React.Component<{}, State> {
  state = initialState;

  map = React.createRef<YaMap>();

  getCurrentPosition() {
    return new Promise<CameraPosition>((resolve) => {
      if (this.map.current) {
        this.map.current.getCameraPosition((position) => {
          resolve(position);
        });
      }
    });
  }

  zoomUp = async () => {
    const position = await this.getCurrentPosition();
    if (this.map.current) {
      this.map.current.setZoom(position.zoom * 1.1, 0.1);
    }
  };

  zoomDown = async () => {
    const position = await this.getCurrentPosition();
    if (this.map.current) {
      this.map.current.setZoom(position.zoom * 0.9, 0.1);
    }
  };

  onMapLongPress = async (event: NativeSyntheticEvent<Point>) => {
    const {lat, lon} = event.nativeEvent;
    const marker = {
      lat,
      lon,
    };
    this.setState({
      marker,
      address: undefined,
    });
    const address = await Geocoder.geoToAddress(marker);
    if (address) {
      this.setState({address: address.formatted});
    }
  };

  onMarkerPress = () => {
    this.setState({marker: undefined});
  };

  onMapPress = (event: NativeSyntheticEvent<Point>) => {
    const {lat, lon} = event.nativeEvent;
    const polyline = [
      ...this.state.polyline,
      {
        lat,
        lon,
      },
    ];
    this.setState({polyline});
  };

  zoomToMarker = () => {
    if (this.map.current && this.state.marker) {
      this.map.current.setCenter(
        {...this.state.marker},
        14,
        0,
        0,
        0.4,
        Animation.SMOOTH,
      );
    }
  };

  centerToUser = async () => {
    const currentPosition = await this.getCurrentPosition();
    const userMarker = {
      lat: currentPosition.point.lat,
      lon: currentPosition.point.lon,
    };
  
    this.setState({
      marker: userMarker,
      address: undefined,
    });
  
    const address = await Geocoder.geoToAddress(userMarker);
    if (address) {
      this.setState({ address: address.formatted });
    }
  
    if (this.map.current) {
      this.map.current.setCenter(
        userMarker,
        14,
        0,
        0,
        0.4,
        Animation.SMOOTH,
      );
    }
  };

  toggleNightMode = () => {
    this.setState({night: !this.state.night});
  };

  render() {
    return (
      <View style={styles.container}>
        <YaMap
          ref={this.map}
          style={styles.container}
          userLocationIcon={USER}
          showUserPosition
          nightMode={this.state.night}
          onMapLongPress={this.onMapLongPress}>
          {this.state.marker ? (
            <>
              <Marker
                anchor={{
                  x: 0.5,
                  y: 1,
                }}
                scale={1.5}
                onPress={this.onMarkerPress}
                point={this.state.marker}
                source={LOCATION}
              />
              <Circle
                center={this.state.marker}
                radius={300}
                fillColor="#ff000080"
                strokeColor={'#ffff00'}
              />
            </>
          ) : null}
         
        </YaMap>
        {this.state.address && this.state.marker ? (
          <View style={styles.addressWrapper}>
            <SafeAreaView />
            <View style={styles.address}>
              <Text style={styles.addressText}>{this.state.address}</Text>
            </View>
          </View>
        ) : null}
        <View style={styles.buttonsBlock}>
          {this.state.marker && (
            <TouchableOpacity
              onPress={this.zoomToMarker}
              style={styles.buttonWrapper}>
              <View style={styles.button}>
                <Image source={LOCATION} style={styles.icon} />
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={this.toggleNightMode}
            style={styles.buttonWrapper}>
            <View style={styles.button}>
              <Image
                source={!this.state.night ? NIGHT : SUN}
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={this.zoomUp} style={styles.buttonWrapper}>
            <View style={styles.button}>
              <Image source={PLUS} style={styles.icon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.zoomDown}
            style={styles.buttonWrapper}>
            <View style={styles.button}>
              <Image source={MINUS} style={styles.icon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.centerToUser} style={styles.buttonWrapper}>
  <View style={styles.button}>
    <Image source={USER} style={styles.icon} />
  </View>
</TouchableOpacity>
        </View>
      </View>
    );
  }
}