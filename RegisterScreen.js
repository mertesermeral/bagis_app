import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const RegisterScreen = ({ route, navigation }) => {
  const role = route?.params?.role || "donor"; // Varsayılan değer olarak 'donor' kullan
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor!");
      return;
    }

    try {
      const auth = getAuth();
      const db = getFirestore();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Kullanıcı bilgilerini Firestore'a kaydet
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        role, // Login ekranından gelen rol (donor veya receiver)
      });

      Alert.alert("Başarılı", "Kayıt işlemi tamamlandı!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Ad</Text>
        <TextInput
          style={styles.input}
          placeholder="Ad"
          placeholderTextColor="#ccc"
          value={firstName}
          onChangeText={setFirstName}
        />
        <Text style={styles.label}>Soyad</Text>
        <TextInput
          style={styles.input}
          placeholder="Soyad"
          placeholderTextColor="#ccc"
          value={lastName}
          onChangeText={setLastName}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Parola</Text>
        <TextInput
          style={styles.input}
          placeholder="Parola"
          placeholderTextColor="#ccc"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.label}>Parola Tekrar Giriniz</Text>
        <TextInput
          style={styles.input}
          placeholder="Parola Tekrar Giriniz"
          placeholderTextColor="#ccc"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
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
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#000",
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
    backgroundColor: "#fff",
  },
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#2c2c2c",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
