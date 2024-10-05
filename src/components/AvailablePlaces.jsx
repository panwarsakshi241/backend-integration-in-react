import { useEffect, useState } from "react";
import { sortPlacesByDistance } from "../loc.js";
import ErrorMessage from "./ErrorMessage.jsx";
import Places from "./Places.jsx";
import { fetchAvailablePlaces } from "./http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();
  

  // Fetch available places from the server using then()
  // useEffect(() => {
  //   fetch('http://localhost:3000/places')
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setAvailablePlaces(data.places);
  //     });
  // }, []);

  // Fetch available places from the server using async/await
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const sortedPlaces = sortPlacesByDistance(
              places,
              position.coords.latitude,
              position.coords.longitude
            );
            setAvailablePlaces(sortedPlaces);
            setIsFetching(false);
          },
          (error) => {
            console.log(error);
          }
        );
      } catch (error) {
        setError({
          message: error.message || "Could not fetch places. Please try again!",
        });
        setIsFetching(false);
      }
    }

    fetchPlaces();
  }, []);

  if (error) {
    return (
      <ErrorMessage
        title="An Error occurred!"
        message={error.message}
        onConfirm={true}
      />
    );
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching places..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
