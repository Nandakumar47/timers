import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, Modal, Alert} from 'react-native';
import {useTimer, Timer} from '../context/TimerContext';
import ProgressBar from './ProgressBar';

type TimerItemProps = {
  timer: Timer;
};

const TimerItem: React.FC<TimerItemProps> = ({timer}) => {
  const {dispatch} = useTimer();
  const [remainingTime, setRemainingTime] = useState(timer.remainingTime);
  const [running, setRunning] = useState(timer.isRunning);
  const [modalVisible, setModalVisible] = useState(false);
  const [halfwayTriggered, setHalfwayTriggered] = useState(false);

  useEffect(() => {
    let interval: number | null = null;

    if (running) {
      interval = setInterval(() => {
        setRemainingTime(prev => Math.max(prev - 1, 0));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running]);

  useEffect(() => {
    if (remainingTime === 0 && running) {
      setRunning(false);
      dispatch({type: 'COMPLETE_TIMER', id: timer.id});
      setModalVisible(true);
    }
  }, [remainingTime, running, dispatch]);

  useEffect(() => {
    if (
      timer.halfwayAlert &&
      !halfwayTriggered &&
      remainingTime === Math.floor(timer.duration / 2)
    ) {
      setHalfwayTriggered(true);
      Alert.alert('Halfway Alert', `Timer "${timer.name}" is halfway done!`);
    }
  }, [remainingTime, halfwayTriggered, timer.halfwayAlert, timer.duration]);

  const progress = (remainingTime / timer.duration) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{timer.name}</Text>
        <Button
          title="✖"
          color="red"
          onPress={() => dispatch({type: 'REMOVE_TIMER', id: timer.id})}
        />
      </View>

      <Text style={styles.time}>
        {remainingTime}s remaining {timer.completed && '(Completed)'}
      </Text>

      <ProgressBar progress={progress} />

      <View style={styles.controls}>
        <Button
          title={running ? 'Pause' : 'Start'}
          onPress={() => setRunning(!running)}
          disabled={timer.completed}
        />
        <Button
          title="Reset"
          onPress={() => setRemainingTime(timer.duration)}
          disabled={timer.completed}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Timer "{timer.name}" Completed!
            </Text>
            <Button
              title="OK"
              onPress={() => {
                setModalVisible(false);
                dispatch({type: 'CONFIRM_COMPLETE_TIMER', id: timer.id});
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 16,
    color: '#555',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default TimerItem;
