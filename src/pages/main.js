import React, { Component, useEffect } from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function Main({ navigation }) {

    return (
        <View>
            <Text>Lista de Usuários do APP</Text>
            <Text>Bem Vindo, {auth().currentUser == null ? "NULO" : auth().currentUser.displayName}</Text>
        </View>
    );
}