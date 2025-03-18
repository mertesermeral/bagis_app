import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from "react-native";
import * as SecureStore from "expo-secure-store";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const LoginScreen = ({ navigation, setUserRole }) => {
  const [activeTab, setActiveTab] = useState("donor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedEmail = await SecureStore.getItemAsync("email");
        const savedPassword = await SecureStore.getItemAsync("password");
        const savedRememberMe = await SecureStore.getItemAsync("rememberMe");

        if (savedRememberMe === "true") {
          setEmail(savedEmail || "");
          setPassword(savedPassword || "");
          setRememberMe(true);
        }
      } catch (error) {
        console.log("Veri yüklenirken hata oluştu:", error);
      }
    };

    loadUserData();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen email ve şifre alanlarını doldurun.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().role) {
        const role = docSnap.data().role;

        if (role !== "donor" && role !== "receiver") {
          Alert.alert("Hata", "Geçersiz kullanıcı rolü.");
          return;
        }

        if (role !== activeTab) {
          Alert.alert(
            "Hata",
            `Bu hesap ${role === "donor" ? "Bağışçı" : "Bağış Alan"} rolüne aittir. Lütfen doğru sekmeyi seçin.`
          );
          return;
        }

        // Kullanıcı rolünü App.js'deki state'e atıyoruz.
        setUserRole(role);

        Alert.alert("Başarılı", `${role === "donor" ? "Bağışçı" : "Bağış Alan"} olarak giriş yapıldı!`);

        // Kullanıcı bilgilerini SecureStore içine kaydet
        if (rememberMe) {
          await SecureStore.setItemAsync("email", email);
          await SecureStore.setItemAsync("password", password);
          await SecureStore.setItemAsync("rememberMe", "true");
        } else {
          await SecureStore.deleteItemAsync("email");
          await SecureStore.deleteItemAsync("password");
          await SecureStore.setItemAsync("rememberMe", "false");
        }

        // Kullanıcıyı yönlendir
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs", params: { userRole: role } }],
        });

      } else {
        Alert.alert("Hata", "Kullanıcı Firestore'da bulunamadı veya rol bilgisi eksik.");
      }
    } catch (error) {
      console.error("Giriş sırasında hata oluştu:", error);
      Alert.alert("Hata", error.message);
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register", { role: activeTab });
  };

  const handleForgotPassword = () => {
    Alert.alert("Şifremi Unuttum", "Şifre sıfırlama işlemi başlatıldı.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "donor" && styles.activeTabButton]}
          onPress={() => setActiveTab("donor")}
        >
          <Text style={[styles.tabText, activeTab === "donor" && styles.activeTabText]}>
            Bağışçı Giriş
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "receiver" && styles.activeTabButton]}
          onPress={() => setActiveTab("receiver")}
        >
          <Text style={[styles.tabText, activeTab === "receiver" && styles.activeTabText]}>
            Bağış Alan Giriş
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />
        <Text>Şifre</Text>
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.rememberMeContainer}>
          <Switch value={rememberMe} onValueChange={setRememberMe} />
          <Text style={{ marginLeft: 10 }}>Beni Hatırla</Text>
        </View>

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
    paddingBottom: "20%",
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
    paddingBottom: "5%",
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
