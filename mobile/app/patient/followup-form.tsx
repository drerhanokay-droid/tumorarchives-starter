import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { deleteFollowUp, getFollowUpById, upsertFollowUp } from '@/src/repositories/followUps';
import { colors } from '@/src/theme/colors';

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

const Section = ({ title, children }: any) => (
  <View style={{ gap: 12, paddingTop: 6 }}>
    <Text style={{ color: colors.teal, fontSize: 13, fontWeight: '800', letterSpacing: 1 }}>{title}</Text>
    {children}
  </View>
);

const parseNumber = (value: string) => {
  if (!value.trim()) return null;
  const n = Number(value.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

export default function FollowUpFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; patientId?: string }>();
  const isEdit = useMemo(() => Boolean(params.id), [params.id]);
  const [form, setForm] = useState<any>({
    visitDate: new Date().toISOString().slice(0, 10),
    visitType: 'Kontrol',
    postoperativeMonth: '',
    complaint: '',
    findings: '',
    painVas: '',
    ecog: '',
    karnofsky: '',
    mstsScore: '',
    localRecurrenceStatus: '',
    metastasisStatus: '',
    lungMetastasisStatus: '',
    woundStatus: '',
    implantStatus: '',
    unionStatus: '',
    weightBearingStatus: '',
    romSummary: '',
    imagingSummary: '',
    pathologySummary: '',
    complicationsJson: '',
    treatmentSinceLastVisit: '',
    plan: '',
    nextVisitDate: '',
  });

  useEffect(() => {
    if (!params.id) return;
    getFollowUpById(params.id).then((record) => {
      if (!record) return;
      setForm({
        ...record,
        visitDate: new Date(record.visitDate).toISOString().slice(0, 10),
        postoperativeMonth: record.postoperativeMonth?.toString() ?? '',
        painVas: record.painVas?.toString() ?? '',
        ecog: record.ecog?.toString() ?? '',
        karnofsky: record.karnofsky?.toString() ?? '',
        mstsScore: record.mstsScore?.toString() ?? '',
        nextVisitDate: record.nextVisitDate ? new Date(record.nextVisitDate).toISOString().slice(0, 10) : '',
      });
    });
  }, [params.id]);

  const setValue = (key: string, value: string) => setForm((current: any) => ({ ...current, [key]: value }));

  const onSave = async () => {
    if (!params.patientId) {
      Alert.alert('Hasta bulunamadı', 'Takip kaydı için hasta kimliği gerekli.');
      return;
    }

    const visitDate = new Date(form.visitDate || '').getTime();
    if (!Number.isFinite(visitDate)) {
      Alert.alert('Geçersiz tarih', 'Vizit tarihini YYYY-MM-DD biçiminde gir.');
      return;
    }

    await upsertFollowUp({
      id: params.id,
      patientId: params.patientId,
      visitDate,
      visitType: form.visitType || null,
      postoperativeMonth: parseNumber(form.postoperativeMonth),
      complaint: form.complaint || null,
      findings: form.findings || null,
      painVas: parseNumber(form.painVas),
      ecog: parseNumber(form.ecog),
      karnofsky: parseNumber(form.karnofsky),
      mstsScore: parseNumber(form.mstsScore),
      localRecurrenceStatus: form.localRecurrenceStatus || null,
      metastasisStatus: form.metastasisStatus || null,
      lungMetastasisStatus: form.lungMetastasisStatus || null,
      woundStatus: form.woundStatus || null,
      implantStatus: form.implantStatus || null,
      unionStatus: form.unionStatus || null,
      weightBearingStatus: form.weightBearingStatus || null,
      romSummary: form.romSummary || null,
      imagingSummary: form.imagingSummary || null,
      pathologySummary: form.pathologySummary || null,
      complicationsJson: form.complicationsJson || null,
      treatmentSinceLastVisit: form.treatmentSinceLastVisit || null,
      plan: form.plan || null,
      nextVisitDate: form.nextVisitDate ? new Date(form.nextVisitDate).getTime() : null,
    });

    router.replace(`/patient/${params.patientId}`);
  };

  const onDelete = async () => {
    if (!params.id || !params.patientId) return;
    Alert.alert('Takibi sil', 'Bu takip kaydı silinsin mi?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await deleteFollowUp(params.id as string);
          router.replace(`/patient/${params.patientId}`);
        }
      }
    ]);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, gap: 14 }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800' }}>{isEdit ? 'Takip Düzenle' : 'Yeni Takip Viziti'}</Text>
      <Text style={{ color: colors.text3 }}>Tarih alanlarını YYYY-MM-DD biçiminde gir.</Text>

      <Section title="VİZİT">
        <Field label="Vizit Tarihi" value={form.visitDate} onChangeText={(v: string) => setValue('visitDate', v)} />
        <Field label="Vizit Tipi" value={form.visitType} onChangeText={(v: string) => setValue('visitType', v)} />
        <Field label="Postop Ay" value={form.postoperativeMonth} onChangeText={(v: string) => setValue('postoperativeMonth', v)} keyboardType="numeric" />
      </Section>

      <Section title="SEMPTOM / MUAYENE">
        <Field label="Şikayet" value={form.complaint} onChangeText={(v: string) => setValue('complaint', v)} multiline />
        <Field label="Bulgular" value={form.findings} onChangeText={(v: string) => setValue('findings', v)} multiline />
        <Field label="VAS" value={form.painVas} onChangeText={(v: string) => setValue('painVas', v)} keyboardType="numeric" />
        <Field label="ECOG" value={form.ecog} onChangeText={(v: string) => setValue('ecog', v)} keyboardType="numeric" />
        <Field label="Karnofsky" value={form.karnofsky} onChangeText={(v: string) => setValue('karnofsky', v)} keyboardType="numeric" />
        <Field label="MSTS" value={form.mstsScore} onChangeText={(v: string) => setValue('mstsScore', v)} keyboardType="numeric" />
        <Field label="ROM Özeti" value={form.romSummary} onChangeText={(v: string) => setValue('romSummary', v)} />
        <Field label="Yük Verme" value={form.weightBearingStatus} onChangeText={(v: string) => setValue('weightBearingStatus', v)} />
      </Section>

      <Section title="ONKOLOJİ / İMPLANT">
        <Field label="Lokal Nüks Durumu" value={form.localRecurrenceStatus} onChangeText={(v: string) => setValue('localRecurrenceStatus', v)} />
        <Field label="Metastaz Durumu" value={form.metastasisStatus} onChangeText={(v: string) => setValue('metastasisStatus', v)} />
        <Field label="Akciğer Metastazı" value={form.lungMetastasisStatus} onChangeText={(v: string) => setValue('lungMetastasisStatus', v)} />
        <Field label="Yara Durumu" value={form.woundStatus} onChangeText={(v: string) => setValue('woundStatus', v)} />
        <Field label="İmplant Durumu" value={form.implantStatus} onChangeText={(v: string) => setValue('implantStatus', v)} />
        <Field label="Kaynama Durumu" value={form.unionStatus} onChangeText={(v: string) => setValue('unionStatus', v)} />
      </Section>

      <Section title="TETKİK / PLAN">
        <Field label="Görüntüleme Özeti" value={form.imagingSummary} onChangeText={(v: string) => setValue('imagingSummary', v)} multiline />
        <Field label="Patoloji Özeti" value={form.pathologySummary} onChangeText={(v: string) => setValue('pathologySummary', v)} multiline />
        <Field label="Komplikasyonlar JSON" value={form.complicationsJson} onChangeText={(v: string) => setValue('complicationsJson', v)} multiline />
        <Field label="Son Vizitten Beri Tedavi" value={form.treatmentSinceLastVisit} onChangeText={(v: string) => setValue('treatmentSinceLastVisit', v)} multiline />
        <Field label="Plan" value={form.plan} onChangeText={(v: string) => setValue('plan', v)} multiline />
        <Field label="Sonraki Vizit" value={form.nextVisitDate} onChangeText={(v: string) => setValue('nextVisitDate', v)} />
      </Section>

      <Pressable onPress={onSave} style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 14, marginTop: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '800' }}>Takibi Kaydet</Text>
      </Pressable>
      {isEdit && (
        <Pressable onPress={onDelete} style={{ backgroundColor: '#3b0f19', padding: 16, borderRadius: 14 }}>
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '800' }}>Takibi Sil</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
