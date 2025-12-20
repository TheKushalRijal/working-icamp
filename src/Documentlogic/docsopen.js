import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";

export default function DocumentPreview({ doc }) {
  if (!doc) return null;

  if (doc.type === "img") {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: doc.uri }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={styles.placeholder}>
      <Text>Preview not supported yet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  image: { width: "100%", height: "100%" },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
