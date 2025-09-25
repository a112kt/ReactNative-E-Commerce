import {
  ActivityIndicator,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import Toast from "react-native-toast-message";
import { Platform } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useNavigation } from "@react-navigation/native";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import axios from "axios";
import { setToken } from "../redux/slices/tokenSlice";

export default function ForgetPassword() {
  type LoginNavProp = NativeStackNavigationProp<RootStackParamList, "Login">;
  let navigation = useNavigation<LoginNavProp>();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const [loader, setLoader] = useState(false);
  function getCode() {
    setLoader(true);
    axios
      .post("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords", {
        email,
      })
      .then((res) => {
        setCurrentStep(1);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setError(err.response.data.message);
      })
      .finally(() => {
        setLoader(false);
        setError("");
      });
  }
  function sendCode() {
    setLoader(true);
    axios
      .post("https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode", {
        resetCode: code,
      })
      .then(() => {
        setCurrentStep(2);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setError(err.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  }
  function checkPass() {
    if (pass1 === pass2) {
      setError("");
      confirm();
    } else {
      setError("Your passwords must be identical");
    }
  }
  function confirm() {
    setLoader(true);
    axios
      .put("https://ecommerce.routemisr.com/api/v1/auth/resetPassword", {
        email: email,
        newPassword: pass1,
      })
      .then((res) => {
        console.log(res.data.token);
        let token = res.data.token;
        if (token) {
          dispatch(setToken(token));
          navigation.navigate("MyTabs");
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      })
      .finally(() => {
        setLoader(false);
      });
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        <ScrollView
          style={styles.stepper}
          // contentContainerStyle={{ flex:1 }}
        >
          <Text style={styles.cardText}>Reset Your Password</Text>
          <ProgressSteps
            activeStep={currentStep}
            completedProgressBarColor="#4ae282ff"
            completedLabelColor="#4ae282ff"
            completedStepIconColor="#4ae282ff"
            activeStepNumColor="#4ae282ff"
            activeLabelColor="white"
            activeStepIconBorderColor="#4ae282ff"
            disabledStepIconColor="gray"
          >
            <ProgressStep label="" removeBtnRow scrollable={false}>
              <View style={styles.content}>
                <Text style={{ fontSize: 20,color:"white",marginBottom:20 }}>
                  Enter your registered email address to receive a password
                  reset code.
                </Text>
                <Text style={[styles.label, { fontSize: 20 }]}>Email :</Text>
                <TextInput
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Enter your email"
                  style={styles.input}
                />
                <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
              </View>
            </ProgressStep>
            <ProgressStep label="" errors={false} removeBtnRow>
              <View style={styles.content}>
                <Text style={[styles.label, { color: "red" }]}>
                  We’ve sent a 6-digit code to your email address.
                </Text>
                <Text style={styles.label}>
                  Please enter the code below to continue.
                </Text>

                <TextInput
                  style={styles.input}
                  value={code}
                  onChangeText={(text) => setCode(text)}
                  keyboardType="number-pad"
                  placeholder="X  X  X  X  X  X"
                  textAlign="center"
                />
                <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
              </View>
            </ProgressStep>
            <ProgressStep label="" removeBtnRow>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
                onChangeText={(text) => setPass1(text)}
                value={pass1}
              />

              <Text style={styles.label}>Re-enter Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                secureTextEntry
                onChangeText={(text) => setPass2(text)}
              />
              <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
            </ProgressStep>
          </ProgressSteps>
          <View style={styles.buttonGroup}>
            {currentStep === 1 && (
              <TouchableOpacity
                style={styles.button}
                disabled={loader}
                onPress={() => {
                  setCurrentStep(() => currentStep - 1);
                  setError("");
                }}
              >
                <Text style={styles.buttonText}> ... Back </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              disabled={loader}
              style={styles.button}
              onPress={() => {
                if (currentStep === 0) {
                  getCode();
                } else if (currentStep === 1) {
                  sendCode();
                } else {
                  checkPass();
                }
              }}
            >
              {loader ? (
                <ActivityIndicator color={"white"} size={"small"} />
              ) : (
                <Text style={styles.buttonText}>
                  {currentStep === 2 ? "Submit" : "Next ..."}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
  },
  backBtn: {
    margin: 3,
  },
  content: {
    // flex: 1,
    borderRadius: 10,
    width: "100%",
    minHeight: 200,
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  stepper: {
    backgroundColor: "#171616ff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
    margin: 30,
    flexDirection: "column",
  },
  card: {
    backgroundColor: "#171616ff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
  },
  button: {
    flex: 1,
    marginTop: 15,
    backgroundColor: "#4ae282ff",
    paddingVertical: 14,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    fontStyle: "italic",
  },
  cardText: {
    fontSize: 25,
    color: "#fff",
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    color: "white",
    fontSize: 15,
    fontStyle: "italic",
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 13,
    backgroundColor: "#fff",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 40,
    marginTop: 70,
  },
});
