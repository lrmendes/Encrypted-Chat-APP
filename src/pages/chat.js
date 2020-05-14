import React, { Component, useState, useEffect, useCallback } from 'react';

import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';

const DATA = [
    { id: 1, message: 'Hello', side: 'left' }, 
    { id: 2, message: 'Hi!', side: 'right' },
    { id: 3, message: 'Hi!', side: 'right' },
    { id: 4, message: 'Se chegou aqui voce esta logado!', side: 'right' }
];

export default function Chat() {
  const [message, setMessage] = useState('');

  const handlePress = useCallback(
    function () {
      // todo this
    },
    [message]
  )

        return (
            <View>
            <View style={styles.messagesContainer}>
              <FlatList
                inverted
                data={DATA}
                keyExtractor={function (item) {
                  return item.id
                }}
                renderItem={function ({ item }) {
                  return (
                    <View style={item.side == 'left' ? stylesLeft.container : flattenedStyles.container}>
                    <View style={item.side == 'left' ? stylesLeft.textContainer : flattenedStyles.textContainer}>
                      <Text style={item.side == 'left' ? flattenedStyles.leftText : flattenedStyles.rightText}>
                        {item.message}
                      </Text>
                    </View>
                  </View>
                  )
                }}
              />
            </View>
      
            <View style={styles.inputContainer}>

            <View style={stylesInput.container}>
              <View style={stylesInput.inputContainer}>
                  <TextInput style={stylesInput.input} value={message} onChangeText={setMessage} placeholder="Write you message" />
              </View>
              <Button title="Send" onPress={handlePress} />
            </View>

            </View>
          </View>
        );
}

const styles = StyleSheet.create({
    messagesContainer: {
        height: '100%',
        paddingBottom: 100
      },
      inputContainer: {
        width: '100%',
        height: 100,
        position: 'absolute',
        bottom: 0,
        paddingVertical: 10,
        paddingLeft: 20,
        borderTopWidth: 1,
        borderTopColor: '#B4B4B4'
      }
});

const stylesInput = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%'
  },
  inputContainer: {
    width: '70%'
  },
  input: {
    height: 40,
    borderColor: '#B4B4B4',
    borderWidth: 1,
    borderRadius: 3,
    flexDirection: 'row',
    paddingHorizontal: 10
  }
})

const stylesLeft = StyleSheet.create({
    container: {
      width: '100%',
      paddingVertical: 3,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    textContainer: {
      width: 160,
      backgroundColor: '#B4B4B4',
  
      borderRadius: 40,
      paddingHorizontal: 15,
      paddingVertical: 12,
      marginLeft: 10
    },
    rightContainer: {
      justifyContent: 'flex-end'
    },
    rightTextContainer: {
      backgroundColor: '#5FB0FF',
      marginRight: 10
    },
    leftText: {
      textAlign: 'left'
    },
    rightText: {
      textAlign: 'right'
    },
    text: {
      fontSize: 12
    }
  })
  
  const flattenedStyles = {
    container: StyleSheet.flatten([stylesLeft.container, stylesLeft.rightContainer]),
    textContainer: StyleSheet.flatten([stylesLeft.textContainer, stylesLeft.rightTextContainer]),
    leftText: StyleSheet.flatten([stylesLeft.leftText, stylesLeft.text]),
    rightText: StyleSheet.flatten([stylesLeft.rightText, stylesLeft.text])
  }