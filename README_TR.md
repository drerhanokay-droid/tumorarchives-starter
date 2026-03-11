# TumorArchives Starter Kit

Bu paket, telefon üzerinde çalışan ve hasta verilerini cihaz içinde tutan bir **tümör arşivi mobil uygulaması** için başlangıç altyapısıdır.

## İçerik

- `mobile/`: Expo + React Native + TypeScript başlangıç uygulaması
- `backend/`: FastAPI tabanlı minimum lisans / kimlik doğrulama servisi
- `docs/`: mimari ve klinik veri modeli notları

## Hedef mimari

- Hasta verisi ve görüntüler: **yalnızca cihazda**
- Yerel veritabanı: **SQLite + SQLCipher**
- DB anahtarı: **SecureStore**
- Uygulama kilidi: **biyometrik doğrulama**
- Görüntüler: cihaz içi dosya sistemi
- Sunucu: sadece **login / lisans / cihaz yönetimi**

## Bu güncellemede eklenenler

- detaylı **hasta değişkenleri**
- detaylı **takip viziti değişkenleri**
- detaylı **görüntü metadata** alanları
- takip viziti repository ve form ekranı
- galeriden ve kameradan görüntü ekleme akışı
- anonymized export içinde takip ve görüntü sayıları
- şema migrasyon akışında ilk kurulum hatasının düzeltilmesi

## 1) Mobil projeyi çalıştırma

```bash
npx create-expo-app@latest tumorarchives --template default@sdk-55
cd tumorarchives

# Bu starter paketteki mobile/ içeriğini proje köküne kopyala

npm install
npx expo prebuild
npx expo run:android
# veya
npx expo run:ios
```

## 2) Backend'i çalıştırma

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

## 3) Önemli dokümanlar

- `docs/ARCHITECTURE_TR.md`
- `docs/CLINICAL_DATA_MODEL_TR.md`
- `docs/LANDING_PAGE_SECTIONS_TR.md`

## 4) İlk geliştirme öncelikleri

1. Hasta CRUD ekranını bitir
2. Görüntü galerisi + kamera akışını sertleştir
3. Takip vizitlerinde komplikasyon ve reoperasyon şablonları ekle
4. Skor hesaplayıcı ekranlarını genişlet
5. CSV / JSON / Excel dışa aktarımını zenginleştir
6. Lisans + cihaz doğrulamasını mobil tarafa bağla
7. KVKK metinleri ve hukuki akışı ekle

## 5) Bu starter neleri özellikle gösteriyor?

- Şifreli DB açılışı
- Biyometrik giriş
- Zengin hasta formu
- Takip viziti formu
- Hasta detay ekranı
- Galeriden ve kameradan görüntü seçip cihaza kopyalama
- Anonim CSV / JSON dışa aktarım iskeleti
- Lisans backend iskeleti

## 6) Bu starter neleri henüz tamamlamıyor?

- Excel (`.xlsx`) üretimi
- thumbnail üretimi
- DICOM işleme ve DICOM viewer
- gelişmiş offline lisans süresi kontrolü
- 378 sınıflama ve 31+ skor sisteminin tam veri seti
- audit log / kullanıcı rolleri / kurum yönetimi
- güvenli şifreli yedek import/export akışı

## 7) Önerilen sonraki sprint

- follow-up ekranını timeline görünümüne çevir
- komplikasyon sözlüğü ve reoperasyon modülü ekle
- görüntü metadata düzenleme ekranı ekle
- Excel export ve filtrelenmiş araştırma kohortu ekle
- landing page'i mobil uygulama ile aynı tasarım diline bağla
