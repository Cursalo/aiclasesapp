'use client'

import React from 'react'
import { AssignmentLesson } from '@/components/lessons/assignment-lesson'
import type { LessonProps } from '@/lib/lessons/types'

const lessonData = {
  id: 'ia-re-07-proyecto-final',
  title: 'Proyecto Final: Plan de IA para tu Agencia',
  description: 'Desarrolla un plan completo de implementación de IA personalizado para tu agencia inmobiliaria con timeline, presupuesto y métricas específicas.',
  type: 'assignment' as const,
  content: {
    overview: `# 🚀 Tu Transformación Digital: Del Concepto a la Realidad

¡Llegó el momento de aplicar todo lo aprendido! En este proyecto final crearás un **Plan Maestro de Implementación de IA** completamente personalizado para tu agencia inmobiliaria.

## 🎯 Objetivo del Proyecto

Desarrollar un plan estratégico detallado que transforme tu agencia en una empresa inmobiliaria potenciada por IA, con resultados medibles en 90 días.

## 📊 Entregables Esperados

1. **Análisis de Situación Actual** (30% del proyecto)
2. **Plan de Implementación Fase por Fase** (40% del proyecto)  
3. **Presupuesto y ROI Proyectado** (20% del proyecto)
4. **Métricas y Sistema de Seguimiento** (10% del proyecto)

## ⏰ Tiempo Estimado

- **Investigación y análisis:** 2-3 horas
- **Desarrollo del plan:** 3-4 horas
- **Presupuesto y cálculos:** 1-2 horas
- **Revisión final:** 1 hora

**Total:** 7-10 horas distribuidas en 1-2 semanas

## 🏆 Criterios de Evaluación

- **Especificidad:** Plan adaptado a tu mercado local
- **Viabilidad:** Factible con tus recursos actuales
- **Medibilidad:** KPIs claros y alcanzables
- **Innovación:** Uso creativo de las herramientas de IA

¡Empecemos a construir el futuro de tu agencia! 💪`,

    instructions: `# 📋 Instrucciones Detalladas

## PARTE 1: Análisis de Situación Actual (30 puntos)

### 1.1 Diagnóstico de tu Agencia
Completa este análisis detallado de tu situación actual:

**Información Básica:**
- Nombre de tu agencia
- Ciudad/país donde operas
- Número de agentes (si aplica)
- Años en el mercado
- Segmento principal (residencial, comercial, lujo, etc.)

**Análisis de Operaciones Actuales:**
- Promedio de propiedades manejadas por mes
- Fuentes principales de leads actuales
- Herramientas tecnológicas que usas actualmente
- Tiempo semanal dedicado a tareas administrativas
- Principal dolor/desafío operativo

**Análisis de Mercado Local:**
- Características del mercado inmobiliario en tu zona
- Precio promedio por m² en tu segmento
- Principal competencia local
- Tendencias de los últimos 12 meses

### 1.2 Identificación de Oportunidades de IA
Basándote en las lecciones del curso, identifica específicamente:

- ¿Qué procesos podrías automatizar inmediatamente?
- ¿Dónde pierdes más tiempo actualmente?
- ¿Qué tareas repetitivas consumen más horas?
- ¿Dónde ves mayor potencial de mejora con IA?

## PARTE 2: Plan de Implementación por Fases (40 puntos)

### FASE 1: Fundamentos (Semanas 1-4)
**Herramientas a implementar:**
- Especifica 3 herramientas de IA que implementarás primero
- Justifica por qué elegiste estas herramientas
- Define el orden de implementación

**Acciones específicas por semana:**
- Semana 1: [Acciones específicas]
- Semana 2: [Acciones específicas] 
- Semana 3: [Acciones específicas]
- Semana 4: [Acciones específicas]

### FASE 2: Optimización (Semanas 5-8)
**Herramientas intermedias:**
- Define 2-3 herramientas adicionales a implementar
- Explica cómo se integrarán con las herramientas de Fase 1
- Establece objetivos cuantificables para esta fase

### FASE 3: Automatización Avanzada (Semanas 9-12)
**Herramientas avanzadas:**
- Identifica 2 herramientas o procesos avanzados
- Define cómo medirás el éxito de la implementación completa
- Establece el plan de escalabilidad

### Plan de Contingencia
- ¿Qué harás si alguna herramienta no funciona como esperas?
- ¿Cómo adaptarás el plan si hay limitaciones presupuestarias?
- ¿Cuál es tu plan B para cada fase?

## PARTE 3: Presupuesto y ROI (20 puntos)

### 3.1 Inversión Requerida
Calcula el costo detallado para cada herramienta:

**Costos Mensuales:**
- ChatGPT Plus: $20 USD
- [Tu herramienta 2]: $X USD
- [Tu herramienta 3]: $X USD
- Capacitación/tiempo: $X USD
- Total mensual: $X USD

**Costos de Implementación (Una vez):**
- Configuración inicial: $X USD
- Capacitación del equipo: $X USD
- Integración con sistemas actuales: $X USD
- Total implementación: $X USD

### 3.2 ROI Proyectado
**Basándote en los casos de estudio del curso, calcula:**

**Ahorros de Tiempo:**
- Horas ahorradas por semana: X horas
- Valor de esas horas a tu tarifa: $X USD/semana
- Ahorro anual: $X USD

**Aumento en Ventas Proyectado:**
- Incremento esperado en leads: X%
- Mejora en tasa de conversión: X%
- Aumento proyectado en ingresos: $X USD/año

**ROI Total:**
- Inversión total año 1: $X USD
- Beneficios totales año 1: $X USD
- ROI: X% (Beneficios ÷ Inversión × 100)

## PARTE 4: Sistema de Métricas y Seguimiento (10 puntos)

### 4.1 KPIs Principales
Define 5 métricas principales que medirás:

1. **Eficiencia Operativa:**
   - Métrica: [Ej: Horas ahorradas por semana]
   - Meta inicial: [Número específico]
   - Cómo medirás: [Método específico]

2. **Generación de Leads:**
   - Métrica: [Ej: Número de leads mensuales]
   - Meta inicial: [Número específico] 
   - Cómo medirás: [Método específico]

3. **Conversión:**
   - Métrica: [Ej: Tasa de conversión de leads]
   - Meta inicial: [Porcentaje específico]
   - Cómo medirás: [Método específico]

4. **Satisfacción del Cliente:**
   - Métrica: [Ej: NPS o encuestas]
   - Meta inicial: [Número específico]
   - Cómo medirás: [Método específico]

5. **Ingresos:**
   - Métrica: [Ej: Ventas mensuales]
   - Meta inicial: [Número específico]
   - Cómo medirás: [Método específico]

### 4.2 Sistema de Reporting
- ¿Cómo harás seguimiento semanal?
- ¿Qué reportes automáticos configurarás?
- ¿Con qué frecuencia evaluarás y ajustarás el plan?

## 📝 Formato de Entrega

**Tu plan debe incluir:**
1. **Documento principal:** 5-8 páginas en formato PDF
2. **Hoja de cálculo de presupuesto:** Con cálculos detallados
3. **Timeline visual:** Gráfico Gantt o similar (opcional pero valorado)

**Estructura sugerida del documento:**
1. Portada con nombre de tu agencia
2. Resumen ejecutivo (1 página)
3. Análisis de situación actual (1-2 páginas)
4. Plan de implementación por fases (2-3 páginas)
5. Presupuesto y ROI (1 página)
6. Sistema de métricas (1 página)
7. Conclusiones y próximos pasos (0.5 páginas)

## ✅ Checklist de Calidad

Antes de entregar, verifica que tu plan incluya:

- [ ] Análisis específico de tu mercado local
- [ ] Herramientas seleccionadas con justificación
- [ ] Timeline realista y específico
- [ ] Presupuesto detallado con costos reales
- [ ] Cálculo de ROI basado en datos
- [ ] KPIs medibles y específicos
- [ ] Plan de contingencia para riesgos
- [ ] Documento bien estructurado y profesional
- [ ] Nombres y números específicos (no generalidades)
- [ ] Vinculación clara con conceptos del curso

## 🎯 Consejos para el Éxito

1. **Sé específico:** "Incrementar leads en 30%" es mejor que "incrementar leads"
2. **Usa datos reales:** Basa tus cálculos en tus números actuales
3. **Sé realista:** Mejor un plan modesto que se execute que uno ambicioso que no
4. **Piensa local:** Adapta las herramientas a la realidad de tu mercado
5. **Considera limitaciones:** Tiempo, presupuesto, resistencia al cambio

## 🚀 Recursos de Apoyo

- **Templates de presupuesto:** [Link a hoja de cálculo modelo]
- **Ejemplos de KPIs inmobiliarios:** [Link a documento]
- **Calculadora de ROI:** [Link a herramienta online]
- **Proveedores recomendados por país:** [Link a lista actualizada]

¡Tu transformación digital comienza con este plan! 💪`,

    deliverables: [
      {
        id: 'deliverable_1',
        title: 'Documento Principal del Plan de IA',
        description: 'Plan completo de implementación de IA para tu agencia (5-8 páginas en PDF)',
        requirements: [
          'Análisis detallado de situación actual de tu agencia',
          'Plan de implementación en 3 fases con timeline específico',
          'Justificación de herramientas seleccionadas',
          'Identificación de oportunidades específicas de tu mercado',
          'Plan de contingencia para posibles obstáculos'
        ],
        format: 'PDF document',
        max_file_size: '10MB'
      },
      {
        id: 'deliverable_2', 
        title: 'Presupuesto y Análisis de ROI',
        description: 'Hoja de cálculo detallada con costos, inversiones y proyección de retorno',
        requirements: [
          'Costos mensuales de todas las herramientas de IA',
          'Costos únicos de implementación y capacitación',
          'Cálculo de horas ahorradas valoradas monetariamente',
          'Proyección de aumento en leads y ventas',
          'Cálculo de ROI con formulas transparentes'
        ],
        format: 'Excel/Google Sheets',
        max_file_size: '5MB'
      },
      {
        id: 'deliverable_3',
        title: 'Sistema de Métricas y KPIs',
        description: 'Marco de medición con 5 KPIs principales y sistema de seguimiento',
        requirements: [
          '5 KPIs específicos y medibles',
          'Metas numéricas claras para cada KPI',
          'Metodología de medición detallada',
          'Frecuencia de evaluación y reporting',
          'Sistema de alertas para desvíos del plan'
        ],
        format: 'Section within main PDF',
        max_file_size: 'N/A'
      }
    ],

    rubric: [
      {
        criterion: 'Análisis de Situación Actual',
        excellent: 'Análisis profundo y específico de la agencia, mercado local, y oportunidades identificadas con datos concretos',
        good: 'Análisis completo con información relevante y algunas especificidades del mercado local',
        satisfactory: 'Análisis básico que cubre los elementos principales pero carece de profundidad',
        needs_improvement: 'Análisis superficial o genérico sin datos específicos de la agencia o mercado',
        points: 30
      },
      {
        criterion: 'Plan de Implementación',
        excellent: 'Plan detallado en 3 fases con timeline específico, herramientas justificadas, y integración clara entre fases',
        good: 'Plan bien estructurado con la mayoría de elementos claros y timeline realista',
        satisfactory: 'Plan básico que cubre las fases principales pero con algunos vacíos en detalles',
        needs_improvement: 'Plan vago o irrealista sin timeline claro o justificación de herramientas',
        points: 40
      },
      {
        criterion: 'Presupuesto y ROI',
        excellent: 'Cálculos detallados y realistas con fuentes claras, ROI bien fundamentado con múltiples beneficios cuantificados',
        good: 'Presupuesto completo con cálculos correctos y ROI basado en datos del curso',
        satisfactory: 'Presupuesto básico con cálculos simples pero ROI presente',
        needs_improvement: 'Presupuesto incompleto o cálculos erróneos sin justificación del ROI',
        points: 20
      },
      {
        criterion: 'Sistema de Métricas',
        excellent: 'KPIs específicos, medibles, con metas numéricas claras y sistema de seguimiento detallado',
        good: 'KPIs bien definidos con la mayoría de elementos de medición claros',
        satisfactory: 'KPIs básicos presentes pero con algunos aspectos de medición poco claros',
        needs_improvement: 'KPIs vagos o no medibles sin sistema claro de seguimiento',
        points: 10
      }
    ],

    submission_guidelines: `## 📤 Instrucciones de Entrega

### Formato de Archivos
- **Documento principal:** PDF (máximo 10MB)
- **Presupuesto:** Excel, Google Sheets, o CSV (máximo 5MB)
- **Archivos adicionales:** Imágenes PNG/JPG para gráficos si los incluyes

### Nomenclatura de Archivos
- \`Plan_IA_[TuNombre]_[TuAgencia].pdf\`
- \`Presupuesto_IA_[TuNombre]_[TuAgencia].xlsx\`

### Proceso de Entrega
1. **Revisa tu trabajo** con el checklist de calidad
2. **Sube los archivos** al sistema de tareas
3. **Incluye un comentario** de 2-3 líneas explicando tu enfoque principal
4. **Confirma la entrega** - no podrás modificar después

### Plazos
- **Fecha límite:** 2 semanas después de acceder a esta lección
- **Entrega temprana:** Bonus de 5 puntos por entregar con 3+ días de anticipación
- **Entrega tardía:** Descuento de 10 puntos por día de retraso

### Feedback y Evaluación
- **Calificación:** 1-5 días hábiles después de la entrega
- **Feedback detallado:** Incluido con cada evaluación
- **Oportunidad de mejora:** Una revisión permitida si el puntaje es menor a 70

### Soporte Durante el Proyecto
- **Foro de dudas:** Disponible 24/7 con respuesta en 24 horas
- **Consulta 1:1:** Disponible por videollamada (agendar con 48h de anticipación)
- **Recursos adicionales:** Acceso a plantillas y ejemplos en el área de recursos

¡Tu plan será la base real para transformar tu agencia! 🚀`,

    examples: [
      {
        title: 'Plan de IA - Agencia Boutique (Ejemplo)',
        description: 'Ejemplo de plan para agencia pequeña especializada en propiedades de lujo',
        type: 'pdf',
        url: 'https://example.com/ejemplos/plan-ia-boutique.pdf'
      },
      {
        title: 'Plan de IA - Agente Independiente (Ejemplo)', 
        description: 'Ejemplo de plan para agente independiente con presupuesto limitado',
        type: 'pdf',
        url: 'https://example.com/ejemplos/plan-ia-independiente.pdf'
      },
      {
        title: 'Plantilla de Presupuesto IA Inmobiliaria',
        description: 'Hoja de cálculo con fórmulas pre-configuradas para calcular ROI',
        type: 'spreadsheet',
        url: 'https://example.com/templates/presupuesto-ia-template.xlsx'
      }
    ],

    peer_review: {
      enabled: true,
      instructions: `## 👥 Revisión por Pares

Como parte del aprendizaje colaborativo, revisarás el plan de un compañero y recibirás feedback del tuyo.

### Qué revisar:
1. **Realismo del plan:** ¿Es factible para esa agencia?
2. **Especificidad:** ¿Incluye detalles concretos o es muy genérico?
3. **Viabilidad del presupuesto:** ¿Los números son realistas?
4. **Claridad de KPIs:** ¿Se pueden medir efectivamente?
5. **Creatividad:** ¿Usa las herramientas de forma innovadora?

### Cómo dar feedback:
- **Sé constructivo:** Sugiere mejoras específicas
- **Sé específico:** "El presupuesto parece alto" vs "La herramienta X cuesta $Y, podrías usar Z que cuesta $W"
- **Reconoce fortalezas:** Menciona qué te gustó del plan
- **Ofrece recursos:** Comparte herramientas o enlaces útiles

### Proceso:
1. Recibirás un plan asignado automáticamente 24h después de tu entrega
2. Tienes 72h para completar tu revisión
3. Usarás una rúbrica específica para calificar cada sección
4. Tu calidad como revisor también será evaluada

¡El feedback de pares es una de las mejores formas de aprender! 🤝`
    }
  },
  duration_minutes: 420, // 7 hours distributed over days
  is_free: false
}

export default function ProyectoFinalPlanIAAgenciaLesson(props: LessonProps) {
  return <AssignmentLesson lesson={lessonData} {...props} />
}