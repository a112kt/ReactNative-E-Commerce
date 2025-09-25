import { StyleSheet, Text, View } from "react-native";
import { ImageBackground } from "expo-image";
import React, { useEffect, useState } from "react";
import axios from "axios";
export type Category = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export default function Announcement() {
  const [cats, setCats] = useState<Category[]>([]);

  function getCategories() {
    axios
      .get("https://ecommerce.routemisr.com/api/v1/categories")
      .then((res) => {
        setCats(res.data.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }
  useEffect(() => {
    getCategories();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, fontWeight: 900 }}>
        {"Browse \n By \n Wide \n Categories".toUpperCase()}
      </Text>
      {cats.map((C) => (
        <ImageBackground
          source={{
            uri: C.image,
          }}
          key={C._id}
          style={{
            height: 300,
            marginVertical: 7,
            boxShadow: "0px 2px 3px #4ae28293",
            borderRadius: 10,
            overflow: "hidden",
            borderWidth: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "#00000053",
            }}
          ></View>
          <Text style={styles.title}>{C.name}</Text>
        </ImageBackground>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    minHeight: 400,
    width: "80%",
    alignSelf: "center",
    padding: 30,
    marginBottom:20
  },
  title: {
    fontSize: 25,
    fontWeight: 800,
    color:"white",
    margin:20
  },
});
