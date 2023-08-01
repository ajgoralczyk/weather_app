import { useState, useEffect } from 'react'
import './App.css'

function getWeatherData(region: string) {
  const responseTime =  Math.floor(Math.random() * (75) + 25);
  const cities = [
    {"city":"Mount Vernon","lat":38.714,"lng":-77.1043,"country":"United States"},
    {"city":"Union City","lat":33.5941,"lng":-84.5629,"country":"United States"},
    {"city":"Waycross","lat":31.2108,"lng":-82.3579,"country":"United States"},
    {"city":"Turtle Creek","lat":40.4085,"lng":-79.8214,"country":"United States"},
    {"city":"Upper Dublin","lat":40.1502,"lng":-75.1813,"country":"United States"},
    {"city":"Fruita","lat":39.1549,"lng":-108.7307,"country":"United States"},
    {"city":"Oak Grove","lat":45.3409,"lng":-93.3264,"country":"United States"},
    {"city":"Dale City","lat":38.6473,"lng":-77.3459,"country":"United States"},
    {"city":"Kelso","lat":46.1236,"lng":-122.891,"country":"United States"},
    {"city":"Kings Mountain","lat":35.2348,"lng":-81.3501,"country":"United States"},
    {"city":"Williamson","lat":34.7082,"lng":-112.5342,"country":"United States"},
    {"city":"Hobart","lat":47.412,"lng":-121.996,"country":"United States"},
    {"city":"Greenville","lat":43.1797,"lng":-85.2533,"country":"United States"},
    {"city":"Hadley","lat":42.3556,"lng":-72.5692,"country":"United States"},
    {"city":"West Freehold","lat":40.2324,"lng":-74.2943,"country":"United States"},
    {"city":"Wynne","lat":35.2322,"lng":-90.7894,"country":"United States"},
    {"city":"Cleveland","lat":34.5971,"lng":-83.7621,"country":"United States"},
    {"city":"Bourbonnais","lat":41.183,"lng":-87.878,"country":"United States"},
    {"city":"Haddam","lat":41.4677,"lng":-72.5458,"country":"United States"},
    {"city":"Hillsboro","lat":39.1668,"lng":-89.4735,"country":"United States"}
  ];

  return new Promise<City[]>(resolve => {
    setTimeout(() => {
      resolve(cities.filter((city) => {
        return city.city.includes(region);
      }));
    }, responseTime);
  });
};

type City = {
  city: string;
  lat: number;
  lng: number;
  country: string;
}

function App() {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    if (inputValue !== '') {
      getWeatherData(inputValue).then((cities) => {
        setSuggestions(cities);
      });
    } else {
      setSuggestions([]);
      setWeatherData({});
    }
  }, [inputValue])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }
  
  function handleSelect(selectedCity: string) {
    setInputValue(selectedCity);
    const selectedCityData = suggestions.find(city => city.city === selectedCity);

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${selectedCityData.lat}&longitude=${selectedCityData.lng}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`)
      .then((response) => {
        return response.json()
      })
      .then(data => {
        setWeatherData(data);
      });
  }

  return (
    <div className="App">
      <label htmlFor="input">Enter location</label>
      <input onChange={handleChange} value={inputValue} id="input" ></input>
      <select
        aria-label="suggestions"
        onChange={e => handleSelect(e.target.value)}
      >
        {suggestions.map((sugg) => <option key={sugg.city} value={sugg.city}>{sugg.city}</option>) }
        {inputValue !== '' && suggestions.length === 0 && <p>currently not supported</p>}
      </select>
      {Object.keys(weatherData).length > 0 && JSON.stringify(weatherData)}
    </div>
  )
}

export default App
