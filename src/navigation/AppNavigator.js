import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import PeopleScreen from "../screens/PeopleScreen";
import AddPersonScreen from "../screens/AddPersonScreen";
import IdeaScreen from "../screens/IdeaScreen";
import AddIdeaScreen from "../screens/AddIdeaScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="People">
        <Stack.Screen name="People" component={PeopleScreen} />
        <Stack.Screen name="AddPerson" component={AddPersonScreen} />
        <Stack.Screen name="Ideas" component={IdeaScreen} />
        <Stack.Screen name="AddIdea" component={AddIdeaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
