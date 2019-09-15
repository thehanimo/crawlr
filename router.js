import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Landing from './app/Containers/Landing/Landing';

const RootStack = createSwitchNavigator({
  //   UserStack: createBottomTabNavigator({}),
  AuthStack: createStackNavigator(
    {
      landing: Landing,
    },
    {
      defaultNavigationOptions: {
        header: null,
      },
    },
  ),
});

export const Application = createAppContainer(RootStack);
