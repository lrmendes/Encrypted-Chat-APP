/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src';
import './src/config/StatusBarConfig';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
