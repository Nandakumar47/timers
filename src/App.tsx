import React from 'react';
import {TimerProvider} from './context/TimerContext';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <TimerProvider>
      <AppNavigator />
    </TimerProvider>
  );
};

export default App;
