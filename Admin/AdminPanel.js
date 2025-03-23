import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AdminPanel = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Paneli</Text>
      <Text style={styles.subtext}>Buradan tüm başvuruları görüntüleyebilir, düzenleyebilir ya da silebilirsiniz.</Text>
      {/* İleride: Başvuru listesi, filtreler vs. eklenecek */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtext: {
    fontSize: 16,
    color: "#555",
  },
});

export default AdminPanel;
