
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Card, TextInput, Button, Text, ActivityIndicator, Icon } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { green100 } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

const RateScreen = () => {
  const route = useRoute();
   const { answer, cid } = route.params || {};

   const navigation = useNavigation();
   const [val,setval]= useState('');

     const saveData = async (id, val) => {
    try {
      // const res = await fetch(`http://10.0.2.2:5001/chat/markFavourite/${id}`, {

      const res = await fetch(`${global.apiBaseUrl}/chat/markFavourite/${id}`, {

        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isfav: val })
      });

      if (res.ok) {
         navigation.goBack("Chat");
      }
    } catch (err) {
      console.error("Favourite error:", err);
    }
  };
  




   
   

return(



    <View style={{flex:1  }}>
        <View  style={{justifyContent:'center',flex:1,paddingLeft:30}}>
        <Text>Answer       {answer} </Text>



           <View style={{marginTop:20}}> 
          <Text>Person Id        {cid} </Text>
          
          </View>

 <View style={{marginTop:20,width:300}}> 

    <TextInput placeholder="Enter Rating " onChangeText={setval}></TextInput>
</View>




   <View style={{marginTop:50}}> 

            <Button    onPress={saveData(cid,val)}
            style={{backgroundColor:'blue'}}>Save Rating </Button>
          </View>

          {/* <View style={{marginTop:100}}> 

            <Button    onPress={goback}
            style={{backgroundColor:'green'}}>Go back</Button>
          </View> */}


          

         </View>
     





    </View>
)







};

export default RateScreen;