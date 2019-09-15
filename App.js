import React, {Component} from 'react';

import {Application} from './router';
import NavigationService from './NavigationService';

export default class App extends Component {
  render() {
    return (
      <Application
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}
