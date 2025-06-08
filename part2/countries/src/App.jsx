import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const Country = ({ country }) => {
  useEffect(() => {
    if (country.capital && !country.weather) {
      axios
        .get(``)
        .then(response => {
          country.weather = {
            temperature: response.data.current.temp_c,
            condition: response.data.current.condition.text
          }
        })
        .catch(error => {
          console.error('Error fetching weather data:', error)
        })
    }
  }, [country]);

  return (
    <div className="country-detail">
      <div className="country-header">
        <img 
          src={country.flags.png} 
          alt={`Flag of ${country.name.common}`} 
          className="country-flag"
        />
        <div className="country-info">
          <h2 className="country-name">{country.name.common}</h2>
          <div className="info-grid">
            <div>
              <p className="info-item"><span className="info-label">Official Name:</span> {country.name.official}</p>
              <p className="info-item"><span className="info-label">Capital:</span> {country.capital ? country.capital[0] : 'N/A'}</p>
              <p className="info-item"><span className="info-label">Population:</span> {country.population.toLocaleString()}</p>
              <p className="info-item"><span className="info-label">Region:</span> {country.region}</p>
            </div>
            <div>
              <p className="info-item"><span className="info-label">Subregion:</span> {country.subregion || 'N/A'}</p>
              <p className="info-item"><span className="info-label">Area:</span> {country.area.toLocaleString()} km²</p>
              <p className="info-item">
                <span className="info-label">Languages:</span>{' '}
                {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}
              </p>
            </div>
          </div>
          {country.maps?.googleMaps && (
            <a 
              href={country.maps.googleMaps} 
              target="_blank" 
              rel="noopener noreferrer"
              className="maps-link"
            >
              View on Google Maps
            </a>
          )}

          {country.weather && (
            <div className="weather-info">
              <h3 className="weather-title">Weather in {country.capital[0]}</h3>
              <p className="weather-data">Temperature: {country.weather.temperature} °C</p>
              <p className="weather-data">Condition: {country.weather.condition}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [text, setText] = useState('')
  const [allCountries, setAllCountries] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState(null)

  const handleChange = (event) => {
    setText(event.target.value)
    console.log(event.target.value)
    if (allCountries !== null) {
      const filtered = allCountries.filter(country => 
        country.name.common.toLowerCase().includes(event.target.value.toLowerCase())
      )
      setFilteredCountries(filtered)
    }
    console.log(filteredCountries)
  }

  useEffect(()=>{
    console.log('effect')
    if(allCountries === null) {
      axios
        .get('https://restcountries.com/v3.1/all')
        .then(response => {
          setAllCountries(response.data)
          setFilteredCountries(response.data)
        })
        .catch(error => {
          console.error('Error fetching countries:', error)
        })
    }

  },[])
  

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="search-container">
          <input 
            type="text" 
            onChange={handleChange} 
            value={text} 
            placeholder="Search for a country..."
            className="search-input"
          />
        </div>
        
        <div>
          {filteredCountries !== null ? (
            filteredCountries.length <= 10 && filteredCountries.length > 1 ? (
              <ul className="country-list">
                {filteredCountries.map((country, index) => (
                  <li key={index} className="country-list-item">
                    <span>{country.name.common}</span>
                    <button 
                      onClick={() => setFilteredCountries([country])}
                      className="show-button"
                    >
                      Show
                    </button>
                  </li>
                ))}
              </ul>
            ) : filteredCountries.length > 10 ? (
              <div className="message warning">
                Too many matches, please refine your search.
              </div>
            ) : filteredCountries.length === 1 ? (
              <Country country={filteredCountries[0]} />
            ) : (
              <div className="message error">
                No matches found.
              </div>
            )
          ) : (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
