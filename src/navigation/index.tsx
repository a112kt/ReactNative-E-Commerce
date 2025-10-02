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
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from "@react-navigation/drawer";
import BrandsScreen from "../screens/tabs/drawer/BrandsScreen";
import WhishlistScreen from "../screens/tabs/drawer/WhishlistScreen";
import AddressesScreen from "../screens/tabs/drawer/AddressesScreen";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { clearToken } from "../redux/slices/tokenSlice";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Orders from "../screens/tabs/drawer/OrdersScreen";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import ProductsScreen from "../screens/tabs/drawer/Products";
import ProductDetails from "../screens/ProductDetails";
import checkout from "../screens/checkout";
import onlinePay from "../screens/onlinePay";
import cashPay from "../screens/cashPay";

export type RootStackParamList = {
  Splash: undefined;
  MyTabs: undefined;
  Register: undefined;
  Login: undefined;
  ForgetPassword: undefined;
  ProductDetails: { productId: string } | undefined;
  checkout: undefined;
  onlinePay: { url: string };
  cashPay: { message: string };
  Products: { initialSearch?: string } | undefined; 
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

type StackNavProp = NativeStackNavigationProp<RootStackParamList, "MyTabs">;
type MyDrawerNavProp = DrawerNavigationProp<DrawerParamList>;

function MyTabs() {
  const cartCount = useSelector((s: RootState) => s.cart.numOfCartItems);

  return (
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
              size={30}
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
              size={30}
              color={focused ? "#4ae282ff" : "gray"}
            />
          ),
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
}

function MyDrawer() {
  const dispatch = useDispatch<AppDispatch>();
  const stackNav = useNavigation<StackNavProp>();
  const drawerNav = useNavigation<MyDrawerNavProp>();

  const handleSignOut = () => {
    dispatch(clearToken());
    stackNav.replace("Login");
  };

  const Favorite = () => {
    stackNav.navigate("MyTabs", {
      screen: "MyDrawer",
      params: {
        screen: "Whishlist",
      },
    } as any);
  };

  return (
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
          headerTitleStyle: { fontSize: 20, fontWeight: "700" },
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              {/* Search Input */}
              <TextInput
                placeholder="Search..."
                style={styles.searchInput}
                placeholderTextColor="#888"
                onFocus={() => {
                  stackNav.navigate("Products", { initialSearch: "" });
                }}
              />
              {/* Favorite Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && { backgroundColor: "#ddd" },
                ]}
                onPress={Favorite}
              >
                {({ pressed }) => (
                  <Ionicons
                    name="heart-outline"
                    size={20}
                    color={pressed ? "red" : "black"}
                  />
                )}
              </Pressable>

              {/* Logout Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && { backgroundColor: "#ddd" },
                ]}
                onPress={handleSignOut}
              >
                {({ pressed }) => (
                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color={pressed ? "tomato" : "black"}
                  />
                )}
              </Pressable>
            </View>
          ),
        }}
      />
      <Drawer.Screen name="Products" component={ProductsScreen} />
      <Drawer.Screen name="Brands" component={BrandsScreen} />
      <Drawer.Screen name="Whishlist" component={WhishlistScreen} />
      <Drawer.Screen name="Address" component={AddressesScreen} />
      <Drawer.Screen name="Orders" component={Orders} />
    </Drawer.Navigator>
  );
}

const RootNavigation = () => {
  return (
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
        <Stack.Screen
          options={{ headerShown: false }}
          name="ProductDetails"
          component={ProductDetails}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="checkout"
          component={checkout}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="onlinePay"
          component={onlinePay}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="cashPay"
          component={cashPay}
        />
        <Stack.Screen
          options={{ headerShown: true, title: "Products" }}
          name="Products"
          component={ProductsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  searchInput: {
    width: 160,
    height: 35,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    fontSize: 12,
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RootNavigation;
