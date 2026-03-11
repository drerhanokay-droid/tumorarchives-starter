import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { scoringSystems } from '@/src/data/scoring';
import { saveScore } from '@/src/repositories/scores';
import { colors } from '@/src/theme/colors';

export default function ScoringScreen() {
  const runQuickDemo = async () => {
    const sys = scoringSystems[0];
    const answers = sys.questions.map(() => sys.id === 'msts' ? 5 : 1);
    const total = answers.reduce((sum, item) => sum + item, 0);
    Alert.alert('Örnek hesaplama', `${sys.name}: ${total} / ${sys.interpret(total)}`);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, gap: 14 }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800' }}>Skorlama</Text>
      <Text style={{ color: colors.text2 }}>Bu starter yapıda örnek skor motoru ve hasta bazlı skor kaydı hazırdır.</Text>
      <Pressable onPress={runQuickDemo} style={{ backgroundColor: colors.primary, padding: 14, borderRadius: 14 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '800' }}>Örnek Hesaplama</Text>
      </Pressable>
      {scoringSystems.map((system) => (
        <View key={system.id} style={{ backgroundColor: colors.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>{system.name}</Text>
          <Text style={{ color: colors.text2, marginTop: 4 }}>{system.description}</Text>
          <Text style={{ color: colors.text3, marginTop: 8 }}>{system.questions.length} soru</Text>
        </View>
      ))}
    </ScrollView>
  );
}
