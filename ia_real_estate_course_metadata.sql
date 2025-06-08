-- Script SQL para crear el curso "IA para Real Estate"
-- Metadatos del curso para la base de datos Supabase

-- Insertar el curso principal
INSERT INTO courses (
  id,
  title,
  description,
  instructor_id,
  instructor_name,
  category,
  difficulty,
  price,
  currency,
  duration_hours,
  lessons_count,
  rating,
  students_count,
  is_published,
  tags,
  learning_objectives,
  requirements,
  created_at,
  updated_at
) VALUES (
  'ia-real-estate-latam',
  'IA para Real Estate - Transformando el Negocio Inmobiliario',
  'Curso completo para agentes y agencias inmobiliarias en Latinoamérica que desean aprovechar el poder de la Inteligencia Artificial para transformar sus negocios, aumentar las ventas y optimizar sus procesos. Aprende a implementar herramientas de IA de forma práctica y rentable, desde la generación de leads hasta la automatización de procesos administrativos.',
  'instructor-ia-realestate',
  'María Elena Rodríguez',
  'business',
  'beginner',
  89.99,
  'USD',
  8,
  8,
  4.9,
  0,
  true,
  '["inteligencia artificial", "real estate", "bienes raices", "automatizacion", "marketing digital", "chatgpt", "leads", "latinoamerica", "agentes inmobiliarios", "propiedades"]',
  '[
    "Comprender la IA aplicada al sector inmobiliario y identificar oportunidades de implementación",
    "Utilizar herramientas de IA para análisis de mercado y toma de decisiones estratégicas",
    "Crear descripciones de propiedades atractivas usando ChatGPT y otras herramientas de IA",
    "Generar leads de forma automatizada mediante estrategias de marketing digital con IA",
    "Automatizar procesos administrativos para aumentar la eficiencia operativa",
    "Desarrollar un plan de implementación de IA adaptado a tu agencia inmobiliaria",
    "Aplicar casos de éxito reales del mercado latinoamericano a tu negocio"
  ]',
  '[
    "Experiencia básica en el sector inmobiliario (mínimo 6 meses)",
    "Conocimientos básicos de computación e internet",
    "Acceso a un computador con conexión a internet",
    "Cuenta de correo electrónico activa",
    "No se requieren conocimientos técnicos o de programación"
  ]',
  NOW(),
  NOW()
);

-- Insertar metadatos de las lecciones
INSERT INTO lessons (id, title, description, type, duration_minutes, is_free, course_id, order_index) VALUES

-- Lección 1: Video de Introducción
('ia-re-01-introduccion', 
 'Introducción a la IA en Bienes Raíces', 
 'Descubre qué es la Inteligencia Artificial y cómo está transformando el sector inmobiliario en Latinoamérica. Casos de éxito, tendencias y oportunidades de negocio.', 
 'video', 
 20, 
 true, 
 'ia-real-estate-latam', 
 1),

-- Lección 2: Texto sobre Análisis de Mercado
('ia-re-02-analisis-mercado', 
 'Herramientas de IA para Análisis de Mercado', 
 'Domina las herramientas de análisis de datos inmobiliarios con IA. Aprende a interpretar tendencias de mercado y tomar decisiones estratégicas basadas en datos.', 
 'text', 
 25, 
 false, 
 'ia-real-estate-latam', 
 2),

-- Lección 3: Ejercicio de Código/Prompts
('ia-re-03-chatgpt-descripciones', 
 'ChatGPT para Descripciones de Propiedades', 
 'Práctica la creación de descripciones atractivas y persuasivas usando ChatGPT. Aprende prompt engineering específico para el sector inmobiliario.', 
 'code', 
 30, 
 false, 
 'ia-real-estate-latam', 
 3),

-- Lección 4: Lección Interactiva
('ia-re-04-generacion-leads', 
 'IA para Generación de Leads', 
 'Implementa chatbots inmobiliarios inteligentes y automatiza el seguimiento de prospectos. Estrategias de marketing digital con IA para captar más clientes.', 
 'interactive', 
 35, 
 false, 
 'ia-real-estate-latam', 
 4),

-- Lección 5: Texto sobre Automatización
('ia-re-05-automatizacion', 
 'Automatización de Procesos con IA', 
 'Identifica procesos automatizables en tu agencia inmobiliaria. Implementa flujos de trabajo inteligentes para reducir tiempo en tareas administrativas.', 
 'text', 
 25, 
 false, 
 'ia-real-estate-latam', 
 5),

-- Lección 6: Quiz de Evaluación
('ia-re-06-quiz-intermedio', 
 'Quiz de Conocimientos Intermedios', 
 'Evalúa tu comprensión de los conceptos de IA aplicados al sector inmobiliario. Quiz interactivo con casos prácticos del mercado latinoamericano.', 
 'quiz', 
 15, 
 false, 
 'ia-real-estate-latam', 
 6),

-- Lección 7: Proyecto Final
('ia-re-07-proyecto-plan-ia', 
 'Proyecto Final - Plan de IA para tu Agencia', 
 'Desarrolla un plan de implementación de IA personalizado para tu agencia inmobiliaria. Incluye análisis de costos, timeline y métricas de éxito.', 
 'assignment', 
 60, 
 false, 
 'ia-real-estate-latam', 
 7),

-- Lección 8: Discusión y Casos de Éxito
('ia-re-08-casos-exito', 
 'Foro de Casos de Éxito y Networking', 
 'Comparte experiencias y aprende de casos reales del mercado. Networking con otros profesionales del sector inmobiliario en Latinoamérica.', 
 'discussion', 
 30, 
 false, 
 'ia-real-estate-latam', 
 8);

-- Insertar información del instructor
INSERT INTO profiles (
  id,
  username,
  full_name,
  bio,
  avatar_url,
  role,
  total_points,
  current_level,
  created_at,
  updated_at
) VALUES (
  'instructor-ia-realestate',
  'maria_elena_rodriguez',
  'María Elena Rodríguez',
  'Experta en transformación digital del sector inmobiliario con más de 10 años de experiencia en el mercado latinoamericano. Consultora certificada en IA aplicada a negocios y mentora de más de 500 agentes inmobiliarios. MBA en Marketing Digital y especialista en automatización de procesos para PyMES.',
  'https://example.com/instructors/maria-elena.jpg',
  'instructor',
  5000,
  8,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  role = EXCLUDED.role,
  updated_at = EXCLUDED.updated_at;

-- Verificar la inserción
SELECT 
  c.title as "Título del Curso",
  c.instructor_name as "Instructor",
  c.category as "Categoría",
  c.difficulty as "Dificultad",
  c.price as "Precio",
  c.duration_hours as "Duración (horas)",
  c.lessons_count as "Número de Lecciones",
  c.is_published as "Publicado"
FROM courses c 
WHERE c.id = 'ia-real-estate-latam';

-- Verificar las lecciones
SELECT 
  l.order_index as "Orden",
  l.title as "Título de Lección",
  l.type as "Tipo",
  l.duration_minutes as "Duración (min)",
  l.is_free as "Gratis"
FROM lessons l 
WHERE l.course_id = 'ia-real-estate-latam'
ORDER BY l.order_index;