import React from 'react';
import { Router, Route, INdexRoute, hashHistory } from "react-router";
import GoogleMap from 'google-map-react';
import styles from './mapStyle.css';
import toiletData from './toilets.json';
import MyMarker from './MyMarker.js';
import axios from 'axios';

export default class Map extends React.Component {

  static defaultProps = {
    center: {lat: -37.8136, lng: 144.9631},
    zoom: 12,
    markers:[]
  };

  constructor(props) {
    super(props);
    this.state = {
      markers: this.setMarkers(),
      bounds: [-37.74603328502601, 144.79178194580078, -37.88110493598199, 145.13441805419922]
    };
  }

  setMarkers = () => {
    var markers = [];
    toiletData.toilets.forEach(function(toilet){
      markers.push({lat: toilet.Latitude, lng: toilet.Longitude, id: toilet.ToiletID});
    });
    return markers;
  };

   _onBoundsChange = (center, zoom , bounds) => {

       var viewportRange = {};
       for(var i=0; i< bounds.length; i++){
           viewportRange[i] = bounds[i];
       }

       function calcDistance (fromLat, fromLng, toLat, toLng) {
           return google.maps.geometry.spherical.computeDistanceBetween(
               new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
       }

       var MapClass = this;

       axios.get('http://0.0.0.0:5000/api/toilets/fetchToiletData', {
           params: {
               viewportRange: viewportRange
           }
       })
           .then(function (response) {
               console.log(response);
               var markers = [];
               response.data.forEach(function(toilet){
                       markers.push({lat: toilet.Latitude, lng: toilet.Longitude, id: toilet.ToiletID, name: toilet.Name, address: toilet.Address1 + toilet.Town});
                   //calcDistance(toilet.Latitude, toilet.Longitude, center[0], center[1]);
               });

               console.log(markers);

               MapClass.setState({
                   markers: markers
               });


           })
           .catch(function (error) {
               console.log(error);
           });
  };

  render() {
      var items = this.state.markers.map(function(marker, i) {
              return (
                  <MyMarker lat={marker.lat} lng={marker.lng} text={marker.id} key={i}/>
              );
      });

      var descriptions = this.state.markers.map(function(marker, i) {
          return (
              <div key={i}>
                  <div>ID- {marker.id}</div>
                  <div>ADDRESS- {marker.address}</div>
                  <br/>
              </div>
          );
      });

    return (
        <div>
            <div><h2>CODE CHALLENGE</h2></div>
            <div className={styles.mapContainer}>
                <GoogleMap
                    bootstrapURLKeys={{key: 'AIzaSyC8FW0KGjAiDEP_8ds-YlATX164P-tigFc'}}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    onBoundsChange={this._onBoundsChange}
                >
                {items}
                </GoogleMap>
            </div>
            <div>
            {descriptions}
            </div>
        </div>
    );
  }
}



