import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DOC_TYPES } from "./mockDocuments";




function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function DocumentCard({ doc, active, onPress }) {
  const aspect = useMemo(() => {
    const w = Number(doc?.meta?.width || 0);
    const h = Number(doc?.meta?.height || 0);
    if (w > 0 && h > 0) return w / h;
    return 1; // fallback
  }, [doc]);

  // Height derived from aspect ratio, bounded so UI stays clean
  const dynamicHeight = useMemo(() => {
    // base width is "card width-ish"; we approximate with 320 for stable height math
    const baseWidth = 320;
    const raw = baseWidth / (aspect || 1);
    return clamp(raw, 90, 170);
  }, [aspect]);

  const leftIcon = useMemo(() => {
    const t = doc?.type;
    if (t === DOC_TYPES.PDF) return "file-pdf-box";
    if (t === DOC_TYPES.DOC) return "file-word-box";
    if (t === DOC_TYPES.XLS) return "file-excel-box";
    if (t === DOC_TYPES.IMG) return "file-image";
    return "file";
  }, [doc]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, active && styles.cardActive]}
    >
      <View style={styles.row}>
        <Icon name={leftIcon} size={22} color={active ? "#111" : "#555"} />
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>
            {doc?.title || "Untitled"}
          </Text>
         
        </View>
      </View>

      <View style={[styles.preview, { height: dynamicHeight }]}>
        {doc?.type === DOC_TYPES.IMG && doc?.uri ? (
          <Image source={{ uri: doc.uri }} style={styles.img} resizeMode="cover" />
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
    borderWidth:1,
    borderColor: "#d0d0d0",
    borderRadius: 20,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  cardActive: {
    borderColor: "#222",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  meta: { flex: 1 },
  title: { fontSize: 14, fontWeight: "600", color: "#111" },
  subtitle: { marginTop: 2, fontSize: 12, color: "#555" },

  preview: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fafafa",
  },
  img: { width: "100%", height: "100%" },

  filePreview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  filePreviewText: { fontSize: 12, color: "#666" },
});
