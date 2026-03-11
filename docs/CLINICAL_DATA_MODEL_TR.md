# Klinik Veri Modeli — TumorArchives

Bu doküman, uygulamadaki **hasta değişkenleri**, **takip viziti değişkenleri** ve **görüntü yükleme metadata alanlarını** netleştirir.

## 1. Hasta değişkenleri

### Kimlik / dosya
- `firstName`, `lastName`
- `age`, `dateOfBirth`
- `gender`
- `phone`
- `nationalIdMasked` → tam T.C. no yerine maskeli kayıt önerilir
- `protocolNo`
- `hospitalName`
- `referringClinic`

### Tanı / patoloji
- `diagnosisDate`
- `biopsyDate`
- `biopsyType`
- `pathologyReportNo`
- `tumorOrigin` → `bone`, `soft_tissue`, `metastatic`, `other`
- `tumorBehavior` → `benign`, `intermediate`, `malignant`, `metastatic`, `unknown`
- `tumorType`
- `tumorSubtype`
- `tumorLocation`
- `boneSegment`
- `tumorSide`
- `compartmentStatus`
- `ennekingStage`
- `ajccT`, `ajccN`, `ajccM`
- `histologicGrade`
- `tumorSizeCm`
- `metastaticAtDiagnosis`
- `skipMetastasis`
- `pathologicalFracture`

### Tedavi
- `surgeryDate`
- `surgeryType`
- `surgeryIntent`
- `reconstruction`
- `implantType`
- `neoadjuvantChemo`
- `adjuvantChemo`
- `chemoProtocol`
- `radiotherapy`
- `radiotherapyDoseGy`
- `surgicalMargin`
- `necrosisRatePct`

### Sonuç / onkolojik durum
- `localRecurrence`
- `localRecurrenceDate`
- `metastasis`
- `metastasisDate`
- `currentStatus`
- `deathDate`
- `lastContactDate`
- `notes`

## 2. Takip viziti değişkenleri

Her vizit ayrı satır olmalı. Tek bir “takip notu” alanı yeterli değil.

### Temel alanlar
- `visitDate`
- `visitType` → kontrol, post-op, onkoloji, acil, revizyon vb.
- `postoperativeMonth`

### Semptom / fonksiyon
- `complaint`
- `findings`
- `painVas`
- `ecog`
- `karnofsky`
- `mstsScore`
- `romSummary`
- `weightBearingStatus`

### Onkolojik durum
- `localRecurrenceStatus`
- `metastasisStatus`
- `lungMetastasisStatus`
- `imagingSummary`
- `pathologySummary`

### Rekonstrüksiyon / yara / implant
- `woundStatus`
- `implantStatus`
- `unionStatus`

### Olaylar ve plan
- `complicationsJson`
- `treatmentSinceLastVisit`
- `plan`
- `nextVisitDate`

## 3. Görüntü yükleme metadata alanları

Görüntüyü DB içine base64 olarak değil, cihaz dosya sistemine koy; DB’de sadece yol ve metadata tut.

### Zorunlu
- `patientId`
- `fileUri`
- `createdAt`

### Önerilen metadata
- `label`
- `imageType` → `xray`, `mri`, `ct`, `clinical`, `pathology`, `pet`, `usg`, `other`
- `modality`
- `bodyPart`
- `bodySide`
- `sourceType` → `camera`, `gallery`, `document_import`, `other`
- `capturedAt`
- `mimeType`
- `fileSizeBytes`
- `width`, `height`
- `thumbnailUri`
- `checksum`
- `notes`

## 4. Akış önerisi

### Yeni hasta
1. Kimlik/dosya alanları
2. Tanı/patoloji alanları
3. Tedavi alanları
4. İlk görüntü yükleme
5. İlk skor ve ilk takip viziti

### Takip viziti
1. Vizit tarihi
2. Semptom ve fonksiyon
3. Görüntüleme özeti
4. Nüks / metastaz durumu
5. İmplant / yara / kaynama
6. Plan ve sonraki tarih

### Görüntü yükleme
1. Kaynak seçimi: kamera / galeri
2. Etiket ve modalite
3. Gerekirse anatomik bölge ve taraf
4. Dosyayı uygulama klasörüne kopyala
5. DB’ye metadata yaz

## 5. Güvenlik notu

- Hasta adı-soyadı ve telefon sadece cihazda kalmalı.
- Dışa aktarımda bu alanlar kaldırılmalı veya anonimize edilmelidir.
- `nationalIdMasked` gibi alanlarda tam kimlik numarası tutmamak daha güvenlidir.
- Görüntü export modülü ayrı izin ve onay ekranı istemelidir.
