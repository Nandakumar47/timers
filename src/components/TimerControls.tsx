import React from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {Timer, useTimer} from '../context/TimerContext';

type Props = {
  timer: Timer;
};

const TimerControls: React.FC<Props> = ({timer}) => {
  const {dispatch} = useTimer();

  return (
    <View style={styles.controls}>
      <Button
        title={timer.isRunning ? 'Pause' : 'Start'}
        onPress={() =>
          dispatch({
            type: timer.isRunning ? 'PAUSE_TIMER' : 'START_TIMER',
            id: timer.id,
          })
        }
      />
      <Button
        title="Reset"
        onPress={() => dispatch({type: 'RESET_TIMER', id: timer.id})}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default TimerControls;
