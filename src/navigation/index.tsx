import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/tabs/drawer/HomeScreen";
import CartScreen from "../screens/tabs/CartScreen";
import Registration from "../screens/Registration";
import Splash from "../screens/SplashScreen";
import Login from "../screens/Login";
import ForgetPassword from "../screens/ForgetPassword";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BrandsScreen from "../screens/tabs/drawer/BrandsScreen";
import WhishlistScreen from "../screens/tabs/drawer/WhishlistScreen";
import AddressesScreen from "../screens/tabs/drawer/AddressesScreen";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { clearToken } from "../redux/slices/tokenSlice";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
type HomeNavProp = NativeStackNavigationProp<RootStackParamList, "MyTabs">;
import Orders from "../screens/tabs/drawer/OrdersScreen";
import { Pressable, Text } from "react-native";

export type RootStackParamList = {
  Splash: undefined;
  MyTabs: undefined;
  Register: undefined;
  Login: undefined;
  ForgetPassword: undefined;
};
export type TabParamList = {
  MyDrawer: undefined;
  Cart: undefined;
};
export type DrawerParamList = {
  Home: undefined;
  Products: undefined;
  Brands: undefined;
  Whishlist: undefined;
  Address: undefined;
  Orders: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function MyTabs() {
  return (
    <>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="MyDrawer"
          component={MyDrawer}
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: { color: "#474646ff" },
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="home"
                size={25}
                color={focused ? "#4ae282ff" : "gray"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarLabelStyle: { color: "#474646ff" },
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="cart"
                size={25}
                color={focused ? "#4ae282ff" : "gray"}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}
function MyDrawer() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<HomeNavProp>();
  const handleSignOut = () => {
    dispatch(clearToken());
    navigation.replace("Login");
  };
  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          drawerLabelStyle: { color: "#474646ff" },
          drawerActiveBackgroundColor: "#4ae2828c",
        }}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerLabel: "Explore",
            headerTitle: "SHOP.CO",
            headerRight: () => (
              <>
                <Pressable
                  style={{
                    backgroundColor: "red",
                    paddingHorizontal: 13,
                    paddingVertical: 10,
                    borderRadius: 8,
                    marginRight: 4,
                  }}
                  onPress={() => {
                    handleSignOut();
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: "white",
                    }}
                  >
                    Log Out
                  </Text>
                </Pressable>
              </>
            ),
            headerTitleStyle: { fontSize: 30, fontWeight: "700" },
          }}
        />
        <Drawer.Screen name="Products" component={BrandsScreen} />
        <Drawer.Screen name="Brands" component={BrandsScreen} />
        <Drawer.Screen name="Whishlist" component={WhishlistScreen} />
        <Drawer.Screen name="Address" component={AddressesScreen} />
        <Drawer.Screen name="Orders" component={Orders} />
      </Drawer.Navigator>
    </>
  );
}

const RootNaviagtion = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            options={{ headerShown: false }}
            name="Splash"
            component={Splash}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="MyTabs"
            component={MyTabs}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={Login}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Register"
            component={Registration}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="ForgetPassword"
            component={ForgetPassword}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
export default RootNaviagtion;
