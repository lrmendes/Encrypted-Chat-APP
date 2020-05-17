import React, { Component, useState, useEffect, useCallback } from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';

export default function Chat({route, navigation}) {
  const user = route.params;
  //console.log("Navigation: ",user);
  navigation.setOptions({ title: user.name })

  const [message, setMessage] = useState({});
  const [text, setText] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    try {
        database()
        .ref(`/messages/${auth().currentUser.uid}/${user.user}`)
        .on('value', snapshot => {
            if (snapshot.val() != null) {
                setMessage(snapshot.val());
                console.log('\n\nMessage data: ', snapshot.val());
                setData(Object.keys(snapshot.val()));
                console.log('\n\nMessage list: ', snapshot.val());
                database().ref(`/messages/${auth().currentUser.uid}/${user.user}`).remove().then( () => {} );
            }
        });
    } catch (erorr) {
        console.log("\nErro ao obter usuarios online");
    }
  }, [auth().currentUser.uid]);

  function sendMessage() {
    if (text != "" && text != null) {
      // UserMsg
      database()
        .ref(`/messages/${user.user}/${auth().currentUser.uid}`)
        .push({ you: text}).then( () => {
          // Yourself
          database()
            .ref(`/messages/${auth().currentUser.uid}/${user.user}`)
            .push({ me: text}).then( () => {
              setText("");
              console.log("Mensagem enviada");
            })
        })
    }
  }

        return (
            <View>
            <View style={styles.messagesContainer}>
              <FlatList
                inverted
                data={data}
                keyExtractor={function (item) {
                  return item.id
                }}
                renderItem={function ({ item }) {
                  return (
                    <View style={item.side == 'left' ? stylesLeft.container : flattenedStyles.container}>
                    <View style={item.side == 'left' ? stylesLeft.textContainer : flattenedStyles.textContainer}>
                      <Text style={item.side == 'left' ? flattenedStyles.leftText : flattenedStyles.rightText}>
                        {item.me}
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
                  <TextInput style={stylesInput.input} value={text} onChangeText={(e) => setText(e)} placeholder="Write you message" />
              </View>
              <Button title="Send" onPress={sendMessage} />
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