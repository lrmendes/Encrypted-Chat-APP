import React, { Component, useState, useEffect, useCallback } from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import RNCryptor from 'react-native-rncryptor';


export default function Chat({route, navigation}) {
  const user = route.params;
  let order = [user.user, auth().currentUser.uid];
  order.sort();

  //console.log("Navigation: ",user);
  navigation.setOptions({ title: user.name })

  const [message, setMessage] = useState({});
  const [text, setText] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    try {
        database()
        .ref(`/messages/${order[0]}_${order[1]}`)
        .on('value', snapshot => {
            if (snapshot.val() != null) {
                setMessage(snapshot.val());
                setData(Object.keys(snapshot.val()));
                //console.log('\n\nMessage list: ', snapshot.val());
                //database().ref(`/messages/${auth().currentUser.displayName}/${user.name}`).set(null);
          }});
    } catch (erorr) {
        console.log("\nErro ao obter usuarios online");
    }
  }, [auth().currentUser.displayName]);

  function sendMessage() {
    if (text != "" && text != null) {
      let encrypted = text;
      RNCryptor.encrypt(text, 'password').then((encryptedbase64)=>{
        ///encrypted = encryptedbase64;

        // UserMsg
        database()
        .ref( `/messages/${order[0]}_${order[1]}`)
        .push({ sender: auth().currentUser.uid , message: encrypted}).then( () => {
              //console.log("Mensagem enviada: ", { sender: auth().currentUser.displayName , message: text});
              setText("");
            })
      });
    }
  }

        return (
            <View>
            <View style={styles.messagesContainer}>
              <FlatList
                inverted
                data={data}
                keyExtractor={function (item) {
                  return item
                }}
                renderItem={function ({ item }) {
                  //console.log( "User: ",auth().currentUser.displayName, " - ", message);
                  return (
                    <View style={ message[item].sender != auth().currentUser.uid ? stylesLeft.container : flattenedStyles.container}>
                    <View style={ message[item].sender != auth().currentUser.uid ? stylesLeft.textContainer : flattenedStyles.textContainer}>
                        { message[item].sender == auth().currentUser.uid 
                        ? null 
                        : <Text style={ message[item].sender == auth().currentUser.uid ? flattenedStyles.leftTextBold : flattenedStyles.rightTextBold}> { user.name }: </Text>
                        }

                      <Text style={ message[item].sender != auth().currentUser.uid ? flattenedStyles.leftText : flattenedStyles.rightText}>
                        { message[item].message }
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
      width: '80%',
      backgroundColor: '#B4B4B4',
  
      borderRadius: 15,
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
      textAlign: 'left'
    },
    text: {
      fontSize: 12
    },
    textBold: {
      fontSize: 12,
      fontWeight: "bold"
    }
  })
  
  const flattenedStyles = {
    container: StyleSheet.flatten([stylesLeft.container, stylesLeft.rightContainer]),
    textContainer: StyleSheet.flatten([stylesLeft.textContainer, stylesLeft.rightTextContainer]),
    leftText: StyleSheet.flatten([stylesLeft.leftText, stylesLeft.text]),
    rightText: StyleSheet.flatten([stylesLeft.rightText, stylesLeft.text]),

    leftTextBold: StyleSheet.flatten([stylesLeft.leftText, stylesLeft.textBold]),
    rightTextBold: StyleSheet.flatten([stylesLeft.rightText, stylesLeft.textBold])
  }