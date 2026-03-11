import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { listPatients } from '@/src/repositories/patients';
import { colors } from '@/src/theme/colors';
import type { Patient } from '@/src/types';

export default function DashboardScreen() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);

  useFocusEffect(
    useCallback(() => {
      listPatients().then(setPatients);
    }, [])
  );

  const recent = patients.slice(0, 5);
  const metastaticCount = patients.filter((p) => p.metastasis && p.metastasis !== 'Yok').length;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, gap: 16 }}>
      <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800' }}>Merhaba, Doktor</Text>
        <Text style={{ color: colors.text2, marginTop: 6 }}>Tümör kayıtları, görüntüler ve araştırma dışa aktarımları bu cihazda tutulur.</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
        {[['Toplam Hasta', patients.length], ['Metastatik', metastaticCount], ['Son 7 Gün', patients.filter((p) => p.createdAt > Date.now() - 7 * 86400000).length]].map(([label, value]) => (
          <View key={String(label)} style={{ width: '31%', minWidth: 100, backgroundColor: colors.card, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.primary2, fontSize: 28, fontWeight: '800' }}>{value}</Text>
            <Text style={{ color: colors.text2, marginTop: 4 }}>{label}</Text>
          </View>
        ))}
      </View>

      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Hızlı işlemler</Text>
      <View style={{ gap: 10 }}>
        <Pressable onPress={() => router.push('/patient/form')} style={{ backgroundColor: colors.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>Yeni hasta</Text>
          <Text style={{ color: colors.text2, marginTop: 4 }}>Klinik bilgi, evre, tedavi ve not gir</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/(tabs)/patients')} style={{ backgroundColor: colors.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>Hasta listesi</Text>
          <Text style={{ color: colors.text2, marginTop: 4 }}>Arama yap, düzenle, görüntü ekle</Text>
        </Pressable>
      </View>

      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Son hastalar</Text>
      <View style={{ gap: 10 }}>
        {recent.length === 0 ? (
          <Text style={{ color: colors.text3 }}>Henüz kayıt yok.</Text>
        ) : (
          recent.map((patient) => (
            <Pressable
              key={patient.id}
              onPress={() => router.push(`/patient/${patient.id}`)}
              style={{ backgroundColor: colors.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border }}
            >
              <Text style={{ color: colors.text, fontWeight: '700' }}>{patient.firstName} {patient.lastName}</Text>
              <Text style={{ color: colors.text2, marginTop: 4 }}>{patient.tumorType ?? 'Tanı girilmedi'} • {patient.tumorLocation ?? 'Lokalizasyon yok'}</Text>
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );
}
