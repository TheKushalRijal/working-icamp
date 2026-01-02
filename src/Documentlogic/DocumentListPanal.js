import React, { useMemo } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DocumentCard from "./DocumentCard";

export default function DocumentListPanel({
  docs,
  selectedDocId,
  onSelectDoc,
}) {
  const insets = useSafeAreaInsets();

  const data = useMemo(
    () => (Array.isArray(docs) ? docs : []),
    [docs]
  );

  if (!data.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          No documents found for this type.
        </Text>
      </View>
    );
  }

  return (
   <FlatList
  data={data}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <DocumentCard
      doc={item}
      active={item.id === selectedDocId}
      onPress={() => onSelectDoc(item)}
    />
  )}
  contentContainerStyle={[
    styles.listContent,
    { paddingBottom: insets.bottom + 24 },
  ]}
  removeClippedSubviews={false}   // ✅ THIS FIXES HALF-CUT LAST ITEM
/>

  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 12,
    gap: 12,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    
  },
  emptyText: {
    color: "#444",
        bottommargin: 160,

  },
});
