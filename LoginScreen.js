import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState("donor"); // "donor" or "receiver"

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const handleLogin = () => {
    Alert.alert("Giriş Yap", "Giriş işlemi gerçekleştirildi!");
  };

  const handleForgotPassword = () => {
    Alert.alert("Şifremi Unuttum", "Şifre sıfırlama işlemi başlatıldı.");
  };

  const handleRegister = () => {
    Alert.alert("Kayıt Ol", "Kayıt ekranına yönlendiriliyorsunuz.");
    
  };

  return (
    <View style={styles.container}>
      {/* Top Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "donor" && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress("donor")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "donor" && styles.activeTabText,
            ]}
          >
            Bağışçı Giriş
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "receiver" && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress("receiver")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "receiver" && styles.activeTabText,
            ]}
          >
            Bağış Alan Giriş
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text>Email</Text>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#ccc" />
        <Text>Şifre</Text>
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#ccc"
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.linkText}>Şifremi Unuttum</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    paddingBottom:"20%",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: "#2C2C2C",
  },
  tabText: {
    color: "#000",
    fontSize: 14,
  },
  activeTabText: {
    color: "#fff",
    fontSize: 14,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    paddingBottom: "30%",
    
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#2C2C2C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: "black",
    textAlign: "left",
    marginVertical: 10,
    textDecorationLine: "underline",
  },
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#2C2C2C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;