import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tcNo, setTcNo] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 0) {
      formatted = `(${cleaned.slice(0, 3)}`;
      if (cleaned.length > 3) {
        formatted += `) ${cleaned.slice(3, 6)}`;
      }
      if (cleaned.length > 6) {
        formatted += ` ${cleaned.slice(6, 8)}`;
      }
      if (cleaned.length > 8) {
        formatted += ` ${cleaned.slice(8, 10)}`;
      }
    }
    return formatted;
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };

  const handleRegister = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!firstName || !lastName || !email || !phone || !tcNo || !birthYear || !password || !confirmPassword || !role) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun ve bir rol seçin.");
      setIsSubmitting(false);
      return;
    }
    
    if (password.length < 6) {
      Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır.");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor!");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://us-central1-bagis-app.cloudfunctions.net/api/validate-tc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tcNo,
          firstName,
          lastName,
          birthYear,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        Alert.alert("Kimlik Doğrulama Başarısız", "Girdiğiniz bilgiler doğrulanamadı.");
        setIsSubmitting(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        phone,
        tcNo,
        birthYear,
        role,
        photoURL: 'https://via.placeholder.com/100'
      });

      Alert.alert("Başarılı", "Kayıt işlemi tamamlandı!");
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }]
      });
    } catch (error) {
      Alert.alert("Hata", "Kayıt sırasında bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Image 
            source={require("./assets/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>Fonity</Text>
          <Text style={styles.logoSubText}>Hesap Oluştur</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>TC Kimlik Numarası</Text>
          <TextInput style={styles.input} value={tcNo} onChangeText={setTcNo} keyboardType="numeric" maxLength={11} />
          
          <Text style={styles.label}>Ad</Text>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
          
          <Text style={styles.label}>Soyad</Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
          
          <Text style={styles.label}>Doğum Yılı</Text>
          <TextInput style={styles.input} value={birthYear} onChangeText={setBirthYear} keyboardType="numeric" maxLength={4} />
          
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          
          <Text style={styles.label}>Telefon</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={handlePhoneChange}
            placeholder="(5XX) XXX XX XX"
            keyboardType="phone-pad"
          />
          
          <Text style={styles.label}>Rol Seçiniz</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleButton, role === "donor" && styles.activeRoleButton]}
              onPress={() => setRole("donor")}
            >
              <Text style={[styles.roleButtonText, role === "donor" && styles.activeRoleButtonText]}>Bağışçı</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === "receiver" && styles.activeRoleButton]}
              onPress={() => setRole("receiver")}
            >
              <Text style={[styles.roleButtonText, role === "receiver" && styles.activeRoleButtonText]}>Bağış Alan</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.label}>Parola</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry={true} />
          
          <Text style={styles.label}>Parola Tekrar</Text>
          <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={true} />
          
          <TouchableOpacity 
            style={[styles.registerButton, isSubmitting && styles.disabledButton]}
            onPress={handleRegister}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Kayıt Ol</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#65558F',
    marginBottom: 4,
  },
  logoSubText: {
    fontSize: 14,
    color: '#666',
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
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  roleButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
  },
  roleButtonText: {
    color: "black",
    fontSize: 16,
  },
  activeRoleButton: {
    backgroundColor: "#2c2c2c",
  },
  activeRoleButtonText: {
    color: "white",
  },
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#2c2c2c",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
