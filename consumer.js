const kafka = require('kafka-node');
const WebSocket = require('ws');

const Consumer = kafka.Consumer;

const Client = kafka.KafkaClient;

// Create a Kafka client
const client = new Client({ kafkaHost: 'localhost:9092' });
console.log("clien init")
// Create a Kafka consumer
const consumer = new Consumer(
  client,
  [
    { topic: 'weather1', partition: 0 } // Adjust the topic and partition as needed
  ],
  {
    autoCommit: true, // Automatically commit offsets
    fromOffset: 'latest' // Start reading from the latest available offset
  }
);
console.log("consumer init")
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {

// Listen for messages
  
  ws.on('close', () => console.log('Client disconnected'));

});
consumer.on('message', function(message) {
  console.log("message")

  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      console.log("sending")
      client.send(message.value);
    }
  });

  // console.log(`Received message: ${message.value}`);
});
console.log("consumer on")
// Handle connection errors
consumer.on('error', function(err) {
  console.error('Error:', err);
});

// Connect to Kafka
client.once('ready', function() {
  console.log('Connected to Kafka');
});


