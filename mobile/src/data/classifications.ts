export const classifications = [
  {
    category: 'Kemik Tümörleri',
    items: [
      {
        name: 'Enneking Cerrahi Evreleme',
        description: 'Muskuloskeletal tümörler için cerrahi evreleme sistemi',
        details: [
          'Evre IA: düşük grade, intrakompartmantal',
          'Evre IB: düşük grade, ekstrakompartmantal',
          'Evre IIA: yüksek grade, intrakompartmantal',
          'Evre IIB: yüksek grade, ekstrakompartmantal',
          'Evre III: metastatik hastalık'
        ]
      },
      {
        name: 'Campanacci',
        description: 'Dev hücreli tümör için radyolojik dereceleme',
        details: ['Grade I latent', 'Grade II aktif', 'Grade III agresif']
      }
    ]
  },
  {
    category: 'Spinal Metastaz',
    items: [
      {
        name: 'SINS',
        description: 'Spinal instabilite neoplastik skoru',
        details: ['0-6 stabil', '7-12 belirsiz', '13-18 instabil']
      },
      {
        name: 'Tokuhashi',
        description: 'Spinal metastazlarda prognoz tahmini',
        details: ['0-8 konservatif', '9-11 palyatif cerrahi', '12-15 eksizyon düşünülebilir']
      }
    ]
  }
];
