



import React from "react";
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Screens import
import Signup from "./ChatBot/Forms/Signup.js";
import Login from "./ChatBot/Forms/Login.js";



import Knowledgebase from "./ChatBot/Forms/Knowledgebase.js";
import Session from "./ChatBot/Forms/Session.js";
import AdminDashboard from "./ChatBot/Forms/AdminDashboard.js";
import CategoriesScreen from "./ChatBot/Forms/CategoriesScreen.js";
import ArchivedScreen from "./ChatBot/Forms/ArchivedScreen.js";

import ChatHistoryScreen from "./ChatBot/Forms/ChatHistoryScreen.js";
import CategoryReportBySession from "./ChatBot/Forms/CategoryReportBySession.js";
import ErrorHistoryScreen from "./ChatBot/Forms/ErrorHistoryScreen.js";
import AddKnowledgeScreen from "./ChatBot/Forms/AddKnowledgeScreen.js";
import ShowChatCategory from "./ChatBot/Forms/ShowChatCategory.js";  // ✅ Correct component import
import Comparison from "./ChatBot/Forms/Comparison.js";
import AllsessioncomparisonReport from "./ChatBot/Forms/AllsessioncomparisonReport.js";
import Mixgraph from "./ChatBot/Forms/Mixgraph.js";
import Allgraph from "./ChatBot/Forms/Allgraph.js";
import ShareChat from "./ChatBot/Forms/ShareChat";
import ReceiveChat from "./ChatBot/Forms/ReceiveChat";
import AddminNotice from "./ChatBot/Forms/AddminNotice.js";
import SndAddminMsg from "./ChatBot/Forms/SndAddminMsg.js";
import ShowMsg from "./ChatBot/Forms/ShowMsg.js";
import RateScreen from "./ChatBot/Forms/Rate.js";
import Chat from "./ChatBot/Forms/Chat.js";



const Stack = createStackNavigator();

global.apiBaseUrl = "http://192.168.2.173:5001";


const App = () => {
  return (
  
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
          

        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />

          <Stack.Screen name="ChatHistoryScreen" component={ChatHistoryScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Knowledgebase" component={Knowledgebase} options={{ headerShown: false }} />
          <Stack.Screen name="Session" component={Session} options={{ headerShown: false }} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
         
          <Stack.Screen name="CategoryReportBySession" component={CategoryReportBySession} options={{ headerShown: false }} />
          <Stack.Screen name="ErrorHistoryScreen" component={ErrorHistoryScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AddKnowledgeScreen" component={AddKnowledgeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ArchivedScreen" component={ArchivedScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Comparison" component={Comparison} options={{ headerShown: false }} />
          <Stack.Screen name="AllsessioncomparisonReport" component={AllsessioncomparisonReport} options={{ headerShown: false }} />
          <Stack.Screen name="Mixgraph" component={Mixgraph} options={{ headerShown: false }} />
          <Stack.Screen name="Allgraph" component={Allgraph} options={{ headerShown: false }} />
          <Stack.Screen name="AddminNotice" component={AddminNotice} options={{ headerShown: false }} />
          <Stack.Screen name="SndAddminMsg" component={SndAddminMsg} />
          <Stack.Screen name="ShowMsg" component={ShowMsg} options={{ headerShown: false }} />

            <Stack.Screen name="ShareChat" component={ShareChat} options={{ headerShown: false }}/>
            <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} options={{ headerShown: false }}/>

              <Stack.Screen name="RateScreen" component={RateScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="ReceiveChat" component={ReceiveChat} options={{ headerShown: false }}/>
          <Stack.Screen name="ShowChatCategory" component={ShowChatCategory} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
   
  );
};

export default App;
