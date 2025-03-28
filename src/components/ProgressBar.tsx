import React from 'react';
import {View, StyleSheet} from 'react-native';

type ProgressBarProps = {
  progress: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({progress}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.progress, {width: `${progress}%`}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
});

export default ProgressBar;
