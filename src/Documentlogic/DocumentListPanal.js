import React, { useMemo } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import DocumentCard from "./DocumentCard";

export default function DocumentListPanel({ docs, selectedDocId, onSelectDoc }) {
  const data = useMemo(() => (Array.isArray(docs) ? docs : []), [docs]);

  if (!data.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No documents found for this type.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <DocumentCard
          doc={item}
          active={item.id === selectedDocId}
          onPress={() => onSelectDoc(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: { padding: 3, gap:10 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#444" },
});
