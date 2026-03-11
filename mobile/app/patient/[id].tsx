import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { listFollowUps } from '@/src/repositories/followUps';
import { deletePatientImage, listPatientImages, savePatientImage } from '@/src/repositories/images';
import { getPatientById } from '@/src/repositories/patients';
import { listScores } from '@/src/repositories/scores';
import { colors } from '@/src/theme/colors';
import type { FollowUp, Patient, PatientImage } from '@/src/types';

const SectionTitle = ({ children }: any) => (
  <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>{children}</Text>
);

const Card = ({ children }: any) => (
  <View style={{ backgroundColor: colors.card, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.border }}>{children}</View>
);

function formatDateString(value?: string | null) {
  if (!value) return null;
  return value;
}

function formatDateMillis(value?: number | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString('tr-TR');
}

function mapImageTypeFromLabel(label?: string | null): PatientImage['imageType'] {
  const l = (label || '').toLowerCase();
  if (l.includes('mr')) return 'mri';
  if (l.includes('bt') || l.includes('ct')) return 'ct';
  if (l.includes('pat')) return 'pathology';
  if (l.includes('pet')) return 'pet';
  if (l.includes('usg') || l.includes('us')) return 'usg';
  if (l.includes('xray') || l.includes('grafi') || l.includes('radyo')) return 'xray';
  return 'clinical';
}

