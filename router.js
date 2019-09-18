import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';

import Landing from './app/Containers/Landing/Landing';
import Login from './app/Containers/Login/Login';
import Connect from './app/Containers/Connect/Connect';
import NavBar from './app/Components/NavBar';
import {COLORS} from './app/global/colors';
import Trending from './app/Containers/Trending/Trending';
import Searches from './app/Containers/Searches/Searches';
import Account from './app/Containers/Account/Account';

const RootStack = createSwitchNavigator({
  UserStack: createBottomTabNavigator(
    {
      connect: {
        screen: Connect,
        navigationOptions: {
          tabBarLabel: () => null,
          tabBarIcon: ({tintColor}) => {
            if (tintColor === '#000') {
              return (
                <IconOutline
                  name="message"
                  color={'#fff'}
                  size={24}
                  style={{paddingRight: 20}}
                />
              );
            }
            return (
              <IconFill
                name="message"
                color={tintColor}
                size={24}
                style={{paddingRight: 20}}
              />
            );
          },
        },
      },
      trending: {
        screen: Trending,
        navigationOptions: {
          tabBarLabel: () => null,
          tabBarIcon: ({tintColor}) => {
            if (tintColor === '#000') {
              return (
                <IconOutline
                  name="fund"
                  color={'#fff'}
                  size={24}
                  style={{paddingRight: 40}}
                />
              );
            }
            return (
              <IconFill
                name="fund"
                color={tintColor}
                size={24}
                style={{paddingRight: 40}}
              />
            );
          },
        },
      },
      searches: {
        screen: Searches,
        navigationOptions: {
          tabBarLabel: () => null,
          tabBarIcon: ({tintColor}) => {
            if (tintColor === '#000') {
              return (
                <IconOutline
                  name="clock-circle"
                  color={'#fff'}
                  size={24}
                  style={{paddingLeft: 40}}
                />
              );
            }
            return (
              <IconFill
                name="clock-circle"
                color={tintColor}
                size={24}
                style={{paddingLeft: 40}}
              />
            );
          },
        },
      },
      account: {
        screen: Account,
        navigationOptions: {
          tabBarLabel: () => null,
          tabBarIcon: ({tintColor}) => {
            if (tintColor === '#000') {
              return (
                <IconOutline
                  name="smile"
                  color={'#fff'}
                  size={24}
                  style={{paddingLeft: 20}}
                />
              );
            }
            return (
              <IconFill
                name="smile"
                color={tintColor}
                size={24}
                style={{paddingLeft: 20}}
              />
            );
          },
        },
      },
    },
    {
      swipeEnabled: false,
      animationEnabled: true,
      allowFontScaling: false,
      tabBarComponent: NavBar,
      tabBarPosition: 'bottom',
      tabBarOptions: {
        showIcon: true,
        activeTintColor: '#fff',
        inactiveTintColor: '#000',
        style: {
          backgroundColor: COLORS.ACCENT,
        },
        indicatorStyle: {
          opacity: 0,
        },
      },
    },
  ),
  AuthStack: createStackNavigator(
    {
      landing: Landing,
      login: Login,
    },
    {
      defaultNavigationOptions: {
        header: null,
      },
    },
  ),
});

export const Application = createAppContainer(RootStack);
