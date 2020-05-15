import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import bgFile from '../assets/bg/bg-register2.jpg';

export default function Main({ navigation }) {
    const [userList,setUserList] = useState([]);

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
                    if (userList.indexOf(snapshot.val()) == -1) {
                        console.log("Entrou ake");
                        setUserList([...userList, snapshot.val()]);
                    } else {
                        console.log("Onde foi parar isso?");
                    }
                    console.log('User data: ', snapshot.val());
                    console.log(userList);
                }
            });
        } catch (erorr) {
            console.log("Erro ao obter usuarios online");
        }

      }, [auth().currentUser.uid]);

    return (
        <ImageBackground source={bgFile} style={styles.bgimage}>
        <View>
            <Text>Lista de Usuários do APP</Text>
            <Text>Bem Vindo, {auth().currentUser == null ? "none" : auth().currentUser.displayName}</Text>
            <Text style={styles.online}>Usuarios Online: </Text>
            {userList.map((user, index) => {
                return (
                <View key={index}>
                    <Text style={styles.userText}>{JSON.stringify(user)}</Text>
                </View>
                )
            })}
        </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    online: {
        marginTop: 15,
        marginLeft: 20,
        fontSize: 20,
        color: '#00FF00',
    },
    userText: {        
        marginTop: 10,
        marginLeft: 25,
        fontSize: 18,
        color: '#00FFFF',
    },
    bgimage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: "cover",
    },
});