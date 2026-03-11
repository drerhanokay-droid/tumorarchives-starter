import { Alert, Pressable, ScrollView, Text } from 'react-native';
import { exportAnonymizedCsv, exportAnonymizedJson } from '@/src/services/exportService';
import { colors } from '@/src/theme/colors';

export default function SettingsScreen() {
  const handleExportJson = async () => {
    const uri = await exportAnonymizedJson();
    Alert.alert('JSON hazır', uri);
  };

  const handleExportCsv = async () => {
    const uri = await exportAnonymizedCsv();
    Alert.alert('CSV hazır', uri);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, gap: 14 }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800' }}>Ayarlar ve dışa aktarım</Text>
      <Text style={{ color: colors.text2 }}>Bu sürümde dışa aktarım cihaz içindeki exports klasörüne yazılır. İstersen bir sonraki adımda paylaşım menüsü ve Excel çıktısı da eklenebilir.</Text>

      <Pressable onPress={handleExportCsv} style={{ backgroundColor: colors.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ color: colors.text, fontWeight: '700' }}>Anonim CSV dışa aktar</Text>
        <Text style={{ color: colors.text3, marginTop: 4 }}>Ad, soyad, telefon gibi alanlar dışarı verilmez.</Text>
      </Pressable>

      <Pressable onPress={handleExportJson} style={{ backgroundColor: colors.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ color: colors.text, fontWeight: '700' }}>Anonim JSON dışa aktar</Text>
        <Text style={{ color: colors.text3, marginTop: 4 }}>Araştırma ve yedekleme için JSON paket üretir.</Text>
      </Pressable>
    </ScrollView>
  );
}
