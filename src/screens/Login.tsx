import React, { useState } from "react";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setToken } from "../redux/slices/tokenSlice";

type FormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Login">>();
  const [serverError, setServerError] = useState<string>("");

  const initialValues: FormValues = {
    email: "",
    password: "",
  };

  const SignUpSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be 6 or more characters")
      .required("Password is required"),
  });

  async function handleSubmit(values: FormValues, helpers: any) {
    console.log("Sending login values:", values);
    helpers.setSubmitting(true);
    setServerError("");

    try {
      const response = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signin",
        values,
        { headers: { "Content-Type": "application/json" }, timeout: 10000 }
      );

      console.log("Login success:", response.data);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Logged in successfully",
        position: "top",
        visibilityTime: 2500,
        autoHide: true,
      });

      const token = response.data.token;
      if (token) {
        dispatch(setToken(token));
        navigation.replace("MyTabs");
      } else {
        setServerError("Login succeeded but no token returned.");
      }
    } catch (error: any) {
      console.log("Axios error full:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log(
          "Response data:",
          JSON.stringify(error.response.data, null, 2)
        );
        console.log("Response headers:", error.response.headers);

        const status = error.response.status;
        const data = error.response.data;

        const serverMsg =
          data?.message ||
          (Array.isArray(data?.errors) && data.errors[0]?.msg) ||
          data?.error ||
          "Invalid credentials";

        if (status === 401) {
          Toast.show({
            type: "error",
            text1: "Login failed",
            text2: serverMsg,
            position: "top",
            visibilityTime: 3500,
            autoHide: true,
          });

          helpers.setFieldTouched("password", true);
          helpers.setFieldError("password", serverMsg);

          setServerError(serverMsg);
        } else if (status === 400) {
          Toast.show({
            type: "info",
            text1: "Validation error",
            text2: serverMsg,
            position: "top",
            visibilityTime: 3500,
            autoHide: true,
          });
          setServerError(serverMsg);
        } else {
          Toast.show({
            type: "error",
            text1: "Server error",
            text2: serverMsg,
            position: "top",
            visibilityTime: 3500,
            autoHide: true,
          });

          setServerError(serverMsg);
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Network error",
          text2: "Please check your internet connection.",
          position: "top",
          visibilityTime: 3500,
          autoHide: true,
        });
        setServerError("Network error. Please check your connection.");
        console.log("Network/other error:", error.message);
      }
    } finally {
      helpers.setSubmitting(false);
    }
  }

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema: SignUpSchema,
    onSubmit: handleSubmit,
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Pressable
        style={styles.backButton}
        onPress={() => {
          if (navigation.canGoBack && navigation.canGoBack())
            navigation.goBack();
          else navigation.navigate("Register");
        }}
      >
        <Icon name="arrow-back" size={30} color="#fff" />
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.cardText}>Welcome Again To Shop.co</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formik.values.email}
          onChangeText={(text) => {
            formik.handleChange("email")(text);
            if (serverError) setServerError("");
          }}
          onBlur={() => formik.handleBlur("email")}
        />
        {formik.touched.email && formik.errors.email && (
          <Text style={styles.error}>{formik.errors.email}</Text>
        )}

        <Text style={styles.label}>Password</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="Enter Your Password"
          value={formik.values.password}
          onChangeText={(text) => {
            formik.handleChange("password")(text);
            if (serverError) setServerError("");
            if (formik.errors.password) formik.setFieldError("password", "");
          }}
          onBlur={() => formik.handleBlur("password")}
        />
        {formik.touched.password && formik.errors.password && (
          <Text style={styles.error}>{formik.errors.password}</Text>
        )}

        {serverError ? (
          <Text style={[styles.error, { marginTop: 6 }]}>{serverError}</Text>
        ) : null}

        <View style={styles.forgetPassword}>
          <Text style={styles.forgetPasswordText}>Forget Password?</Text>
          <Pressable onPress={() => navigation.navigate("ForgetPassword")}>
            <Text style={styles.clickbtn}>Click here</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.button, formik.isSubmitting && { opacity: 0.7 }]}
          onPress={() => formik.handleSubmit()}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: { position: "absolute", top: 50, left: 6, zIndex: 10 },
  card: {
    backgroundColor: "#171616ff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
  },
  cardText: {
    fontSize: 25,
    color: "#fff",
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    color: "#fff",
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
  error: { color: "red", fontSize: 12, marginTop: 4 },
  button: {
    marginTop: 30,
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
  forgetPassword: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  forgetPasswordText: { color: "#fff", fontSize: 16, fontStyle: "italic" },
  clickbtn: { textDecorationLine: "underline", color: "green", fontSize: 16 },
});
