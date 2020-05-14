import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, View } from 'react-native';
import Main from './pages/main';
import Login from './pages/login';
import Register from './pages/register';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
        <Stack.Navigator >
            <Stack.Screen name="Login" component={Login} 
            options={{
                title: 'Login',
                headerShown: false,
              }}/>
            <Stack.Screen name="Home" component={Main} options={{
                headerStyle: {
                    backgroundColor: '#f4511e',
                  },
                  title: 'Tela Principal',
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
            }}/>
            <Stack.Screen name="Register" component={Register} 
            options={{
                title: 'Register',
                headerShown: false,
              }}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
}
