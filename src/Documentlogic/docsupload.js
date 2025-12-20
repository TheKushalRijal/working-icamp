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

export default function UploadCanvas({ visible, onClose, onUpload }) {
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

  // IMPORTANT: handle content:// URIs
  const sourcePath =
    asset.uri.startsWith("content://")
      ? await RNFS.stat(asset.uri).then(stat => stat.path)
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

  if (result.didCancel) return;

  if (result.errorCode) {
    Alert.alert("Error", result.errorMessage || "Failed to pick image");
    return;
  }

  const asset = result.assets?.[0];
  if (!asset) return;

  try {
    const localUri = await saveFileLocally(asset);

    const document = {
      id: Date.now().toString(),
      type: "img",
      title: asset.fileName || "Uploaded Image",
      localUri,
      mimeType: asset.type,
      size: asset.fileSize,
      status: "local",
      createdAt: Date.now(),
    };


    const onsuccessselected = (document) => {

    }



    onUpload?.(document);
    onClose();
  } catch (err) {
    Alert.alert("Error", "Failed to save file locally");
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
    paddingBottom: 24,
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
});
