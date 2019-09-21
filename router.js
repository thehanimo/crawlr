import React from 'react';
import {createAppContainer} from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {Transition} from 'react-native-reanimated';
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

const RootStack = createAnimatedSwitchNavigator(
  {
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
    UserStack: createBottomTabNavigator(
      {
        connect: {
          screen: Connect,
          navigationOptions: {
            tabBarLabel: () => null,
            tabBarIcon: ({tintColor}) => {
              if (tintColor === '#000') {
                return <IconOutline name="message" color={'#fff'} size={24} />;
              }
              return <IconFill name="message" color={tintColor} size={24} />;
            },
          },
        },
        trending: {
          screen: Trending,
          navigationOptions: {
            tabBarLabel: () => null,
            tabBarIcon: ({tintColor}) => {
              if (tintColor === '#000') {
                return <IconOutline name="fund" color={'#fff'} size={24} />;
              }
              return <IconFill name="fund" color={tintColor} size={24} />;
            },
          },
        },
        dummy: {
          screen: Searches,
          navigationOptions: {
            tabBarLabel: () => null,
            tabBarIcon: ({tintColor}) => {
              if (tintColor === '#000') {
                return;
              }
              return;
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
                  <IconOutline name="clock-circle" color={'#fff'} size={24} />
                );
              }
              return (
                <IconFill name="clock-circle" color={tintColor} size={24} />
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
                return <IconOutline name="smile" color={'#fff'} size={24} />;
              }
              return <IconFill name="smile" color={tintColor} size={24} />;
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
  },
  {
    transition: (
      <Transition.Together>
        <Transition.Out type="fade" durationMs={400} interpolation="easeIn" />
        <Transition.In type="fade" durationMs={500} interpolation="easeIn" />
      </Transition.Together>
    ),
  },
);

export const Application = createAppContainer(RootStack);
