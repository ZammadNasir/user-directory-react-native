import type { NavigatorScreenParams } from '@react-navigation/native';
import type { User } from '../types/user';

export type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Profile: {
    user?: User;
    userId?: number;
  };
};
