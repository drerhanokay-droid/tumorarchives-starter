export const scoringSystems = [
  {
    id: 'msts',
    name: 'MSTS',
    description: 'Ekstremite fonksiyonel skorlama',
    questions: [
      { label: 'Ağrı', options: [5, 4, 3, 2, 1, 0] },
      { label: 'Fonksiyon', options: [5, 4, 3, 2, 1, 0] },
      { label: 'Emosyonel Kabul', options: [5, 4, 3, 2, 1, 0] },
      { label: 'Destek', options: [5, 4, 3, 2, 1, 0] },
      { label: 'Yürüme / El Becerisi', options: [5, 4, 3, 2, 1, 0] },
      { label: 'Hareket Açıklığı', options: [5, 4, 3, 2, 1, 0] }
    ],
    interpret(total: number) {
      const pct = Math.round((total / 30) * 100);
      if (pct >= 80) return `%${pct} - Mükemmel`;
      if (pct >= 60) return `%${pct} - İyi`;
      if (pct >= 40) return `%${pct} - Orta`;
      return `%${pct} - Düşük`;
    }
  },
  {
    id: 'mirels',
    name: 'Mirels',
    description: 'Patolojik kırık riski',
    questions: [
      { label: 'Lokalizasyon', options: [1, 2, 3] },
      { label: 'Ağrı', options: [1, 2, 3] },
      { label: 'Lezyon tipi', options: [1, 2, 3] },
      { label: 'Korteks tutulumu', options: [1, 2, 3] }
    ],
    interpret(total: number) {
      if (total <= 7) return 'Düşük risk';
      if (total === 8) return 'Ara risk';
      return 'Yüksek risk';
    }
  }
];
