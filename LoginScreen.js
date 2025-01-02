import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const LoginScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("donor"); // "donor" or "receiver"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen email ve şifre alanlarını doldurun.");
      return;
    }

    try {
      // Kullanıcı giriş yapıyor
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Kullanıcının Firestore'daki rolünü alıyoruz
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const role = userData.role; // Kullanıcının Firestore'daki rolü

        // Seçili tab ile Firestore'dan alınan rolü karşılaştır
        if (role !== activeTab) {
          Alert.alert(
            "Hata",
            `Bu hesap ${role === "donor" ? "Bağışçı" : "Bağış Alan"} rolüne aittir. Lütfen doğru sekmeyi seçin.`
          );
          return;
        }

        Alert.alert("Başarılı", `${role === "donor" ? "Bağışçı" : "Bağış Alan"} olarak giriş yapıldı!`);

        // Rol bilgisine göre yönlendirme
        if (role === "donor") {
          navigation.navigate("BagisciAnaMenu"); // Bağışçı ana sayfası
        } else if (role === "receiver") {
          navigation.navigate("BagisAlanAnaMenu"); // Bağış alan ana sayfası
        }
      } else {
        Alert.alert("Hata", "Kullanıcı bilgileri Firestore'da bulunamadı.");
      }
    } catch (error) {
      console.error("Giriş sırasında hata oluştu:", error);
      Alert.alert("Hata", error.message);
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register", { role: activeTab }); // Seçili rolü Register ekranına gönder
  };

  const handleForgotPassword = () => {
    Alert.alert("Şifremi Unuttum", "Şifre sıfırlama işlemi başlatıldı.");
  };

  return (
    <View style={styles.container}>
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
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
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
