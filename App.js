import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Signup from "./ChatBot/Forms/Signup.js";
import Login from "./ChatBot/Forms/Login.js";
import Chat from "./ChatBot/Forms/Chat.js";
import Knowldgebase from "./ChatBot/Forms/Knowldgebase.js";
import AdminDashboard from "./ChatBot/Forms/AdminDashboard.js";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
        <Stack.Screen name="Knowldgebase" component={Knowldgebase} options={{ headerShown: false }} /> 
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App