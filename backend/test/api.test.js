const request = require('supertest'); // supertest'i kullanmak için yüklemeniz gerekebilir
const app = require('../index');

describe('API Testleri', () => {
  // Test birimi
  describe('GET /', () => {
    it('Ana sayfanın başarıyla döndürülmesi gerekir', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
    });
  });

  // Diğer rota testleri burada...
  describe('GET /customers', () => {
    it('Kullanıcıların başarıyla döndürülmesi gerekir', async () => {
      const res = await request(app).get('/customers');
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array); // Dönüş tipini kontrol et
    });
  });

  // Diğer test senaryoları buraya eklenebilir
});
