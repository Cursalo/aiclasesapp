'use client'

import React from 'react'
import { CodeLesson } from '@/components/lessons/code-lesson'
import type { LessonProps } from '@/lib/lessons/types'

const lessonData = {
  id: 'ia-re-03-chatgpt-descripciones',
  title: 'ChatGPT para Descripciones de Propiedades',
  description: 'Domina el arte de crear descripciones atractivas y persuasivas usando ChatGPT y prompt engineering.',
  type: 'code' as const,
  content: {
    instructions: `# 🎯 Maestría en Descripciones Inmobiliarias con ChatGPT

## Tu Misión
Aprenderás a crear descripciones de propiedades que **conviertan 3x más** usando ChatGPT. Al final de esta lección, dominarás 5 templates de prompts probados que generan descripciones irresistibles.

## 🚀 Ejercicios Progresivos

### **Ejercicio 1: Template Básico**
Crea una descripción atractiva para un departamento usando el template base.

### **Ejercicio 2: Storytelling Inmobiliario** 
Transforma características en beneficios emocionales.

### **Ejercicio 3: Optimización SEO**
Genera descripciones optimizadas para motores de búsqueda.

### **Ejercicio 4: Personalización por Audiencia**
Adapta el tono según el tipo de comprador.

### **Ejercicio 5: Descripción Premium**
Crea una descripción de lujo usando técnicas avanzadas.

## 📊 Datos de la Propiedad para Practicar

**Departamento en Polanco, Ciudad de México**
- 95 m² construidos
- 2 recámaras, 2 baños
- Piso 8 de 12
- Balcón con vista a parque
- Cocina integral equipada
- 1 cajón de estacionamiento
- Amenidades: gym, alberca, roof garden
- Precio: $4,850,000 MXN
- Cerca de metro Polanco (3 min caminando)
- Centro comercial Antara a 5 min

¡Empecemos a crear descripciones que vendan!`,

    starter_code: `// 🏠 EJERCICIO 1: TEMPLATE BÁSICO
// Copia este prompt en ChatGPT y reemplaza los datos entre []

/*
PROMPT TEMPLATE BÁSICO:

Eres un copywriter especializado en bienes raíces de lujo en México. 
Crea una descripción atractiva para esta propiedad:

DATOS DE LA PROPIEDAD:
- Tipo: [Departamento]
- Ubicación: [Polanco, CDMX]  
- Tamaño: [95 m²]
- Recámaras: [2]
- Baños: [2]
- Características: [Piso 8, balcón con vista a parque, cocina equipada]
- Precio: [$4,850,000 MXN]
- Ubicación específica: [3 min del metro Polanco]

INSTRUCCIONES:
1. Máximo 150 palabras
2. Incluye llamada a la acción
3. Destaca el lifestyle, no solo características
4. Usa lenguaje persuasivo pero profesional
5. Menciona inversión/plusvalía

Tu descripción:
*/

// 🎯 EJERCICIO 2: STORYTELLING INMOBILIARIO
// Ahora vamos a crear una descripción que cuente una historia

/*
PROMPT STORYTELLING:

Eres un experto en storytelling inmobiliario. Crea una descripción que 
haga que el lector se VISUALICE viviendo en esta propiedad.

PROPIEDAD: [Mismo departamento de arriba]

TÉCNICA REQUERIDA:
- Empieza con una escena cotidiana ("Imagínate despertando...")
- Conecta características con beneficios emocionales
- Usa palabras sensoriales (vista, sonidos, sensaciones)
- Termina con urgencia sutil

ESTRUCTURA:
1. Apertura emocional (30 palabras)
2. Tour virtual (80 palabras) 
3. Lifestyle y comunidad (40 palabras)
4. Cierre con llamada a la acción (20 palabras)

Tu descripción storytelling:
*/

// 💻 EJERCICIO 3: OPTIMIZACIÓN SEO
// Vamos a crear una descripción optimizada para Google

/*
PROMPT SEO:

Actúa como especialista en SEO inmobiliario para México. 
Crea una descripción optimizada para estas palabras clave:

KEYWORDS PRINCIPALES:
- "departamento venta Polanco"
- "departamento 2 recámaras CDMX"  
- "propiedades lujo Polanco"

KEYWORDS SECUNDARIAS:
- "metro Polanco"
- "amenidades"
- "inversión inmobiliaria"

REGLAS SEO:
1. Keyword principal en los primeros 50 caracteres
2. Usar variaciones naturales de keywords
3. Incluir ubicaciones específicas
4. Mencionar amenidades populares en búsquedas
5. Máximo 160 palabras para descripción meta

DATOS: [Mismo departamento]

Tu descripción SEO:
*/

// 🎭 EJERCICIO 4: PERSONALIZACIÓN POR AUDIENCIA
// Crea 3 versiones para diferentes tipos de compradores

/*
PROMPT SEGMENTACIÓN:

Crea 3 versiones de descripción para la MISMA propiedad, 
dirigidas a diferentes audiencias:

PROPIEDAD: [Departamento Polanco - datos anteriores]

AUDIENCIA 1 - JÓVENES PROFESIONALES (25-35 años):
- Enfoque: ubicación, movilidad, lifestyle urbano
- Tono: dinámico, moderno
- Destacar: cercanía al trabajo, vida social, tecnología

AUDIENCIA 2 - FAMILIAS JÓVENES (30-45 años):  
- Enfoque: seguridad, espacios, futuro de los hijos
- Tono: cálido, estable
- Destacar: espacios familiares, educación cercana, tranquilidad

AUDIENCIA 3 - INVERSIONISTAS (35-55 años):
- Enfoque: ROI, plusvalía, números
- Tono: profesional, analítico  
- Destacar: ubicación premium, demanda de renta, crecimiento

Cada descripción: máximo 100 palabras

Versión Jóvenes Profesionales:

Versión Familias:

Versión Inversionistas:
*/

// 💎 EJERCICIO 5: DESCRIPCIÓN PREMIUM
// El nivel máximo: descripción de lujo que justifica precio premium

/*
PROMPT PREMIUM:

Eres el copywriter #1 de propiedades de lujo en Latinoamérica. 
Tu misión: crear una descripción que haga sentir al lector que 
esta propiedad vale cada peso del precio.

PROPIEDAD: [Departamento Polanco]
PRECIO: $4,850,000 MXN (¡Hay que justificarlo!)

TÉCNICAS PREMIUM:
1. Usa vocabulario exclusivo (no digas "bonito", di "excepcional")
2. Menciona detalles únicos que otros no ven
3. Conecta con aspiraciones y status
4. Crea sensación de escasez/exclusividad
5. Incluye comparaciones sutiles con propiedades menores

ESTRUCTURA PREMIUM:
- Headline impactante (10 palabras)
- Declaración de valor único (30 palabras)
- Descripción experiencial (100 palabras)
- Llamada a la acción exclusiva (20 palabras)

Tu descripción premium:
*/`,

    solution: `// ✅ SOLUCIONES Y MEJORES PRÁCTICAS

// 🏠 SOLUCIÓN EJERCICIO 1: TEMPLATE BÁSICO
/*
DESCRIPCIÓN BÁSICA EFECTIVA:

🏙️ VIVE LA EXPERIENCIA POLANCO 

Descubre este excepcional departamento de 95m² que redefine el concepto de hogar urbano. Con 2 recámaras perfectamente distribuidas, 2 baños completos y un balcón con vista privilegiada al parque, cada detalle fue pensado para tu comodidad.

La cocina integral equipada se convierte en el corazón del hogar, mientras que el piso 8 te ofrece privacidad y vistas espectaculares. A solo 3 minutos del Metro Polanco, tendrás la ciudad a tus pies.

Amenidades de resort: gym, alberca y roof garden para un lifestyle sin igual.

Inversión inteligente en la zona de mayor plusvalía de CDMX.

💰 $4,850,000 MXN - Tu patrimonio te espera

📞 ¡Agenda tu cita hoy! Esta oportunidad no durará mucho.
*/

// 🎯 SOLUCIÓN EJERCICIO 2: STORYTELLING
/*
DESCRIPCIÓN STORYTELLING:

Imagínate despertando cada mañana con la vista del parque desde tu cama, mientras el aroma del café se esparce desde tu cocina integral de lujo...

Este departamento en Polanco no es solo un hogar, es tu refugio urbano de 95m². Caminas descalzo por los pisos de calidad, abres las ventanas del balcón y respiras la tranquilidad del parque que tienes enfrente. Tus invitados quedan maravillados al llegar al piso 8, donde la vista los recibe antes que tú.

Después del trabajo, bajas al gym del edificio, te relajas en la alberca, y por las noches, el roof garden se convierte en tu terraza privada bajo las estrellas de la CDMX.

La estación del metro está a 3 minutos: tu conexión con toda la ciudad.

🏡 Esta vida te está esperando en Polanco.
📲 ¡Ven a vivirla este fin de semana!
*/

// 💻 SOLUCIÓN EJERCICIO 3: SEO
/*
DESCRIPCIÓN SEO OPTIMIZADA:

DEPARTAMENTO VENTA POLANCO - 2 RECÁMARAS LUJO CDMX

Excepcional departamento 2 recámaras en venta Polanco, ubicado a 3 minutos Metro Polanco. Esta propiedad de lujo de 95m² ofrece amenidades premium: gym, alberca y roof garden.

Características destacadas departamento Polanco:
✓ 2 recámaras amplias + 2 baños completos  
✓ Cocina integral equipada marca italiana
✓ Balcón vista parque + estacionamiento incluido
✓ Piso 8 con elevador + seguridad 24/7

Ubicación privilegiada propiedades lujo Polanco: Centro comercial Antara 5 minutos, restaurantes gourmet, oficinas corporativas.

Inversión inmobiliaria inteligente zona plusvalía CDMX. Ideal departamentos renta ejecutiva o residencia familiar.

Precio departamento venta Polanco: $4,850,000 MXN

Agente certificado propiedades Polanco. Financiamiento disponible todas las instituciones bancarias.

📞 Contacto inmediato departamentos lujo CDMX
*/

// 🎭 SOLUCIÓN EJERCICIO 4: SEGMENTACIÓN
/*
VERSIÓN JÓVENES PROFESIONALES:
🚀 TU BASE DE OPERACIONES EN POLANCO

Olvídate del tráfico: Metro Polanco a 3 minutos. Este departamento de 95m² con 2 recámaras es perfecto para tu lifestyle dinámico. Cocina equipada para tus reuniones, balcón para el home office con vista al parque, y amenidades que rivalizan con cualquier club: gym para tu rutina matutina, alberca para el after-office, roof garden para tus fiestas de fin de semana. Antara Mall a 5 minutos para shopping y entretenimiento. Invierte en tu futuro mientras vives el presente. $4,850,000 MXN

VERSIÓN FAMILIAS:
🏡 EL HOGAR QUE TU FAMILIA MERECE

Seguridad 24/7, tranquilidad de parque enfrente, y espacios perfectos para crecer juntos. Este departamento de 95m² ofrece 2 recámaras cómodas para los niños, 2 baños completos, y una cocina donde crear memorias familiares. El balcón se convierte en su espacio de juegos con vista segura al parque. Amenidades pensadas para la familia: alberca para diversión, áreas verdes en roof garden. Excelentes escuelas cercanas y transporte eficiente. Tu patrimonio familiar en la mejor zona de CDMX. $4,850,000 MXN

VERSIÓN INVERSIONISTAS:
📈 INVERSIÓN ESTRATÉGICA POLANCO

ROI comprobado: 8-12% anual en rentas ejecutivas. Ubicación premium Metro Polanco (3 min) garantiza demanda constante inquilinos corporativos. 95m² óptimos, 2 recámaras layout eficiente, amenidades que justifican rentas $35,000-40,000 MXN mensuales.

Factores clave plusvalía: Nuevo desarrollo comercial Antara expansión, línea metro en crecimiento, zona oficinas corporativas consolidada. Precio $4,850,000 MXN = $51,052 MXN/m² (15% below market average similar buildings).

Financiamiento disponible 80% valor. Entrega inmediata, sin remodelaciones requeridas.
*/

// 💎 SOLUCIÓN EJERCICIO 5: PREMIUM
/*
DESCRIPCIÓN PREMIUM LUXURY:

**EXCLUSIVIDAD REDEFINIDA EN POLANCO**

"Hay propiedades... y hay residencias que marcan la diferencia."

En el corazón de la colonia más codiciada de México, este departamento de 95m² trasciende el concepto tradicional de hogar. No es solo la ubicación privilegiada a pasos del Metro Polanco, ni las vistas envolventes al parque desde el octavo piso.

Es la experiencia de despertar cada día en un santuario urbano donde cada detalle susurra sofisticación: la cocina integral de línea europea que invita a crear momentos memorables, el balcón privado que se convierte en tu mirador exclusivo hacia la serenidad del parque, los dos espacios íntimos perfectamente climatizados que abrazan tus momentos de descanso.

Las amenidades no son servicios, son extensiones de tu estilo de vida: un gymnasium que rivaliza con clubes exclusivos, una alberca que te transporta a un resort privado, un roof garden donde el skyline de la ciudad se convierte en tu vista nocturna personal.

Solo para conocedores que comprenden que $4,850,000 MXN no es un precio, es una inversión en exclusividad.

🔑 Disponible únicamente por cita privada.
*/

// 📝 MEJORES PRÁCTICAS IDENTIFICADAS:

/*
✅ PALABRAS QUE CONVIERTEN MÁS:
- "Excepcional" vs "bonito"
- "Privilegiado" vs "bueno" 
- "Exclusivo" vs "especial"
- "Inversión" vs "compra"
- "Lifestyle" vs "vida"

✅ ESTRUCTURA GANADORA:
1. Hook emocional (primera línea)
2. Beneficios específicos (no características)
3. Prueba social/ubicación
4. Urgencia sutil
5. Llamada a la acción clara

✅ ELEMENTOS QUE NUNCA FALLAN:
- Números específicos (3 minutos, 95m²)
- Beneficios emocionales (tranquilidad, exclusividad)
- Comparaciones implícitas (rivaliza con clubes)
- Llamadas a la acción con urgencia
- Precio presentado como inversión

✅ ERRORES A EVITAR:
- Listas aburridas de características
- Lenguaje genérico 
- Descripciones muy largas
- Falta de llamada a la acción
- No segmentar por audiencia
*/`,

    language: 'markdown',
    
    tests: [
      {
        name: 'Descripción básica incluye llamada a la acción',
        code: 'descripcionBasica.includes("agenda") || descripcionBasica.includes("contacta") || descripcionBasica.includes("llama")',
        expected: true
      },
      {
        name: 'Descripción storytelling usa lenguaje sensorial',
        code: 'descripcionStorytelling.includes("imagínate") || descripcionStorytelling.includes("aroma") || descripcionStorytelling.includes("vista")',
        expected: true
      },
      {
        name: 'Descripción SEO incluye palabras clave',
        code: 'descripcionSEO.includes("Polanco") && descripcionSEO.includes("2 recámaras")',
        expected: true
      },
      {
        name: 'Segmentación tiene 3 versiones diferentes',
        code: 'versionJovenes !== versionFamilias && versionFamilias !== versionInversionistas',
        expected: true
      },
      {
        name: 'Descripción premium justifica precio alto',
        code: 'descripcionPremium.includes("exclusiv") || descripcionPremium.includes("lujo") || descripcionPremium.includes("premium")',
        expected: true
      }
    ],
    
    hints: [
      'Usa verbos en segunda persona ("vives", "disfrutas") para crear conexión emocional',
      'Incluye números específicos para dar credibilidad (3 minutos, 95m², $4,850,000)',
      'Menciona beneficios emocionales, no solo características físicas',
      'Cada descripción debe tener una llamada a la acción clara y específica',
      'Para SEO, incluye las palabras clave de forma natural en los primeros 50 caracteres'
    ],
    
    resources: [
      {
        title: 'Guía Completa de Copywriting Inmobiliario',
        type: 'pdf',
        url: 'https://example.com/copywriting-inmobiliario.pdf'
      },
      {
        title: 'Templates de Prompts para ChatGPT Inmobiliario',
        type: 'template',
        url: 'https://example.com/prompts-templates.docx'
      },
      {
        title: 'Keywords SEO Inmobiliario México 2024',
        type: 'spreadsheet',
        url: 'https://example.com/keywords-seo-mx.xlsx'
      }
    ]
  },
  duration_minutes: 30,
  is_free: false
}

export default function ChatGPTDescripcionesPropiedadesLesson(props: LessonProps) {
  return <CodeLesson lesson={lessonData} {...props} />
}