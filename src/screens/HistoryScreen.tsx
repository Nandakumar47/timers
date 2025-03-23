import React from 'react';
import {View, Text, Button, StyleSheet, FlatList, Alert} from 'react-native';
import {useTimer} from '../context/TimerContext';
import {DownloadDirectoryPath, writeFile} from 'react-native-fs';

const HistoryScreen = () => {
  const {state} = useTimer();

  const exportHistory = async () => {
    try {
      const filePath = `${DownloadDirectoryPath}/timer_history.json`;
      const jsonContent = JSON.stringify(state.completedTimers, null, 2);

      await writeFile(filePath, jsonContent, 'utf8');

      Alert.alert('Export Successful', `History exported to ${filePath}`);
    } catch (error) {
      console.error('Export Error:', error);
      Alert.alert('Export Failed', 'An error occurred while exporting.');
    }
  };

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

      <Button title="Export History" onPress={exportHistory} />
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
