import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

const Learn = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<number | null>(null);

  const learnData = [
    {
      title: t('diseases.powderyMildew'),
      symptoms: t('learn.White powdery spots on leaves and buds.'),
      treatment: t('learn.Apply sulfur-based fungicides.'),
      more: t('learn.Ensure good air circulation and avoid overhead watering.'),
    },
    {
      title: t('diseases.anthracnose'),
      symptoms: t('learn.Black lesions on fruits and leaves.'),
      treatment: t('learn.Use copper-based fungicides.'),
      more: t('learn.Remove and destroy infected plant parts.'),
    },
    {
      title: t('diseases.bacterialCanker'),
      symptoms: t('learn.Gum oozing and black spots.'),
      treatment: t('learn.Use antibiotics and prune infected parts.'),
      more: t('learn.Disinfect pruning tools after each cut.'),
    },
    {
      title: t('diseases.sootyMold'),
      symptoms: t('learn.Black, sooty coating on leaves and stems.'),
      treatment: t('learn.Control sap-sucking insects and wash off mold.'),
      more: t('learn.Improve air flow and reduce humidity.'),
    },
    {
      title: t('diseases.dieBack'),
      symptoms: t('learn.Twigs and branches die from the tip backward.'),
      treatment: t('learn.Prune affected branches and apply fungicide.'),
      more: t('learn.Avoid waterlogging and improve soil drainage.'),
    },
  ];

  const handleToggle = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Animated.Text entering={FadeInUp} style={styles.header}>
          {t('learn.title')}
        </Animated.Text>

        {learnData.map((item, index) => (
          <Animated.View entering={FadeInUp.delay(index * 100)} key={index}>
            <Pressable onPress={() => handleToggle(index)}>
              <View style={styles.card}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.label}>{t('learn.symptoms') || 'Symptoms'}:</Text>
                <Text>{item.symptoms}</Text>
                <Text style={styles.label}>{t('learn.treatment') || 'Treatment'}:</Text>
                <Text>{item.treatment}</Text>
                {expanded === index && (
                  <View style={styles.moreBox}>
                    <Text style={styles.moreTitle}>{t('learn.more') || 'More Info'}:</Text>
                    <Text>{item.more}</Text>
                  </View>
                )}
                <Text style={styles.expandText}>
                  {expanded === index ? t('learn.hideDetails') || 'Hide details ▲' : t('learn.showMore') || 'Show more ▼'}
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <Ionicons name="home" size={28} color={pathname === '/home' ? '#2e7d32' : '#777'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/history')}>
          <Ionicons name="time" size={28} color={pathname === '/history' ? '#2e7d32' : '#777'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/learn')}>
          <Ionicons name="book" size={28} color={pathname === '/learn' ? '#2e7d32' : '#777'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/settings')}>
          <Ionicons name="settings" size={28} color={pathname === '/settings' ? '#2e7d32' : '#777'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Learn;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 16,
    color: '#228B22',
    marginTop: 40,
  },
  content: { paddingHorizontal: 16 },
  card: {
    backgroundColor: '#f4f4f4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  label: { fontWeight: '600', marginTop: 10 },
  moreBox: {
    backgroundColor: '#e0f7e9',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  moreTitle: { fontWeight: '700', marginBottom: 4, color: '#228B22' },
  expandText: {
    marginTop: 10,
    color: '#228B22',
    fontWeight: '600',
    textAlign: 'right',
    fontSize: 13,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  navItem: { alignItems: 'center' },
});
