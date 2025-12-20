import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DOC_TYPES } from "./mockDocuments";

export default function DocumentPreview({ doc, onClose }) {
  const label = useMemo(() => {
    if (!doc) return "No document selected";
    return `${doc.title} • ${doc.type.toUpperCase()}`;
  }, [doc]);

  if (!doc) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No documents to show</Text>
      </View>
    );
  }

  // For images: show actual preview
  if (doc.type === DOC_TYPES.IMG && doc.uri) {
    return (
        
      <View style={styles.previewWrap}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{label}</Text>
        </View>
<View style={styles.closeButton}>
  <Text style={styles.closeText} onPress={onClose}>✕</Text>
</View>

        <View style={styles.body}>
          <Image
            source={{ uri: doc.uri }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }

  // For PDF/DOC/XLS: placeholder preview (safe, bug-free)
  return (
    <View style={styles.previewWrap}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{label}</Text>
      </View>

      <View style={styles.center}>
        <Icon name="file" size={54} color="#444" />
        <Text style={styles.subText}>
          Preview placeholder (hook up a renderer later)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  previewWrap: { flex: 1 },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
closeButton: {
  position: "absolute",
  top: 40,
  right: 20,
  zIndex: 10,
  backgroundColor: "rgba(0,0,0,0.6)",
  width: 36,
  height: 36,
  borderRadius: 18,
  alignItems: "center",
  justifyContent: "center",
},

closeText: {
  color: "#fff",
  fontSize: 20,
  fontWeight: "600",
},





  title: { fontSize: 14, color: "#111", fontWeight: "600" },
  body: { flex: 1, padding: 10 },

  image: { width: "100%", height: "100%" },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  emptyText: { color: "#444" },
  subText: { marginTop: 8, color: "#555", textAlign: "center" },
});
