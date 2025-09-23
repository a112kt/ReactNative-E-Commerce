import React from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import axios from "axios";
import Toast from "react-native-toast-message"; 



type FormValues = {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
};

export default function Registration() {
  
 
  type LoginNavProp = NativeStackNavigationProp<RootStackParamList, "Login">;
  const navigation = useNavigation<LoginNavProp>();

  const initialValues: FormValues = {
    name: "",
    email: "",
    password: "",
    rePassword: "",
    phone: "",
  };

  const SignUpSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name must be more than 2 characters")
      .required("Name is required")
      .max(20, "Name too long"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be 6 or more characters")
      .required("Password is required"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Re-enter password is required"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Phone must be digits only")
      .min(10, "Phone must be at least 10 digits")
      .required("Phone number is required"),
  });

  async function handleSubmit(values: FormValues, helpers: any) {
    console.log("Sending signup values:", values);

    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      rePassword: values.rePassword,
      phone: values.phone,
    };

    helpers.setSubmitting(true);

    try {
      const response = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
        payload,
        { headers: { "Content-Type": "application/json" }, timeout: 10000 }
      );

      console.log("Signup success:", response.data);
      

      // Toast success
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Account created successfully",
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
      });

      helpers.resetForm();
      navigation.navigate("Login");
      const token = response.data.token
      console.log(token)
    } catch (error: any) {
      console.log("Axios error full:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Response data:", error.response.data);

        const serverData = error.response.data;

        if (error.response.status === 409) {
          const msg = serverData?.message || "Account already exists.";
          helpers.setFieldTouched("email", true);
          helpers.setFieldError("email", msg);

          Toast.show({
            type: "error",
            text1: "Registration failed",
            text2: msg + ". Try logging in or use another email.",
            position: "top",
            visibilityTime: 4000,
            autoHide: true,
          });
        } else if (error.response.status === 400) {
          const msg = serverData?.message || "Invalid data. Please check inputs.";
          Toast.show({
            type: "info",
            text1: "Validation error",
            text2: msg,
            position: "top",
            visibilityTime: 3500,
            autoHide: true,
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Server error",
            text2: "Something went wrong. Try again later.",
            position: "top",
            visibilityTime: 3500,
            autoHide: true,
          });
        }
      } else {
        console.log("Network/other error:", error.message);
        Toast.show({
          type: "error",
          text1: "Network error",
          text2: "Please check your internet connection.",
          position: "top",
          visibilityTime: 3500,
          autoHide: true,
        });
      }
    } finally {
      helpers.setSubmitting(false);
    }
  }

  // useFormik hook
  const Formik = useFormik({
    initialValues,
    validationSchema: SignUpSchema,
    onSubmit: handleSubmit,
  });

  return (
   
    <SafeAreaView style={styles.container}>
       <StatusBar barStyle="light-content" backgroundColor="#000" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ width: "100%" }}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Welcome To Shop.Co</Text>

          <View>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              autoCapitalize="words"
              onChangeText={Formik.handleChange("name")}
              onBlur={() => Formik.handleBlur("name")}
              value={Formik.values.name}
            />
            {Formik.errors.name && Formik.touched.name && (
              <Text style={styles.error}>{Formik.errors.name}</Text>
            )}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={Formik.handleChange("email")}
              onBlur={() => Formik.handleBlur("email")}
              value={Formik.values.email}
            />
            {Formik.errors.email && Formik.touched.email && (
              <Text style={styles.error}>{Formik.errors.email}</Text>
            )}

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              onChangeText={Formik.handleChange("password")}
              onBlur={() => Formik.handleBlur("password")}
              value={Formik.values.password}
            />
            {Formik.errors.password && Formik.touched.password && (
              <Text style={styles.error}>{Formik.errors.password}</Text>
            )}

            <Text style={styles.label}>Re-enter Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter your password"
              secureTextEntry
              onChangeText={Formik.handleChange("rePassword")}
              onBlur={() => Formik.handleBlur("rePassword")}
              value={Formik.values.rePassword}
            />
            {Formik.errors.rePassword && Formik.touched.rePassword && (
              <Text style={styles.error}>{Formik.errors.rePassword}</Text>
            )}

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone"
              keyboardType="phone-pad"
              onChangeText={Formik.handleChange("phone")}
              onBlur={() => Formik.handleBlur("phone")}
              value={Formik.values.phone}
            />
            {Formik.errors.phone && Formik.touched.phone && (
              <Text style={styles.error}>{Formik.errors.phone}</Text>
            )}

            <TouchableOpacity
              onPress={() => Formik.handleSubmit()}
              style={[
                styles.button,
                (Formik.isSubmitting || !Formik.isValid || !Formik.dirty) && { opacity: 0.6 },
              ]}
              disabled={Formik.isSubmitting || !Formik.isValid || !Formik.dirty}
            >
              {Formik.isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.haveAccount}>
              <Text style={styles.haveAccountText}>I Already Have Account </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.haveAccountbtn}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#171616ff",
    padding: 30,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    width: "100%",
    maxWidth: 420,
  },

  title: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
    textAlign: "center",
    fontStyle:"italic"
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 4,
    color: "#fff",
    fontStyle:"italic"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 13,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#4ae282ff",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,

    // Shadow iOS
    shadowColor: "#000000f6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    // Shadow Android
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    fontStyle:"italic"
  },
  haveAccount: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    padding: 5,
  },
  haveAccountText: {
    color: "#fff",
    fontSize: 12,
    fontStyle:"italic"
  },
  haveAccountbtn:{
     textDecorationLine: "underline",
    color: "green",
    fontSize: 16,
    cursor:"pointer"
  }
});
