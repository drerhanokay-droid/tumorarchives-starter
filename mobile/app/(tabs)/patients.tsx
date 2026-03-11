import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { listPatients } from '@/src/repositories/patients';
import { colors } from '@/src/theme/colors';
import type { Patient } from '@/src/types';

export default function PatientsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);

  const reload = useCallback(() => {
    listPatients(search).then(setPatients);
  }, [search]);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800' }}>Hastalar</Text>
      <TextInput
        placeholder="Hasta, protokol veya tümör ara"
        placeholderTextColor={colors.text3}
        value={search}
        onChangeText={(value) => {
          setSearch(value);
          listPatients(value).then(setPatients);
        }}
        style={{ backgroundColor: colors.card, color: colors.text, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border }}
      />
      <Pressable onPress={() => router.push('/patient/form')} style={{ backgroundColor: colors.primary, padding: 14, borderRadius: 14 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '800' }}>Yeni Hasta</Text>
      </Pressable>

      <View style={{ gap: 10 }}>
        {patients.map((patient) => (
          <Pressable key={patient.id} onPress={() => router.push(`/patient/${patient.id}`)} style={{ backgroundColor: colors.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{patient.firstName} {patient.lastName}</Text>
            <Text style={{ color: colors.text2, marginTop: 4 }}>{patient.tumorType ?? 'Tanı yok'} • {patient.tumorLocation ?? 'Lokalizasyon yok'}</Text>
            <Text style={{ color: colors.text3, marginTop: 6 }}>{patient.protocolNo ? `#${patient.protocolNo}` : 'Protokol yok'}</Text>
          </Pressable>
        ))}
        {patients.length === 0 && <Text style={{ color: colors.text3 }}>Eşleşen kayıt yok.</Text>}
      </View>
    </ScrollView>
  );
}
