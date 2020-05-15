import React, {useState, useEffect} from 'react';
import { ImageBackground, Keyboard, TouchableOpacity, View, Text, StyleSheet,TextInput, ActivityIndicator, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import { CommonActions } from '@react-navigation/native';


import bgFile from '../assets/bg/bg-login.jpg';

export default function Login({ navigation }) {
    const [user,setUser] = useState("");
    const [pass,setPass] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const createTwoButtonAlert = (title,msg) =>
    Alert.alert(
        title,
        msg,
      [
        { text: "OK", onPress: () => setPass("") }
      ],
      { cancelable: false }
    );

    function loginUser() {
        setIsLoading(true);

        if (user == "" || pass == "") {
            setIsLoading(false);
            return createTwoButtonAlert('Error','Empty Field!');
        }

        auth()
            .signInWithEmailAndPassword(user, pass)
                .then(() => {
                    if (!auth().currentUser.emailVerified) {
                        auth().signOut().then(() => {
                            setIsLoading(false);
                            return createTwoButtonAlert('Error','This email has not been verified!\nPlease, confirm this email by the verify mail!');
                        });
                    } else {
                        setIsLoading(false);
                        return navigation.navigate('Home');
                    }
                })
                .catch(error => {
                    /*auth().fetchProvidersForEmail(user).then(function( result ){
                        console.log(result)
                    });*/
                    if (error == 'auth/wrong-password') {
                        return createTwoButtonAlert('Error','Wrong Password!');
                    }
                    if (error == 'auth/invalid-email') {
                        return createTwoButtonAlert('Error','Invalid Email!');
                    }
                    setIsLoading(false);     
                    console.log(error); 
                    alert(error);
                });
        }

    useEffect(() => {
        if (auth().currentUser != null) {
            if (!auth().currentUser.emailVerified) {
                auth().signOut().then(() => {
                    console.log("Email nao verificado - deslogou usuario");
                });
            } else {
                navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [
                        { name: 'Home' },
                    ],}))
            }
        }

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
            <Icon2 style={classes.icone} name="lock-outline" size={60} color="#006994" />
                <Text style={classes.titleText}>Login</Text>
                <TextInput
                    style={classes.inputText}
                    onChangeText={text => setUser(text)}
                    value={user}
                    placeholder="Email"
                    keyboardType={"email-address"}
                    autoCompleteType={"email"}
                />
                <TextInput
                    style={classes.inputText}
                    onChangeText={text => setPass(text)}
                    value={pass}
                    placeholder="Password"
                    secureTextEntry={true}
                />
                <TouchableOpacity style={classes.inputButton} disabled={isLoading} onPress={() => loginUser()}>
                {isLoading 
                        ? <ActivityIndicator size="small" color='rgba(255, 255, 255,1)' /> 
                        : <Text style = {classes.buttonText}>Login</Text>
                }
                </TouchableOpacity>
                <View style={!isKeyboardVisible ? classes.container2 : {display: "none"} } > 
                <Text style={classes.text2}>New User?</Text>
                <TouchableOpacity style={classes.inputButton2} onPress={() => navigation.navigate('Register')}>
                    <Text style = {classes.buttonText}>
                    Register Now
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