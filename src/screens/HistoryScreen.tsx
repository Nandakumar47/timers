import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {useTimer} from '../context/TimerContext';

const HistoryScreen = () => {
  const {state} = useTimer();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Timers</Text>

      <FlatList
        data={state.completedTimers}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Completed At: {item.completionTime}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 10},
  item: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
    borderRadius: 5,
  },
  name: {fontSize: 18, fontWeight: 'bold'},
});

export default HistoryScreen;
