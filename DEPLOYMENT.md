# Deployment Guide - GitHub Pages

Panduan lengkap untuk mendeploy Langit Digital Platform ke GitHub Pages.

## 📋 Prerequisites

1. **Akun GitHub**: Pastikan Anda memiliki akun GitHub
2. **Git**: Install Git di komputer Anda
3. **Node.js**: Install Node.js versi 16 atau lebih baru
4. **Supabase Project**: Setup project Supabase dengan database yang sudah dikonfigurasi

## 🚀 Step-by-Step Deployment

### 1. Persiapan Repository GitHub

1. **Buat Repository Baru di GitHub:**
   - Login ke GitHub
   - Klik tombol "New" atau "+" → "New repository"
   - Nama repository: `langit-digital-platform` (atau nama lain sesuai keinginan)
   - Set sebagai Public repository
   - Jangan centang "Initialize with README" (karena kita sudah punya)
   - Klik "Create repository"

### 2. Setup Local Repository

1. **Inisialisasi Git di project folder:**
```bash
git init
git add .
git commit -m "Initial commit: Langit Digital Platform"
```

2. **Hubungkan dengan GitHub repository:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git branch -M main
git push -u origin main
```

### 3. Konfigurasi Environment Variables

1. **Di GitHub Repository:**
   - Go to Settings → Secrets and variables → Actions
   - Klik "New repository secret"
   - Tambahkan secrets berikut:
     - `VITE_SUPABASE_URL`: URL project Supabase Anda
     - `VITE_SUPABASE_ANON_KEY`: Anon key dari Supabase

### 4. Enable GitHub Pages

1. **Aktifkan GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` (akan dibuat otomatis oleh GitHub Actions)
   - Folder: `/ (root)`
   - Klik "Save"

### 5. Deploy Otomatis

GitHub Actions akan otomatis:
1. Build project setiap kali ada push ke branch `main`
2. Deploy hasil build ke GitHub Pages
3. Website akan tersedia di: `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`

## 🔧 Manual Build & Deploy

Jika ingin deploy manual tanpa GitHub Actions:

1. **Build project:**
```bash
npm run build
```

2. **Deploy ke GitHub Pages:**
```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

## 🌐 Custom Domain (Opsional)

Jika Anda memiliki domain sendiri:

1. **Setup DNS:**
   - Buat CNAME record yang mengarah ke `YOUR_USERNAME.github.io`

2. **Konfigurasi GitHub:**
   - Go to Settings → Pages
   - Custom domain: masukkan domain Anda
   - Centang "Enforce HTTPS"

3. **Update workflow file:**
   - Edit `.github/workflows/deploy.yml`
   - Uncomment dan isi `cname:` dengan domain Anda

## 📱 Testing Deployment

1. **Cek build status:**
   - Go to Actions tab di GitHub repository
   - Pastikan workflow "Deploy to GitHub Pages" berhasil

2. **Test website:**
   - Buka `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`
   - Test semua fitur utama:
     - Login user dan admin
     - Navigation antar halaman
     - Audio player
     - Download functionality

## 🔍 Troubleshooting

### Build Errors

1. **Environment variables tidak terbaca:**
   - Pastikan secrets sudah ditambahkan dengan nama yang benar
   - Check case sensitivity

2. **Import errors:**
   - Pastikan semua dependencies sudah terinstall
   - Check relative import paths

### Deployment Issues

1. **404 Error pada refresh:**
   - Tambahkan file `public/404.html` yang redirect ke `index.html`
   - Atau gunakan Hash Router instead of Browser Router

2. **Assets tidak load:**
   - Pastikan `base: './'` sudah diset di `vite.config.ts`
   - Check asset paths di build output

### Performance Issues

1. **Slow loading:**
   - Enable code splitting di Vite config
   - Optimize images dan assets
   - Use lazy loading untuk components

## 📊 Monitoring

1. **GitHub Pages Analytics:**
   - Setup Google Analytics
   - Monitor traffic dan performance

2. **Error Tracking:**
   - Implement error boundary
   - Use browser dev tools untuk debugging

## 🔄 Updates

Untuk update aplikasi:

1. **Make changes locally**
2. **Test thoroughly**
3. **Commit dan push:**
```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

4. **GitHub Actions akan otomatis deploy**

## 📞 Support

Jika mengalami masalah deployment:

1. Check GitHub Actions logs
2. Verify Supabase configuration
3. Test build locally dengan `npm run build`
4. Check browser console untuk errors

---

**Happy Deploying! 🚀**

Langit Digital Platform © 2025