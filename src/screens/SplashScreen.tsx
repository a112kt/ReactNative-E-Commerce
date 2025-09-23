import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import type { RootStackParamList } from "../navigation";
import type { RootState } from "../redux/store";

type SplashNavigationProp = NativeStackNavigationProp<RootStackParamList, "Splash">;

const SPLASH_DELAY = 1500;

const Splash: React.FC = () => {
  const navigation = useNavigation<SplashNavigationProp>();
  const token = useSelector((state: RootState) => state.auth.token);

  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showOfflineUI, setShowOfflineUI] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const didNavigateRef = useRef(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const clearNavigateTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const proceedNavigation = (target: "Home" | "Register" | "Login") => {
    if (didNavigateRef.current) return;
    didNavigateRef.current = true;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      navigation.replace(target);
    });
  };

  const startDelayAndNavigate = () => {
    if (didNavigateRef.current) return;
    clearNavigateTimer();

    const navigateTo = token ? "Home" : "Register";
    
    timerRef.current = setTimeout(() => {
      proceedNavigation(navigateTo);
    }, SPLASH_DELAY);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      })
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = !!state.isConnected && !!state.isInternetReachable;
      setIsConnected(connected);

      if (connected) {
        setShowOfflineUI(false);
        startDelayAndNavigate();
      } else {
        clearNavigateTimer();
        setShowOfflineUI(true);
      }
    });

    return () => {
      unsubscribe();
      clearNavigateTimer();
    };
  }, [token]);

  const handleRetry = async () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const state = await NetInfo.fetch();
    const connected = !!state.isConnected && !!state.isInternetReachable;
    setIsConnected(connected);

    if (connected) {
      setShowOfflineUI(false);
      startDelayAndNavigate();
    } else {
      setShowOfflineUI(true);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.Text 
        style={[
          styles.title,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ]
          }
        ]}
      >
        Shop.Co
      </Animated.Text>
      
      <Animated.View 
        style={[
          styles.statusBox,
          {
            opacity: fadeAnim,
            transform: [{ scale: pulseAnim }]
          }
        ]}
      >
        {isConnected === null ? (
          <ActivityIndicator color={"#fff"} size="large" />
        ) : isConnected ? (
          <ActivityIndicator color={"#fff"} size="large" />
        ) : (
          <>
            <Text style={[styles.statusText, { color: "#c0392b" }]}>
              No Internet Connection
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 12,
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
  },
  statusBox: {
    marginTop: 28,
    alignItems: "center",
  },
  statusText: {
    marginTop: 8,
    fontSize: 18,
    color: "#fff",
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#4ae282",
    borderRadius: 8,
  },
  retryText: {
    color: "#000",
    fontWeight: "700",
  },
});

