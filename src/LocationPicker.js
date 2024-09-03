import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Input, Button } from 'antd';
import { AimOutlined, SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useGeolocated } from 'react-geolocated';
import { useNavigate } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ3NhaXRlamEwMDEiLCJhIjoiY2x5a3MyeXViMDl3NjJqcjc2OHQ3NTVoNiJ9.b5q6xpWN2yqeaKTaySgcBQ'; // Replace with your Mapbox token

const LocationPicker = ({ onConfirmLocation }) => {
  const [location, setLocation] = useState(null);
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [enablePickUp, setEnablePickUp] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null); // Ref to store the map instance
  const navigate = useNavigate();

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });

  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.remove(); // Clean up the previous map instance if it exists
    }

    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current, // Reference to the map container
      style: 'mapbox://styles/mapbox/streets-v11', // Replace with your preferred Mapbox style
      center: location ? [location.lng, location.lat] : [78.476, 17.366], // Default center to a place if no location is set
      zoom: 13,
    });

    mapInstance.current.on('moveend', () => {
      const newCenter = mapInstance.current.getCenter();
      setLocation({ lat: newCenter.lat, lng: newCenter.lng });
    });

    mapInstance.current.on('style.load', () => {
      const layers = mapInstance.current.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;

      mapInstance.current.addLayer(
        {
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 14,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        },
        labelLayerId
      );
    });

    if (coords) {
      const newLocation = { lat: coords.latitude, lng: coords.longitude };
      setLocation(newLocation);
      setDeviceLocation(newLocation);
      mapInstance.current.setCenter([newLocation.lng, newLocation.lat]);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove(); // Cleanup map on component unmount
        mapInstance.current = null; // Ensure the map instance is cleared
      }
    };
  }, [coords]);

  const handleSearch = (value) => {
    setAddress(value);
    // Implement address search and update location based on the address
  };

  const handleCurrentLocation = () => {
    if (coords) {
      const newLocation = { lat: coords.latitude, lng: coords.longitude };
      setLocation(newLocation);
      setDeviceLocation(newLocation);
      mapInstance.current.setCenter([newLocation.lng, newLocation.lat]);
    }
  };

  const handleEnablePickUp = () => {
    setEnablePickUp(!enablePickUp);
  };

  const handleConfirmLocation = () => {
    if (typeof onConfirmLocation === 'function') {
      onConfirmLocation(location);
    }
    setEnablePickUp(false);

    // Save the location value in localStorage
    localStorage.setItem('location', JSON.stringify(location));

    navigate('/sell-buy');
  };

  const pulseStyle = {
    width: '20px',
    height: '20px',
    border: '5px solid rgba(0, 150, 0, 0.5)',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 150, 0, 0.5)',
    position: 'absolute',
    top: 'calc(50% - 15px)', // Center the pulse effect
    left: 'calc(50% - 15px)', // Center the pulse effect
    animation: 'pulse 1.5s infinite',
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <div style={styles.searchContainer}>
        <Input
          placeholder="Search for area, street name"
          prefix={<SearchOutlined />}
          value={address}
          onChange={(e) => handleSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      <div id="map" ref={mapRef} style={{ width: '100%', height: 'calc(100vh - 200px)' }}></div>
      <div style={styles.centerMarker}>
        <img
          src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png"
          alt="center marker"
          style={{ width: '25px', height: '41px' }}
        />
      </div>
      {deviceLocation && (
        <div style={{ ...styles.customDeviceIcon, ...pulseStyle }} />
      )}
      <div style={{ padding: '10px', backgroundColor: '#fff' }}>
        <Button
          type="primary"
          icon={<AimOutlined />}
          onClick={handleCurrentLocation}
          disabled={!isGeolocationAvailable || !isGeolocationEnabled}
          style={{ marginBottom: '10px' }}
        >
          Current Location
        </Button>
        <Button
          type={enablePickUp ? "primary" : "default"}
          icon={<EnvironmentOutlined />}
          onClick={handleEnablePickUp}
          style={{ marginBottom: '10px', marginLeft: '10px' }}
        >
          {enablePickUp ? 'Disable Pick-up' : 'Pick-up on Map'}
        </Button>
        <Button
          type="primary"
          onClick={handleConfirmLocation}
          style={{ marginBottom: '10px', marginLeft: '10px' }}
          disabled={!location}
        >
          Confirm Location
        </Button>
      </div>
    </div>
  );
};

const styles = {
  searchContainer: {
    position: 'absolute',
    top: '30px',
    width: 'calc(100% - 40px)',
    left: '20px',
    right: '20px',
    zIndex: 1000,
  },
  searchInput: {
    width: '85%',
    padding: '10px',
    borderRadius: '50px', // "Island" shape
    border: '1px solid #ccc',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  centerMarker: {
    position: 'absolute',
    top: 'calc(50% - 20.5px)', // Center the marker icon
    left: 'calc(50% - 12.5px)', // Center the marker icon
    pointerEvents: 'none', // Allow clicks to pass through to the map
    zIndex: 1000, // Ensure the marker is above the map
  },
  deviceLocationMarker: {
    position: 'absolute',
    top: 'calc(50% - 20.5px)', // Center the pulse effect
    left: 'calc(50% - 20.5px)', // Center the pulse effect
    pointerEvents: 'none', // Allow clicks to pass through to the map
    zIndex: 999, // Ensure the pulse effect is above the map but below the marker
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(0.5)',
      opacity: 0.8,
    },
    '100%': {
      transform: 'scale(2.5)',
      opacity: 0,
    },
  },
};

export default LocationPicker;
