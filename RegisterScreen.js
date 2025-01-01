import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const RegisterScreen = () => {
  const handleRegister = () => {
    Alert.alert("Kayıt Ol", "Kayıt işlemi başarıyla tamamlandı!");
  };

  const handleGoToLogin = () => {
    Alert.alert("Giriş Yap", "Giriş ekranına yönlendiriliyorsunuz.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Ad</Text>
        <TextInput
          style={styles.input}
          placeholder="Zorunlu Alan*"
          placeholderTextColor="#ccc"
        />

        <Text style={styles.label}>Soyad</Text>
        <TextInput
          style={styles.input}
          placeholder="Zorunlu Alan*"
          placeholderTextColor="#ccc"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Zorunlu Alan*"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Parola</Text>
        <TextInput
          style={styles.input}
          placeholder="Zorunlu Alan*"
          placeholderTextColor="#ccc"
          secureTextEntry={true}
        />

        <Text style={styles.label}>Parola Tekrar Giriniz</Text>
        <TextInput
          style={styles.input}
          placeholder="Zorunlu Alan*"
          placeholderTextColor="#ccc"
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Kayıt Ol</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleGoToLogin}>
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
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
    backgroundColor: "#000",
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
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
