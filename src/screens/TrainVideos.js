import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TextInput, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const videos = [
  { id: '1', category: 'Basic Commands', title: 'Sit', duration: '3:03', thumbnail: 'https://img.youtube.com/vi/qExwIfed7jg/0.jpg', url: 'https://www.youtube.com/embed/qExwIfed7jg' },
  { id: '2', category: 'Basic Commands', title: 'Stay', duration: '4:14', thumbnail: 'https://img.youtube.com/vi/RndMTsZTpMo/0.jpg', url: 'https://www.youtube.com/embed/RndMTsZTpMo' },
  { id: '3', category: 'Behavioral Training', title: 'Barking', duration: '3:53', thumbnail: 'https://img.youtube.com/vi/pZkzdsjtWc0/0.jpg', url: 'https://www.youtube.com/embed/pZkzdsjtWc0' },
  { id: '4', category: 'Behavioral Training', title: 'Chewing', duration: '5:00', thumbnail: 'https://img.youtube.com/vi/CZuo57SbFJc/0.jpg', url: 'https://www.youtube.com/embed/CZuo57SbFJc' },
  { id: '5', category: 'Advanced Training', title: 'Heel', duration: '6:05', thumbnail: 'https://img.youtube.com/vi/Eh3vvSbbGd0/0.jpg', url: 'https://www.youtube.com/embed/Eh3vvSbbGd0' },
  { id: '6', category: 'Advanced Training', title: 'Recall', duration: '4:35', thumbnail: 'https://img.youtube.com/vi/aptya2T2_3M/0.jpg', url: 'https://www.youtube.com/embed/aptya2T2_3M' },
];

export default function TrainVideos() {
  const [savedVideos, setSavedVideos] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');

  const handlePlay = (url) => {
    setCurrentVideoUrl(url);
    setModalVisible(true);
  };

  const handleSave = (id) => {
    if (!savedVideos.includes(id)) {
      setSavedVideos([...savedVideos, id]);
    }
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchText.toLowerCase()) ||
    video.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderVideoItem = ({ item }) => (
    <View style={styles.videoContainer}>
      <TouchableOpacity onPress={() => handlePlay(item.url)} style={styles.touchable}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.videoDetails}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.duration}>{item.duration}</Text>
        </View>
      </TouchableOpacity>
      <Button title="Save for Later" onPress={() => handleSave(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Training with TechPup</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Videos"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredVideos}
        renderItem={renderVideoItem}
        keyExtractor={(video) => video.id}
        contentContainerStyle={styles.listContent}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.webviewWrapper}>
            <WebView
              source={{ uri: currentVideoUrl }}
              style={styles.webview}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  videoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  touchable: {
    flexDirection: 'row',
    flex: 1,
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 8,
  },
  videoDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  webviewWrapper: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.5,
    overflow: 'hidden',
    borderRadius: 10,
  },
  webview: {
    width: '100%',
    height: '100%',
  },
});
