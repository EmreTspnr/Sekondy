# API Tasarımı - OpenAPI Specification Örneği

**OpenAPI Spesifikasyon Dosyası:** [lamine.yaml](lamine.yaml)

Bu doküman, OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış örnek bir API tasarımını içermektedir.

## OpenAPI Specification

```yaml
openapi: 3.0.3
info:
  title: Sekondy
  version: 1.0.0
  description: >
    Bu API, ikinci el eşya/mülk alım satım platformunun temel gereksinimlerini karşılamak üzere tasarlanmıştır.
    Kullanıcı yönetimi, ilan işlemleri, mesajlaşma, favoriler, arama kayıtları ve admin moderasyon süreçlerini içerir.
servers:
  - url: https://api.ikincielprojesi.com/v1
    description: Üretim Sunucusu (Production) (Örnektir)

tags:
  - name: Auth
    description: Kimlik doğrulama ve kayıt işlemleri
  - name: Profile
    description: Kullanıcı profili yönetimi
  - name: Ads
    description: İlan oluşturma, güncelleme ve listeleme
  - name: Users
    description: Kullanıcı etkileşimleri (Takip vb.)
  - name: Saved Searches
    description: Kayıtlı aramalar ve bildirimler
  - name: Messages
    description: Kullanıcılar arası mesajlaşma
  - name: Favorites
    description: Favori ilan yönetimi
  - name: Reports
    description: Şikayet yönetimi
  - name: Admin
    description: Sistem yöneticisi işlemleri

security:
  - BearerAuth: []

paths:
  /auth/register:
    post:
      tags: [Auth]
      summary: Kullanıcı Kayıt Olma
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterInput'
      responses:
        "201":
          description: Başarılı kayıt
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        "400":
          $ref: '#/components/responses/BadRequest'

  /auth/login:
    post:
      tags: [Auth]
      summary: Sisteme Giriş Yapma (2)
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginInput'
      responses:
        "200":
          description: Başarılı giriş
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        "401":
          $ref: '#/components/responses/Unauthorized'

  /auth/history:
    get:
      tags: [Auth]
      summary: Giriş Geçmişini Listeleme (6)
      responses:
        "200":
          description: Başarılı
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/LoginHistory'
        "401":
          $ref: '#/components/responses/Unauthorized'

  /profile:
    get:
      tags: [Profile]
      summary: Kullanıcı Profilini Görüntüleme (4)
      responses:
        "200":
          description: Profil bilgileri
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        "401":
          $ref: '#/components/responses/Unauthorized'
    put:
      tags: [Profile]
      summary: Profil Bilgilerini Güncelleme (3)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProfileUpdateInput'
      responses:
        "200":
          description: Başarılı güncelleme
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        "400":
          $ref: '#/components/responses/BadRequest'
        "401":
          $ref: '#/components/responses/Unauthorized'
    delete:
      tags: [Profile]
      summary: Kullanıcı Hesabını Silme (5)
      responses:
        "204":
          description: Hesap başarıyla silindi
        "401":
          $ref: '#/components/responses/Unauthorized'

  /ads:
    post:
      tags: [Ads]
      summary: Yeni İlan Ekleme (7)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AdInput'
      responses:
        "201":
          description: İlan oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Ad'
        "400":
          $ref: '#/components/responses/BadRequest'
        "401":
          $ref: '#/components/responses/Unauthorized'

  /ads/{adId}:
    parameters:
      - $ref: '#/components/parameters/adIdParam'
    get:
      tags: [Ads]
      summary: İlan Detaylarını Görüntüleme (10)
      security: []
      responses:
        "200":
          description: İlan detayları
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Ad'
        "404":
          $ref: '#/components/responses/NotFound'
    put:
      tags: [Ads]
      summary: İlan Bilgilerini Güncelleme (9)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AdInput'
      responses:
        "200":
          description: Başarılı güncelleme
        "401":
          $ref: '#/components/responses/Unauthorized'
        "403":
          $ref: '#/components/responses/Forbidden'
        "404":
          $ref: '#/components/responses/NotFound'
    delete:
      tags: [Ads]
      summary: İlanı Silme (11)
      responses:
        "204":
          description: İlan silindi
        "401":
          $ref: '#/components/responses/Unauthorized'
        "403":
          $ref: '#/components/responses/Forbidden'
        "404":
          $ref: '#/components/responses/NotFound'

  /ads/{adId}/photos:
    post:
      tags: [Ads]
      summary: İlana Fotoğraf Yükleme (8)
      parameters:
        - $ref: '#/components/parameters/adIdParam'
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
      responses:
        "200":
          description: Fotoğraf başarıyla yüklendi
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Fotoğraf başarıyla eklendi."
                  photoUrl:
                    type: string
                    format: uri
                    example: "https://api.ikincielprojesi.com/uploads/ads/photo1.jpg"
        "400":
          $ref: '#/components/responses/BadRequest'
        "401":
          $ref: '#/components/responses/Unauthorized'
        "403":
          $ref: '#/components/responses/Forbidden'

  /my-ads:
    get:
      tags: [Ads]
      summary: Kendi İlanlarını Listeleme (12)
      parameters:
        - $ref: '#/components/parameters/pageParam'
        - $ref: '#/components/parameters/limitParam'
      responses:
        "200":
          description: Kullanıcının ilanları
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Ad'
        "401":
          $ref: '#/components/responses/Unauthorized'

  /ads/category/{categoryId}:
    get:
      tags: [Ads]
      summary: Kategoriye Göre İlan Listeleme (17)
      security: []
      parameters:
        - name: categoryId
          in: path
          required: true
          schema:
            type: string
        - $ref: '#/components/parameters/pageParam'
        - $ref: '#/components/parameters/limitParam'
      responses:
        "200":
          description: Kategoriye ait ilanlar
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Ad'

  /ads/showcase:
    get:
      tags: [Ads]
      summary: Vitrin İlanlarını Görüntüleme (18)
      parameters:
        - $ref: '#/components/parameters/pageParam'
        - $ref: '#/components/parameters/limitParam'
      security: []
      responses:
        "200":
          description: Vitrin ilanları
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Ad'

  /users/{userId}/follow:
    post:
      tags: [Users]
      summary: Satıcıyı Takip Etme (13)
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Takip işlemi başarılı
        "401":
          $ref: '#/components/responses/Unauthorized'
        "404":
          $ref: '#/components/responses/NotFound'

  /saved-searches:
    post:
      tags: [Saved Searches]
      summary: Arama Kriterlerini Kaydetme (14)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SavedSearchInput'
      responses:
        "201":
          description: Arama kaydedildi
        "401":
          $ref: '#/components/responses/Unauthorized'

  /saved-searches/{searchId}:
    delete:
      tags: [Saved Searches]
      summary: Kayıtlı Aramayı Silme (16)
      parameters:
        - $ref: '#/components/parameters/searchIdParam'
      responses:
        "204":
          description: Başarıyla silindi
        "401":
          $ref: '#/components/responses/Unauthorized'
        "404":
          $ref: '#/components/responses/NotFound'

  /saved-searches/{searchId}/notifications:
    put:
      tags: [Saved Searches]
      summary: Arama Bildirimlerini Açma/Kapatma (15)
      parameters:
        - $ref: '#/components/parameters/searchIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                enabled:
                  type: boolean
      responses:
        "200":
          description: Bildirim tercihi güncellendi
        "401":
          $ref: '#/components/responses/Unauthorized'
        "404":
          $ref: '#/components/responses/NotFound'

  /messages:
    get:
      tags: [Messages]
      summary: Gelen Mesajları Listeleme (23)
      parameters:
        - $ref: '#/components/parameters/pageParam'
        - $ref: '#/components/parameters/limitParam'
      responses:
        "200":
          description: Mesaj listesi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Message'
        "401":
          $ref: '#/components/responses/Unauthorized'
    post:
      tags: [Messages]
      summary: Satıcıya Mesaj Gönderme (19)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MessageInput'
      responses:
        "201":
          description: Mesaj gönderildi
        "400":
          $ref: '#/components/responses/BadRequest'
        "401":
          $ref: '#/components/responses/Unauthorized'

  /messages/{messageId}:
    delete:
      tags: [Messages]
      summary: Gelen Mesajı Silme (22)
      parameters:
        - $ref: '#/components/parameters/messageIdParam'
      responses:
        "204":
          description: Mesaj silindi
        "401":
          $ref: '#/components/responses/Unauthorized'
        "404":
          $ref: '#/components/responses/NotFound'

  /messages/{messageId}/read:
    put:
      tags: [Messages]
      summary: Mesajı Okundu İşaretleme (21)
      parameters:
        - $ref: '#/components/parameters/messageIdParam'
      responses:
        "200":
          description: Okundu olarak işaretlendi
        "401":
          $ref: '#/components/responses/Unauthorized'
        "404":
          $ref: '#/components/responses/NotFound'

  /favorites:
    get:
      tags: [Favorites]
      summary: Favori İlanları Listeleme (24)
      parameters:
        - $ref: '#/components/parameters/pageParam'
        - $ref: '#/components/parameters/limitParam'
      responses:
        "200":
          description: Favoriler listesi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Ad'
        "401":
          $ref: '#/components/responses/Unauthorized'
    post:
      tags: [Favorites]
      summary: İlanı Favorilere Ekleme (20)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                adId:
                  type: string
      responses:
        "201":
          description: Favorilere eklendi
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "İlan favorilerinize eklendi."
                  adId:
                    type: string
        "401":
          $ref: '#/components/responses/Unauthorized'
        "404":
          $ref: '#/components/responses/NotFound'

  /reports:
    post:
      tags: [Reports]
      summary: İlan Şikayet Etme
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ReportInput'
      responses:
        "201":
          description: Şikayet alındı
        "401":
          $ref: '#/components/responses/Unauthorized'

  /admin/ads/pending:
    get:
      tags: [Admin]
      summary: Onay Bekleyen İlanları Listeleme
      parameters:
        - $ref: '#/components/parameters/pageParam'
        - $ref: '#/components/parameters/limitParam'
      responses:
        "200":
          description: Onay bekleyen ilanlar
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Ad'
        "401":
          $ref: '#/components/responses/Unauthorized'
        "403":
          $ref: '#/components/responses/Forbidden'

  /admin/reports:
    get:
      tags: [Admin]
      summary: Şikayet Edilen İlanları Listeleme
      parameters:
        - $ref: '#/components/parameters/pageParam'
        - $ref: '#/components/parameters/limitParam'
      responses:
        "200":
          description: Şikayet listesi
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Report'
        "401":
          $ref: '#/components/responses/Unauthorized'
        "403":
          $ref: '#/components/responses/Forbidden'

  /admin/ads/{adId}/approve:
    put:
      tags: [Admin]
      summary: İlan Durumunu Onaylama (26)
      parameters:
        - $ref: '#/components/parameters/adIdParam'
      responses:
        "200":
          description: İlan onaylandı
        "401":
          $ref: '#/components/responses/Unauthorized'
        "403":
          $ref: '#/components/responses/Forbidden'
        "404":
          $ref: '#/components/responses/NotFound'

  /admin/ads/{adId}:
    delete:
      tags: [Admin]
      summary: Uygunsuz İlanı Silme (28)
      parameters:
        - $ref: '#/components/parameters/adIdParam'
      responses:
        "204":
          description: İlan sistemden silindi
        "401":
          $ref: '#/components/responses/Unauthorized'
        "403":
          $ref: '#/components/responses/Forbidden'
        "404":
          $ref: '#/components/responses/NotFound'

  /admin/users/{userId}/suspend:
    put:
      tags: [Admin]
      summary: Kullanıcı Hesabını Askıya Alma (27)
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Kullanıcı askıya alındı
        "401":
          $ref: '#/components/responses/Unauthorized'
        "403":
          $ref: '#/components/responses/Forbidden'
        "404":
          $ref: '#/components/responses/NotFound'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  parameters:
    pageParam:
      name: page
      in: query
      description: Sayfa numarası
      schema:
        type: integer
        minimum: 1
        default: 1
    limitParam:
      name: limit
      in: query
      description: Sayfa başına gösterilecek sonuç sayısı
      schema:
        type: integer
        minimum: 1
        maximum: 50
        default: 10
    adIdParam:
      name: adId
      in: path
      required: true
      description: İlanın benzersiz kimliği
      schema:
        type: string
    searchIdParam:
      name: searchId
      in: path
      required: true
      description: Kayıtlı aramanın benzersiz kimliği
      schema:
        type: string
    messageIdParam:
      name: messageId
      in: path
      required: true
      description: Mesajın benzersiz kimliği
      schema:
        type: string

  responses:
    BadRequest:
      description: Geçersiz istek verisi
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    Unauthorized:
      description: Kimlik doğrulama başarısız (Eksik veya geçersiz token)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    Forbidden:
      description: Bu işlem için yetkiniz yok (Örneğin admin değilsiniz veya başkasının ilanı)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    NotFound:
      description: Kayıt bulunamadı
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

  schemas:
    Error:
      type: object
      properties:
        message:
          type: string
          example: "Bir hata oluştu."

    AuthResponse:
      type: object
      properties:
        token:
          type: string
        user:
          $ref: '#/components/schemas/User'

    RegisterInput:
      type: object
      required: [firstName, lastName, email, password]
      properties:
        firstName:
          type: string
        lastName:
          type: string
        email:
          type: string
          format: email
        password:
          type: string
          format: password
        phone:
          type: string

    LoginInput:
      type: object
      required: [email, password]
      properties:
        email:
          type: string
          format: email
        password:
          type: string
          format: password

    User:
      type: object
      properties:
        id:
          type: string
        firstName:
          type: string
        lastName:
          type: string
        email:
          type: string
        phone:
          type: string
        address:
          type: string
        status:
          type: string
          enum: [ACTIVE, SUSPENDED]

    ProfileUpdateInput:
      type: object
      properties:
        phone:
          type: string
        address:
          type: string

    LoginHistory:
      type: object
      properties:
        ipAddress:
          type: string
        device:
          type: string
        loginTime:
          type: string
          format: date-time

    Ad:
      type: object
      properties:
        id:
          type: string
        sellerId:
          type: string
        categoryId:
          type: string
        title:
          type: string
        description:
          type: string
        price:
          type: number
        status:
          type: string
          enum: [PENDING, ACTIVE, SOLD, REMOVED]
        photos:
          type: array
          items:
            type: string
            format: uri

    AdInput:
      type: object
      required: [title, description, price, categoryId]
      properties:
        title:
          type: string
        description:
          type: string
        price:
          type: number
        categoryId:
          type: string

    SavedSearchInput:
      type: object
      required: [query]
      properties:
        query:
          type: string
        categoryId:
          type: string
        minPrice:
          type: number
        maxPrice:
          type: number

    Message:
      type: object
      properties:
        id:
          type: string
        senderId:
          type: string
        receiverId:
          type: string
        adId:
          type: string
        content:
          type: string
        isRead:
          type: boolean
        createdAt:
          type: string
          format: date-time

    MessageInput:
      type: object
      required: [receiverId, adId, content]
      properties:
        receiverId:
          type: string
        adId:
          type: string
        content:
          type: string

    Report:
      type: object
      properties:
        id:
          type: string
        adId:
          type: string
        reporterId:
          type: string
        reason:
          type: string
        status:
          type: string
          enum: [OPEN, RESOLVED]

    ReportInput:
      type: object
      required: [adId, reason]
      properties:
        adId:
          type: string
        reason:
          type: string
```