export default function PatientDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [images, setImages] = useState<PatientImage[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);

  const reload = useCallback(() => {
    if (!id) return;
    getPatientById(id).then(setPatient);
    listPatientImages(id).then(setImages);
    listScores(id).then(setScores);
    listFollowUps(id).then(setFollowUps);
  }, [id]);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  const addFromGallery = async () => {
    if (!id) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      allowsMultipleSelection: true,
      exif: false,
    });
    if (result.canceled) return;
    for (const asset of result.assets) {
      await savePatientImage({
        patientId: id,
        sourceUri: asset.uri,
        label: asset.fileName ?? 'Görüntü',
        imageType: mapImageTypeFromLabel(asset.fileName),
        modality: mapImageTypeFromLabel(asset.fileName) === 'clinical' ? 'Clinical Photo' : String(mapImageTypeFromLabel(asset.fileName)).toUpperCase(),
        sourceType: 'gallery',
        capturedAt: asset.assetId ? new Date().toISOString() : new Date().toISOString(),
        mimeType: asset.mimeType,
        fileSizeBytes: asset.fileSize,
        width: asset.width,
        height: asset.height,
      });
    }
    reload();
  };

  const addFromCamera = async () => {
    if (!id) return;
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('İzin gerekli', 'Kamera kullanımı için izin vermen gerekiyor.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.85, exif: false });
    if (result.canceled) return;
    const asset = result.assets[0];
    await savePatientImage({
      patientId: id,
      sourceUri: asset.uri,
      label: asset.fileName ?? `Kamera ${new Date().toLocaleString('tr-TR')}`,
      imageType: 'clinical',
      modality: 'Clinical Photo',
      sourceType: 'camera',
      capturedAt: new Date().toISOString(),
      mimeType: asset.mimeType,
      fileSizeBytes: asset.fileSize,
      width: asset.width,
      height: asset.height,
    });
    reload();
  };

  const removeImage = async (imageId: string) => {
    Alert.alert('Görüntüyü sil', 'Bu görüntü kaldırılsın mı?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: async () => { await deletePatientImage(imageId); reload(); } }
    ]);
  };

  if (!patient) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.text2 }}>Kayıt yükleniyor...</Text>
      </View>
    );
  }

  const summaryCards = [
    ['Tümör', [patient.tumorType, patient.tumorSubtype].filter(Boolean).join(' • ')],
    ['Lokalizasyon', [patient.tumorLocation, patient.boneSegment, patient.tumorSide].filter(Boolean).join(' • ')],
    ['Evreleme', [patient.ennekingStage, patient.ajccT, patient.ajccN, patient.ajccM].filter(Boolean).join(' / ')],
    ['Patoloji', [patient.histologicGrade, patient.pathologyReportNo].filter(Boolean).join(' • ')],
    ['Tedavi', [patient.surgeryType, patient.reconstruction, patient.implantType].filter(Boolean).join(' • ')],
    ['Sonuç', [patient.localRecurrence, patient.metastasis, patient.currentStatus].filter(Boolean).join(' • ')],
  ].filter(([, value]) => Boolean(value));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, gap: 14 }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800' }}>{patient.firstName} {patient.lastName}</Text>
      <Text style={{ color: colors.text2 }}>
        {patient.age ?? '-'} yaş • {patient.protocolNo ? `#${patient.protocolNo}` : 'Protokol yok'} • {patient.currentStatus ?? 'Durum yok'}
      </Text>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable onPress={() => router.push({ pathname: '/patient/form', params: { id } })} style={{ flex: 1, backgroundColor: colors.card, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.text, fontWeight: '800', textAlign: 'center' }}>Kaydı Düzenle</Text>
        </Pressable>
        <Pressable onPress={() => router.push({ pathname: '/patient/followup-form', params: { patientId: id } })} style={{ flex: 1, backgroundColor: colors.primary, padding: 14, borderRadius: 14 }}>
          <Text style={{ color: '#fff', fontWeight: '800', textAlign: 'center' }}>Takip Ekle</Text>
        </Pressable>
      </View>

      <SectionTitle>Klinik özet</SectionTitle>
      <View style={{ gap: 10 }}>
        {summaryCards.map(([label, value]) => (
          <Card key={label}>
            <Text style={{ color: colors.text3, fontSize: 12 }}>{label}</Text>
            <Text style={{ color: colors.text, fontWeight: '700', marginTop: 4 }}>{String(value)}</Text>
          </Card>
        ))}
      </View>

      <SectionTitle>Görüntüler</SectionTitle>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable onPress={addFromGallery} style={{ flex: 1, backgroundColor: colors.primary, padding: 14, borderRadius: 14 }}>
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '800' }}>Galeriden Ekle</Text>
        </Pressable>
        <Pressable onPress={addFromCamera} style={{ flex: 1, backgroundColor: colors.card2, padding: 14, borderRadius: 14 }}>
          <Text style={{ color: colors.text, textAlign: 'center', fontWeight: '800' }}>Kameradan Çek</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {images.map((image) => (
          <View key={image.id} style={{ width: '48%', backgroundColor: colors.card, borderRadius: 14, padding: 8, borderWidth: 1, borderColor: colors.border }}>
            <Image source={{ uri: image.fileUri }} style={{ width: '100%', height: 140, borderRadius: 12 }} />
            <Text style={{ color: colors.text, marginTop: 8, fontWeight: '700' }} numberOfLines={1}>{image.label ?? 'Görüntü'}</Text>
            <Text style={{ color: colors.text3, marginTop: 4, fontSize: 12 }}>
              {[image.modality ?? image.imageType, image.bodyPart, image.bodySide].filter(Boolean).join(' • ') || 'Metadata yok'}
            </Text>
            <Text style={{ color: colors.text3, marginTop: 4, fontSize: 12 }}>
              {[image.width && image.height ? `${image.width}x${image.height}` : null, image.fileSizeBytes ? `${Math.round(image.fileSizeBytes / 1024)} KB` : null].filter(Boolean).join(' • ')}
            </Text>
            <Pressable onPress={() => removeImage(image.id)} style={{ marginTop: 8, backgroundColor: colors.card2, padding: 10, borderRadius: 10 }}>
              <Text style={{ color: colors.text, textAlign: 'center' }}>Sil</Text>
            </Pressable>
          </View>
        ))}
        {images.length === 0 && <Text style={{ color: colors.text3 }}>Henüz görüntü yok.</Text>}
      </View>

      <SectionTitle>Takip vizitleri</SectionTitle>
      <View style={{ gap: 10 }}>
        {followUps.map((item) => (
          <Card key={item.id}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{formatDateMillis(item.visitDate)} • {item.visitType ?? 'Kontrol'}</Text>
            <Text style={{ color: colors.text2, marginTop: 6 }}>
              {[
                item.painVas !== null && item.painVas !== undefined ? `VAS ${item.painVas}` : null,
                item.ecog !== null && item.ecog !== undefined ? `ECOG ${item.ecog}` : null,
                item.mstsScore !== null && item.mstsScore !== undefined ? `MSTS ${item.mstsScore}` : null,
                item.localRecurrenceStatus,
                item.metastasisStatus,
              ].filter(Boolean).join(' • ') || 'Özet yok'}
            </Text>
            {(item.findings || item.imagingSummary || item.plan) ? (
              <Text style={{ color: colors.text3, marginTop: 8 }}>
                {[item.findings, item.imagingSummary, item.plan].filter(Boolean).join(' • ')}
              </Text>
            ) : null}
            {item.nextVisitDate ? <Text style={{ color: colors.text3, marginTop: 8 }}>Sonraki vizit: {formatDateMillis(item.nextVisitDate)}</Text> : null}
          </Card>
        ))}
        {followUps.length === 0 && <Text style={{ color: colors.text3 }}>Henüz takip kaydı yok.</Text>}
      </View>

      <SectionTitle>Kaydedilmiş skorlar</SectionTitle>
      <View style={{ gap: 10 }}>
        {scores.map((score) => (
          <Card key={score.id}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{score.scoring_system}</Text>
            <Text style={{ color: colors.text2, marginTop: 4 }}>{score.total_score} • {score.interpretation}</Text>
          </Card>
        ))}
        {scores.length === 0 && <Text style={{ color: colors.text3 }}>Henüz skor kaydı yok.</Text>}
      </View>

      <SectionTitle>Detay alanları</SectionTitle>
      <View style={{ gap: 10 }}>
        {[
          ['Tanı tarihi', formatDateString(patient.diagnosisDate)],
          ['Biyopsi', [formatDateString(patient.biopsyDate), patient.biopsyType].filter(Boolean).join(' • ')],
          ['Davranış', patient.tumorBehavior],
          ['Köken', patient.tumorOrigin],
          ['Kompartman', patient.compartmentStatus],
          ['Tanıda metastaz', patient.metastaticAtDiagnosis],
          ['Skip metastaz', patient.skipMetastasis],
          ['Patolojik kırık', patient.pathologicalFracture],
          ['Cerrahi tarihi', formatDateString(patient.surgeryDate)],
          ['Cerrahi amaç', patient.surgeryIntent],
          ['Kemoterapi', [patient.neoadjuvantChemo, patient.adjuvantChemo, patient.chemoProtocol].filter(Boolean).join(' • ')],
          ['Radyoterapi', [patient.radiotherapy, patient.radiotherapyDoseGy ? `${patient.radiotherapyDoseGy} Gy` : null].filter(Boolean).join(' • ')],
          ['Cerrahi sınır', patient.surgicalMargin],
          ['Nekroz oranı', patient.necrosisRatePct !== null && patient.necrosisRatePct !== undefined ? `%${patient.necrosisRatePct}` : null],
          ['Lokal nüks tarihi', formatDateString(patient.localRecurrenceDate)],
          ['Metastaz tarihi', formatDateString(patient.metastasisDate)],
          ['Son temas', formatDateString(patient.lastContactDate)],
        ].filter(([, value]) => Boolean(value)).map(([label, value]) => (
          <Card key={label}>
            <Text style={{ color: colors.text3, fontSize: 12 }}>{label}</Text>
            <Text style={{ color: colors.text, fontWeight: '700', marginTop: 4 }}>{String(value)}</Text>
          </Card>
        ))}
      </View>

      {patient.notes ? (
        <>
          <SectionTitle>Notlar</SectionTitle>
          <Card>
            <Text style={{ color: colors.text2 }}>{patient.notes}</Text>
          </Card>
        </>
      ) : null}
    </ScrollView>
  );
}
