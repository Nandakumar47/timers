import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Timer = {
  id: string;
  name: string;
  duration: number;
  remainingTime: number;
  category: string;
  isRunning: boolean;
  completed: boolean;
  halfwayAlert: boolean;
  halfwayTriggered: boolean;
  completionTime?: string;
};

type TimerState = {
  timers: Timer[];
  completedTimers: Timer[];
};

type TimerAction =
  | {type: 'ADD_TIMER'; payload: Timer}
  | {type: 'START_TIMER'; id: string}
  | {type: 'PAUSE_TIMER'; id: string}
  | {type: 'RESET_TIMER'; id: string}
  | {type: 'REMOVE_TIMER'; id: string}
  | {type: 'COMPLETE_TIMER'; id: string}
  | {type: 'CONFIRM_COMPLETE_TIMER'; id: string}
  | {type: 'START_CATEGORY'; category: string}
  | {type: 'PAUSE_CATEGORY'; category: string}
  | {type: 'RESET_CATEGORY'; category: string}
  | {type: 'HALFWAY_ALERT_TRIGGERED'; id: string}
  | {type: 'LOAD_TIMERS'; payload: TimerState};

const initialState: TimerState = {
  timers: [],
  completedTimers: [],
};

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case 'ADD_TIMER':
      const newTimers = [...state.timers, action.payload];
      AsyncStorage.setItem('timers', JSON.stringify(newTimers));
      return {...state, timers: newTimers};

    case 'START_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.id ? {...timer, isRunning: true} : timer,
        ),
      };

    case 'PAUSE_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.id ? {...timer, isRunning: false} : timer,
        ),
      };

    case 'RESET_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.id
            ? {...timer, remainingTime: timer.duration, isRunning: false}
            : timer,
        ),
      };

    case 'COMPLETE_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.id
            ? {...timer, completed: true, isRunning: false}
            : timer,
        ),
      };

    case 'CONFIRM_COMPLETE_TIMER':
      const completedTimer = state.timers.find(t => t.id === action.id);
      if (completedTimer) {
        const updatedCompletedTimer = {
          ...completedTimer,
          completionTime: new Date().toLocaleString(),
        };
        const updatedTimers = state.timers.filter(t => t.id !== action.id);
        const updatedCompletedTimers = [
          ...state.completedTimers,
          updatedCompletedTimer,
        ];

        AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
        AsyncStorage.setItem(
          'completedTimers',
          JSON.stringify(updatedCompletedTimers),
        );

        return {
          ...state,
          timers: updatedTimers,
          completedTimers: updatedCompletedTimers,
        };
      }
      return state;

    case 'REMOVE_TIMER':
      const filteredTimers = state.timers.filter(
        timer => timer.id !== action.id,
      );
      AsyncStorage.setItem('timers', JSON.stringify(filteredTimers));
      return {...state, timers: filteredTimers};

    case 'START_CATEGORY':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.category === action.category
            ? {...timer, isRunning: true}
            : timer,
        ),
      };

    case 'PAUSE_CATEGORY':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.category === action.category
            ? {...timer, isRunning: false}
            : timer,
        ),
      };

    case 'RESET_CATEGORY':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.category === action.category
            ? {...timer, remainingTime: timer.duration, isRunning: false}
            : timer,
        ),
      };

    case 'HALFWAY_ALERT_TRIGGERED':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.id ? {...timer, halfwayTriggered: true} : timer,
        ),
      };

    case 'LOAD_TIMERS':
      return {
        ...state,
        timers: action.payload.timers,
        completedTimers: action.payload.completedTimers,
      };

    default:
      return state;
  }
};

const TimerContext = createContext<{
  state: TimerState;
  dispatch: React.Dispatch<TimerAction>;
}>({state: initialState, dispatch: () => {}});

export const TimerProvider = ({children}: {children: ReactNode}) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  useEffect(() => {
    const loadTimers = async () => {
      const storedTimers = await AsyncStorage.getItem('timers');
      const storedCompletedTimers = await AsyncStorage.getItem(
        'completedTimers',
      );
      dispatch({
        type: 'LOAD_TIMERS',
        payload: {
          timers: storedTimers ? JSON.parse(storedTimers) : [],
          completedTimers: storedCompletedTimers
            ? JSON.parse(storedCompletedTimers)
            : [],
        },
      });
    };

    loadTimers();
  }, []);

  return (
    <TimerContext.Provider value={{state, dispatch}}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
