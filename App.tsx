import React from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import RootNaviagtion from "./src/navigation/index";
import { store, persistor } from "./src/redux/store"; 
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        }
        persistor={persistor}
      >
        <SafeAreaProvider>
          <RootNaviagtion />
          <Toast />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
