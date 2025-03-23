import {StackNavigationProp} from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  AddTimer: undefined;
  History: undefined;
};

export type NavigationProp = StackNavigationProp<RootStackParamList>;
