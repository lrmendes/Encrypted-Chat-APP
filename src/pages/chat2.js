import React, { Component, useState, useEffect, useCallback } from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import RNCryptor from 'react-native-rncryptor';


export default function Chat({route, navigation}) {
  const user = route.params;
  let order = [user.user, auth().currentUser.uid];
  order.sort();

  //console.log("Navigation: ",user);
  navigation.setOptions({ title: user.name })

  //const [message, setMessage] = useState([]);
  //const messageList = [];

  const [messageList, setMessageList] = useState([]);

  const [text, setText] = useState("");
  const [data, setData] = useState([]);

  const [showCrypto, setShowCrypto] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  async function decryptMessages(messages) {
    console.log("\n Descripte: ",messages,"\n");
    await RNCryptor.decrypt(messages.message, 'password').then((plaintext) => {
        //setMessage({...message, [message[item]]: {...message[item], message: plaintext } });
        
        messages["encryptedMessage"] = messages.message;
        messages.message = plaintext;
        
        console.log("\nAchou: ",messages.message);
        
        messageList.push(messages);
        
        setIsLoading(false);
        
        console.log("\n\n Array: ", messageList, "\n------------------------");
        return;
      }).catch((error) => {
        console.log("\n",error);
      })
  }

  useEffect(() => {
    try {
        database()
        .ref(`/messages/${order[0]}_${order[1]}`)
        .on('child_added', snapshot => {
            if (snapshot.val() != null) {
              //console.log("\n Chegou: ",snapshot.val(),"\n------------------");
              decryptMessages(snapshot.val());
          }});
    } catch (erorr) {
        console.log("\nErro ao obter usuarios online");
    }
  }, [auth().currentUser.uid]);

  function sendMessage() {
    if (text != "" && text != null) {
      setIsSending(true);
      let encrypted = text;
      RNCryptor.encrypt(text, 'password').then((encryptedbase64)=>{
        encrypted = encryptedbase64;

        // UserMsg
        database()
        .ref( `/messages/${order[0]}_${order[1]}`)
        .push({ sender: auth().currentUser.uid , message: encrypted}).then( () => {
              //console.log("Mensagem enviada: ", { sender: auth().currentUser.displayName , message: text});
              setText("");
              setIsSending(false);
            })
      });
    }
  }

        return (
            <View>
            <View style={styles.messagesContainer}>
              <FlatList
                data={messageList}
                keyExtractor={ (item, index) => {
                  //console.log("\nIndice: ",index);
                  return index
                }}
                renderItem={function ({ item }) {
                  //console.log("\nMsg Item: ",item);
                  return (
                    <View style={ item.sender != auth().currentUser.uid ? stylesLeft.container : flattenedStyles.container}>
                    <View style={ item.sender != auth().currentUser.uid ? stylesLeft.textContainer : flattenedStyles.textContainer}>
                        { item.sender == auth().currentUser.uid 
                        ? null 
                        : <Text style={ item.sender == auth().currentUser.uid ? flattenedStyles.leftTextBold : flattenedStyles.rightTextBold}> { user.name }: </Text>
                        }
                      <Text style={ item.sender != auth().currentUser.uid ? flattenedStyles.leftText : flattenedStyles.rightText}>
                        { !showCrypto ? item.message : item.encryptedMessage }
                      </Text>
                    </View>
                    </View>
                  )
                }}
              />
            </View>
      
            <View style={styles.inputContainer}>

            <View style={stylesInput.container}>
              <TouchableOpacity style={styles.rowBtn} disable={isLoading} onPress={() => { setShowCrypto(!showCrypto) } }>
                {isLoading 
                        ? <ActivityIndicator size="small" color='rgba(0, 0, 0, 1)' /> 
                        : <Icon name={showCrypto ? "eye" : "lock-outline" } size={30} />
                }
              </TouchableOpacity>
              <View style={stylesInput.inputContainer}>
                  <TextInput editable={!isSending} style={stylesInput.input} value={text} onChangeText={(e) => setText(e)} placeholder="Write you message" />
              </View>
              <TouchableOpacity onPress={sendMessage} style={styles.sendBtn} disable={isSending} >
                {isSending 
                        ? <ActivityIndicator size="small" color='rgba(255, 255, 255, 1)' /> 
                        : <Text style = {styles.sendText}>Send</Text>
                }
              </TouchableOpacity>
            </View>

            </View>
          </View>
        );
}

const styles = StyleSheet.create({
    messagesContainer: {
        height: '100%',
        paddingBottom: 70
      },
      inputContainer: {
        width: '100%',
        height: 60,
        position: 'absolute',
        bottom: 0,
        paddingVertical: 10,
        paddingLeft: 10,
        borderTopWidth: 1,
        borderTopColor: '#B4B4B4'
      },
      sendBtn: {
        backgroundColor: '#000000',
        color: '#ffffff',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 3,
        padding: 9,
      },
      sendText: {
        color: '#ffffff'
      },
      rowBtn: {
        padding: 3,
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        borderRadius: 5
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
      paddingVertical: 4,
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