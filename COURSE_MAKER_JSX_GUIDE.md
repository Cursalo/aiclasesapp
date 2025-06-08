# 📚 Guía Completa para Crear Cursos JSX - AIClases LMS

## 🎯 Estructura del Curso JSX

### 1. Archivo Principal: `course_outline.md`
```markdown
# Curso: [NOMBRE DEL CURSO]

## Información Básica
- **Título:** [Título completo en español]
- **Descripción:** [Descripción de 2-3 líneas]
- **Audiencia:** [Target específico]
- **Duración Total:** [X] horas
- **Nivel:** Principiante/Intermedio/Avanzado
- **Idioma:** Español (Latinoamérica)

## Estructura del Curso
[8 lecciones con tipos variados]
```

### 2. Metadatos SQL: `[curso]_metadata.sql`
```sql
-- Insertar curso en base de datos
INSERT INTO courses (id, title, description, instructor_id, category_id, level, duration_hours, price, is_published, created_at)
VALUES (...);

-- Insertar instructor
INSERT INTO instructors (id, name, bio, expertise, profile_image_url, created_at)
VALUES (...);

-- Insertar lecciones
INSERT INTO lessons (id, course_id, title, description, lesson_type, content_url, duration_minutes, order_index, is_free, created_at)
VALUES (...);
```

## 🔧 Tipos de Lecciones JSX

### Tipo 1: Video Lesson
```typescript
const lessonData = {
  id: 'unique-lesson-id',
  title: 'Título de la Lección',
  description: 'Descripción breve',
  type: 'video' as const,
  content: {
    video_url: 'https://example.com/video.mp4',
    duration: 1200, // segundos
    thumbnail: 'https://example.com/thumb.jpg',
    transcript: `Transcripción completa del video aquí...`,
    
    notes: [
      'Punto clave 1',
      'Punto clave 2'
    ],
    
    chapters: [
      { title: 'Introducción', timestamp: 0 },
      { title: 'Concepto Principal', timestamp: 300 }
    ],
    
    resources: [
      {
        title: 'Recurso Adicional',
        type: 'pdf',
        url: 'https://example.com/resource.pdf'
      }
    ]
  },
  duration_minutes: 20,
  is_free: true
}
```

### Tipo 2: Text Lesson
```typescript
const lessonData = {
  id: 'unique-lesson-id',
  title: 'Título de la Lección',
  description: 'Descripción breve',
  type: 'text' as const,
  content: {
    markdown: `# Título Principal

## Sección 1
Contenido en markdown...

### Subsección
Más contenido...

**IMPORTANTE:** No usar triple backticks dentro del template literal.
Para código usar:
\\`\\`\\`javascript
// código aquí
\\`\\`\\``,
    estimated_reading_time: 15
  },
  duration_minutes: 20,
  is_free: false
}
```

### Tipo 3: Code Lesson
```typescript
const lessonData = {
  id: 'unique-lesson-id',
  title: 'Título de la Lección',
  description: 'Descripción breve',
  type: 'code' as const,
  content: {
    instructions: `# Instrucciones del Ejercicio

Tu misión es completar estos ejercicios...`,

    starter_code: `// Código inicial
function ejemplo() {
  return "Hola mundo";
}`,

    solution: `// Solución completa
function ejemplo() {
  return "Hola mundo completado";
}`,

    language: 'javascript',
    
    tests: [
      {
        name: 'Test básico',
        code: 'ejemplo().includes("Hola")',
        expected: true
      }
    ],
    
    hints: [
      'Pista 1 para ayudar',
      'Pista 2 para guiar'
    ],
    
    resources: [
      {
        title: 'Documentación',
        type: 'link',
        url: 'https://example.com'
      }
    ]
  },
  duration_minutes: 30,
  is_free: false
}
```

