import logo from './logo.svg';
import './App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import React, { useState, useEffect } from 'react';





function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    console.log('useEffect called');

    const client = new W3CWebSocket('ws://localhost:8080');
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {

      console.log('message received');
      console.log(message.data);
      setData((currentData) => [...currentData, {...JSON.parse(message.data),time: new Date().toLocaleTimeString()}]);
    };
    client.onerror = function(error) {
      console.log('WebSocket Error: ', error);
    };
    // Return a cleanup function that will be called when the component is unmounted
    return () => {
      client.close();
      console.log('WebSocket Client Disconnected');
    };
  }, []);
  // Make sure to close the connection when the window unloads


  
  return (
    <>
      <div className="App">
        <header className="App-header">
          <div>
            {data.length > 0 ? (
              <div className="data-card">
                <h2>City: {data[data.length - 1].name}</h2>
                <h3></h3>
                <img src={`https://openweathermap.org/img/wn/${data[data.length - 1].weather[0].icon}.png`} alt="weather icon" />
                <p>wind speed : {data[data.length - 1].wind.speed}</p>
              </div>
            ) : null} 
          </div>
          <div className="data-container">
            {data.map((element, index) => (
              <div key={index} className="data-card">
                
                <div>
                  <p>Temp :{element.main.temp}</p>
                  <p>Min :{element.main.temp_min}</p>
                  <p>Max :{element.main.temp_max}</p>
                  <p>Pressure :{element.main.pressure}</p>
                  <p>Humidity :{element.main.humidity}</p>
                  <p>Time :{element.time}</p>
                </div>
              </div>
            ))}
          </div>
        </header>
      </div>
    </>
  );
}

export default App;
