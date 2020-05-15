import React, {useState, useEffect} from 'react';
import { ImageBackground, Alert, Keyboard, TouchableOpacity, View, Text, StyleSheet,TextInput, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';

import bgFile from '../assets/bg/bg-register2.jpg';

export default function Register({ navigation }) {
    const [display,setDisplay] = useState("");
    const [user,setUser] = useState("");
    const [pass,setPass] = useState("");
    const [passConfirm,setPassConfirm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const createTwoButtonAlert = (title,msg) =>
    Alert.alert(
        title,
        msg,
      [
        { text: "OK", onPress: () => {setPass(""); setPassConfirm("")} }
      ],
      { cancelable: false }
    );

    function registerUser() {
        setIsLoading(true);

        if (pass != passConfirm) {
            setIsLoading(false);
            return createTwoButtonAlert("ERROR","The Passwords does not match. Please try again!");
        }
        if (pass == '' || user == '' || display == '') {
            setIsLoading(false);
            return createTwoButtonAlert("ERROR","Empty Field Found!");
        }

        if (pass.length < 8) {
            setIsLoading(false);
            return createTwoButtonAlert("ERROR","Password must be have at least 8 characters.");
        }
        

        auth()
        .createUserWithEmailAndPassword(user, pass)
        .then(authUser => {
            var user2 = auth().currentUser;
            if (user2 != null) {
                user2.updateProfile({
                    displayName: display,
                }).then(function() {
                    user2.sendEmailVerification().then(function() {
                        createTwoButtonAlert("Sucess","Registration Sucessful!!\nNow You need to confirm your email.\nWe Sent a confirmation email.");
                        return navigation.navigate('Login');
                    });
                });
            } else {
                alert("Registration Sucessful!");
                return navigation.navigate('Login');
            }
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            setIsLoading(false);
            return createTwoButtonAlert('ERROR','That email address is already in use!');
          }
      
          if (error.code === 'auth/invalid-email') {
            setIsLoading(false);
            return createTwoButtonAlert('ERROR','That email address is invalid!');
          }

          setIsLoading(false);
          console.error(error);
        });
    }

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
            <Icon style={classes.icone} name="lock-open-outline" size={60} color="#fff" />
                <Text style={classes.titleText}>Register</Text>
                <TextInput
                    style={classes.inputText}
                    onChangeText={text => setDisplay(text)}
                    value={display}
                    placeholder="Display Name"
                    placeholderTextColor='rgba(255,255,255,0.5)'
                />
                <TextInput
                    style={classes.inputText}
                    onChangeText={text => setUser(text)}
                    value={user}
                    placeholder="Email"
                    keyboardType={"email-address"}
                    placeholderTextColor='rgba(255,255,255,0.5)'
                    autoCompleteType={"email"}
                />
                <TextInput
                    style={classes.inputText}
                    onChangeText={text => setPass(text)}
                    value={pass}
                    placeholder="Password"
                    placeholderTextColor='rgba(255,255,255,0.5)' 
                    secureTextEntry={true}
                />
                <TextInput
                    style={classes.inputText}
                    onChangeText={text => setPassConfirm(text)}
                    value={passConfirm}
                    placeholderTextColor='rgba(255,255,255,0.5)'
                    placeholder="Password Confirm"
                    secureTextEntry={true}
                />
                <TouchableOpacity style={classes.inputButton} disabled={isLoading} onPress={() => registerUser() }>
                    {isLoading 
                        ? <ActivityIndicator size="small" color='rgba(255, 255, 255,1)' /> 
                        : <Text style = {classes.buttonText}>Register</Text> }
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
      paddingBottom: 80,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container2: {
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
    },
    icone: {
        opacity: 0.4,
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
        color: 'rgba(255, 255, 255,0.5)',
    },
    inputText: {
        marginTop: 15,
        height: 40,
        width: 250,
        maxWidth: '80%',
        borderColor: 'rgba(200,200,200,0.7)',
        backgroundColor: 'rgba(200,200,200,0.2)',
        borderRadius: 5,
        borderWidth: 1,
        color: 'rgba(255,255,255,1)',
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
        opacity: 0.9,
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
        opacity: 0.7,
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 15,
        color: '#fff'
    }
  });