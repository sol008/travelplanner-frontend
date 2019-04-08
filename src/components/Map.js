import React, { Component } from "react";
import "../styles/Map.css";
import axios from "axios";

// const map = undefined;
const markers = [];
class Map extends Component {
  constructor(props) {
    super(props);
    this.handlePlaces = this.handlePlaces.bind(this);
    this.renderMap = this.renderMap.bind(this);
    this.initMap = this.initMap.bind(this);
    this.getVenues = this.getVenues.bind(this);
  }

  state = {
    venues: [],
    map: undefined,
  };

  // componentDidMount() {
  //   console.log("this.props.show: ", this.props.show);
  //   if(this.props.show){
  //     this.getVenues();
  //   }
  // }

  componentDidUpdate(prevProps) {
    // console.log("this.props.show in update: ", this.props.show);
    // Typical usage (don't forget to compare props):
    // console.log("cityChange: ", this.props.cityChange);
    if (this.props.show && this.props.cityChange !== prevProps.cityChange) {
      this.getVenues();
    }
    console.log("in Map.js this.props.POIs is: ", this.props.POIs)
    if (this.props.POIs !== prevProps.POIs) {
      this.rerenderMarkers();
    }
  }

  renderMap = () => {
    loadScript(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyD1DrDBUd6GNL2EIBCxK-K0OjkTny8kbuA&callback=initMap"
    );
    window.initMap = this.initMap;
  };

  rerenderMarkers = () => {
    // Create An InfoWindow
    
    var infowindow = new window.google.maps.InfoWindow();

    for (var i = 0; i < markers.length; i++ ) {
      markers[i].setMap(null);
    }
    markers.length = 0;

    // Display Dynamic Markers
    this.props.POIs.map(poi => {
      var contentString = `${poi.venue.name}`;

      // Create A Marker
      var marker = new window.google.maps.Marker({
        position: {
          lat: poi.venue.location.lat,
          lng: poi.venue.location.lng
        },
        map: this.state.map,
        title: poi.venue.name
      });
      // Click on A Marker!
      marker.addListener("click", () => {
        // Change the content
        infowindow.setContent(contentString);

        // Open An InfoWindow
        infowindow.open(this.state.map, marker);
      });
      markers.push(marker);
      console.log("markers: ", markers);
    });
  };

  getVenues = () => {
    // console.log("this.props.city: ", this.props.city);
    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const parameters = {
      client_id: "CTSQGNHXWZYRLBY3FNJBIDAJFZIRYBHB1T5TWCD5GPDKJDAX",
      client_secret: "PBR2A350JUGUPZABPF5U011IQ3MBXX3Q1VUZHTQGGIOKSUUJ",
      section: this.props.section,
      near: this.props.city,
      v: "20180323"
    };

    axios
      .get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState(
          {
            venues: response.data.response.groups[0].items
          },
          this.renderMap()
        );
      })
      .then(() => {
        this.handlePlaces();
      })
      .catch(error => {
        console.log("ERROR!! " + error);
      });
  };

  initMap = () => {
    // Create A Map
    this.setState({
      map: new window.google.maps.Map(document.getElementById("map"), {
        center: {
          lat: this.state.venues[0].venue.location.lat,
          lng: this.state.venues[0].venue.location.lng
        },
        zoom: 12
      })
    }, () => {console.log("done")});
    // var map = new window.google.maps.Map(document.getElementById("map"), {
    //   center: {
    //     lat: this.state.venues[0].venue.location.lat,
    //     lng: this.state.venues[0].venue.location.lng
    //   },
    //   zoom: 12
    // });

    // // Create An InfoWindow
    // var infowindow = new window.google.maps.InfoWindow();

    // // Display Dynamic Markers
    // this.state.venues.map(myVenue => {
    //   var contentString = `${myVenue.venue.name}`;

    //   // Create A Marker
    //   var marker = new window.google.maps.Marker({
    //     position: {
    //       lat: myVenue.venue.location.lat,
    //       lng: myVenue.venue.location.lng
    //     },
    //     map: map,
    //     title: myVenue.venue.name
    //   });

    //   // Click on A Marker!
    //   marker.addListener("click", function() {
    //     // Change the content
    //     infowindow.setContent(contentString);

    //     // Open An InfoWindow
    //     infowindow.open(map, marker);
    //   });
    // });
  };

  handlePlaces() {
    this.props.onPlaces(this.state.venues);
  }

  render() {
    return <div id="map" />;
  }
}

function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default Map;
