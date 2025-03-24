import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const defaultProfileImage = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';

const EtkinliklerDetay = ({ route, navigation }) => {
  if (!route || !route.params || !route.params.event) {
    return <Text>Hata: Etkinlik bilgisi bulunamadı.</Text>;
  }

  const { event } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editedText, setEditedText] = useState('');
  const userId = auth.currentUser?.uid;

  const fetchUserProfileImage = async (userId) => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, `profileImages/${userId}/profile.jpg`);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      return defaultProfileImage;
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      const q = query(collection(db, 'comments'), where('eventId', '==', event.id));
      const querySnapshot = await getDocs(q);

      const commentList = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
        const commentData = docSnap.data();
        const userDocRef = doc(db, 'users', commentData.userId);
        const userDoc = await getDoc(userDocRef);

        const userData = userDoc.exists() 
          ? userDoc.data() 
          : { firstName: 'Bilinmeyen', lastName: 'Kullanıcı' };

        const profileImage = await fetchUserProfileImage(commentData.userId);

        return {
          id: docSnap.id,
          ...commentData,
          userName: `${userData.firstName} ${userData.lastName}`,
          userProfileImage: profileImage,
        };
      }));

      setComments(commentList);
    };

    fetchComments();
  }, [event.id]);

  const addComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Hata', 'Lütfen bir yorum giriniz.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.exists() 
        ? userDoc.data() 
        : { firstName: 'Bilinmeyen', lastName: 'Kullanıcı' };

      const profileImage = await fetchUserProfileImage(userId);

      const docRef = await addDoc(collection(db, 'comments'), {
        eventId: event.id,
        userId,
        text: newComment,
        createdAt: new Date(),
      });

      setComments([
        ...comments,
        { 
          id: docRef.id, 
          userId, 
          text: newComment, 
          userName: `${userData.firstName} ${userData.lastName}`,
          userProfileImage: profileImage,
        }
      ]);

      setNewComment('');
      Keyboard.dismiss(); // Klavyeyi kapat
    } catch (error) {
      Alert.alert('Hata', 'Yorum eklenirken hata oluştu.');
    }
  };

  const deleteComment = async (commentId, commentUserId) => {
    if (commentUserId !== userId && event.organizerId !== userId) {
      Alert.alert('Yetkisiz', 'Bu yorumu sadece yazan kişi veya etkinlik sahibi silebilir.');
      return;
    }
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      Alert.alert('Hata', 'Yorum silinirken hata oluştu.');
    }
  };

  const startEditing = (comment) => {
    setEditingComment(comment.id);
    setEditedText(comment.text);
  };

  const saveEditedComment = async (commentId) => {
    if (!editedText.trim()) {
      Alert.alert('Hata', 'Yorum boş bırakılamaz.');
      return;
    }
    try {
      await updateDoc(doc(db, 'comments', commentId), { text: editedText });
      setComments(comments.map(comment => (comment.id === commentId ? { ...comment, text: editedText } : comment)));
      setEditingComment(null);
      setEditedText('');
    } catch (error) {
      Alert.alert('Hata', 'Yorum güncellenirken hata oluştu.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Etkinlikler</Text>
          </View>

          <FlatList
            ListHeaderComponent={
              <View style={styles.content}>
                {event.imageUrl ? (
                  <Image source={{ uri: event.imageUrl }} style={styles.image} />
                ) : (
                  <Text style={styles.noImageText}>Görsel bulunamadı</Text>
                )}
                <Text style={styles.title}>{event.eventName}</Text>
                <Text style={styles.organizer}>Düzenleyen: {event.organizer}</Text>
                <Text style={styles.description}>{event.description}</Text>
                <Text style={styles.date}>Tarih: {event.date}</Text>
                <Text style={styles.commentsHeader}>Yorumlar</Text>
              </View>
            }
            data={comments}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Image source={{ uri: item.userProfileImage }} style={styles.profileImage} />
                <View style={styles.commentContent}>
                  <Text style={styles.userName}>{item.userName}</Text>
                  {editingComment === item.id ? (
                    <TextInput 
                      style={styles.commentInput} 
                      value={editedText} 
                      onChangeText={setEditedText} 
                      onBlur={() => saveEditedComment(item.id)}
                    />
                  ) : (
                    <Text style={styles.commentText}>{item.text}</Text>
                  )}
                </View>
                <View style={styles.commentActions}>
                  {item.userId === userId && (
                    <TouchableOpacity onPress={() => startEditing(item)}>
                      <Icon name="edit" size={20} color="blue" />
                    </TouchableOpacity>
                  )}
                  {(item.userId === userId || event.organizerId === userId) && (
                    <TouchableOpacity onPress={() => deleteComment(item.id, item.userId)}>
                      <Icon name="delete" size={20} color="red" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          />

<View style={styles.addCommentContainer}>
  <TextInput
    style={styles.commentInput}
    placeholder="Yorum yaz..."
    value={newComment}
    onChangeText={setNewComment}
    multiline={true}
    numberOfLines={4}
  />
  <TouchableOpacity style={styles.addCommentButton} onPress={addComment}>
    <Text style={styles.addCommentButtonText}>Gönder</Text>
  </TouchableOpacity>
</View>


        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#FEF7FF', paddingVertical: 30, borderBottomWidth: 1, borderBottomColor: '#ddd', alignItems: 'center' },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#65558F' },
  content: { padding: 16, alignItems: 'center' },
  image: { width: '100%', height: 250, borderRadius: 10, marginBottom: 16 },
  commentsSection: { padding: 16 },
  commentItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#f8f8f8', padding: 10, borderRadius: 10 },
  profileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  commentContent: { flex: 1 },
  userName: { fontWeight: 'bold', color: '#333', marginBottom: 2 },
  commentActions: { flexDirection: 'row', gap: 10 },
  commentText: { color: '#555' },
  commentInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 5, marginRight: 10 },
  addCommentButton: { backgroundColor: '#65558F', padding: 10, borderRadius: 5 },
  addCommentButtonText: { color: '#fff' },
  addCommentContainer: {
    flexDirection: 'row', // Yorum kutusu ve butonu yan yana getirir
    alignItems: 'center', // İçeriği dikey olarak hizalar
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  
  commentInput: {
    flex: 1, // Tüm alanı kaplamasını sağlar
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    minHeight: 50,
    maxHeight: 120,
    textAlignVertical: 'top', // Yazıyı yukarıdan başlatır
    marginRight: 10, // Butonla arasında boşluk bırakır
  },
  
  addCommentButton: {
    backgroundColor: '#65558F',
    paddingVertical: 14, // Butonun yüksekliğini artırır
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  
  addCommentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  
});

export default EtkinliklerDetay;
