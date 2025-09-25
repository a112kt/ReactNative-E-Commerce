import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Dimensions } from "react-native";
import Swiper from "react-native-swiper";
const { width } = Dimensions.get("window");
const height = Dimensions.get("window").height - 135;
export default function Carousel() {
  return (
    <Swiper
      style={{ height }}
      showsButtons={true} 
      autoplay={true} 
      loop={true} 
      dotStyle={{ backgroundColor: "gray" }}
      activeDotStyle={{ backgroundColor: "#4ae282ce" }}
      nextButton={<Text style={{ color: "#4ae282ce", fontSize: 50 }}>›</Text>}
      prevButton={<Text style={{ color: "#4ae282ce", fontSize: 50 }}>‹</Text>}
    >
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../assests/4.jpg")}
          resizeMode="cover"
          style={{ width, height }}
        />
      </View>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../assests/6.jpg")}
          // style={{ height: 500, width: 600 }}
          resizeMode="cover"
          style={{ width, height }}
        />
      </View>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../assests/1.jpg")}
          // style={{ height: 500, width: 600 }}
          resizeMode="cover"
          style={{ width, height }}
        />
      </View>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../assests/7.jpg")}
          // style={{ height: 500, width: 600 }}
          resizeMode="cover"
          style={{ width, height }}
        />
      </View>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../assests/3.jpg")}
          // style={{ height: 500, width: 600 }}
          resizeMode="cover"
          style={{ width, height }}
        />
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../assests/5.jpg")}
          // style={{ height: 500, width: 600 }}
          resizeMode="cover"
          style={{ width, height }}
        />
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../assests/2.jpg")}
          // style={{ height: 500, width: 600 }}
          resizeMode="cover"
          style={{ width, height }}
        />
      </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({});
