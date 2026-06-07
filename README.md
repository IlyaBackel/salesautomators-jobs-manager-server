# salesautomators-job-manager-server

## Стек технологий

- Node.js
- Express
- JavaScript

## Используемые библиотеки

- CORS
- nodemailer

## Запуск

npm i
npm start

## Как работает процесс

Создание задания – POST /api/jobs → валидация, сохранение в jobs.json со статусом Job Created, отправка уведомлений в Slack и Google Sheets.

Смена статуса – PATCH /api/jobs/:id/status → обновление JSON, повторная отправка в Slack/Sheets, при Completed – отправка email клиенту, при Cancelled – сохранение причины.

Логирование – все ключевые действия (создание, смена статуса, отправка уведомлений) записываются в файл logs/job-events.log (создаётся автоматически).

Примечание: файлы jobs.json и job-events.log создаются автоматически при запуске сервера, логика прописана в /utils/fileHelper.js и /utils/logger.js.

## Использование ИИ

Для ускорения разработки и быстрого освоения незнакомых инструментов я использовал ChatGPT и GitHub Copilot.