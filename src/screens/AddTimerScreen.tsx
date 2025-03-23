import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTimer} from '../context/TimerContext';
import uuid from 'react-native-uuid';

const AddTimerScreen = () => {
  const {dispatch} = useTimer();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [halfwayAlert, setHalfwayAlert] = useState(false);

  const handleAddTimer = () => {
    if (!name || !duration || !category) {
      return Alert.alert('Error', 'All fields are required!');
    }

    const newTimer = {
      id: uuid.v4() as string,
      name,
      duration: parseInt(duration),
      remainingTime: parseInt(duration),
      category,
      isRunning: false,
      completed: false,
      halfwayAlert,
      halfwayTriggered: false,
    };

    dispatch({type: 'ADD_TIMER', payload: newTimer});
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Timer Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Duration (seconds):</Text>
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Category:</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Enable Halfway Alert:</Text>
        <Switch value={halfwayAlert} onValueChange={setHalfwayAlert} />
      </View>

      <Button title="Add Timer" onPress={handleAddTimer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default AddTimerScreen;
