# 🚀 Sekondy Ekibi - Yeni Geliştirici Rehberi

Öncelikle aramıza hoş geldiniz! "Git kullanımı çok karışık" diyorsanız hiç dert etmeyin. Aşağıdaki adımları **sırayla ve kopyala-yapıştır** mantığıyla yaptığınızda harika bir şekilde çalışacağız.

## Özet Kural:
**KİMSE, HİÇBİR ZAMAN `main` BRANCH'İNE DOĞRUDAN KOD PUSH'LAYAMAZ.** 
Herkes kendi adıyla branch açıp kodunu oraya yazacak ve sonra Emre, GitHub üzerinden kodları inceleyip ana projeye ekleyecek.

---

### ☀️ Sabah Çalışmaya Başlarken (ÖNEMLİ)
Dün yazdığınız kodlardan sonra ve bugün yeni bir koda başlamadan önce, projenin en güncel (Emre'nin onayladığı) halini kendi bilgisayarınıza çekmeniz zorunludur:
```bash
git checkout main
git pull origin main
```

### 🌿 Kendinize Ait Yeni Bir Sayfa/Görev Yazarken
Her bir yeni sayfa tasarımı (örneğin Kayıt olma sayfası) için önce kendi çalışma masanızı (branch) ve dalınızı oluşturmalısınız:
```bash
# Sadece İlk Kez Yaparken:
git checkout -b ozellik/kendiAdiniz-yaptiginizIs
# Örnek: git checkout -b ozellik/furkan-register
```

### 💻 Kodlarınızı Yazdıktan ve Test Ettikten Sonra (Akşam Paydos)
React ekranını veya backend'i yazdınız, test ettiniz ve süper çalışıyor! Bunu hocanızın görebilmesi ve Emre'nin ana projeye çekebilmesi için göndermeliyiz:

```bash
# 1. Hangi dosyaların değiştiğini gör (Sadece kontrol amaçlı)
git status

# 2. Yaptığın tüm değişiklikleri pakete ekle (noktaya dikkat)
git add .

# 3. Yaptığın işi anlatan ZORUNLU bir mesaj yaz (İngilizce olmak zorunda değil)
git commit -m "Furkan: Kullanıcı kayıt olma ekranına butonlar eklendi ve axios yazıldı"

# 4. Kendi dalını (branch) Github'a Gönder! (Branch adınıza dikkat edin)
# İlk gönderme için komut:
git push -u origin ozellik/furkan-register

# İkinci ve sonraki göndermelerinizde sadece şu yeterli:
git push
```

### 🔀 Emre'ye "Benim İşimi Ana Projeye Al" Demek (Pull Request)
- `git push` yaptıktan sonra [Sekondy Github Sayfasına](https://github.com/) gidin.
- Üstte sarı renkte veya yeşil buton halinde **"Compare & pull request"** yazısı belirecek. Ona tıklayın.
- Açıklamaya *"Bunu Emre incelesin, sorun yoksa merge etsin"* yazıp **Create Pull Request** diyerek Emre'nin önüne işinizi bırakın. 
Geriye kalan işlemleri ve çakışmaları (conflict) Baş Mimar Emre halledecektir.

---

## 👨‍💻 Sadece EMRE İçin (Ana Yetkili İşlemleri)
Emre, arkadaşlarından PR (Pull Request) geldiğinde çakışmaları çözmen ve bunları asıl repoya (main'e) katman için senin adımların şu şekilde:

**A. Çakışma (Conflict) Varsa (Manuel Çözüm):**
```bash
git checkout main
git pull origin main
# Arkadaşının branch'ini kendi lokal main'ine çek:
git merge ozellik/furkan-register
# VS Code sana çakışan dosyaları "Accept Current", "Accept Incoming" butonlarıyla gösterecek. Hangi kod doğruysa onu seçip kaydet.
git add .
git commit -m "Merge conflict çözüldü ve Furkan'ın auth sayfası eklendi"
git push origin main
```

**B. Gelen Kod Temizse:**
Github web sitesi üzerinden PR kısmına gir, kodu incele, onaylıyorsan yeşil **Merge Pull Request** butonuna bas ve mutlu son!