### Tipo 4: Interactive Lesson
```typescript
const lessonData = {
  id: 'unique-lesson-id',
  title: 'Título de la Lección',
  description: 'Descripción breve',
  type: 'interactive' as const,
  content: {
    components: [
      {
        type: 'explanation',
        title: 'Introducción',
        content: `Explicación del concepto...`
      },
      
      {
        type: 'live-demo',
        title: 'Demo Interactivo',
        html: \`<div id="demo">
          <button onclick="ejemplo()">Hacer clic</button>
        </div>\`,
        
        css: \`#demo {
          padding: 20px;
          background: #f0f0f0;
        }\`,
        
        javascript: \`function ejemplo() {
          alert('¡Funciona!');
        }\`,
        
        explanation: 'Interactúa con el demo'
      },
      
      {
        type: 'exercise',
        title: 'Ejercicio Práctico',
        instructions: `Completa esta tarea...`,
        starter_code: `// Tu código aquí`,
        solution: `// Solución aquí`
      },
      
      {
        type: 'challenge',
        title: 'Desafío Avanzado',
        instructions: `Desafío más complejo...`,
        starter_html: `<div>HTML inicial</div>`,
        starter_code: `// JavaScript inicial`,
        solution: `// Solución completa`
      }
    ],
    
    learning_goals: [
      'Objetivo de aprendizaje 1',
      'Objetivo de aprendizaje 2'
    ]
  },
  duration_minutes: 35,
  is_free: false
}
```

### Tipo 5: Quiz Lesson
```typescript
const lessonData = {
  id: 'unique-lesson-id',
  title: 'Quiz de Conocimientos',
  description: 'Evalúa tu comprensión',
  type: 'quiz' as const,
  content: {
    introduction: `# Introducción al Quiz

Instrucciones para el quiz...`,

    questions: [
      {
        id: 'q1',
        question: '¿Cuál es la respuesta correcta?',
        type: 'multiple_choice',
        options: [
          'Opción A',
          'Opción B', 
          'Opción C',
          'Opción D'
        ],
        correct_answer: 1, // índice de la respuesta correcta
        explanation: 'Explicación de por qué es correcta'
      },
      
      {
        id: 'q2',
        question: '¿Verdadero o falso?',
        type: 'true_false',
        correct_answer: true,
        explanation: 'Explicación de la respuesta'
      }
    ],

    passing_score: 80,
    show_results_immediately: true,
    allow_retakes: true,
    randomize_questions: false,
    
    feedback: {
      perfect_score: {
        title: '¡Perfecto!',
        message: 'Has dominado el tema completamente'
      },
      high_score: {
        title: '¡Excelente!',
        message: 'Muy buen entendimiento'
      },
      passing_score: {
        title: '¡Aprobado!',
        message: 'Has pasado el quiz'
      },
      failing_score: {
        title: 'Necesitas repasar',
        message: 'Revisa el material y vuelve a intentar'
      }
    }
  },
  duration_minutes: 20,
  is_free: false
}
```

### Tipo 6: Assignment Lesson
```typescript
const lessonData = {
  id: 'unique-lesson-id',
  title: 'Proyecto Final',
  description: 'Desarrolla un proyecto completo',
  type: 'assignment' as const,
  content: {
    overview: `# Descripción del Proyecto

Objetivos y descripción general...`,

    instructions: `# Instrucciones Detalladas

## Parte 1: Análisis
Pasos específicos...

## Parte 2: Desarrollo
Más pasos...`,

    deliverables: [
      {
        id: 'deliverable_1',
        title: 'Documento Principal',
        description: 'Descripción del entregable',
        requirements: [
          'Requisito 1',
          'Requisito 2'
        ],
        format: 'PDF document',
        max_file_size: '10MB'
      }
    ],

    rubric: [
      {
        criterion: 'Criterio de Evaluación',
        excellent: 'Descripción de excelente',
        good: 'Descripción de bueno',
        satisfactory: 'Descripción de satisfactorio',
        needs_improvement: 'Descripción de necesita mejora',
        points: 25
      }
    ],

    submission_guidelines: `## Instrucciones de Entrega

Formato y proceso de entrega...`,

    examples: [
      {
        title: 'Ejemplo de Proyecto',
        description: 'Descripción del ejemplo',
        type: 'pdf',
        url: 'https://example.com/ejemplo.pdf'
      }
    ]
  },
  duration_minutes: 420, // 7 horas
  is_free: false
}
```

### Tipo 7: Discussion Lesson
```typescript
const lessonData = {
  id: 'unique-lesson-id',
  title: 'Foro de Discusión',
  description: 'Comparte experiencias y aprende',
  type: 'discussion' as const,
  content: {
    introduction: `# Bienvenido al Foro

Propósito y reglas del foro...`,

    discussion_prompts: [
      {
        id: 'prompt_1',
        title: 'Tema de Discusión 1',
        description: 'Descripción del tema',
        questions: [
          '¿Pregunta 1?',
          '¿Pregunta 2?'
        ],
        sample_responses: [
          {
            author: 'Usuario Ejemplo',
            content: 'Respuesta de ejemplo',
            likes: 10,
            replies: 5
          }
        ]
      }
    ],

    community_guidelines: `## Reglas de la Comunidad

### Permitido:
- Comportamiento positivo

### No permitido:
- Comportamiento negativo`,

    featured_discussions: [
      {
        id: 'featured_1',
        title: 'Discusión Destacada',
        author: 'Autor',
        preview: 'Vista previa del contenido...',
        replies: 25,
        likes: 50,
        category: 'Categoría'
      }
    ]
  },
  duration_minutes: 30,
  is_free: false
}
```

## 🚫 Errores Comunes a Evitar

### 1. Template Literals con Backticks
```typescript
// ❌ INCORRECTO
content: `
Texto con ```código``` dentro
`

