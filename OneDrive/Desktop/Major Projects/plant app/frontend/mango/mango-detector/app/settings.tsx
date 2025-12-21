import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';
import { useRouter, usePathname } from 'expo-router';

export default function Settings() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'हिन्दी', value: 'hi' },
    { label: 'தமிழ்', value: 'ta' },
    { label: 'తెలుగు', value: 'te' },
  ];

  const changeLanguage = (lang: string) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
    Alert.alert('✅', `Language changed to ${lang.toUpperCase()}`);
  };

  const handleAbout = () => {
    Alert.alert(
      t('about_title'),
      'Mango Disease Detector\nVersion 1.0.0\nBuilt using React Native & Django'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚙️ <Text style={styles.headerGreen}>{t('settings.title')}</Text></Text>

      {/* Language Picker */}
      <View style={styles.card}>
        <Text style={styles.optionTitle}>🌐 {t('settings.language')}</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedLang}
            onValueChange={(value) => changeLanguage(value)}
            style={styles.picker}
            dropdownIconColor="green"
          >
            {languages.map((lang, index) => (
              <Picker.Item key={index} label={lang.label} value={lang.value} />
            ))}
          </Picker>
        </View>
      </View>

      {/* About App */}
      <TouchableOpacity style={styles.card} onPress={handleAbout}>
        <Text style={styles.optionTitle}>ℹ️ {t('settings.about_app')}</Text>
      </TouchableOpacity>

      <Text style={styles.version}>{t('version')}: 1.0.0</Text>

      {/* Bottom Nav */}
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
    padding: 35,
    paddingBottom: 90,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  headerGreen: {
    color: '#2e7d32',
  },
  card: {
    backgroundColor: '#f1f8e9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#c5e1a5',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2e7d32',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 120 : 50,
    width: '100%',
  },
  version: {
    marginTop: 40,
    textAlign: 'center',
    color: '#777',
    fontSize: 13,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
