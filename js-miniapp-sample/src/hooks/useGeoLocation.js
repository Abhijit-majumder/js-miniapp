import { useState } from 'react';

import { miniAppInstance as MiniApp } from 'js-miniapp-sdk';

const useGeoLocation = () => {
  const [state, setState] = useState({
    isWatching: false,
  });
  const watch = () => {
    return MiniApp.requestLocationPermission()
      .then(() =>
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { longitude, latitude } = pos.coords;
            setState({
              isWatching: true,
              location: {
                latitude,
                longitude,
              },
            });
          },
          (error) => {
            throw error;
          },
          {
            enableHighAccuracy: true,
          }
        )
      )
      .catch((error) => console.error(error));
  };

  const unwatch = () => {
    setState({
      isWatching: false,
    });
  };

  return [state, watch, unwatch];
};

export default useGeoLocation;
