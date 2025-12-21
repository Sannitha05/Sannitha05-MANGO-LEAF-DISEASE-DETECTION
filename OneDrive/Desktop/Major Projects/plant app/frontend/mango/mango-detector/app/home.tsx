import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useCameraPermissions } from 'expo-camera';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInUp, SlideInUp } from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';

interface PredictionResult {
  label: string;
  confidence: number;
  confidence_breakdown: { [key: string]: number };
}

const Home = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<string>('anthracnose');
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  const pickImage = async () => {
    setPrediction(null);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    setPrediction(null);
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImageUri(null);
    setPrediction(null);
  };

  const handleAnalyse = async () => {
    if (!imageUri) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await fetch('http://192.168.176.161:8000/api/predict/', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const text = await response.text();
      const raw = JSON.parse(text);
      const data = Array.isArray(raw) ? raw[0] : raw;

      if (data?.prediction?.label) {
        const detectedLabel = data.prediction.label.toLowerCase().replace(/\s+/g, '');
        setPrediction(data.prediction);
        setSelectedDisease(detectedLabel);
        setImageUri(null);
      } else {
        alert(t('alerts.apiError'));
      }
    } catch (err) {
      alert(t('alerts.apiError'));
    } finally {
      setLoading(false);
    }
  };

  const getDiseaseDescription = (labelKey: string) => {
    return t(`diseases.${labelKey}`, { defaultValue: 'No description available.' });
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.Text entering={FadeInUp} style={styles.title}>
          {t('home.title')}
        </Animated.Text>

        <Text style={styles.uploadPrompt}>{t('home.uploadPrompt')}</Text>

        <Animated.View entering={SlideInUp} style={styles.uploadBox}>
          <TouchableOpacity style={styles.dynamicButton} onPress={pickImage}>
            <Ionicons name="image" size={24} color="white" />
            <Text style={styles.dynamicText}>{t('buttons.upload')}</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>{t('home.or')}</Text>

          <TouchableOpacity style={styles.dynamicButton} onPress={takePhoto}>
            <Ionicons name="camera" size={24} color="white" />
            <Text style={styles.dynamicText}>{t('buttons.camera')}</Text>
          </TouchableOpacity>
        </Animated.View>

        {imageUri && (
          <Animated.View entering={FadeInUp.delay(300)}>
            <Image source={{ uri: imageUri }} style={styles.preview} />
            <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
              <Text style={styles.removeButtonText}>{t('home.Remove')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.analyseButton} onPress={handleAnalyse}>
              <Text style={styles.analyseButtonText}>{t('buttons.analyse')}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {loading && <ActivityIndicator size="large" color="green" style={{ marginTop: 20 }} />}

        {prediction && (
          <Animated.View entering={FadeInUp.delay(400)} style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>{t('home.predictedDisease')}</Text>
            <Text style={styles.highlightResult}>{t(`home.${prediction.label.toLowerCase().replace(/\s+/g, '')}`)}</Text>
            <Text style={styles.highlightConfidence}>
              {t('home.Confidence')}: {prediction.confidence.toFixed(2)}%
            </Text>

            <Text style={styles.dropdownLabel}>{t('home.confidenceBreakdown')}</Text>

            {Object.entries(prediction.confidence_breakdown).map(([key, value]) => (
              <View key={key} style={styles.confidenceRow}>
                <Ionicons name="leaf" size={16} color="#2e7d32" style={{ marginRight: 6 }} />
                <Text style={styles.highlightConfidence}>
                  {t(`preddata.${key}`)}: {(value * 1).toFixed(2)}%
                </Text>
              </View>
            ))}

            <Text style={styles.dropdownLabel}>{t('home.diseaseInfo')}</Text>
            <Text style={styles.highlightDesc}>
              {getDiseaseDescription(prediction.label.toLowerCase().replace(/\s+/g, ''))}
            </Text>
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.delay(500)} style={styles.staticInfoBox}>
          <Text style={styles.staticTitle}>{t('home.diseaseInfo')}</Text>
          {['anthracnose', 'powderyMildew', 'bacterialCanker', 'sootyMold', 'dieBack'].map(key => (
            <View key={key} style={styles.staticItem}>
              <Text style={styles.staticDisease}>{t(`home.${key}`)}</Text>
              <Text style={styles.staticDescription}>{t(`diseases.${key}`)}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Ionicons name="home" size={28} color={pathname === '/home' ? '#2e7d32' : '#777'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/history')}>
          <Ionicons name="time" size={28} color={pathname === '/history' ? '#2e7d32' : '#777'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/learn')}>
          <Ionicons name="book" size={28} color={pathname === '/learn' ? '#2e7d32' : '#777'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons name="settings" size={28} color={pathname === '/settings' ? '#2e7d32' : '#777'} />
        </TouchableOpacity>
      </View>
    </>
   
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    marginBlockStart: 25,
    padding: 25,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
    textAlign: 'center',
  },
  uploadPrompt: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#555',
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: 'green',
    borderStyle: 'dotted',
    borderRadius: 8,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#f1f8e9',
  },
  dynamicButton: {
    flexDirection: 'row',
    backgroundColor: '#2e7d32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 8,
  },
  dynamicText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  orText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginVertical: 8,
  },
  preview: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginVertical: 20,
    borderRadius: 10,
  },
  removeButton: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  removeButtonText: {
    color: 'red',
    fontWeight: '600',
  },
  analyseButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  analyseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  highlightBox: {
    backgroundColor: '#d7ffd9',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 10,
  },
  highlightResult: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 5,
  },
  highlightConfidence: {
    fontSize: 15,
    marginBottom: 6,
    color: '#444',
  },
  highlightDesc: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  dropdownLabel: {
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  staticInfoBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
    marginTop: 30,
    marginBottom: 80,
  },
  staticTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  staticItem: {
    marginBottom: 10,
  },
  staticDisease: {
    fontWeight: '600',
    color: '#2e7d32',
    fontSize: 15,
  },
  staticDescription: {
    color: '#444',
    fontSize: 14,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
 confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
});
