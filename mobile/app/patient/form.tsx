import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { deletePatient, getPatientById, upsertPatient } from '@/src/repositories/patients';
import { colors } from '@/src/theme/colors';

const Section = ({ title, children }: any) => (
  <View style={{ gap: 12, paddingTop: 6 }}>
    <Text style={{ color: colors.teal, fontSize: 13, fontWeight: '800', letterSpacing: 1 }}>{title}</Text>
    {children}
  </View>
);

const Field = ({ label, value, onChangeText, keyboardType = 'default', multiline = false }: any) => (
  <View style={{ gap: 6 }}>
    <Text style={{ color: colors.text2, fontWeight: '600' }}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
      placeholder={label}
      placeholderTextColor={colors.text3}
      style={{
        backgroundColor: colors.card,
        color: colors.text,
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: colors.border,
        minHeight: multiline ? 96 : undefined,
        textAlignVertical: multiline ? 'top' : 'auto',
      }}
    />
  </View>
);

const parseNumber = (value: string) => {
  if (!value.trim()) return null;
  const n = Number(value.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

export default function PatientFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const isEdit = useMemo(() => Boolean(params.id), [params.id]);
  const [form, setForm] = useState<any>({
    firstName: '',
    lastName: '',
    age: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    nationalIdMasked: '',
    protocolNo: '',
    hospitalName: '',
    referringClinic: '',
    diagnosisDate: '',
    biopsyDate: '',
    pathologyReportNo: '',
    tumorOrigin: '',
    tumorBehavior: '',
    tumorType: '',
    tumorSubtype: '',
    tumorLocation: '',
    boneSegment: '',
    tumorSide: '',
    compartmentStatus: '',
    ennekingStage: '',
    ajccT: '',
    ajccN: '',
    ajccM: '',
    histologicGrade: '',
    tumorSizeCm: '',
    metastaticAtDiagnosis: '',
    skipMetastasis: '',
    pathologicalFracture: '',
    biopsyType: '',
    surgeryDate: '',
    surgeryType: '',
    surgeryIntent: '',
    reconstruction: '',
    implantType: '',
    neoadjuvantChemo: '',
    adjuvantChemo: '',
    chemoProtocol: '',
    radiotherapy: '',
    radiotherapyDoseGy: '',
    surgicalMargin: '',
    necrosisRatePct: '',
    localRecurrence: '',
    localRecurrenceDate: '',
    metastasis: '',
    metastasisDate: '',
    currentStatus: '',
    deathDate: '',
    lastContactDate: '',
    notes: '',
  });

  useEffect(() => {
    if (!params.id) return;
    getPatientById(params.id).then((patient) => {
      if (!patient) return;
      setForm({
        ...patient,
        age: patient.age?.toString() ?? '',
        tumorSizeCm: patient.tumorSizeCm?.toString() ?? '',
        radiotherapyDoseGy: patient.radiotherapyDoseGy?.toString() ?? '',
        necrosisRatePct: patient.necrosisRatePct?.toString() ?? '',
      });
    });
  }, [params.id]);

  const setValue = (key: string, value: string) => setForm((current: any) => ({ ...current, [key]: value }));

  const onSave = async () => {
    if (!form.firstName || !form.lastName) {
      Alert.alert('Eksik bilgi', 'Ad ve soyad zorunludur.');
      return;
    }

    const saved = await upsertPatient({
      id: params.id,
      firstName: form.firstName,
      lastName: form.lastName,
      age: parseNumber(form.age),
      dateOfBirth: form.dateOfBirth || null,
      gender: form.gender || null,
      phone: form.phone || null,
      nationalIdMasked: form.nationalIdMasked || null,
      protocolNo: form.protocolNo || null,
      hospitalName: form.hospitalName || null,
      referringClinic: form.referringClinic || null,
      diagnosisDate: form.diagnosisDate || null,
      biopsyDate: form.biopsyDate || null,
      pathologyReportNo: form.pathologyReportNo || null,
      tumorOrigin: form.tumorOrigin || null,
      tumorBehavior: form.tumorBehavior || null,
      tumorType: form.tumorType || null,
      tumorSubtype: form.tumorSubtype || null,
      tumorLocation: form.tumorLocation || null,
      boneSegment: form.boneSegment || null,
      tumorSide: form.tumorSide || null,
      compartmentStatus: form.compartmentStatus || null,
      ennekingStage: form.ennekingStage || null,
      ajccT: form.ajccT || null,
      ajccN: form.ajccN || null,
      ajccM: form.ajccM || null,
      histologicGrade: form.histologicGrade || null,
      tumorSizeCm: parseNumber(form.tumorSizeCm),
      metastaticAtDiagnosis: form.metastaticAtDiagnosis || null,
      skipMetastasis: form.skipMetastasis || null,
      pathologicalFracture: form.pathologicalFracture || null,
      biopsyType: form.biopsyType || null,
      surgeryDate: form.surgeryDate || null,
      surgeryType: form.surgeryType || null,
      surgeryIntent: form.surgeryIntent || null,
      reconstruction: form.reconstruction || null,
      implantType: form.implantType || null,
      neoadjuvantChemo: form.neoadjuvantChemo || null,
      adjuvantChemo: form.adjuvantChemo || null,
      chemoProtocol: form.chemoProtocol || null,
      radiotherapy: form.radiotherapy || null,
      radiotherapyDoseGy: parseNumber(form.radiotherapyDoseGy),
      surgicalMargin: form.surgicalMargin || null,
      necrosisRatePct: parseNumber(form.necrosisRatePct),
      localRecurrence: form.localRecurrence || null,
      localRecurrenceDate: form.localRecurrenceDate || null,
      metastasis: form.metastasis || null,
      metastasisDate: form.metastasisDate || null,
      currentStatus: form.currentStatus || null,
      deathDate: form.deathDate || null,
      lastContactDate: form.lastContactDate || null,
      notes: form.notes || null,
    });

    router.replace(`/patient/${saved.id}`);
  };

  const onDelete = async () => {
    if (!params.id) return;
    Alert.alert('Kaydı sil', 'Bu hasta kaydı silinsin mi?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await deletePatient(params.id as string);
          router.replace('/(tabs)/patients');
        }
      }
    ]);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, gap: 14 }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800' }}>{isEdit ? 'Hasta Düzenle' : 'Yeni Hasta'}</Text>
      <Text style={{ color: colors.text3 }}>Tarih alanlarını ISO biçiminde gir: YYYY-MM-DD</Text>

      <Section title="KİMLİK / DOSYA">
        <Field label="Ad" value={form.firstName} onChangeText={(v: string) => setValue('firstName', v)} />
        <Field label="Soyad" value={form.lastName} onChangeText={(v: string) => setValue('lastName', v)} />
        <Field label="Yaş" value={form.age} onChangeText={(v: string) => setValue('age', v)} keyboardType="numeric" />
        <Field label="Doğum Tarihi" value={form.dateOfBirth} onChangeText={(v: string) => setValue('dateOfBirth', v)} />
        <Field label="Cinsiyet" value={form.gender} onChangeText={(v: string) => setValue('gender', v)} />
        <Field label="Telefon" value={form.phone} onChangeText={(v: string) => setValue('phone', v)} />
        <Field label="Kimlik No (maskeli)" value={form.nationalIdMasked} onChangeText={(v: string) => setValue('nationalIdMasked', v)} />
        <Field label="Protokol No" value={form.protocolNo} onChangeText={(v: string) => setValue('protocolNo', v)} />
        <Field label="Kurum" value={form.hospitalName} onChangeText={(v: string) => setValue('hospitalName', v)} />
        <Field label="Yönlendiren Klinik" value={form.referringClinic} onChangeText={(v: string) => setValue('referringClinic', v)} />
      </Section>

      <Section title="TANI / PATOLOJİ">
        <Field label="Tanı Tarihi" value={form.diagnosisDate} onChangeText={(v: string) => setValue('diagnosisDate', v)} />
        <Field label="Biyopsi Tarihi" value={form.biopsyDate} onChangeText={(v: string) => setValue('biopsyDate', v)} />
        <Field label="Biyopsi Tipi" value={form.biopsyType} onChangeText={(v: string) => setValue('biopsyType', v)} />
        <Field label="Patoloji Rapor No" value={form.pathologyReportNo} onChangeText={(v: string) => setValue('pathologyReportNo', v)} />
        <Field label="Köken (bone / soft_tissue / metastatic)" value={form.tumorOrigin} onChangeText={(v: string) => setValue('tumorOrigin', v)} />
        <Field label="Davranış (benign / malignant / metastatic)" value={form.tumorBehavior} onChangeText={(v: string) => setValue('tumorBehavior', v)} />
        <Field label="Tümör Tipi" value={form.tumorType} onChangeText={(v: string) => setValue('tumorType', v)} />
        <Field label="Alt Tip" value={form.tumorSubtype} onChangeText={(v: string) => setValue('tumorSubtype', v)} />
        <Field label="Lokalizasyon" value={form.tumorLocation} onChangeText={(v: string) => setValue('tumorLocation', v)} />
        <Field label="Kemik Segmenti" value={form.boneSegment} onChangeText={(v: string) => setValue('boneSegment', v)} />
        <Field label="Taraf" value={form.tumorSide} onChangeText={(v: string) => setValue('tumorSide', v)} />
        <Field label="Kompartman" value={form.compartmentStatus} onChangeText={(v: string) => setValue('compartmentStatus', v)} />
        <Field label="Enneking" value={form.ennekingStage} onChangeText={(v: string) => setValue('ennekingStage', v)} />
        <Field label="AJCC T" value={form.ajccT} onChangeText={(v: string) => setValue('ajccT', v)} />
        <Field label="AJCC N" value={form.ajccN} onChangeText={(v: string) => setValue('ajccN', v)} />
        <Field label="AJCC M" value={form.ajccM} onChangeText={(v: string) => setValue('ajccM', v)} />
        <Field label="Histolojik Grade" value={form.histologicGrade} onChangeText={(v: string) => setValue('histologicGrade', v)} />
        <Field label="Boyut (cm)" value={form.tumorSizeCm} onChangeText={(v: string) => setValue('tumorSizeCm', v)} keyboardType="numeric" />
        <Field label="Tanıda metastaz" value={form.metastaticAtDiagnosis} onChangeText={(v: string) => setValue('metastaticAtDiagnosis', v)} />
        <Field label="Skip metastaz" value={form.skipMetastasis} onChangeText={(v: string) => setValue('skipMetastasis', v)} />
        <Field label="Patolojik kırık" value={form.pathologicalFracture} onChangeText={(v: string) => setValue('pathologicalFracture', v)} />
      </Section>

      <Section title="TEDAVİ">
        <Field label="Cerrahi Tarihi" value={form.surgeryDate} onChangeText={(v: string) => setValue('surgeryDate', v)} />
        <Field label="Cerrahi Tip" value={form.surgeryType} onChangeText={(v: string) => setValue('surgeryType', v)} />
        <Field label="Cerrahi Amaç" value={form.surgeryIntent} onChangeText={(v: string) => setValue('surgeryIntent', v)} />
        <Field label="Rekonstrüksiyon" value={form.reconstruction} onChangeText={(v: string) => setValue('reconstruction', v)} />
        <Field label="İmplant Tipi" value={form.implantType} onChangeText={(v: string) => setValue('implantType', v)} />
        <Field label="Neoadjuvan KT" value={form.neoadjuvantChemo} onChangeText={(v: string) => setValue('neoadjuvantChemo', v)} />
        <Field label="Adjuvan KT" value={form.adjuvantChemo} onChangeText={(v: string) => setValue('adjuvantChemo', v)} />
        <Field label="Kemoterapi Protokolü" value={form.chemoProtocol} onChangeText={(v: string) => setValue('chemoProtocol', v)} />
        <Field label="Radyoterapi" value={form.radiotherapy} onChangeText={(v: string) => setValue('radiotherapy', v)} />
        <Field label="RT Dozu (Gy)" value={form.radiotherapyDoseGy} onChangeText={(v: string) => setValue('radiotherapyDoseGy', v)} keyboardType="numeric" />
        <Field label="Cerrahi Sınır" value={form.surgicalMargin} onChangeText={(v: string) => setValue('surgicalMargin', v)} />
        <Field label="Nekroz Oranı %" value={form.necrosisRatePct} onChangeText={(v: string) => setValue('necrosisRatePct', v)} keyboardType="numeric" />
      </Section>

      <Section title="SONUÇ / TAKİP ÖZETİ">
        <Field label="Lokal Nüks" value={form.localRecurrence} onChangeText={(v: string) => setValue('localRecurrence', v)} />
        <Field label="Lokal Nüks Tarihi" value={form.localRecurrenceDate} onChangeText={(v: string) => setValue('localRecurrenceDate', v)} />
        <Field label="Metastaz" value={form.metastasis} onChangeText={(v: string) => setValue('metastasis', v)} />
        <Field label="Metastaz Tarihi" value={form.metastasisDate} onChangeText={(v: string) => setValue('metastasisDate', v)} />
        <Field label="Güncel Durum" value={form.currentStatus} onChangeText={(v: string) => setValue('currentStatus', v)} />
        <Field label="Ölüm Tarihi" value={form.deathDate} onChangeText={(v: string) => setValue('deathDate', v)} />
        <Field label="Son Temas Tarihi" value={form.lastContactDate} onChangeText={(v: string) => setValue('lastContactDate', v)} />
        <Field label="Notlar" value={form.notes} onChangeText={(v: string) => setValue('notes', v)} multiline />
      </Section>

      <Pressable onPress={onSave} style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 14, marginTop: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '800' }}>Kaydet</Text>
      </Pressable>
      {isEdit && (
        <Pressable onPress={onDelete} style={{ backgroundColor: '#3b0f19', padding: 16, borderRadius: 14 }}>
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '800' }}>Kaydı Sil</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
