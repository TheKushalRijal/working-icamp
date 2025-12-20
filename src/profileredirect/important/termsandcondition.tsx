import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Switch, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TermsAndPrivacy = () => {
  const [agreed, setAgreed] = useState(true); // Default agreement

  // Load agreement from AsyncStorage (optional)
 

  

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView style={{ flex: 1, marginBottom: 20 }}>
        {/* Terms & Privacy Title */}
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 15 }}>
          Icamp Privacy Policy & Terms and Conditions
        </Text>

        {/* Privacy Policy */}
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Privacy Policy
        </Text>
        <Text style={{ marginBottom: 10 }}>
          1. Purpose of Icamp: Icamp is a resourceful application designed to support international students in the United States. Its sole purpose is to provide guidance, information, and resources to help students thrive.
        </Text>
        <Text style={{ marginBottom: 10 }}>
          2. Data Collection: Icamp does not collect any personal data from its users. All information provided is for reference only.
        </Text>
        <Text style={{ marginBottom: 10 }}>
          3. Accuracy: While we strive to provide accurate and useful information, some content may not always be up to date.
        </Text>
        <Text style={{ marginBottom: 10 }}>
          4. Third-Party Links: We are not responsible for the content, privacy practices, or reliability of any external sites linked from the app.
        </Text>
        <Text style={{ marginBottom: 10 }}>
          5. Liability: Icamp is provided “as is” and we are not responsible for any harm or inconvenience arising from its use.
        </Text>
        <Text style={{ marginBottom: 10 }}>
          6. Misuse: Any misuse, illegal or malicious activity may be reported to the authorities.
        </Text>

        {/* Terms and Conditions */}
        <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>
          Terms and Conditions
        </Text>
        <Text style={{ marginBottom: 10 }}>
          1. Acceptance: By using Icamp, you agree to comply with these Terms and Conditions.
        </Text>
        <Text style={{ marginBottom: 10 }}>
          2. Purpose: Icamp is intended solely as a supportive tool for international students. It is not a substitute for official guidance or legal advice.
        </Text>
        <Text style={{ marginBottom: 10 }}>
          3. No Personal Data: We do not collect or store personal information.
        </Text>
        <Text style={{ marginBottom: 10 }}>
          4. Accuracy and Reliability: Information is for reference only. We are not responsible for errors or outdated content.
        </Text>
        <Text style={{ marginBottom: 10 }}>
          5. Limitation of Liability: We are not liable for any direct or indirect damages arising from the use of this application.
        </Text>
        <Text style={{ marginBottom: 10 }}>
          6. User Conduct: Users must use the app responsibly. Misuse may be reported to authorities.
        </Text>
        <Text style={{ marginBottom: 10 }}>
          7. Intellectual Property: All content is owned by Icamp. Unauthorized use for commercial purposes is prohibited.
        </Text>
        <Text style={{ marginBottom: 10 }}>
          8. Changes: Terms and Privacy Policy may be updated at any time. Continued use implies acceptance.
        </Text>
      </ScrollView>

      {/* Agreement Switch */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Switch value={agreed} onValueChange={setAgreed} />
        <Text style={{ marginLeft: 10 }}>I agree to the Terms & Privacy Policy</Text>
      </View>

    </View>
  );
};

export default TermsAndPrivacy;
