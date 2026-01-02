import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  PermissionsAndroid,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { launchImageLibrary } from "react-native-image-picker";
import RNFS from "react-native-fs";
import { TextInput } from "react-native";
import { Image } from "react-native";
import { DOC_TYPES } from "./mockDocuments";

export default function UploadCanvas({ visible, onClose, onUpload }) {
  const [pendingAsset, setPendingAsset] = React.useState(null);
const [nameCanvasVisible, setNameCanvasVisible] = React.useState(false);
const [documentName, setDocumentName] = React.useState("");
  // --- Permission handling (Android only)
  const requestImagePermission = async () => {
  if (Platform.OS !== "android") return true;

  if (Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
};


  // --- Save picked file into app private storage
const saveFileLocally = async (asset) => {
  const extension = asset.type?.split("/")[1] || "jpg";
  const fileName = asset.fileName || `doc_${Date.now()}.${extension}`;

  const targetDir = `${RNFS.DocumentDirectoryPath}/documents`;
  const targetPath = `${targetDir}/${fileName}`;

  if (!(await RNFS.exists(targetDir))) {
    await RNFS.mkdir(targetDir);
  }

  const sourcePath =
    asset.uri.startsWith("content://")
      ? (await RNFS.stat(asset.uri)).path
      : asset.uri.replace("file://", "");

  await RNFS.copyFile(sourcePath, targetPath);

  return `file://${targetPath}`;
};



  // --- Pick image + process
const handlePickImage = async () => {
  const result = await launchImageLibrary({
    mediaType: "photo",
    selectionLimit: 1,
    quality: 1,
  });

  if (result.didCancel || result.errorCode) return;

  const asset = result.assets?.[0];
  if (!asset) return;

setPendingAsset(asset);
setDocumentName("");
setNameCanvasVisible(true);


};



const handleConfirmName = async () => {
  try {
    const localUri = await saveFileLocally(pendingAsset);

    if (!localUri) {
      Alert.alert("Upload failed", "Could not save image");
      return;
    }

    const document = {
      id: Date.now().toString(),
      type: DOC_TYPES.IMG,
      title: documentName,
      uri: localUri,
      mimeType: pendingAsset.type,
      size: pendingAsset.fileSize,
      createdAt: Date.now(),
    };

    onUpload(document);

    // cleanup
    setPendingAsset(null);
    setNameCanvasVisible(false);
    onClose();
  } catch (err) {
    Alert.alert("Error", "Failed to save image");
    console.error(err);
  }
};



  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Upload Document</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={22} color="#111" />
            </TouchableOpacity>
          </View>

          {/* Upload Image */}
          <TouchableOpacity style={styles.option} onPress={handlePickImage}>
            <Icon name="image" size={22} color="#444" />
            <Text style={styles.optionText}>Upload Image</Text>
          </TouchableOpacity>

          {/* Disabled placeholders */}
          <TouchableOpacity style={styles.option} disabled>
            <Icon name="file-pdf-box" size={22} color="#aaa" />
            <Text style={[styles.optionText, styles.disabled]}>
              Upload PDF (coming soon)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} disabled>
            <Icon name="file-document" size={22} color="#aaa" />
            <Text style={[styles.optionText, styles.disabled]}>
              Upload Document (coming soon)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} disabled>
            <Icon name="file-excel-box" size={22} color="#aaa" />
            <Text style={[styles.optionText, styles.disabled]}>
              Upload Excel (coming soon)
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <TouchableOpacity onPress={onClose} style={styles.cancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

<Modal visible={nameCanvasVisible} transparent animationType="slide">
  <View style={styles.overlay}>
    <View style={styles.nameSheet}>
      <Text style={styles.nameTitle}>Name this image</Text>

      {/* Image preview */}
      {pendingAsset?.uri && (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: pendingAsset.uri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Name input */}
      <TextInput
        placeholder="Enter image name"
        value={documentName}
        onChangeText={setDocumentName}
        style={styles.nameInput}
        autoFocus
      />

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={() => setNameCanvasVisible(false)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleConfirmName}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>




        </View>
      </View>
    </Modal>



  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 34,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  optionText: {
    fontSize: 15,
    color: "#111",
  },
  disabled: {
    color: "#aaa",
  },
  cancel: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#007AFF",
    fontSize: 15,
    fontWeight: "500",
  },

nameSheet: {
  backgroundColor: "#fff",
  padding: 16,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
},

nameTitle: {
  fontSize: 16,
  fontWeight: "600",
  marginBottom: 12,
  color: "#111",
},

previewContainer: {
  height: 160,
  borderRadius: 12,
  overflow: "hidden",
  backgroundColor: "#f2f2f2",
  marginBottom: 12,
},

previewImage: {
  width: "100%",
  height: "100%",
},

nameInput: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 10,
  fontSize: 15,
  marginBottom: 16,
},

actionRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

saveText: {
  color: "#007AFF",
  fontSize: 15,
  fontWeight: "600",
},




});
