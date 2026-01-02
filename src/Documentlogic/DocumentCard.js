import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DOC_TYPES } from "./mockDocuments";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function DocumentCard({ doc, active, onPress }) {
  const insets = useSafeAreaInsets();

  // Image aspect ratio
  const aspect = useMemo(() => {
    const w = Number(doc?.meta?.width || 0);
    const h = Number(doc?.meta?.height || 0);
    return w > 0 && h > 0 ? w / h : 1;
  }, [doc]);

  // Dynamic preview height
  const dynamicHeight = useMemo(() => {
    const baseWidth = 320;
    const raw = baseWidth / aspect;
    return clamp(raw, 90, 170);
  }, [aspect]);
console.log("CARD DOC:", { type: doc?.type, IMG: DOC_TYPES.IMG, uri: doc?.uri });

  // Icon based on document type
  const leftIcon = useMemo(() => {
    switch (doc?.type) {
      case DOC_TYPES.PDF:
        return "file-pdf-box";
      case DOC_TYPES.DOC:
        return "file-word-box";
      case DOC_TYPES.XLS:
        return "file-excel-box";
      case DOC_TYPES.IMG:
        return "file-image";
      default:
        return "file";
    }
    
  }, [doc]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.card,
        active && styles.cardActive,
        // ✅ FIX: extra bottom space so last card is fully visible
      ]}
    >
      {/* Header */}
      <View style={styles.row}>
        <Icon name={leftIcon} size={22} color={active ? "#111" : "#555"} />
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>
            {doc?.title || "Untitled"}
          </Text>
        </View>
      </View>

      {/* Preview */}
      <View style={[styles.preview, { height: dynamicHeight }]}>
  {doc?.type === DOC_TYPES.IMG && doc?.uri ? (
    <Image
      source={{ uri: doc.uri }}
      style={styles.img}
      resizeMode="cover"
    />
  ) : (
    <View style={styles.filePreview}>
      <Icon name="file-outline" size={34} color="#666" />
      <Text style={styles.filePreviewText}>Preview</Text>
    </View>
  )}
</View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",

    // consistent spacing between cards
    marginBottom: 12,
  },

  cardActive: {
    borderColor: "#222",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  meta: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },

  preview: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fafafa",

    // ensure children fill exactly
    overflow: "hidden",
  },

  img: {
    width: "100%",
    height: "100%",
  },

  filePreview: {
    width: "100%",
    height: "100%",

    alignItems: "center",
    justifyContent: "center",
  },

  filePreviewText: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
  },
});

