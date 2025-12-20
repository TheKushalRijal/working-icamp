import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DOC_TYPES } from "./mockDocuments";

const ICONS = [
  { type: DOC_TYPES.IMG, icon: "file-image" },
  { type: DOC_TYPES.ALL, icon: "apps" },
  { type: DOC_TYPES.PDF, icon: "file-pdf-box" },
  { type: DOC_TYPES.DOC, icon: "file-word-box" },
  { type: DOC_TYPES.XLS, icon: "file-excel-box" },
];

export default function TopIconBar({ selectedType, onSelectType, onAdd }) {
  return (
    <View style={styles.bar}>
      {/* Left icons group */}
      <View style={styles.iconGroup}>
        {ICONS.map((item) => {
          const active = selectedType === item.type;
          return (
            <TouchableOpacity
              key={item.type}
              onPress={() => onSelectType(item.type)}
              style={[styles.iconBtn, active && styles.iconBtnActive]}
              activeOpacity={0.8}
            >
              <Icon
                name={item.icon}
                size={28}
                color={active ? "#111" : "#666"}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Right + button */}
      <TouchableOpacity
        style={styles.addBtn}
        activeOpacity={0.8}
        onPress={onAdd}
      >
        <Icon name="plus" size={26} color="#111" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 38,
    backgroundColor: "#bdbdbd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  iconBtnActive: {
    backgroundColor: "rgba(255,255,255,0.45)",
  },

  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
});
