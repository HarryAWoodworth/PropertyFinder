/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

'use strict';

import {createStackNavigator, createAppContainer} from 'react-navigation';
import SearchPage from './SearchPage';
import SearchResults from './SearchResults';

// This configures the SearchPage component as the initial
// component in the navigation stack.
const MainNavigator = createStackNavigator({
  Home: { screen: SearchPage },
  Results: { screen: SearchResults },
});

// Now required, wraps the navigator in an App Container
const App = createAppContainer(MainNavigator);

// Exports the app
export default App;
