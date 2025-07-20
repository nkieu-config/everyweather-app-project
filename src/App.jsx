import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { useState, useEffect } from "react";
import Input from "./components/Input";
import Weather from "./components/Weather";
import convertToFlag from "./utils/convertToFlag";

// Fix for country flag emojis
polyfillCountryFlagEmojis();

export default function App() {
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayLocation, setDisplayLocation] = useState("");
  const [weather, setWeather] = useState({});
  const [error, setError] = useState("");

  // Load location from localStorage on first render
  useEffect(() => {
    const storedLocation = localStorage.getItem("location");
    if (storedLocation) setLocation(storedLocation);
  }, []);

  // Location must be at least 2 characters
  useEffect(() => {
    if (location.length < 2) {
      setWeather({});
      return;
    }

    async function fetchWeather() {
      try {
        setIsLoading(true);
        setError("");

        // Fetch GeoLocation data
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
        );
        if (!geoRes.ok) throw new Error("We couldn’t retrieve location data.");

        const geoData = await geoRes.json();
        if (!geoData.results)
          throw new Error("We couldn't find that location. Please try again.");

        const { latitude, longitude, timezone, name, country_code } =
          geoData.results.at(0);

        setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

        // Fetch weather data
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
        );
        if (!weatherRes.ok)
          throw new Error("Weather information is currently unavailable.");
        const weatherData = await weatherRes.json();

        setWeather(weatherData.daily);
      } catch (err) {
        setError(err.message);
        setWeather({});
      } finally {
        setIsLoading(false);
      }
    }

    fetchWeather();
    localStorage.setItem("location", location);
  }, [location]);

  return (
    <div className="app">
      <h1>EveryWeather</h1>
      <Input
        location={location}
        onChangeLocation={(e) => setLocation(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      {isLoading && <p className="loader">Loading...</p>}

      {weather.weathercode && (
        <Weather weather={weather} location={displayLocation} />
      )}
    </div>
  );
}
