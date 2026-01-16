import React from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const TermsAndPrivacy = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Terms & Privacy</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          Icamp Privacy Policy & Terms and Conditions
        </Text>

        <Text style={styles.sectionTitle}>Privacy Policy</Text>

        <Text style={styles.text}>
          1. Purpose of Icamp: Icamp is a resourceful application designed to
          support international students in the United States.
        </Text>
        <Text style={styles.text}>
          2. Data Collection: Icamp does not collect personal data from users.
        </Text>
        <Text style={styles.text}>
          3. Accuracy: Content may not always be up to date.
        </Text>
        <Text style={styles.text}>
          4. Third-Party Links: We are not responsible for external sites.
        </Text>
        <Text style={styles.text}>
          5. Liability: Icamp is provided “as is”.
        </Text>
        <Text style={styles.text}>
          6. Misuse: Illegal or malicious use may be reported.
        </Text>

        <Text style={styles.sectionTitle}>Terms and Conditions</Text>

        <Text style={styles.text}>
          1. Acceptance: By using Icamp, you agree to these terms.
        </Text>
        <Text style={styles.text}>
          2. Purpose: This app is not a substitute for official advice.
        </Text>
        <Text style={styles.text}>
          3. No Personal Data: We do not store personal information.
        </Text>
        <Text style={styles.text}>
          4. Liability: We are not responsible for damages.
        </Text>
        <Text style={styles.text}>
          5. User Conduct: Misuse may be reported.
        </Text>
        <Text style={styles.text}>
          6. Intellectual Property: Content belongs to Icamp.
        </Text>
        <Text style={styles.text}>
          7. Changes: Continued use implies acceptance of updates.
        </Text>
      </ScrollView>

      {/* Locked Agreement */}
      <View style={styles.agreement}>
        <Switch value={true} disabled />
        <Text style={styles.agreementText}>
          You have agreed to the Terms & Privacy Policy
        </Text>
      </View>
    </View>
  );
};

export default TermsAndPrivacy;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeText: {
    color: "#007AFF",
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    color: "#333",
  },
  agreement: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
  },
  agreementText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#555",
  },
});
