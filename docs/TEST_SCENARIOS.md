# Тестовые сценарии для API управления зданиями, схемами и посещениями

## 1. Управление зданиями (Buildings)

### 1.1. Получение списка всех зданий

- **Цель**: Проверить возможность получения списка всех зданий
- **Предусловия**: Пользователь с правами администратора
- **Шаги**:
    1. Авторизоваться как администратор
    2. Отправить GET-запрос на `/buildings`
    3. Убедиться, что возвращается пустой список
    4. Создать тестовое здание
    5. Повторно отправить GET-запрос на `/buildings`
- **Ожидаемый результат**: Код 200 и список, содержащий созданное здание

### 1.2. Получение здания по ID

- **Цель**: Проверить возможность получения информации о здании по его ID
- **Предусловия**: Пользователь с правами администратора
- **Шаги**:
    1. Авторизоваться как администратор
    2. Отправить GET-запрос на `/buildings/9999` (несуществующий ID)
    3. Убедиться, что получена ошибка 404
    4. Создать тестовое здание
    5. Отправить GET-запрос на `/buildings/{id}` с ID созданного здания
- **Ожидаемый результат**: Код 200 и данные созданного здания

### 1.3. Создание здания

- **Цель**: Проверить возможность создания нового здания
- **Предусловия**: Пользователь с правами администратора, доступна возможность загрузки изображений
- **Шаги**:
    1. Авторизоваться как администратор
    2. Загрузить тестовое изображение
    3. Подготовить данные для создания здания
    4. Отправить POST-запрос на `/buildings` с данными здания
- **Ожидаемый результат**: Код 200 и данные созданного здания с правильным именем

### 1.4. Обновление данных здания

- **Цель**: Проверить возможность изменения данных существующего здания
- **Предусловия**: Пользователь с правами администратора, существует здание для обновления
- **Шаги**:
    1. Авторизоваться как администратор
    2. Создать тестовое здание
    3. Подготовить обновленные данные для здания
    4. Отправить PATCH-запрос на `/buildings/{id}` с обновленными данными
- **Ожидаемый результат**: Код 200 и обновленные данные здания

### 1.5. Ограничение доступа к обновлению здания

- **Цель**: Проверить, что только администратор может обновлять данные здания
- **Предусловия**: Пользователь без прав администратора, существует здание для обновления
- **Шаги**:
    1. Авторизоваться как обычный пользователь
    2. Попытаться обновить данные существующего здания
- **Ожидаемый результат**: Код 403 (доступ запрещен)

### 1.6. Обработка ошибки при обновлении несуществующего здания

- **Цель**: Проверить корректную обработку попытки обновить несуществующее здание
- **Предусловия**: Пользователь с правами администратора
- **Шаги**:
    1. Авторизоваться как администратор
    2. Отправить PATCH-запрос на `/buildings/999` с данными для несуществующего здания
- **Ожидаемый результат**: Код 404 (ресурс не найден)

### 1.7. Удаление здания

- **Цель**: Проверить возможность удаления здания
- **Предусловия**: Пользователь с правами администратора, существует здание для удаления
- **Шаги**:
    1. Авторизоваться как администратор
    2. Создать тестовое здание
    3. Отправить DELETE-запрос на `/buildings/{id}`
    4. Попытаться получить удаленное здание
- **Ожидаемый результат**:
    - Код 204 при удалении
    - Код 404 при попытке получить удаленное здание

## 2. Управление схемами зданий (Schemes)

### 2.1. Создание схемы здания

- **Цель**: Проверить возможность создания схемы для существующего здания
- **Предусловия**: Пользователь с правами администратора, существует здание
- **Шаги**:
    1. Авторизоваться как администратор
    2. Создать тестовое здание
    3. Подготовить данные для схемы (этаж и изображение)
    4. Отправить POST-запрос на `/buildings/{id}/schemes` с данными схемы
- **Ожидаемый результат**: Код 204 (успешное создание без возврата данных)

### 2.2. Обработка ошибки при создании схемы для несуществующего здания

- **Цель**: Проверить корректную обработку попытки создать схему для несуществующего здания
- **Предусловия**: Пользователь с правами администратора
- **Шаги**:
    1. Авторизоваться как администратор
    2. Подготовить данные для схемы
    3. Отправить POST-запрос на `/buildings/1/schemes` (для несуществующего здания)
