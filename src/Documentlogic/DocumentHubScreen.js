import React, { useMemo, useState, useCallback } from "react";
import { SafeAreaView, View, StyleSheet, Text } from "react-native";

import TopIconBar from "./TopIconBar";
import DocumentPreview from "./DocumentPreview";

import DocumentListPanel from "./DocumentListPanal";
import { MOCK_DOCUMENTS,DOC_TYPES } from "./mockDocuments";
import TopNav from "../components/navigation/TopNav";
import UploadCanvas from "./docsupload";


export default function DocumentHubScreen() {
  const [selectedType, setSelectedType] = useState(DOC_TYPES.IMG);
const [selectedDocId, setSelectedDocId] = useState(null);
const [showUpload, setShowUpload] = useState(false);


  const filteredDocs = useMemo(() => {
    if (selectedType === DOC_TYPES.ALL) return MOCK_DOCUMENTS;
    return MOCK_DOCUMENTS.filter((d) => d.type === selectedType);
  }, [selectedType]);

const selectedDoc = useMemo(() => {
  if (!selectedDocId) return null;
  return filteredDocs.find((d) => d.id === selectedDocId) || null;
}, [filteredDocs, selectedDocId]);


  // If filter changes and selected doc is not in the filtered list, auto-fix selection


  const handleSelectType = useCallback((type) => {
    setSelectedType(type);
  }, []);




  
  const handleSelectDoc = useCallback((doc) => {
    if (!doc || !doc.id) return;
    setSelectedDocId(doc.id);
  }, []);




  return (
   <SafeAreaView style={styles.safe}>
  {selectedDoc ? (
    // FULL SCREEN VIEWER
<DocumentPreview
  doc={selectedDoc}
  onClose={() => setSelectedDocId(null)}
/>
  ) : (
    // LIST SCREEN
    <View style={styles.container}>
      <TopNav />
      <TopIconBar
  selectedType={selectedType}
  onSelectType={handleSelectType}
  onAdd={() => setShowUpload(true)}
/>


      <View style={styles.listBox}>
        <View style={styles.listContent}>
          <DocumentListPanel
            docs={filteredDocs}
            selectedDocId={selectedDocId}
            onSelectDoc={handleSelectDoc}
          />
        </View>
      </View>
    </View>
  )}

 <UploadCanvas
      visible={showUpload}
      onClose={() => setShowUpload(false)}
    />


</SafeAreaView>

  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1 },

  topNavPlaceholder: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
  },
  topNavText: {
    fontSize: 15,
    color: "#111",
  },


});
