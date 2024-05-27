const kafka = require('kafka-node');
const Producer = kafka.Producer;
const Client = kafka.KafkaClient;
const axios = require('axios'); // Assuming you're still using axios for API calls

// Create a Kafka client
const client = new Client({ kafkaHost: 'localhost:9092' });

// Create a Kafka producer
const producer = new Producer(client);

// Function to fetch weather data from OpenWeather API
async function fetchWeatherData() {
  try {
    const response = await axios.get('http://api.openweathermap.org/data/2.5/weather?q=London&appid=267e28f8a69732a0d98302484ae1f95c');
    const weatherData = response.data; // Process the response as needed
    return JSON.stringify(weatherData); // Convert the data to a string to send through Kafka
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// Wrap the producer logic in a function
function sendDataThroughKafka() {
  fetchWeatherData().then((data) => {
    const payloads = [{ topic: 'weather1', messages: data },];
    producer.send(payloads, (err, data) => {
      if (err) {
        console.log('Error:', err);
      } else {
        console.log('Message sent successfully:', data);
      }
    });
  }).catch((err) => {
    console.error('Failed to send message:', err);
  });
}

// Use setInterval to execute sendDataThroughKafka every 10 seconds
setInterval(sendDataThroughKafka, 10000); // 10000 milliseconds = 10 seconds
