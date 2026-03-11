import { ScrollView, Text, View } from 'react-native';
import { classifications } from '@/src/data/classifications';
import { colors } from '@/src/theme/colors';

export default function ClassificationsScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, gap: 14 }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800' }}>Sınıflamalar</Text>
      {classifications.map((group) => (
        <View key={group.category} style={{ gap: 10 }}>
          <Text style={{ color: colors.amber, fontWeight: '800' }}>{group.category}</Text>
          {group.items.map((item) => (
            <View key={item.name} style={{ backgroundColor: colors.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>{item.name}</Text>
              <Text style={{ color: colors.text2, marginTop: 4 }}>{item.description}</Text>
              {item.details.map((detail) => (
                <Text key={detail} style={{ color: colors.text3, marginTop: 6 }}>• {detail}</Text>
              ))}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