- **Ожидаемый результат**: Код 404 (здание не найдено)

### 2.3. Ограничение доступа к созданию схемы

- **Цель**: Проверить, что только авторизованный пользователь может создавать схемы
- **Предусловия**: Неавторизованный запрос
- **Шаги**:
    1. Подготовить данные для схемы
    2. Отправить POST-запрос на `/buildings/1/schemes` без токена авторизации
- **Ожидаемый результат**: Код 403 (доступ запрещен)

### 2.4. Получение схем здания

- **Цель**: Проверить возможность получения списка схем для здания
- **Предусловия**: Существует здание со схемой
- **Шаги**:
    1. Создать тестовое здание с правами администратора
    2. Создать схему для здания
    3. Отправить GET-запрос на `/buildings/{id}/schemes`
- **Ожидаемый результат**: Код 200 и данные схем

### 2.5. Обработка ошибки при получении схем несуществующего здания

- **Цель**: Проверить корректную обработку попытки получить схемы несуществующего здания
- **Предусловия**: Пользователь с правами администратора
- **Шаги**:
    1. Авторизоваться как администратор
    2. Отправить GET-запрос на `/buildings/123/schemes` (для несуществующего здания)
- **Ожидаемый результат**: Код 404 (здание не найдено)

## 3. Управление местами на схеме (Places)

### 3.1. Создание места на схеме здания

- **Цель**: Проверить возможность создания места на схеме здания
- **Предусловия**: Пользователь с правами администратора, существует здание со схемой
- **Шаги**:
    1. Авторизоваться как администратор
    2. Создать тестовое здание
    3. Создать схему для здания
    4. Подготовить данные для места
    5. Отправить POST-запрос на `/buildings/{id}/schemes/{floor}` с данными места
- **Ожидаемый результат**: Код 200 и данные созданного места

### 3.2. Удаление места на схеме

- **Цель**: Проверить возможность удаления места со схемы здания
- **Предусловия**: Пользователь с правами администратора, существует место на схеме
- **Шаги**:
    1. Авторизоваться как администратор
    2. Создать тестовое здание со схемой и местом
    3. Отправить DELETE-запрос на `/buildings/{id}/schemes/{floor}`
- **Ожидаемый результат**: Код 204 (успешное удаление)

## 4. Управление посещениями (Visits)

### 4.1. Получение списка посещений по месту

- **Цель**: Проверить возможность получения посещений для определенного здания и схемы
- **Предусловия**: Существует здание со схемой
- **Шаги**:
    1. Создать тестовое здание с правами администратора
    2. Создать схему для здания
    3. Отправить GET-запрос на `/buildings/{id}/schemes/visits`
- **Ожидаемый результат**: Код 200 и список посещений

### 4.2. Обработка ошибки при получении посещений несуществующего здания

- **Цель**: Проверить корректную обработку попытки получить посещения несуществующего здания
- **Предусловия**: Пользователь с правами администратора
- **Шаги**:
    1. Авторизоваться как администратор
    2. Отправить GET-запрос на `/buildings/9999/schemes/visits` (для несуществующего здания)
- **Ожидаемый результат**: Код 404 (здание не найдено)

### 4.3. Создание посещения для места

- **Цель**: Проверить возможность создания посещения для определенного места
- **Предусловия**: Пользователь с правами администратора, существует место в здании
- **Шаги**:
    1. Авторизоваться как администратор
    2. Создать тестовое здание со схемой и местом
    3. Подготовить данные для посещения (дата начала и окончания)
    4. Отправить POST-запрос на `/buildings/{id}/places/{place_id}/visits` с данными посещения
- **Ожидаемый результат**: Код 200 и данные созданного посещения

### 4.4. Обработка ошибки при создании посещения для несуществующего места

- **Цель**: Проверить корректную обработку попытки создать посещение для несуществующего места
- **Предусловия**: Пользователь с правами администратора, существует здание
- **Шаги**:
    1. Авторизоваться как администратор
    2. Создать тестовое здание со схемой
    3. Подготовить данные для посещения
    4. Отправить POST-запрос на `/buildings/{id}/places/9999/visits` (для несуществующего места)
- **Ожидаемый результат**: Код 404 (место не найдено)

### 4.5. Обработка ошибки при создании посещения в несуществующем здании

