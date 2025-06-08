'use client'

import React from 'react'
import { VideoLesson } from '@/components/lessons/video-lesson'
import type { LessonProps } from '@/lib/lessons/types'

const lessonData = {
  id: 'ia-re-01-introduccion',
  title: 'Introducción a la IA en Bienes Raíces',
  description: 'Descubre qué es la Inteligencia Artificial y cómo está transformando el sector inmobiliario en Latinoamérica.',
  type: 'video' as const,
  content: {
    video_url: 'https://example.com/videos/ia-real-estate-intro.mp4',
    duration: 1200, // 20 minutos en segundos
    thumbnail: 'https://example.com/thumbnails/ia-intro-thumbnail.jpg',
    transcript: `¡Bienvenidos a "IA para Real Estate"!

Soy María Elena Rodríguez, y durante los próximos 20 minutos te voy a mostrar cómo la Inteligencia Artificial está revolucionando el sector inmobiliario en toda Latinoamérica.

**¿Qué aprenderás en esta lección?**

En los próximos minutos descubrirás:
- Qué es realmente la Inteligencia Artificial y por qué es crucial para tu negocio inmobiliario
- Cómo agentes de México, Colombia, Argentina, Chile y Brasil están multiplicando sus ventas con IA
- Los 5 mitos más comunes sobre la implementación de IA que están frenando a miles de agentes
- Tu roadmap personalizado para transformar digitalmente tu agencia paso a paso

**¿Qué es la Inteligencia Artificial en términos simples?**

Imagínate que tienes un asistente súper inteligente que nunca se cansa, que puede analizar miles de datos en segundos, que nunca olvida seguir un prospecto, y que puede generar contenido profesional las 24 horas del día.

Eso es la IA para tu negocio inmobiliario.

No es ciencia ficción, no requiere ser ingeniero, y definitivamente no va a reemplazarte. La IA es una herramienta que va a potenciar tus habilidades como agente inmobiliario.

**Casos de Éxito Reales en Latinoamérica**

Déjame contarte sobre Sandra Morales, una agente independiente en Ciudad de México. Hace 8 meses, Sandra vendía 2-3 propiedades por mes trabajando 12 horas diarias.

Después de implementar las herramientas de IA que te voy a enseñar en este curso, Sandra ahora:
- Vende 7-8 propiedades por mes
- Trabaja solo 8 horas diarias
- Generó 40% más leads cualificados
- Automatizó 70% de sus tareas administrativas

¿El secreto? Sandra aprendió a usar IA para:
- Crear descripciones de propiedades que generan 3x más consultas
- Automatizar el seguimiento de prospectos
- Analizar el mercado para fijar precios optimizados
- Generar contenido para redes sociales automáticamente

**El Caso de Inmobiliaria Torres - Colombia**

Carlos Torres, dueño de una agencia en Bogotá con 12 agentes, implementó IA en su empresa y en 6 meses:

- Aumentó las ventas totales de la agencia en 45%
- Redujo los costos operativos en 30%
- Mejoró la satisfacción del cliente de 7.2 a 9.1 sobre 10
- Automatizó 80% de los reportes y documentación

Carlos dice: "La IA no reemplazó a mis agentes, los convirtió en súper agentes."

**5 Mitos que Debes Eliminar Ahora Mismo**

Mito #1: "La IA es solo para empresas grandes"
REALIDAD: Las herramientas más poderosas cuestan menos de $20 USD al mes.

Mito #2: "Necesito ser técnico para usar IA"
REALIDAD: Las interfaces son tan fáciles como usar WhatsApp.

Mito #3: "La IA va a reemplazar a los agentes"
REALIDAD: La IA potencia las habilidades humanas, no las reemplaza.

Mito #4: "Es muy complicado implementar"
REALIDAD: Puedes empezar con 3 herramientas básicas en menos de 1 semana.

Mito #5: "No funciona en el mercado latinoamericano"
REALIDAD: Te acabé de mostrar casos reales de México, Colombia y más países.

**El Mercado Inmobiliario en LATAM y la IA**

Según el último reporte de PropTech LATAM 2024:
- 67% de compradores de vivienda usan internet como primera fuente de información
- 84% prefiere agentes que respondan en menos de 1 hora
- 78% valora más las descripciones detalladas y atractivas
- 92% confía más en agentes que demuestran conocimiento del mercado

¿Sabes qué tienen en común todos estos puntos? La IA puede ayudarte a sobresalir en cada uno de ellos.

**Tu Roadmap de Transformación Digital**

FASE 1 - Primeras 2 semanas (Herramientas básicas):
- Configurar ChatGPT para descripciones de propiedades
- Implementar chatbot básico en tu sitio web
- Automatizar seguimiento por email

FASE 2 - Mes 1-2 (Optimización):
- Análisis de mercado con IA
- Personalización avanzada de comunicaciones
- Integración con tu CRM actual

FASE 3 - Mes 3-6 (Automatización completa):
- Predicción de precios
- Marketing automatizado multicanal
- Reportes inteligentes para clientes

**¿Por qué AHORA es el momento perfecto?**

1. **Costo**: Las herramientas nunca han sido tan accesibles
2. **Facilidad**: Las interfaces son cada vez más intuitivas
3. **Competencia**: Tus competidores aún no las están usando masivamente
4. **ROI**: Los resultados se ven en las primeras semanas

**Lo que viene en el curso**

En las próximas 7 lecciones te voy a enseñar paso a paso:

Lección 2: Herramientas específicas para analizar tu mercado local
Lección 3: Cómo crear descripciones que conviertan 3x más
Lección 4: Sistemas para generar leads automáticamente
Lección 5: Automatización completa de procesos
Lección 6: Evaluación de tus conocimientos
Lección 7: Tu plan personalizado de implementación
Lección 8: Networking con otros agentes exitosos

**Tu primer desafío**

Antes de continuar con la siguiente lección, quiero que pienses en estas 3 preguntas:

1. ¿Cuál es tu mayor desafío actual como agente inmobiliario?
2. ¿Cuántas horas a la semana gastas en tareas repetitivas?
3. ¿Qué pasaría si pudieras recuperar 50% de ese tiempo para enfocarte en vender?

Anota tus respuestas, porque al final del curso vas a tener un plan específico para resolver cada uno de estos puntos.

**Recuerda: La IA no va a hacer tu trabajo, va a hacer que seas mejor en tu trabajo.**

En la siguiente lección vamos a entrar en acción inmediatamente con herramientas reales de análisis de mercado.

¡Nos vemos en la Lección 2!`,
    
    notes: [
      'La IA es una herramienta para potenciar las habilidades de los agentes inmobiliarios',
      'Casos de éxito reales en México y Colombia muestran aumentos del 35-45% en ventas',
      'Las herramientas de IA cuestan menos de $20 USD al mes para empezar',
      'No se requieren conocimientos técnicos para implementar IA básica',
      '67% de compradores usan internet como primera fuente de información',
      'El roadmap de implementación tiene 3 fases: básica (2 semanas), optimización (2 meses), automatización (6 meses)',
      'La ventaja competitiva actual existe porque pocos agentes usan IA masivamente'
    ],
    
    chapters: [
      { title: 'Introducción al curso', timestamp: 0 },
      { title: '¿Qué es la IA para bienes raíces?', timestamp: 180 },
      { title: 'Casos de éxito en Latinoamérica', timestamp: 360 },
      { title: 'Mitos vs. Realidad sobre la IA', timestamp: 600 },
      { title: 'Estadísticas del mercado LATAM', timestamp: 780 },
      { title: 'Roadmap de implementación', timestamp: 900 },
      { title: 'Por qué empezar ahora', timestamp: 1020 },
      { title: 'Resumen y siguiente lección', timestamp: 1140 }
    ],
    
    resources: [
      {
        title: 'Reporte PropTech LATAM 2024',
        type: 'pdf',
        url: 'https://example.com/resources/proptech-latam-2024.pdf'
      },
      {
        title: 'Lista de verificación: ¿Está tu agencia lista para IA?',
        type: 'checklist',
        url: 'https://example.com/resources/checklist-ia-ready.pdf'
      },
      {
        title: 'Calculadora ROI de IA para inmobiliarias',
        type: 'tool',
        url: 'https://example.com/tools/roi-calculator'
      }
    ]
  },
  duration_minutes: 20,
  is_free: true
}

export default function IntroduccionIABienesRaicesLesson(props: LessonProps) {
  return <VideoLesson lesson={lessonData} {...props} />
}