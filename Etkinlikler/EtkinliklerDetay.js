import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Linking 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, deleteObject } from 'firebase/storage';

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

  // Etkinlik silme fonksiyonu
  const handleDeleteEvent = () => {
    if (event.organizerId !== userId) {
      Alert.alert('Yetkisiz İşlem', 'Bu etkinliği sadece oluşturan kişi silebilir.');
      return;
    }

    Alert.alert(
      'Etkinliği Sil',
      'Bu etkinliği silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              // Etkinlik resmini storage'dan sil
              if (event.imageUrl) {
                const storage = getStorage();
                const imageRef = ref(storage, event.imageUrl);
                try {
                  await deleteObject(imageRef);
                } catch (error) {
                  console.log('Resim silinirken hata:', error);
                }
              }

              // Etkinliğe ait yorumları sil
              const commentsQuery = query(
                collection(db, 'comments'),
                where('eventId', '==', event.id)
              );
              const commentsSnapshot = await getDocs(commentsQuery);
              const deletePromises = commentsSnapshot.docs.map(doc => deleteDoc(doc.ref));
              await Promise.all(deletePromises);

              // Etkinliği sil
              await deleteDoc(doc(db, 'events', event.id));
              
              Alert.alert('Başarılı', 'Etkinlik başarıyla silindi.');
              navigation.goBack();
            } catch (error) {
              console.error('Etkinlik silinirken hata:', error);
              Alert.alert('Hata', 'Etkinlik silinirken bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <FlatList
            ListHeaderComponent={
              <View style={styles.content}>
                <Image 
                  source={{ uri: event.imageUrl || 'https://via.placeholder.com/400' }} 
                  style={styles.eventImage} 
                />
                
                <View style={styles.eventInfoContainer}>
                  <Text style={styles.eventTitle}>{event.eventName}</Text>
                  
                  <View style={styles.organizerInfo}>
                    <Icon name="person" size={20} color="#65558F" />
                    <Text style={styles.organizerText}>
                      {event.organizer}
                    </Text>
                  </View>

                  {/* Etkinlik sahibi için silme butonu */}
                  {event.organizerId === userId && (
                    <TouchableOpacity
                      style={styles.deleteEventButton}
                      onPress={handleDeleteEvent}
                    >
                      <Icon name="delete" size={20} color="#fff" />
                      <Text style={styles.deleteEventButtonText}>Etkinliği Sil</Text>
                    </TouchableOpacity>
                  )}

                  <View style={styles.eventDetails}>
                    <View style={styles.detailItem}>
                      <Icon name="event" size={20} color="#65558F" />
                      <Text style={styles.detailText}>{event.date}</Text>
                    </View>

                    <TouchableOpacity 
                      style={styles.detailItem}
                      onPress={() => {
                        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
                        Linking.openURL(mapUrl);
                      }}
                    >
                      <Icon name="location-on" size={20} color="#65558F" />
                      <Text style={styles.detailText}>{event.location}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionTitle}>Etkinlik Açıklaması</Text>
                    <Text style={styles.descriptionText}>{event.description}</Text>
                  </View>
                </View>

                <View style={styles.commentsSection}>
                  <Text style={styles.commentsTitle}>Yorumlar</Text>
                </View>
              </View>
            }
            data={comments}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <Image source={{ uri: item.userProfileImage }} style={styles.commentUserImage} />
                  <View style={styles.commentUserInfo}>
                    <Text style={styles.commentUserName}>{item.userName}</Text>
                  </View>
                  <View style={styles.commentActions}>
                    {item.userId === userId && (
                      <TouchableOpacity onPress={() => startEditing(item)} style={styles.actionButton}>
                        <Icon name="edit" size={20} color="#65558F" />
                      </TouchableOpacity>
                    )}
                    {(item.userId === userId || event.organizerId === userId) && (
                      <TouchableOpacity onPress={() => deleteComment(item.id, item.userId)} style={styles.actionButton}>
                        <Icon name="delete" size={20} color="#FF5252" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {editingComment === item.id ? (
                  <TextInput
                    style={styles.editCommentInput}
                    value={editedText}
                    onChangeText={setEditedText}
                    onBlur={() => saveEditedComment(item.id)}
                    multiline
                  />
                ) : (
                  <Text style={styles.commentContent}>{item.text}</Text>
                )}
              </View>
            )}
          />

          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Yorum yazın..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={addComment}
            >
              <Icon name="send" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  eventImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  eventInfoContainer: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  organizerText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#65558F',
    fontWeight: '500',
  },
  eventDetails: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#444',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  commentsSection: {
    padding: 16,
    borderTopWidth: 8,
    borderTopColor: '#f5f5f5',
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  commentCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentUserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  commentUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  commentContent: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#65558F',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editCommentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    fontSize: 14,
    color: '#444',
  },
  deleteEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
    justifyContent: 'center'
  },
  deleteEventButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold'
  },
});

export default EtkinliklerDetay;
