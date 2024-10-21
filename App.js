import React, { useEffect } from "react";
import { GiftProvider } from "./src/contexts/GiftContext";
import AppNavigator from "./src/navigation/AppNavigator";
import * as SplashScreen from "expo-splash-screen";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Warning: DatePicker:", "Warning: Header:"]);

export default function App() {
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating some loading time
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <GiftProvider>
      <AppNavigator />
    </GiftProvider>
  );
}
