# Mimari Notlar

## Neden web sitesi değil, mobil uygulama?

Senin hedefinde kritik nokta şu:

- klinik veri ve görüntü telefonda kalacak
- sunucuya hasta verisi gitmeyecek
- çevrimdışı kullanılacak
- galeriden ve kameradan hasta görseli alınacak

Bu yüzden asıl ürünün **PWA değil native mobil uygulama** olması daha doğru.

## Ürün katmanları

### 1. Mobil istemci
- Expo / React Native
- SQLite + SQLCipher
- SecureStore ile anahtar saklama
- LocalAuthentication ile uygulama kilidi
- FileSystem ile cihaz içi görüntü klasörü
- ImagePicker ile galeri + kamera akışı

### 2. Backend
- FastAPI
- kullanıcı hesabı
- lisans kontrolü
- cihaz limiti
- token doğrulama

### 3. İçerik veri paketleri
- sınıflamalar JSON
- skorlamalar JSON
- yorum kuralları
- lokalizasyon listeleri
- tümör tipleri
- takip şablonları

## Klinik veri modülleri

### Hasta kartı
Kimlik, tanı, patoloji, evreleme, tedavi, sonuç özeti.

### Takip vizitleri
Her vizit ayrı kayıt tutulur. Ağrı, ECOG, MSTS, görüntüleme özeti, nüks/metastaz durumu, implant/yara durumu ve plan ayrı alanlar olmalıdır.

### Görüntü arşivi
Görüntü dosyası cihaz klasörüne kopyalanır. DB içine sadece dosya yolu ve metadata yazılır.

## Tavsiye edilen ek modüller

- DICOM import (ikinci faz)
- thumbnail üretimi
- lokal full text arama
- otomatik yedek şifreleme
- araştırma kohort filtreleme
- nüks / metastaz zaman çizelgesi
- komplikasyon ve reoperasyon modülü

## Önemli uygulama kararları

### Görüntüleri DB içine base64 koyma
Görüntüleri doğrudan veritabanında tutmak yerine dosya sistemi içinde saklayıp DB'de sadece yol ve metadata tut.

### Sunucuya hasta datası gönderme
Backend sadece login / lisans / cihaz doğrulama görsün.

### Anahtar yönetimi
DB şifre anahtarını kullanıcı şifresinden doğrudan türetmek yerine cihaz güvenli saklama alanında da koru.

### Offline lisans
Son başarılı lisans doğrulamasından sonra cihaz içinde imzalı bir lisans cache'i tut.

### Veri modelleme
- Hasta kaydı = tekil dosya özeti
- Takip kaydı = zaman serisi kayıt
- Görüntü kaydı = dosya + metadata
- Skor kaydı = hesap sonucu + cevap JSON'u

## Yayın stratejisi

- önce Android internal test
- sonra iOS TestFlight
- küçük doktor grubuyla saha testi
- ancak ondan sonra store release
