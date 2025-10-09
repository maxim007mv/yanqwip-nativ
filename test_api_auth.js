#!/usr/bin/env node

/**
 * API Testing Script with Authentication
 * Полная проверка API с авторизацией
 */

const https = require('http');

const API_BASE = 'http://45.144.28.25:5435';
const API_PREFIX = '/api';

console.log('🔐 Полная проверка API с авторизацией');
console.log('========================================');

// Функция для выполнения HTTP запроса
function makeRequest(method, endpoint, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + API_PREFIX + endpoint);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: body,
          headers: res.headers,
        });
      });
    });

    req.on('error', err => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAPI() {
  let accessToken = null;

  try {
    console.log('\n1️⃣ Регистрация тестового пользователя...');
    const testEmail = 'test_api_' + Date.now() + '@example.com';
    const registerResponse = await makeRequest('POST', '/auth/register', {
      email: testEmail,
      password: 'test123456',
      full_name: 'Test API User',
    });

    if (registerResponse.status === 200 || registerResponse.status === 201) {
      console.log('✅ Регистрация успешна');
    } else {
      console.log('⚠️ Регистрация:', registerResponse.body);
    }

    console.log('\n2️⃣ Вход в систему...');
    const loginResponse = await makeRequest('POST', '/auth/login', {
      email: testEmail,
      password: 'test123456',
    });

    if (loginResponse.status === 200) {
      const loginData = JSON.parse(loginResponse.body);
      accessToken = loginData.access_token;
      console.log('✅ Вход успешен, получен токен');
    } else {
      console.log('❌ Ошибка входа:', loginResponse.body);
      return;
    }

    const authHeaders = {
      Authorization: `Bearer ${accessToken}`,
    };

    console.log('\n3️⃣ Проверка авторизации...');
    const meResponse = await makeRequest('GET', '/auth/me', null, authHeaders);
    if (meResponse.status === 200) {
      console.log('✅ Авторизация работает');
    } else {
      console.log('❌ Ошибка авторизации:', meResponse.body);
    }

    console.log('\n4️⃣ Получение маршрутов...');
    const routesResponse = await makeRequest('GET', '/routes/user', null, authHeaders);
    if (routesResponse.status === 200) {
      console.log('✅ Маршруты получены');
    } else {
      console.log('⚠️ Маршруты:', routesResponse.body);
    }

    console.log('\n5️⃣ Тест чата с агентом...');
    const chatResponse = await makeRequest(
      'POST',
      '/agent/message',
      {
        message: 'Привет! Расскажи о Москве',
      },
      authHeaders,
    );

    if (chatResponse.status === 200) {
      console.log('✅ Чат с агентом работает');
    } else {
      console.log('⚠️ Чат с агентом:', chatResponse.body);
    }

    console.log('\n6️⃣ Поиск мест...');
    const placesResponse = await makeRequest('GET', '/places?q=красная+площадь', null, authHeaders);
    if (placesResponse.status === 200) {
      console.log('✅ Поиск мест работает');
    } else {
      console.log('⚠️ Поиск мест:', placesResponse.body);
    }

    console.log('\n🎉 Тестирование завершено!');
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  }
}

testAPI();
