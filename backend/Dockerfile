FROM node:21.5.0-alpine3.19

# Çalışma dizinini /app olarak ayarla
WORKDIR /app

# package.json ve package-lock.json dosyalarını çalışma dizinine kopyala
COPY package.json package-lock.json ./

# npm bağımlılıklarını yükle
RUN npm install

# Uygulamanın geri kalanını çalışma dizinine kopyala
COPY . .

# Uygulamanın dinleyeceği portu aç
EXPOSE 3000

# Çevresel değişken olarak PORT=8080 ayarla
ENV PORT=8080

# Uygulamayı başlat
CMD ["npm", "start"]
