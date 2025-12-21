import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useTranslation } from 'react-i18next';

interface HistoryRecord {
  id: string;
  predictedDisease: string;
  confidence: number;
  timestamp: string;
}

export default function History() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://192.168.176.161:8000/api/history');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`http://192.168.176.161:8000/api/history/delete/${id}/`, {
                method: 'DELETE',
              });
              if (response.ok) {
                setHistory(prev => prev.filter(item => item.id !== id));
              } else {
                Alert.alert('Error', 'Failed to delete the record.');
              }
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'An error occurred while deleting.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: HistoryRecord }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{t('home.predictedDisease')}: {item.predictedDisease}</Text>
      <Text style={styles.cardText}>Confidence: {(item.confidence * 100).toFixed(2)}%</Text>
      <Text style={styles.cardDate}>{new Date(item.timestamp).toLocaleString()}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRecord(item.id)}>
        <Ionicons name="trash" size={20} color="#b00020" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        <Text style={styles.headerGreen}>{t('history.title')}</Text>
      </Text>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#2e7d32" />
        ) : history.length === 0 ? (
          <Text style={styles.message}>{t('history.message')}</Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Ionicons
            name="home"
            size={28}
            color={pathname === '/home' ? '#2e7d32' : '#777'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/history')}>
          <Ionicons
            name="time"
            size={28}
            color={pathname === '/history' ? '#2e7d32' : '#777'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/learn')}>
          <Ionicons
            name="book"
            size={28}
            color={pathname === '/learn' ? '#2e7d32' : '#777'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons
            name="settings"
            size={28}
            color={pathname === '/settings' ? '#2e7d32' : '#777'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  headerGreen: {
    color: '#2e7d32',
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#f4f4f4',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#2e7d32',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
  },
  cardDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  deleteText: {
    marginLeft: 6,
    color: '#b00020',
    fontWeight: '500',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9f9f9',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
