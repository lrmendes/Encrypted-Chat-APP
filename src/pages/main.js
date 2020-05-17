import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import bgFile from '../assets/bg/bg-register2.jpg';

export default function Main({ navigation }) {
    const [userList,setUserList] = useState({});

    useEffect(() => {
        try {
            // Assuming user is logged in
            const userId = auth().currentUser.uid;
            const reference = database().ref(`/online/${auth().currentUser.displayName}`);
            // Set the /users/:userId value to true
            reference.set({ user: auth().currentUser.uid, name: auth().currentUser.displayName }).then(() => console.log('Online presence set'));
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
            <View style={styles.list}>
            { userList != null 
                ? Object.keys(userList).map((user,index) => {
                    return (
                    user == auth().currentUser.displayName 
                    ? null
                    :    <View style={styles.row} key={index}>
                            <View style={styles.rowleft}>
                                <Icon style={styles.icone} name="account-circle" size={50} color="#FFFFFF" />
                                <Text style={styles.userText}>{userList[user].name}</Text>
                            </View>
                            <TouchableOpacity style={styles.rowBtn} onPress={() => navigation.navigate('Chat', userList[user])}>
                                <Icon name="arrow-right-circle" size={60} color="rgba(0,255,255,0.7)" />
                            </TouchableOpacity>
                        </View>
                    )
                })
                : <Text style={styles.online}> Nenhum Usuário Online </Text> }
            </View>
        </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    list: {
        flex: 1,
        height: '100%',
        width: '100%',
        marginTop: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 15,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 100,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
        borderRadius: 5,
    },
    rowleft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowBtn: {
        marginRight: 15,
    },
    icone: {
        marginLeft: 15,
    },
    online: {
        marginTop: 15,
        marginLeft: 20,
        fontSize: 20,
        color: '#00FF00',
    },
    userText: {       
        marginLeft: 25,
        fontSize: 20,
        color: '#FFFFFF',
    },
    welcome: {
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