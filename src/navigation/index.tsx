import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import Registration from "../screens/Registration";
import Splash from "../screens/SplashScreen";
import Login from "../screens/Login";
import ForgetPassword from "../screens/ForgetPassword";

export type RootStackParamList={
    Splash:undefined;
    Home:undefined;
    Register:undefined;
    Login: undefined;
    ForgetPassword:undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const RootNaviagtion = ()=>{
    return<>

    <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen options={{headerShown:false}} name="Splash" component={Splash}/>
            <Stack.Screen options={{headerShown:false}} name="Home" component={HomeScreen}/>
            <Stack.Screen options={{headerShown:false}} name="Register" component={Registration}/>
            <Stack.Screen options={{headerShown:false}} name="Login" component={Login}/>
            <Stack.Screen options={{headerShown:false}} name="ForgetPassword" component={ForgetPassword}/>
        </Stack.Navigator>
    </NavigationContainer>
    </>
}
export default RootNaviagtion;