// ✅ CORRECTO  
content: \`
Texto con \\`\\`\\`código\\`\\`\\` dentro
\`
```

### 2. Comillas Dobles en JavaScript
```typescript
// ❌ INCORRECTO
javascript: \`
function ejemplo() {
  console.log("Hola");
}
\`

// ✅ CORRECTO
javascript: \`
function ejemplo() {
  console.log('Hola');
}
\`
```

### 3. HTML con Comillas
```typescript
// ❌ INCORRECTO
html: \`<div onclick="funcion()">Texto</div>\`

// ✅ CORRECTO
html: \`<div onclick="funcion()">Texto</div>\`
// o mejor aún
html: \`<div onclick="funcion()">Texto</div>\`
```

### 4. Markdown en Template Literals
```typescript
// ❌ INCORRECTO
markdown: \`
# Título
```javascript
código aquí
```
\`

// ✅ CORRECTO
markdown: \`
# Título
\\`\\`\\`javascript
código aquí
\\`\\`\\`
\`
```

## 📁 Estructura de Archivos

```
src/components/lessons/courses/[nombre-curso]/
├── 01-leccion-video.tsx
├── 02-leccion-texto.tsx
├── 03-leccion-codigo.tsx
├── 04-leccion-interactiva.tsx
├── 05-leccion-texto-2.tsx
├── 06-quiz-intermedio.tsx
├── 07-proyecto-final.tsx
└── 08-foro-discusion.tsx
```

## 🎨 Nomenclatura

### IDs de Lecciones
```typescript
// Formato: [curso-prefix]-[numero]-[descripcion-corta]
id: 'ia-re-01-introduccion'
id: 'marketing-02-herramientas'
id: 'legal-03-automatizacion'
```

### Nombres de Archivos
```
01-introduccion-tema-principal.tsx
02-herramientas-especificas.tsx
03-ejercicios-practicos.tsx
```

## ✅ Checklist de Calidad

Antes de crear cada lección, verificar:

- [ ] ID único y descriptivo
- [ ] Título claro en español
- [ ] Descripción informativa
- [ ] Tipo de lección correcto
- [ ] Duración realista
- [ ] Contenido apropiado para el tipo
- [ ] Template literals correctamente escapados
- [ ] Comillas simples en JavaScript
- [ ] Markdown válido
- [ ] Recursos y ejemplos incluidos
- [ ] Objetivos de aprendizaje claros

## 🚀 Comando de Build Test

```bash
# Probar compilación sin errores
npm run build

# Verificar tipos TypeScript
npx tsc --noEmit

# Linting
npm run lint
```

## 📚 Ejemplos Completos

Ver los archivos en `/src/components/lessons/courses/ia-real-estate-latam/` como referencia de implementación correcta.

---

**Importante:** Siempre escapar los backticks (\`) dentro de template literals JSX para evitar errores de parsing.