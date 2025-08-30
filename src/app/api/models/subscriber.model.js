// src/models/subscriber.js

// Subscriber model for MongoDB
const Subscriber = {
  email: "",              // string, required
  location: {
    lat: 0,               // number, latitude
    lon: 0                // number, longitude
  },
  createdAt: new Date()   // timestamp of registration
};

export default Subscriber;