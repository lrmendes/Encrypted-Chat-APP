import React, {useState, useEffect} from 'react';
import { ImageBackground, Keyboard, TouchableOpacity, View, Text, StyleSheet,TextInput, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import bgFile from '../assets/bg/bg-login.jpg';

export default function Register({ navigation }) {
    const [display,setDisplay] = useState("");
    const [user,setUser] = useState("");
    const [pass,setPass] = useState("");

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          () => {
            setKeyboardVisible(true); // or some other action
          }
        );
        const keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          () => {
            setKeyboardVisible(false); // or some other action
          }
        );
    
        return () => {
          keyboardDidHideListener.remove();
          keyboardDidShowListener.remove();
        };
      }, []);

  return (
      <ImageBackground source={bgFile} style={classes.bgimage}>
          <View style={classes.container}>
            <Icon style={classes.icone} name="lock-open-outline" size={60} color="#006994" />
                <Text style={classes.titleText}>Register</Text>
                <TextInput
                    style={classes.inputText}
                    onChangeText={text => setDisplay(text)}
                    value={display}
                    placeholder="Display Name"
                />
                <TextInput
                    style={classes.inputText}
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
                    Register
                    </Text>
                </TouchableOpacity>
                <View style={!isKeyboardVisible ? classes.container2 : {display: "none"} } > 
                <Text style={classes.text2}>Already Have an Account?</Text>
                <TouchableOpacity style={classes.inputButton2} onPress={() => navigation.navigate('Login')}>
                    <Text style = {classes.buttonText}>
                    Login Now
                    </Text>
                </TouchableOpacity>
                </View>
            </View>
         </ImageBackground>
  );
}

const classes = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 30,
      alignItems: 'center'
    },
    container2: {
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
    },
    icone: {
        opacity: 0.7,
    },
    bgimage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: "cover",
    },
    titleText: {
        fontSize: 24,
        marginBottom: 10,
        color: 'rgba(0, 105, 148,0.7)',
    },
    inputText: {
        marginTop: 15,
        height: 40,
        width: 250,
        maxWidth: '80%',
        borderColor: 'rgba(200,200,200,0.5)',
        borderRadius: 5,
        borderWidth: 1,
        color: 'rgba(0,0,0,0.5)',
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
        color: 'rgba(0,0,0,0.5)',
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