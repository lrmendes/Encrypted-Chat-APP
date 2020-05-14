import React, {useState} from 'react';
import { ImageBackground, TouchableOpacity, View, Text, StyleSheet,TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import bgFile from '../assets/bg/bg-login.jpg';

export default function Login({ navigation }) {

    const [user,setUser] = useState("");
    const [pass,setPass] = useState("");


  return (
      <ImageBackground source={bgFile} style={classes.bgimage}>
          <View style={classes.container}>
            <Icon name="lock-outline" size={60} color="#900" />
                <Text style={classes.titleText}>Login</Text>
                <TextInput
                    style={classes.inputText}
                    autoFocus={true}
                    onChangeText={text => setUser(text)}
                    value={user}
                    placeholder="Username"
                />
                <TextInput
                    style={classes.inputText}
                    onChangeText={text => setPass(text)}
                    value={pass}
                    placeholder="Password"
                    secureTextEntry={true}
                />
                <TouchableOpacity style={classes.inputButton} onPress={() => navigation.navigate('Home')}>
                    <Text style = {classes.buttonText}>
                    Login
                    </Text>
                </TouchableOpacity>
                <Text style={classes.text2}>New User?</Text>
                <TouchableOpacity style={classes.inputButton2} onPress={() => navigation.navigate('Home')}>
                    <Text style = {classes.buttonText}>
                    Register Now
                    </Text>
                </TouchableOpacity>
            </View>
         </ImageBackground>
  );
}

const classes = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: 30,
    },
    bgimage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: "cover",
    },
    titleText: {
        fontSize: 25,
        marginTop: 5,
    },
    inputText: {
        marginTop: 15,
        height: 40,
        width: 250,
        maxWidth: '80%',
        borderColor: 'rgba(200,200,200,0.5)',
        borderRadius: 5,
        borderWidth: 1,
        color: '#fff',
        opacity: 0.9,
        textAlign: 'center',
    },
    inputButton: {
        width: 250,
        height: 40,
        marginTop: 15,
        maxWidth: '80%',
        fontSize: 15, 
        backgroundColor: '#000',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        opacity: 0.5,
        alignItems: 'center'
    },
    text2: {
        marginTop: 60
    },
    inputButton2: {
        width: 250,
        height: 40,
        marginTop: 5,
        maxWidth: '80%',
        fontSize: 15, 
        backgroundColor: '#000',
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        opacity: 0.5,
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 15,
        color: '#fff'
    }
  });