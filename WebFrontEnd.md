# Web Frontend Görev Dağılımı

**Web Frontend Adresi:** [sekondy.com](https://www.sekondy.com/)

Bu dokümanda, web uygulamasının kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) görevleri listelenmektedir. Görevler doğrudan ana [Gereksinim Analizi](Gereksinim-Analizi.md) dokümanında belirlenen maddelere göre bölüşülmüş ve her bir üyenin sorumlulukları kendi özel sayfasında frontend detaylarıyla analiz edilmiştir.

---

## Grup Üyelerinin Web Frontend Görevleri

1. [Emre Taşpınar'ın Web Frontend Görevleri](Emre-Taspinar/Emre-Taspinar-Web-Frontend-Gorevleri.md)
2. [Veysel Emir Hartavi'nin Web Frontend Görevleri](Veysel-Emir-Hartavi/Veysel-Emir-Hartavi-Web-Frontend-Gorevleri.md)
3. [Sinan Ece'nin Web Frontend Görevleri](Sinan-Ece/Sinan-Ece-Web-Frontend-Gorevleri.md)
4. [Furkan Sarıbaş'ın Web Frontend Görevleri](Furkan-Saribas/Furkan-Saribas-Web-Frontend-Gorevleri.md)
5. [Ramize Elif Ermiş'in Web Frontend Görevleri](Ramize-Elif-Ermis/Ramize-Elif-Ermis-Web-Frontend-Gorevleri.md)

---

## Genel Web Frontend Prensipleri

### 1. Responsive Tasarım
- **Mobile-First Approach:** Önce mobil tasarım, sonra desktop
- **Breakpoints:** 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Flexible Layouts:** CSS Grid ve Flexbox kullanımı
- **Responsive Images:** srcset ve sizes attributes
- **Touch-Friendly:** Minimum 44x44px touch targets

### 2. Tasarım Sistemi
- **CSS Framework:** Tailwind CSS v4
- **Renk Paleti:** Tutarlı renk kullanımı (Tailwind tema token'ları)
- **Tipografi:** Modern font entegrasyonu (Google Fonts vb.)
- **Spacing:** Tailwind utility spacing sistemi
- **Iconography:** Lucide React
- **Component Library:** Projeye özel oluşturulmuş React bileşenleri

### 3. Performans Optimizasyonu
- **Code Splitting:** Route-based ve component-based splitting
- **Lazy Loading:** Images, components, ve routes
- **Minification:** CSS ve JavaScript minification
- **Compression:** Gzip/Brotli compression
- **Caching:** Browser caching, service worker (PWA)
- **Bundle Size:** Tree shaking, dead code elimination

### 4. SEO (Search Engine Optimization)
- **Meta Tags:** Title, description, keywords
- **Structured Data:** JSON-LD schema markup
- **Semantic HTML:** Proper HTML5 semantic elements
- **Alt Text:** Image alt attributes
- **Sitemap:** XML sitemap generation
- **Robots.txt:** Search engine crawling rules

### 5. Erişilebilirlik (Accessibility)
- **WCAG 2.1 AA Compliance:** Minimum accessibility standard
- **Keyboard Navigation:** Tab order, focus management
- **Screen Reader Support:** ARIA labels, roles, landmarks
- **Color Contrast:** Minimum 4.5:1 ratio
- **Focus Indicators:** Visible focus states
- **Skip Links:** Skip to main content

### 6. Browser Compatibility
- **Modern Browsers:** Chrome, Firefox, Safari, Edge (son 2 versiyon)
- **Polyfills:** ES6+ features için gerekli polyfills
- **CSS Prefixes:** Autoprefixer kullanımı
- **Feature Detection:** Modernizr veya native feature detection
- **Graceful Degradation:** Eski tarayıcılar için fallback

### 7. State Management
- **Global State:** Context API (React)
- **Local State:** Component state, React Hooks (`useState`, `useReducer`)
- **Server State:** Axios istekleri ve `useEffect` kullanımı ile asenkron kontrol
- **Form State:** React State kontrollü yapılar (Controlled Components)

### 8. Routing
- **Client-Side Routing:** React Router DOM v7
- **Deep Linking:** URL-based navigation
- **Protected Routes:** Authentication guards (Private Route yapısı)
- **404 Handling:** Custom 404 sayfası
- **History Management:** `useNavigate` ve `useLocation` hook'ları

### 9. API Entegrasyonu
- **HTTP Client:** Axios
- **Request Interceptors:** Authorization Token injection
- **Response Interceptors:** Merkezi hata yakalama
- **Error Handling:** Try-catch blokları ile Centralized error handling
- **Loading States:** Global/Lokal spinner loading indicatorları

### 10. Etkileşim ve Animasyonlar
- **Sayfa Geçişleri:** Framer Motion (`motion`) kullanımı
- **UI Geri Bildirimi:** Tailwind ile hover, focus, active transition efektleri

### 11. Build ve Deployment
- **Core:** React 19 (TypeScript)
- **Build Tool:** Vite
- **Environment Variables:** .env files ile URL bazlı konfigürasyon
- **Cloud/Hosting Platformu:** Vercel (vercel.json entegrasyonu ile)