# 🚀 CoreX — Gamified Soft Skills & Habit Tracker

Aplicación móvil Full-Stack diseñada para que estudiantes de ingeniería y perfiles técnicos desarrollen habilidades blandas (comunicación asertiva, liderazgo y manejo emocional) mediante mecánicas de gamificación RPG y simulación con Inteligencia Artificial.

## 🛠️ Stack Tecnológico y Arquitectura
* **Frontend Móvil:** React Native con Expo Router (Navegación basada en archivos y manejo de estado reactivo).
* **Backend & Base de Datos:** Supabase (PostgreSQL) con suscripciones en tiempo real (*Write-Ahead Logging* / `postgres_changes`).
* **Seguridad en Base de Datos (RLS):** Políticas *Row Level Security* nativas en PostgreSQL (`auth.uid() = user_id`) y *Triggers* en `PL/pgSQL` para auto-aprovisionamiento seguro de perfiles.
* **Inteligencia Artificial Resiliente:** Integración con Google Gemini (`gemini-3.5-flash`) implementando un patrón de *Automatic Model Fallback* ante saturación de servidores (HTTP 503).

## 🧩 Módulos Principales (MVP)
1. **Tracker de Hábitos & Sistema RPG:** Registro de hábitos (adquirir/erradicar) con reinicio automático calculado a medianoche local (`00:00 hrs`), sistema de vidas mensuales, rachas y barra de experiencia (XP/Niveles).
2. **Simulador IA de Conversaciones Difíciles:** Entrenamiento de negociación y resolución de conflictos evaluado en tiempo real por IA con retorno estructurado en JSON.
3. **Microlecciones & Misiones IRL (*In Real Life*):** Retos prácticos en el mundo real recompensados con XP.
4. **Basurero Emocional (Arquitectura Zero-Data Retention):** Espacio de desahogo nocturno diseñado bajo privacidad estricta por diseño; el texto vive exclusivamente en la memoria RAM volátil del dispositivo (`useState`) y se purga permanentemente al confirmar, sin ejecutar `INSERT` en SQL ni transitar por la red.

## ⚙️ Instalación Local
1. Clonar el repositorio:
   `git clone https://github.com/Adrian441dz/corex.git`
2. Instalar dependencias:
   `cd frontend && npm install`
3. Configurar variables de entorno copiando `.env.example` a `.env`.
4. Iniciar servidor limpiando caché:
   `npx expo start -c`