- **Цель**: Проверить корректную обработку попытки создать посещение в несуществующем здании
- **Предусловия**: Пользователь с правами администратора, существует место
- **Шаги**:
    1. Авторизоваться как администратор
    2. Создать тестовое здание со схемой и местом
    3. Подготовить данные для посещения
    4. Отправить POST-запрос на `/buildings/9999/places/{place_id}/visits` (для несуществующего здания)
- **Ожидаемый результат**: Код 404 (здание не найдено)

## 5. Регистрация и аутентификация пользователей

### 5.1. Успешная регистрация пользователя

- **Цель**: Проверить возможность регистрации нового пользователя
- **Предусловия**: Нет
- **Шаги**:
    1. Подготовить данные для регистрации (имя, email, пароль)
    2. Отправить POST-запрос на `/auth/register` с данными пользователя
- **Ожидаемый результат**: Код 200 и данные созданного пользователя

### 5.2. Обработка ошибок валидации при регистрации

- **Цель**: Проверить корректную обработку некорректных данных при регистрации
- **Предусловия**: Нет
- **Шаги**:
    1. Подготовить некорректные данные для регистрации (пропущенные поля, невалидный email)
    2. Отправить POST-запрос на `/auth/register` с некорректными данными
- **Ожидаемый результат**: Код 422 (ошибка валидации)

### 5.3. Обработка попытки повторной регистрации

- **Цель**: Проверить корректную обработку попытки зарегистрировать пользователя с уже существующим email
- **Предусловия**: Существует зарегистрированный пользователь
- **Шаги**:
    1. Зарегистрировать пользователя
    2. Попытаться зарегистрировать пользователя с теми же данными
- **Ожидаемый результат**: Код 409 (конфликт)

### 5.4. Успешная аутентификация пользователя

- **Цель**: Проверить возможность входа зарегистрированного пользователя
- **Предусловия**: Существует зарегистрированный пользователь
- **Шаги**:
    1. Зарегистрировать пользователя
    2. Отправить POST-запрос на `/auth/login` с данными пользователя
- **Ожидаемый результат**: Код 200 и токен авторизации

### 5.5. Обработка ошибок валидации при аутентификации

- **Цель**: Проверить корректную обработку некорректных данных при входе
- **Предусловия**: Нет
- **Шаги**:
    1. Отправить POST-запрос на `/auth/login` с неполными данными (пропущенный email или пароль)
- **Ожидаемый результат**: Код 422 (ошибка валидации)

### 5.6. Обработка попытки входа несуществующего пользователя

- **Цель**: Проверить корректную обработку попытки входа с несуществующими учетными данными
- **Предусловия**: Нет
- **Шаги**:
    1. Отправить POST-запрос на `/auth/login` с данными несуществующего пользователя
- **Ожидаемый результат**: Код 401 (неавторизован)

## 6. Управление профилем пользователя

### 6.1. Получение информации о текущем пользователе

- **Цель**: Проверить возможность получения информации о своем профиле
- **Предусловия**: Авторизованный пользователь
- **Шаги**:
    1. Зарегистрировать и авторизовать пользователя
    2. Отправить GET-запрос на `/clients/@me` с токеном авторизации
- **Ожидаемый результат**: Код 200 и данные пользователя

### 6.2. Обработка ошибки при получении информации о несуществующем пользователе

- **Цель**: Проверить корректную обработку попытки получить данные несуществующего пользователя
- **Предусловия**: Пользователь с правами администратора
- **Шаги**:
    1. Авторизоваться как администратор
    2. Отправить GET-запрос на `/clients/10` (для несуществующего пользователя)
- **Ожидаемый результат**: Код 404 (пользователь не найден)

### 6.3. Ограничение доступа к информации о других пользователях

- **Цель**: Проверить, что обычный пользователь не может получить информацию о других пользователях
- **Предусловия**: Авторизованный пользователь без прав администратора
- **Шаги**:
    1. Авторизоваться как обычный пользователь
    2. Отправить GET-запрос на `/clients/10`
- **Ожидаемый результат**: Код 403 (доступ запрещен)

### 6.4. Проверка массовой обработки пользователей

- **Цель**: Проверить возможность получения информации о нескольких пользователях
- **Предусловия**: База данных с несколькими пользователями
- **Шаги**:
    1. Создать несколько пользователей
    2. Проверить возможность получения всех пользователей с разными размерами выборки
- **Ожидаемый результат**: Корректное количество пользователей в ответе
- 