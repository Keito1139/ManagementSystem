import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { getAccessToken } from '@/utils/auth'; // Adjust the import path as needed

const EventScreen = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = await getAccessToken();
      if (!token) {
        Alert.alert('Error', 'You are not logged in.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/events/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events', error);
        Alert.alert('Error', 'Failed to fetch events.');
      }
    };

    fetchEvents();
  }, []);

  return (
    <View>
      {events.length > 0 ? (
        events.map(event => (
          <Text key={event.start}>{event.title} - {event.start}</Text>
        ))
      ) : (
        <Text>No events found.</Text>
      )}
      <Button title="Reload Events" onPress={() => fetchEvents()} />
    </View>
  );
};

export default EventScreen;
