import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import bgFile from '../assets/bg/bg-register2.jpg';

export default function Main({ navigation }) {
    const [userList,setUserList] = useState({});

    useEffect(() => {
        try {
            // Assuming user is logged in
            const userId = auth().currentUser.uid;
            const reference = database().ref(`/online/${auth().currentUser.displayName}`);
            // Set the /users/:userId value to true
            reference.set(true).then(() => console.log('Online presence set'));
        } catch (error) {
            //console.log("Erro ao buscar online");
        }
    
        try {
            const userId = auth().currentUser.uid;
            const reference = database().ref(`/online/${auth().currentUser.displayName}`);
            // Remove the node whenever the client disconnects
            reference
                .onDisconnect()
                .remove()
                .then(() => console.log('On disconnect function configured.'));
        } catch (error) {
            //console.log("Erro ao salvar desconexao");
        }

        try {
            database()
            .ref('/online')
            .on('value', snapshot => {
                if (snapshot.val() != null) {
                    setUserList(snapshot.val());
                    console.log('\n\nUser data: ', snapshot.val());
                }
            });
        } catch (erorr) {
            console.log("\nErro ao obter usuarios online");
        }

      }, [auth().currentUser.uid]);


    return (
        <ImageBackground source={bgFile} style={styles.bgimage}>
        <View style={styles.container}>
            <Text style={styles.welcome}>Bem Vindo, {auth().currentUser == null ? "none" : auth().currentUser.displayName}</Text>
            <Text style={styles.online}>Usuarios Online: {Object.keys(userList).length} </Text>
            { userList != null 
            ? Object.keys(userList).map((user,index) => {
                return (
                user == auth().currentUser.displayName 
                ? null
                :   <View key={index}>
                        <Text style={styles.userText}>{user}</Text>
                    </View>
                )
            })
            : <Text style={styles.online}> Nenhum Usuário Online </Text> }
        </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        alignItems: 'center',
    },
    online: {
        marginTop: 15,
        marginLeft: 20,
        fontSize: 20,
        color: '#00FF00',
    },
    userText: {        
        marginTop: 10,
        marginLeft: 25,
        fontSize: 25,
        color: '#00FFFF',
    },
    welcome: {
        marginTop: 40,
        fontSize: 20,
        color: '#FFFFFF',
    },
    bgimage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: "cover",
    },
});