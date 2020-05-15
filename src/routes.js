import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';

import Main from './pages/main';
import Login from './pages/login';
import Register from './pages/register';
import Chat from './pages/chat';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CommonActions } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

export default function App() {

  const Stack = createStackNavigator();

  const createTwoButtonAlert = (title,msg,navigation) =>
  Alert.alert(
      title,
      msg,
    [
      { text: "Yes", onPress: () => logoutUser(navigation) },
      { text: "Cancel" }
    ],
    { cancelable: true }
  );

  function logoutUser(navigation) {
    auth().signOut().then(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'Login' },
        ],}));
    })
  }

    return (
        <NavigationContainer>
        <Stack.Navigator >
            <Stack.Screen name="Login" component={Login} 
            options={{
                title: 'Login',
                headerShown: false,
              }}/>
            <Stack.Screen name="Home" component={Main} options={({ navigation }) => ({
                headerStyle: {
                    backgroundColor: '#f4511e',
                  },
                  title: 'Tela Principal',
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerLeft: null, /* createTwoButtonAlert('Confirm','Do you want to log out??',navigation)}> */
                  headerRight: () => (
                    <TouchableOpacity style={styles.inputButton2} onPress={() => createTwoButtonAlert('Confirm','Do you want to log out??',navigation)}> 
                      <Icon style={styles.btnIcon}  name="exit-to-app" size={30} color="#ffffff" />
                    </TouchableOpacity>
                  ),
            })}/>
            <Stack.Screen name="Register" component={Register} 
            options={{
                title: 'Register',
                headerShown: false,
              }}/>
            <Stack.Screen name="Chat" component={Chat} 
            options={{
                title: 'Chat',
                headerShown: false,
              }}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  inputButton2: {
    marginRight: 15,
  },
});