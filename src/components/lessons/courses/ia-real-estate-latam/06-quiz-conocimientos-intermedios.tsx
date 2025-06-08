'use client'

import React from 'react'
import { QuizLesson } from '@/components/lessons/quiz-lesson'
import type { LessonProps } from '@/lib/lessons/types'

const lessonData = {
  id: 'ia-re-06-quiz-intermedio',
  title: 'Quiz de Conocimientos Intermedios',
  description: 'Evalúa tu comprensión de los conceptos de IA aplicados al sector inmobiliario que has aprendido hasta ahora.',
  type: 'quiz' as const,
  content: {
    introduction: `# 🎯 Momento de la Verdad: ¿Qué tanto has aprendido?

¡Llegó el momento de poner a prueba todo lo que has aprendido! Este quiz evalúa tu comprensión de los conceptos clave de IA aplicados al sector inmobiliario.

## 📊 Sobre este Quiz

- **20 preguntas** que cubren las 5 lecciones anteriores
- **Mezcla de tipos:** múltiple opción, verdadero/falso, y escenarios prácticos
- **Tiempo recomendado:** 15-20 minutos
- **Puntaje mínimo para aprobar:** 80% (16/20 preguntas correctas)
- **Intentos permitidos:** Ilimitados para aprender mejor

## 🎓 Lo que se Evalúa

1. **Conceptos básicos de IA en bienes raíces** (Lección 1)
2. **Herramientas de análisis de mercado** (Lección 2)
3. **Creación de descripciones con ChatGPT** (Lección 3)
4. **Estrategias de generación de leads** (Lección 4)
5. **Automatización de procesos** (Lección 5)

## 💡 Consejos para el Éxito

- Lee cada pregunta cuidadosamente
- Si no estás seguro, repasa las lecciones anteriores
- Piensa en aplicaciones prácticas para tu mercado
- ¡No te preocupes si no apruebas al primer intento!

**¡Empecemos!** 🚀`,

    questions: [
      {
        id: 'q1',
        question: '¿Cuál es la principal ventaja de implementar IA en tu agencia inmobiliaria según el caso de Sandra Morales mencionado en el curso?',
        type: 'multiple_choice',
        options: [
          'Reemplazar completamente a los agentes humanos',
          'Reducir costos eliminando empleados',
          'Aumentar ventas de 2-3 a 7-8 propiedades por mes trabajando menos horas',
          'Automatizar solo las redes sociales'
        ],
        correct_answer: 2,
        explanation: 'Sandra Morales logró aumentar significativamente sus ventas (de 2-3 a 7-8 propiedades por mes) mientras reducía sus horas de trabajo de 12 a 8 horas diarias, demostrando que la IA potencia las capacidades humanas sin reemplazarlas.'
      },
      
      {
        id: 'q2',
        question: 'Según las estadísticas del mercado LATAM mencionadas en el curso, ¿qué porcentaje de compradores usa internet como primera fuente de información?',
        type: 'multiple_choice',
        options: [
          '45%',
          '67%',
          '78%',
          '92%'
        ],
        correct_answer: 1,
        explanation: 'El 67% de compradores de vivienda en LATAM usa internet como primera fuente de información, lo que hace crucial tener presencia digital optimizada con IA.'
      },

      {
        id: 'q3',
        question: 'PropiedadesIA.com puede predecir precios por m² con una precisión del:',
        type: 'multiple_choice',
        options: [
          '75%',
          '82%',
          '89%',
          '95%'
        ],
        correct_answer: 2,
        explanation: 'PropiedadesIA.com ofrece predicción de precios por m² con 89% de precisión, una herramienta valiosa para análisis de mercado.'
      },

      {
        id: 'q4',
        question: '¿Qué significa DOM en el análisis de mercado inmobiliario?',
        type: 'multiple_choice',
        options: [
          'Documentos Oficiales del Mercado',
          'Días Promedio en el Mercado',
          'Demanda Oficial Mensual',
          'Datos Organizados por Mes'
        ],
        correct_answer: 1,
        explanation: 'DOM significa "Días Promedio en el Mercado" (Days on Market), una métrica clave que indica qué tan rápido se venden las propiedades en una zona específica.'
      },

      {
        id: 'q5',
        question: 'Según el curso, ¿cuál es el benchmark "excelente" para DOM en el mercado latinoamericano?',
        type: 'multiple_choice',
        options: [
          'Menos de 30 días',
          'Entre 30-60 días',
          'Entre 60-90 días',
          'Más de 90 días'
        ],
        correct_answer: 0,
        explanation: 'Un DOM de menos de 30 días se considera "excelente" en LATAM, indicando un mercado muy dinámico con alta demanda.'
      },

      {
        id: 'q6',
        question: 'Al crear descripciones con ChatGPT, ¿cuál de estas técnicas es más efectiva para generar conexión emocional?',
        type: 'multiple_choice',
        options: [
          'Listar solo características técnicas',
          'Usar verbos en segunda persona como "vives", "disfrutas"',
          'Escribir descripciones muy largas y detalladas',
          'Enfocarse únicamente en el precio'
        ],
        correct_answer: 1,
        explanation: 'Usar verbos en segunda persona crea conexión emocional al hacer que el lector se visualice viviendo en la propiedad, una técnica clave del storytelling inmobiliario.'
      },

      {
        id: 'q7',
        question: 'Para optimización SEO en descripciones inmobiliarias, la palabra clave principal debe aparecer en:',
        type: 'multiple_choice',
        options: [
          'Solo al final del texto',
          'Los primeros 50 caracteres',
          'Únicamente en el título',
          'No importa la ubicación'
        ],
        correct_answer: 1,
        explanation: 'Para SEO efectivo, la palabra clave principal debe aparecer en los primeros 50 caracteres de la descripción para máximo impacto en motores de búsqueda.'
      },

      {
        id: 'q8',
        question: '¿Cuál es la diferencia principal entre una descripción para "jóvenes profesionales" vs "familias" según el curso?',
        type: 'multiple_choice',
        options: [
          'El precio mencionado',
          'La longitud del texto',
          'El enfoque: ubicación/movilidad vs seguridad/espacios familiares',
          'El idioma utilizado'
        ],
        correct_answer: 2,
        explanation: 'Para jóvenes profesionales se enfatiza ubicación, movilidad y lifestyle urbano, mientras que para familias se destacan seguridad, espacios y aspectos relacionados con el futuro de los hijos.'
      },

      {
        id: 'q9',
        question: 'En un sistema de lead scoring inmobiliario, ¿qué factor tiene mayor peso según la metodología enseñada?',
        type: 'multiple_choice',
        options: [
          'Datos completos del cliente',
          'Tipo de propiedad buscada',
          'Presupuesto del cliente',
          'Ubicación preferida'
        ],
        correct_answer: 2,
        explanation: 'El presupuesto tiene el mayor peso (25 puntos máximo) en el sistema de lead scoring porque indica directamente la capacidad de compra y el nivel de seriedad del prospecto.'
      },

      {
        id: 'q10',
        question: 'Un lead con puntaje de 85 en el sistema de scoring se clasifica como:',
        type: 'multiple_choice',
        options: [
          'Lead Frío',
          'Lead Tibio',
          'Lead Caliente',
          'Lead Descartable'
        ],
        correct_answer: 2,
        explanation: 'Un puntaje de 85 clasifica como "Lead Caliente" (80+ puntos), requiriendo contacto inmediato y máxima prioridad de atención.'
      },

      {
        id: 'q11',
        question: 'Para chatbots inmobiliarios efectivos, ¿cuál es la secuencia correcta de calificación?',
        type: 'multiple_choice',
        options: [
          'Contacto → Calificación → Profundización → Agenda → Saludo',
          'Saludo → Calificación → Profundización → Contacto → Agenda',
          'Agenda → Saludo → Contacto → Calificación → Profundización',
          'Profundización → Agenda → Saludo → Contacto → Calificación'
        ],
        correct_answer: 1,
        explanation: 'La secuencia correcta es: Saludo → Calificación → Profundización → Contacto → Agenda, permitiendo un flujo natural que califica antes de solicitar datos personales.'
      },

      {
        id: 'q12',
        question: 'El ROI esperado de automatización según el caso de Patricia Ruiz (agente independiente) fue de:',
        type: 'multiple_choice',
        options: [
          '150%',
          '240%',
          '340%',
          '520%'
        ],
        correct_answer: 2,
        explanation: 'Patricia Ruiz logró un ROI de 340% aumentando sus ingresos de $45,000 a $78,000 MXN mensuales (+73%) tras implementar automatizaciones básicas.'
      },

      {
        id: 'q13',
        question: 'Según el curso, ¿cuántas horas semanales puede ahorrar un agente implementando automatización completa?',
        type: 'multiple_choice',
        options: [
          '5-8 horas',
          '10-15 horas',
          '20-25 horas',
          '30-35 horas'
        ],
        correct_answer: 1,
        explanation: 'La automatización completa permite ahorrar 10-15 horas semanales, tiempo que puede reinvertirse en actividades de venta directa.'
      },

      {
        id: 'q14',
        question: 'HubSpot para inmobiliarias tiene un costo aproximado desde:',
        type: 'multiple_choice',
        options: [
          '$15 USD/mes',
          '$25 USD/mes',
          '$45 USD/mes',
          '$99 USD/mes'
        ],
        correct_answer: 2,
        explanation: 'HubSpot para automatización inmobiliaria tiene un costo desde $45 USD/mes, ofreciendo CRM completo con automatización de marketing.'
      },

      {
        id: 'q15',
        question: 'La tasa de absorción del mercado se calcula como:',
        type: 'multiple_choice',
        options: [
          'Inventario total ÷ Número de ventas mensuales',
          'Número de ventas mensuales ÷ Inventario total',
          'Precio promedio ÷ Días en el mercado',
          'Días en el mercado ÷ Precio promedio'
        ],
        correct_answer: 1,
        explanation: 'La tasa de absorción se calcula como: Número de ventas mensuales ÷ Inventario total, indicando qué tan rápido se absorbe el inventario disponible.'
      },

      {
        id: 'q16',
        question: 'Una tasa de absorción mayor al 20% indica:',
        type: 'multiple_choice',
        options: [
          'Mercado lento',
          'Mercado equilibrado',
          'Mercado muy activo',
          'Mercado problemático'
        ],
        correct_answer: 2,
        explanation: 'Una tasa de absorción mayor al 20% indica un "mercado muy activo" con alta demanda y rotación rápida de inventario.'
      },

      {
        id: 'q17',
        question: '¿Cuál es la principal diferencia entre segmentar una descripción para "primera vivienda" vs "inversión"?',
        type: 'multiple_choice',
        options: [
          'El precio final de la propiedad',
          'El enfoque emocional vs analítico/ROI',
          'La ubicación de la propiedad',
          'El tamaño del texto'
        ],
        correct_answer: 1,
        explanation: 'Para primera vivienda se usa enfoque emocional (hogar, familia, sueños), mientras que para inversión se enfoca en análisis, ROI, plusvalía y números concretos.'
      },

      {
        id: 'q18',
        question: 'Facebook Advantage+ es una herramienta de:',
        type: 'multiple_choice',
        options: [
          'Análisis de la competencia',
          'Optimización automática de audiencias',
          'Creación de contenido automático',
          'Gestión de leads manual'
        ],
        correct_answer: 1,
        explanation: 'Facebook Advantage+ optimiza audiencias automáticamente usando IA para mejorar el rendimiento de campañas publicitarias sin intervención manual constante.'
      },

      {
        id: 'q19',
        question: 'El costo por lead en WhatsApp Bot según las métricas del curso es aproximadamente:',
        type: 'multiple_choice',
        options: [
          '$20-50 MXN',
          '$50-100 MXN',
          '$150-300 MXN',
          '$200-400 MXN'
        ],
        correct_answer: 1,
        explanation: 'WhatsApp Bot tiene un costo por lead de $50-100 MXN, siendo uno de los canales más rentables con alta tasa de conversión del 15-25%.'
      },

      {
        id: 'q20',
        question: 'Según el roadmap de implementación, ¿qué se debe hacer en las primeras 2 semanas?',
        type: 'multiple_choice',
        options: [
          'Implementar IA predictiva y análisis avanzado',
          'Configurar herramientas básicas: ChatGPT, chatbot web, email marketing',
          'Integrar todas las herramientas con CRM enterprise',
          'Crear campaña completa de marketing multicanal'
        ],
        correct_answer: 1,
        explanation: 'En las primeras 2 semanas se implementan herramientas básicas: ChatGPT para descripciones, chatbot básico en el sitio web, y automatización de seguimiento por email.'
      }
    ],

    passing_score: 80,
    show_results_immediately: true,
    allow_retakes: true,
    randomize_questions: true,
    
    feedback: {
      perfect_score: {
        title: '🏆 ¡Excelencia Absoluta!',
        message: '¡Felicitaciones! Has dominado completamente los conceptos de IA aplicados a bienes raíces. Estás listo para implementar estas herramientas y revolucionar tu práctica inmobiliaria. ¡Tu transformación digital comienza ahora!'
      },
      high_score: {
        title: '🎯 ¡Excelente Dominio!',
        message: '¡Muy bien! Tienes un sólido entendimiento de cómo aplicar IA en el sector inmobiliario. Estás preparado para empezar a implementar estas herramientas en tu práctica diaria.'
      },
      passing_score: {
        title: '✅ ¡Aprobado!',
        message: 'Has demostrado un buen entendimiento de los conceptos básicos. Te recomendamos repasar los temas donde tuviste dificultades antes de continuar con las lecciones avanzadas.'
      },
      failing_score: {
        title: '📚 Necesitas Repasar',
        message: 'No te preocupes, el aprendizaje es un proceso. Te recomendamos revisar las lecciones anteriores, especialmente los temas donde tuviste más dificultades, y volver a intentar el quiz.'
      }
    },

    study_materials: [
      {
        title: 'Repaso: Introducción a la IA en Bienes Raíces',
        type: 'lesson_link',
        url: '/lessons/ia-real-estate-latam/01-introduccion-ia-bienes-raices'
      },
      {
        title: 'Repaso: Herramientas de Análisis de Mercado',
        type: 'lesson_link', 
        url: '/lessons/ia-real-estate-latam/02-herramientas-analisis-mercado'
      },
      {
        title: 'Repaso: ChatGPT para Descripciones',
        type: 'lesson_link',
        url: '/lessons/ia-real-estate-latam/03-chatgpt-descripciones-propiedades'
      },
      {
        title: 'Repaso: Generación de Leads con IA',
        type: 'lesson_link',
        url: '/lessons/ia-real-estate-latam/04-ia-generacion-leads'
      },
      {
        title: 'Repaso: Automatización de Procesos',
        type: 'lesson_link',
        url: '/lessons/ia-real-estate-latam/05-automatizacion-procesos-ia'
      },
      {
        title: 'Glosario de Términos de IA Inmobiliaria',
        type: 'pdf',
        url: 'https://example.com/resources/glosario-ia-inmobiliaria.pdf'
      }
    ]
  },
  duration_minutes: 20,
  is_free: false
}

export default function QuizConocimientosIntermediosLesson(props: LessonProps) {
  return <QuizLesson lesson={lessonData} {...props} />
}