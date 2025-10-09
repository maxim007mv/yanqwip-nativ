#!/usr/bin/env node

/**
 * API Health Check Script
 * Проверяет доступность всех основных эндпоинтов API
 */

const https = require('http');

const API_BASE = 'http://45.144.28.25:5435';
const API_PREFIX = '/api';

console.log('🔍 Проверка API сервера:', API_BASE);
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

// Функция для проверки эндпоинта
async function checkEndpoint(method, endpoint, description, data = null, headers = {}) {
  try {
    console.log(`📡 ${description} (${method} ${endpoint}):`);
    const response = await makeRequest(method, endpoint, data, headers);

    if (response.status >= 200 && response.status < 300) {
      console.log(`   ✅ OK (${response.status})`);
    } else if (response.status === 401) {
      console.log(`   🔒 Требуется авторизация (${response.status})`);
    } else if (response.status === 404) {
      console.log(`   ❌ Не найден (${response.status})`);
    } else if (response.status >= 500) {
      console.log(`   💥 Ошибка сервера (${response.status})`);
      console.log(`   Ответ: ${response.body}`);
    } else {
      console.log(`   ⚠️  Неожиданный код (${response.status})`);
    }
    console.log('');
  } catch (error) {
    console.log(`   ❌ Ошибка сети: ${error.message}`);
    console.log('');
  }
}

async function main() {
  console.log('\n🌐 Проверка основных эндпоинтов:\n');

  // Проверка базовой доступности
  await checkEndpoint('GET', '/', 'Корневой эндпоинт');

  // Проверка аутентификации
  await checkEndpoint('GET', '/auth/me', 'Проверка авторизации');
  await checkEndpoint('POST', '/auth/login', 'Вход в систему', {
    username: 'test',
    password: 'test',
  });

  // Проверка маршрутов
  await checkEndpoint('GET', '/routes/user', 'Получение маршрутов пользователя');

  // Проверка агента
  await checkEndpoint('POST', '/agent/chat', 'Чат с агентом', {
    message: 'test',
  });

  // Проверка мест
  await checkEndpoint('GET', '/places/search?q=test', 'Поиск мест');

  console.log('📊 Проверка завершена!');
  console.log('\n💡 Для тестирования с авторизацией:');
  console.log('1. Зарегистрируйтесь или войдите в приложение');
  console.log('2. Получите токен доступа');
  console.log('3. Используйте токен в заголовке: Authorization: Bearer <token>');
  console.log('\n🔗 Swagger документация:', API_BASE + '/docs');
  console.log('📄 OpenAPI спецификация:', API_BASE + '/openapi.json');
}

main().catch(console.error);
