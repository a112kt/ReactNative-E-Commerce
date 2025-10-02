import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Dimensions } from "react-native";
import Swiper from "react-native-swiper";
const { width } = Dimensions.get("window");
const height = Dimensions.get("window").height - 135;
export default function Carousel() {
  return (
 <View style={{ flex: 1, backgroundColor: "#fff" }}>
  <View style={{ height: 250 }}>
    <Swiper
      showsButtons={false}
      autoplay={true}
      loop={true}
      dotStyle={{ backgroundColor: "gray", width: 8, height: 8, borderRadius: 4 }}
      activeDotStyle={{ backgroundColor: "#000", width: 10, height: 10, borderRadius: 5,marginBottom:10 }}
    >
      {[
        require("../assests/imgs/Dress.png"),
        require("../assests/imgs/Whatch.png"),
        require("../assests/imgs/1.jpg"),
        require("../assests/imgs/7.jpg"),
        require("../assests/imgs/3.jpg"),
        require("../assests/imgs/5.jpg"),
        require("../assests/imgs/2.jpg"),
      ].map((img, index) => (
        <View
          key={index}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={img}
            resizeMode="contain"
            style={{
              width: "90%",  
              height: 200,   
            }}
          />
        </View>
      ))}
    </Swiper>
  </View>
</View>



  );
}

const styles = StyleSheet.create({});
