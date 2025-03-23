import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTimer} from '../context/TimerContext';
import TimerItem from '../components/TimerItem';
import {NavigationProp} from '../types/navigation';

const HomeScreen = () => {
  const {state, dispatch} = useTimer();
  const navigation = useNavigation<NavigationProp>();
  const [expandedCategories, setExpandedCategories] = useState<{
    [key: string]: boolean;
  }>({});

  const groupedTimers = state.timers.reduce((acc, timer) => {
    if (!acc[timer.category]) acc[timer.category] = [];
    acc[timer.category].push(timer);
    return acc;
  }, {} as Record<string, typeof state.timers>);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({...prev, [category]: !prev[category]}));
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Button
          title="Add Timer"
          onPress={() => navigation.navigate('AddTimer')}
        />

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('History')}>
          <Text style={styles.historyButtonText}>View History</Text>
        </TouchableOpacity>
      </View>

      {Object.keys(groupedTimers).length === 0 ? (
        <Text style={styles.empty}>No timers available. Add one!</Text>
      ) : (
        <FlatList
          data={Object.keys(groupedTimers)}
          keyExtractor={category => category}
          renderItem={({item: category}) => (
            <View style={styles.categoryContainer}>
              <TouchableOpacity
                onPress={() => toggleCategory(category)}
                style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <Text>{expandedCategories[category] ? '▼' : '▶'}</Text>
              </TouchableOpacity>

              {expandedCategories[category] && (
                <View style={styles.categoryControls}>
                  <Button
                    title="Start All"
                    onPress={() => dispatch({type: 'START_CATEGORY', category})}
                  />
                  <Button
                    title="Pause All"
                    onPress={() => dispatch({type: 'PAUSE_CATEGORY', category})}
                  />
                  <Button
                    title="Reset All"
                    onPress={() => dispatch({type: 'RESET_CATEGORY', category})}
                  />
                </View>
              )}

              {expandedCategories[category] &&
                groupedTimers[category].map(timer => (
                  <TimerItem key={timer.id} timer={timer} />
                ))}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
  },
  historyButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  categoryContainer: {
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginBottom: 16,
  },
  empty: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
});

export default HomeScreen;
