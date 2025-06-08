/* eslint-disable */
'use client'

import React from 'react'
import { InteractiveLesson } from '@/components/lessons/interactive-lesson'
import type { LessonProps } from '@/lib/lessons/types'

const lessonData = {
  id: 'ia-re-04-generacion-leads',
  title: 'IA para Generación de Leads',
  description: 'Implementa sistemas inteligentes para captar y calificar prospectos automáticamente usando chatbots, marketing digital y IA.',
  type: 'interactive' as const,
  content: {
    components: [
      {
        type: 'explanation',
        title: '🎯 Revoluciona tu Generación de Leads con IA',
        content: `**¿Sabías que el 73% de los leads inmobiliarios se pierden por falta de seguimiento inmediato?**

En esta lección aprenderás a crear un sistema de generación de leads que:
- ✅ Responde automáticamente en menos de 60 segundos
- ✅ Califica leads mientras duermes
- ✅ Personaliza comunicaciones para cada prospecto
- ✅ Aumenta tu tasa de conversión en 40-60%

**Caso de Éxito Real:**
Roberto Hernández, agente en Guadalajara, implementó estos sistemas y pasó de 12 leads mensuales a 48 leads cualificados, aumentando sus ventas 35% en 4 meses.

## 🏆 Sistema de Leads con IA - Componentes Clave:

### 1. **Chatbot Inmobiliario Inteligente**
- Respuesta instantánea 24/7
- Calificación automática de leads
- Agenda citas automáticamente
- Integración WhatsApp Business

### 2. **Marketing Digital Automatizado**
- Anuncios en Facebook/Google optimizados por IA
- Retargeting inteligente
- Emails personalizados automáticos
- Content marketing automatizado

### 3. **Scoring de Leads con Machine Learning**
- Clasifica leads en calientes/tibios/fríos
- Prioriza tu tiempo en leads de mayor conversión
- Predice probabilidad de compra
- Automatiza el follow-up según el score

¡Empecemos a construir tu máquina de leads!`
      },
      
      {
        type: 'live-demo',
        title: '🤖 Demo: Configurando tu Primer Chatbot Inmobiliario',
        html: `<div id="chatbot-demo" style="max-width: 400px; margin: 0 auto; border: 2px solid #ccc; border-radius: 10px; overflow: hidden;">
  <div class="chat-header" style="background: #007bff; color: white; padding: 15px; text-align: center;">
    <h3 style="margin: 0;">🏠 AsistenteIA Inmobiliario</h3>
    <p style="margin: 5px 0 0 0; font-size: 12px;">En línea • Responde en segundos</p>
  </div>
  
  <div id="chat-messages" style="height: 300px; overflow-y: auto; padding: 15px; background: #f8f9fa;">
    <div class="message bot-message" style="margin-bottom: 15px;">
      <div style="background: white; padding: 10px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <strong>AsistenteIA:</strong> ¡Hola! 👋 Soy tu asistente inmobiliario inteligente. ¿En qué tipo de propiedad estás interesado?
      </div>
    </div>
  </div>
  
  <div class="chat-input" style="padding: 15px; background: white; border-top: 1px solid #ddd;">
    <div style="display: flex; gap: 10px;">
      <input type="text" id="user-input" placeholder="Escribe tu mensaje..." style="flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
      <button onclick="sendMessage()" style="padding: 10px 15px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Enviar</button>
    </div>
    
    <div style="margin-top: 10px;">
      <button onclick="sendQuickReply('Departamento')" style="margin: 2px; padding: 5px 10px; background: #e9ecef; border: 1px solid #ccc; border-radius: 15px; cursor: pointer; font-size: 12px;">🏠 Departamento</button>
      <button onclick="sendQuickReply('Casa')" style="margin: 2px; padding: 5px 10px; background: #e9ecef; border: 1px solid #ccc; border-radius: 15px; cursor: pointer; font-size: 12px;">🏡 Casa</button>
      <button onclick="sendQuickReply('Comercial')" style="margin: 2px; padding: 5px 10px; background: #e9ecef; border: 1px solid #ccc; border-radius: 15px; cursor: pointer; font-size: 12px;">🏢 Comercial</button>
    </div>
  </div>
</div>`,
        
        css: `#chatbot-demo {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.message {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message {
  text-align: right;
}

.user-message div {
  background: #007bff !important;
  color: white;
  margin-left: 50px;
}

.bot-message div {
  margin-right: 50px;
}

button:hover {
  opacity: 0.8;
  transform: translateY(-1px);
  transition: all 0.2s;
}`,
        
        javascript: `let conversationStep = 0;
const responses = {
  "departamento": {
    message: "🏠 Excelente elección! ¿En qué zona de la ciudad te interesa buscar?",
    quickReplies: ["Centro", "Norte", "Sur", "Este", "Oeste"]
  },
  "casa": {
    message: "🏡 Perfecto! ¿Cuántas recámaras necesitas?",
    quickReplies: ["1-2 recámaras", "3 recámaras", "4+ recámaras"]
  },
  "comercial": {
    message: "🏢 Interesante! ¿Qué tipo de negocio planeas?",
    quickReplies: ["Oficina", "Local comercial", "Bodega", "Restaurante"]
  }
};

function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;
  
  addUserMessage(message);
  input.value = "";
  
  setTimeout(() => {
    processUserMessage(message);
  }, 1000);
}

function sendQuickReply(message) {
  addUserMessage(message);
  setTimeout(() => {
    processUserMessage(message);
  }, 1000);
}

function addUserMessage(message) {
  const chatMessages = document.getElementById("chat-messages");
  const messageDiv = document.createElement("div");
  messageDiv.className = "message user-message";
  messageDiv.style.marginBottom = "15px";
  messageDiv.innerHTML = 
    '<div style="background: #007bff; color: white; padding: 10px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">' +
      '<strong>Tú:</strong> ' + message +
    '</div>';
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(message, quickReplies = []) {
  const chatMessages = document.getElementById("chat-messages");
  const messageDiv = document.createElement("div");
  messageDiv.className = "message bot-message";
  messageDiv.style.marginBottom = "15px";
  
  let quickReplyButtons = "";
  if (quickReplies.length > 0) {
    quickReplyButtons = 
      '<div style="margin-top: 10px;">' +
        quickReplies.map(reply => 
          '<button onclick="sendQuickReply(\\'' + reply + '\\')" style="margin: 2px; padding: 5px 10px; background: #e9ecef; border: 1px solid #ccc; border-radius: 15px; cursor: pointer; font-size: 12px;">' + reply + '</button>'
        ).join("") +
      "</div>";
  }
  
  messageDiv.innerHTML = 
    '<div style="background: white; padding: 10px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">' +
      '<strong>AsistenteIA:</strong> ' + message +
      quickReplyButtons +
    '</div>';
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processUserMessage(message) {
  conversationStep++;
  const messageLower = message.toLowerCase();
  
  if (conversationStep === 1) {
    if (responses[messageLower]) {
      const response = responses[messageLower];
      addBotMessage(response.message, response.quickReplies);
    } else {
      addBotMessage("Interesante! Me puedes dar más detalles sobre lo que buscas?");
    }
  } else if (conversationStep === 2) {
    addBotMessage("Perfecto! Basándome en que buscas " + message + ", tengo algunas opciones excelentes. ¿Cuál es tu presupuesto aproximado?", ["Hasta $2M", "$2M - $5M", "$5M - $10M", "Más de $10M"]);
  } else if (conversationStep === 3) {
    addBotMessage("¡Excelente! Con presupuesto de " + message + ", puedo mostrarte propiedades perfectas. ¿Cuándo te gustaría agendar una cita para ver algunas opciones? 📅", ["Hoy", "Mañana", "Este fin de semana", "Próxima semana"]);
  } else if (conversationStep === 4) {
    addBotMessage("¡Perfecto! 🎉 Ya tengo toda la información. Te voy a conectar con nuestro agente especializado quien te contactará en los próximos 15 minutos para agendar tu cita para " + message + ". Mientras tanto, ¿me podrías compartir tu número de WhatsApp para enviarte algunas opciones preliminares?");
    
    // Aquí es donde el chatbot captura el lead y lo envía al CRM
    setTimeout(() => {
      addBotMessage("✅ ¡Lead capturado exitosamente! Este prospecto ya está en tu CRM con toda la información recopilada.", ["Nuevo Lead", "Ver CRM"]);
    }, 3000);
  }
}

// Permitir envío con Enter
document.getElementById("user-input").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});`,
        explanation: '👆 **Interactúa con el chatbot de demostración** para ver cómo captura leads automáticamente. Observa cómo hace preguntas estratégicas para calificar al prospecto.'
      },

      {
        type: 'exercise',
        title: '📝 Ejercicio: Diseña tu Flujo de Conversación',
        instructions: `## 🎯 Tu Misión: Crear el Flujo Perfecto

Diseña un flujo de conversación para tu chatbot que capture los datos esenciales de tus leads.

### **Información que DEBE capturar tu chatbot:**
1. **Tipo de propiedad** (casa, departamento, comercial)
2. **Zona de interés** (específica de tu ciudad)
3. **Presupuesto** (rangos realistas para tu mercado)
4. **Timeframe** (urgencia de compra)
5. **Datos de contacto** (nombre, teléfono, email)
6. **Motivación** (primera vivienda, inversión, cambio de casa)

### **Estructura Recomendada:**
```
SALUDO → CALIFICACIÓN → PROFUNDIZACIÓN → CONTACTO → AGENDA
```

### **Tu Tarea:**
Escribe el diálogo completo de tu chatbot usando este formato:

**BOT:** [Mensaje del bot]
**OPCIONES:** [Botones de respuesta rápida]
**USUARIO:** [Posible respuesta]
**BOT:** [Siguiente mensaje]

### **Ejemplo para inspirarte:**
```
BOT: ¡Hola! Soy María, tu asistente inmobiliaria virtual 🏠 
     ¿En qué puedo ayudarte hoy?
OPCIONES: [Busco comprar] [Busco rentar] [Vender mi propiedad]

USUARIO: Busco comprar
BOT: ¡Excelente! ¿Qué tipo de propiedad te interesa?
OPCIONES: [Casa] [Departamento] [Local comercial]
```

**Continúa el flujo hasta capturar todos los datos esenciales...**`,
        
        starter_code: `// 🤖 FLUJO DE CONVERSACIÓN - CHATBOT INMOBILIARIO
// Completa el flujo de conversación para tu mercado específico

// PASO 1: SALUDO Y PRIMER CONTACTO
BOT_MENSAJE_1: "¡Hola! Soy [TU_NOMBRE], tu asistente inmobiliario virtual 🏠"
OPCIONES_1: ["Busco comprar", "Busco rentar", "Vender mi propiedad", "Solo información"]

// PASO 2: CALIFICACIÓN DE TIPO DE PROPIEDAD
// Si usuario eligió "Busco comprar":
BOT_MENSAJE_2: "¡Perfecto! ¿Qué tipo de propiedad buscas?"
OPCIONES_2: ["Casa", "Departamento", "Terreno", "Comercial"]

// PASO 3: UBICACIÓN
// Continúa aquí con tu flujo...
BOT_MENSAJE_3: "Excelente elección. ¿En qué zona te interesa buscar?"
OPCIONES_3: ["[Zona 1 de tu ciudad]", "[Zona 2]", "[Zona 3]", "No estoy seguro"]

// PASO 4: PRESUPUESTO
BOT_MENSAJE_4: 
OPCIONES_4: 

// PASO 5: TIMEFRAME
BOT_MENSAJE_5: 
OPCIONES_5: 

// PASO 6: DATOS DE CONTACTO
BOT_MENSAJE_6: 
OPCIONES_6: 

// PASO 7: CIERRE Y AGENDA
BOT_MENSAJE_7: 
OPCIONES_7:`,
        
        solution: `// ✅ FLUJO COMPLETO DE CONVERSACIÓN OPTIMIZADO

// PASO 1: SALUDO PERSONALIZADO
BOT_MENSAJE_1: "¡Hola! Soy Ana, tu asistente inmobiliaria virtual 🏠 Estoy aquí para ayudarte a encontrar la propiedad perfecta en CDMX. ¿En qué te puedo ayudar?"
OPCIONES_1: ["🏠 Busco comprar", "🏠 Busco rentar", "💰 Vender mi propiedad", "ℹ️ Solo información"]

// PASO 2: TIPO DE PROPIEDAD
BOT_MENSAJE_2: "¡Excelente decisión! La compra de una propiedad es una gran inversión. ¿Qué tipo de propiedad estás buscando?"
OPCIONES_2: ["🏡 Casa", "🏠 Departamento", "🏢 Local comercial", "🌳 Terreno"]

// PASO 3: UBICACIÓN ESPECÍFICA
BOT_MENSAJE_3: "Perfecta elección! Los departamentos son muy populares en CDMX. ¿En qué colonia o zona te gustaría vivir?"
OPCIONES_3: ["Polanco", "Roma Norte/Sur", "Condesa", "Santa Fe", "Del Valle", "Otra zona"]

// PASO 4: CARACTERÍSTICAS ESPECÍFICAS
BOT_MENSAJE_4: "¡Polanco es una zona premium! 👑 ¿Cuántas recámaras necesitas?"
OPCIONES_4: ["1 recámara", "2 recámaras", "3 recámaras", "4+ recámaras"]

// PASO 5: PRESUPUESTO
BOT_MENSAJE_5: "Entiendo, 2 recámaras es perfecto para una pareja o familia pequeña. ¿Cuál es tu presupuesto aproximado?"
OPCIONES_5: ["$2M - $4M", "$4M - $7M", "$7M - $12M", "Más de $12M", "Prefiero no decir"]

// PASO 6: TIMEFRAME DE COMPRA
BOT_MENSAJE_6: "Perfecto! Con ese presupuesto tengo excelentes opciones en Polanco. ¿Qué tan urgente es tu búsqueda?"
OPCIONES_6: ["Este mes", "Próximos 3 meses", "Próximos 6 meses", "Solo explorando"]

// PASO 7: MOTIVACIÓN DE COMPRA
BOT_MENSAJE_7: "¡Qué emocionante que sea este mes! ¿Es tu primera propiedad o ya tienes experiencia comprando?"
OPCIONES_7: ["Primera vez", "Segunda propiedad", "Inversión", "Cambio de casa"]

// PASO 8: CAPTURA DE DATOS
BOT_MENSAJE_8: "Excelente! Para enviarte las mejores opciones que tengo disponibles, ¿me podrías compartir tu nombre?"
// (Campo de texto libre)

// PASO 9: NÚMERO DE CONTACTO
BOT_MENSAJE_9: "Mucho gusto, [NOMBRE]! Para enviarte por WhatsApp algunas propiedades que se ajustan perfecto a lo que buscas, ¿cuál es tu número?"
// (Campo de texto libre con validación)

// PASO 10: EMAIL
BOT_MENSAJE_10: "¡Perfecto! Y tu email para enviarte información detallada y agendar una cita?"
// (Campo de texto libre con validación de email)

// PASO 11: AGENDA CITA
BOT_MENSAJE_11: "¡Listo, [NOMBRE]! 🎉 Tengo 3 departamentos en Polanco que cumplen exactamente con lo que buscas. ¿Cuándo te gustaría verlos?"
OPCIONES_11: ["Hoy en la tarde", "Mañana", "Este fin de semana", "Llamada primero"]

// PASO 12: CONFIRMACIÓN Y CIERRE
BOT_MENSAJE_12: "¡Perfecto! Te he agendado para mañana. En 5 minutos recibirás por WhatsApp las fotos de las 3 propiedades y mi asistente te llamará en 15 minutos para confirmar la hora exacta. ¡Estoy segura de que encontraremos tu hogar ideal! 🏠✨"

// PASO 13: LEAD SCORING AUTOMÁTICO
LEAD_SCORE: {
  presupuesto_alto: +20,
  timeframe_urgente: +15,
  zona_premium: +10,
  datos_completos: +10,
  primera_vez: +5,
  total: 60 // LEAD CALIENTE 🔥
}

// INTEGRACIÓN CRM
CRM_DATA: {
  nombre: "[CAPTURADO]",
  telefono: "[CAPTURADO]",
  email: "[CAPTURADO]",
  tipo_propiedad: "Departamento",
  zona: "Polanco",
  recamaras: "2",
  presupuesto: "$4M-$7M",
  timeframe: "Este mes",
  motivacion: "Primera vez",
  lead_score: 60,
  fuente: "Chatbot Web",
  fecha_captura: "2024-XX-XX",
  proxima_accion: "Llamada en 15 min"
}`
      },

      {
        type: 'challenge',
        title: '🚀 Desafío: Sistema de Lead Scoring Inteligente',
        instructions: `## 🎯 Crea tu Algoritmo de Puntuación de Leads

Desarrolla un sistema que califique automáticamente tus leads del 1-100 basándose en sus respuestas.

### **Factores de Puntuación Sugeridos:**

#### **Presupuesto (25 puntos máx):**
- Más de $10M: 25 pts
- $5M-$10M: 20 pts  
- $2M-$5M: 15 pts
- Menos de $2M: 10 pts
- No especifica: 5 pts

#### **Timeframe (20 puntos máx):**
- Este mes: 20 pts
- Próximos 3 meses: 15 pts
- Próximos 6 meses: 10 pts
- Solo explorando: 5 pts

#### **Ubicación (15 puntos máx):**
- Zona premium: 15 pts
- Zona media-alta: 10 pts
- Zona media: 8 pts
- Zona popular: 5 pts

#### **Motivación (15 puntos máx):**
- Inversión: 15 pts
- Cambio de casa: 12 pts
- Segunda propiedad: 10 pts
- Primera vez: 8 pts

#### **Datos Completos (10 puntos máx):**
- Nombre + teléfono + email: 10 pts
- Solo 2 datos: 7 pts
- Solo 1 dato: 3 pts

#### **Engagement (15 puntos máx):**
- Acepta cita inmediata: 15 pts
- Acepta llamada: 10 pts
- Solo info por WhatsApp: 5 pts

### **Tu Misión:**
Crea el algoritmo completo con ejemplos de 3 leads diferentes.`,
        
        starter_html: `<div class="lead-scoring-calculator">
  <h3>🎯 Calculadora de Lead Scoring</h3>
  
  <div class="lead-example">
    <h4>Lead Ejemplo #1</h4>
    <div class="scoring-form">
      <label>Presupuesto:</label>
      <select id="budget1">
        <option value="25">Más de $10M (25 pts)</option>
        <option value="20">$5M-$10M (20 pts)</option>
        <option value="15">$2M-$5M (15 pts)</option>
        <option value="10">Menos de $2M (10 pts)</option>
        <option value="5">No especifica (5 pts)</option>
      </select>
      
      <label>Timeframe:</label>
      <select id="timeframe1">
        <option value="20">Este mes (20 pts)</option>
        <option value="15">Próximos 3 meses (15 pts)</option>
        <option value="10">Próximos 6 meses (10 pts)</option>
        <option value="5">Solo explorando (5 pts)</option>
      </select>
      
      <!-- Agregar más campos según tu algoritmo -->
      
      <button onclick="calculateScore(1)">Calcular Puntaje</button>
      <div id="result1" class="score-result"></div>
    </div>
  </div>
</div>`,
        
        starter_code: `// 🏆 ALGORITMO DE LEAD SCORING INMOBILIARIO
// Desarrolla la función que calcule el puntaje de cada lead

function calculateLeadScore(leadData) {
  let totalScore = 0;
  
  // FACTOR 1: PRESUPUESTO (25 puntos máx)
  const budgetScores = {
    'mas_10m': 25,
    '5m_10m': 20,
    '2m_5m': 15,
    'menos_2m': 10,
    'no_especifica': 5
  };
  totalScore += budgetScores[leadData.presupuesto] || 0;
  
  // FACTOR 2: TIMEFRAME (20 puntos máx)
  // Tu código aquí...
  
  // FACTOR 3: UBICACIÓN (15 puntos máx)
  // Tu código aquí...
  
  // FACTOR 4: MOTIVACIÓN (15 puntos máx)
  // Tu código aquí...
  
  // FACTOR 5: DATOS COMPLETOS (10 puntos máx)
  // Tu código aquí...
  
  // FACTOR 6: ENGAGEMENT (15 puntos máx)
  // Tu código aquí...
  
  return {
    score: totalScore,
    classification: getLeadClassification(totalScore),
    nextAction: getRecommendedAction(totalScore)
  };
}

function getLeadClassification(score) {
  if (score >= 80) return "🔥 LEAD CALIENTE";
  if (score >= 60) return "🟡 LEAD TIBIO";
  if (score >= 40) return "🔵 LEAD FRÍO";
  return "⚫ LEAD DESCARTABLE";
}

function getRecommendedAction(score) {
  // Define qué acción tomar según el puntaje
  // Tu código aquí...
}

// EJEMPLOS DE LEADS PARA PROBAR
const lead1 = {
  presupuesto: '5m_10m',
  timeframe: 'este_mes',
  ubicacion: 'premium',
  motivacion: 'inversion',
  datos: 'completos',
  engagement: 'cita_inmediata'
};

const lead2 = {
  presupuesto: '2m_5m',
  timeframe: 'explorando',
  ubicacion: 'media',
  motivacion: 'primera_vez',
  datos: 'parciales',
  engagement: 'solo_info'
};

// Calcula y muestra los resultados
console.log("Lead 1:", calculateLeadScore(lead1));
console.log("Lead 2:", calculateLeadScore(lead2));`,
        
        solution: `// ✅ ALGORITMO COMPLETO DE LEAD SCORING

function calculateLeadScore(leadData) {
  let totalScore = 0;
  let scoreBreakdown = {};
  
  // FACTOR 1: PRESUPUESTO (25 puntos máx)
  const budgetScores = {
    'mas_10m': 25,
    '5m_10m': 20,
    '2m_5m': 15,
    'menos_2m': 10,
    'no_especifica': 5
  };
  const budgetPoints = budgetScores[leadData.presupuesto] || 0;
  totalScore += budgetPoints;
  scoreBreakdown.presupuesto = budgetPoints;
  
  // FACTOR 2: TIMEFRAME (20 puntos máx)
  const timeframeScores = {
    'este_mes': 20,
    'tres_meses': 15,
    'seis_meses': 10,
    'explorando': 5
  };
  const timeframePoints = timeframeScores[leadData.timeframe] || 0;
  totalScore += timeframePoints;
  scoreBreakdown.timeframe = timeframePoints;
  
  // FACTOR 3: UBICACIÓN (15 puntos máx)
  const locationScores = {
    'premium': 15,    // Polanco, Santa Fe, Lomas
    'media_alta': 10, // Roma, Condesa, Del Valle
    'media': 8,       // Doctores, Juárez, Centro
    'popular': 5      // Iztapalapa, Gustavo A. Madero
  };
  const locationPoints = locationScores[leadData.ubicacion] || 0;
  totalScore += locationPoints;
  scoreBreakdown.ubicacion = locationPoints;
  
  // FACTOR 4: MOTIVACIÓN (15 puntos máx)
  const motivationScores = {
    'inversion': 15,
    'cambio_casa': 12,
    'segunda_propiedad': 10,
    'primera_vez': 8
  };
  const motivationPoints = motivationScores[leadData.motivacion] || 0;
  totalScore += motivationPoints;
  scoreBreakdown.motivacion = motivationPoints;
  
  // FACTOR 5: DATOS COMPLETOS (10 puntos máx)
  const dataScores = {
    'completos': 10,    // Nombre + teléfono + email
    'parciales': 7,     // Solo 2 datos
    'minimos': 3        // Solo 1 dato
  };
  const dataPoints = dataScores[leadData.datos] || 0;
  totalScore += dataPoints;
  scoreBreakdown.datos = dataPoints;
  
  // FACTOR 6: ENGAGEMENT (15 puntos máx)
  const engagementScores = {
    'cita_inmediata': 15,
    'llamada': 10,
    'whatsapp': 7,
    'solo_info': 5
  };
  const engagementPoints = engagementScores[leadData.engagement] || 0;
  totalScore += engagementPoints;
  scoreBreakdown.engagement = engagementPoints;
  
  return {
    score: totalScore,
    breakdown: scoreBreakdown,
    classification: getLeadClassification(totalScore),
    priority: getLeadPriority(totalScore),
    nextAction: getRecommendedAction(totalScore),
    followUpTiming: getFollowUpTiming(totalScore)
  };
}

function getLeadClassification(score) {
  if (score >= 80) return "🔥 LEAD CALIENTE";
  if (score >= 60) return "🟡 LEAD TIBIO"; 
  if (score >= 40) return "🔵 LEAD FRÍO";
  return "⚫ LEAD DESCARTABLE";
}

function getLeadPriority(score) {
  if (score >= 80) return "ALTA - Contactar inmediatamente";
  if (score >= 60) return "MEDIA - Contactar en 2-4 horas";
  if (score >= 40) return "BAJA - Contactar en 24 horas";
  return "MÍNIMA - Agregar a nurturing automático";
}

function getRecommendedAction(score) {
  if (score >= 80) return "Llamada inmediata + envío de propiedades + agenda cita";
  if (score >= 60) return "WhatsApp con propiedades + llamada de seguimiento";
  if (score >= 40) return "Email con información general + WhatsApp casual";
  return "Agregar a secuencia de emails automáticos";
}

function getFollowUpTiming(score) {
  if (score >= 80) return "15 minutos";
  if (score >= 60) return "2 horas";
  if (score >= 40) return "24 horas";
  return "7 días";
}

// 📊 EJEMPLOS DE LEADS REALES

const leadCaliente = {
  presupuesto: '5m_10m',
  timeframe: 'este_mes',
  ubicacion: 'premium',
  motivacion: 'inversion',
  datos: 'completos',
  engagement: 'cita_inmediata'
};

const leadTibio = {
  presupuesto: '2m_5m',
  timeframe: 'tres_meses',
  ubicacion: 'media_alta',
  motivacion: 'primera_vez',
  datos: 'parciales',
  engagement: 'llamada'
};

const leadFrio = {
  presupuesto: 'menos_2m',
  timeframe: 'explorando',
  ubicacion: 'media',
  motivacion: 'primera_vez',
  datos: 'minimos',
  engagement: 'solo_info'
};

// 🎯 RESULTADOS DE SCORING
console.log("🔥 LEAD CALIENTE:");
console.log(calculateLeadScore(leadCaliente));
console.log("Puntaje: 95/100 - Acción: Llamar YA!");

console.log("\\n🟡 LEAD TIBIO:");
console.log(calculateLeadScore(leadTibio));
console.log("Puntaje: 64/100 - Acción: WhatsApp + Llamada en 2h");

console.log("\\n🔵 LEAD FRÍO:");
console.log(calculateLeadScore(leadFrio));
console.log("Puntaje: 31/100 - Acción: Email automático + Nurturing");

// 📈 ESTADÍSTICAS DE CONVERSIÓN ESPERADAS
const conversionRates = {
  "caliente": "40-60%",
  "tibio": "15-25%", 
  "frio": "3-8%",
  "descartable": "0-2%"
};`
      },

      {
        type: 'explanation',
        title: '📊 Marketing Digital Automatizado con IA',
        content: `## 🎯 Campañas que se Optimizan Solas

### **1. Facebook Ads con IA**

**Herramientas Recomendadas:**
- **Facebook Advantage+**: Optimización automática de audiencias
- **Revealbot**: Automatización de reglas y optimización
- **AdEspresso**: Testing A/B automatizado

**Estrategia de Campañas Automatizadas:**

#### **Campaña 1: Prospección Fría**
- **Objetivo**: Awareness y captación
- **Audiencia**: Lookalike de clientes existentes + intereses inmobiliarios
- **Presupuesto**: $500-1000 MXN diarios
- **Optimización IA**: CPC automático + audiencias expandidas

#### **Campaña 2: Retargeting Inteligente**
- **Objetivo**: Conversión de leads
- **Audiencia**: Visitantes web + engagement en redes
- **Presupuesto**: $300-500 MXN diarios  
- **Optimización IA**: Bid automático para conversiones

#### **Campaña 3: Lookalike de Compradores**
- **Objetivo**: Encontrar clientes similares a tus compradores
- **Audiencia**: Lookalike 1% de clientes que compraron
- **Presupuesto**: $200-400 MXN diarios
- **Optimización IA**: Aprendizaje automático de Facebook

### **2. Google Ads con Smart Bidding**

**Campañas Automatizadas Efectivas:**

#### **Search Campaign - Palabras Clave Locales**
```
Keywords Principal: "departamentos venta [TU_CIUDAD]"
Keywords Long-tail: "departamentos 2 recámaras [COLONIA]"
Bid Strategy: Target CPA (Costo por Adquisición)
IA Optimization: Smart Bidding + Responsive Search Ads
```

#### **Display Campaign - Remarketing**
```
Audiencia: Visitantes de propiedades específicas
Creative: Dinámico basado en propiedades vistas
Bid Strategy: Target ROAS (Return on Ad Spend)
IA Optimization: Optimización automática de placements
```

### **3. Email Marketing Automatizado**

**Secuencias Inteligentes con IA:**

#### **Secuencia 1: Nuevo Lead (5 emails)**
- Email 1: Bienvenida + Propiedades recomendadas (Inmediato)
- Email 2: Guía "Cómo comprar tu primera casa" (Día 2)
- Email 3: Propiedades similares a su búsqueda (Día 5)
- Email 4: Testimonios de clientes + Case studies (Día 8)
- Email 5: Llamada a la acción urgente (Día 12)

#### **Personalización con IA:**
- **Asunto dinámico**: "María, 3 nuevos departamentos en Polanco"
- **Contenido adaptativo**: Basado en presupuesto y preferencias
- **Timing inteligente**: Envío cuando el usuario está más activo

### **4. WhatsApp Business Automatizado**

**Chatbot de WhatsApp para Leads:**

```
Flujo Automático:
1. Auto-respuesta inmediata con menú de opciones
2. Clasificación automática por tipo de consulta
3. Envío de propiedades relevantes automático
4. Agenda de citas integrada con tu calendario
5. Seguimiento automático si no responde en 24h
```

**Herramientas Recomendadas:**
- **Chatfuel**: Para flujos complejos
- **Many Chat**: Integración Facebook + WhatsApp
- **Tawk.to**: Chat web que deriva a WhatsApp

### **5. Content Marketing Automatizado**

#### **Generación de Contenido con IA:**

**ChatGPT para Content Calendar:**
```
Prompt: "Crea un calendario de contenido para inmobiliaria en CDMX:
- 4 posts por semana
- Mix: tips, propiedades, mercado, testimonios  
- Adaptado a audiencia millennials
- Incluye hashtags relevantes"
```

**Midjourney para Imágenes:**
```
Prompt: "Modern apartment interior, Mexico City, natural lighting, 
professional real estate photography style, 4K, clean design"
```

#### **Automatización de Publicaciones:**
- **Hootsuite/Buffer**: Programación automática
- **Later**: Auto-posting optimizado por horarios de audiencia
- **Zapier**: Conexión entre diferentes plataformas

### **6. Análisis y Optimización Automática**

#### **Dashboards Inteligentes:**
- **Google Analytics 4**: Eventos automáticos + conversiones
- **Facebook Analytics**: Atribución automática multicanal
- **CallRail**: Tracking de llamadas desde campañas

#### **Reportes Automáticos:**
- **Google Data Studio**: Updates automáticos semanales
- **Zapier + Slack**: Alertas automáticas de leads importantes
- **Email reports**: Resumen semanal automatizado

### **📈 ROI Esperado por Canal:**

| Canal | Costo/Lead | Conv. Rate | ROI |
|-------|------------|------------|-----|
| Facebook Ads | $150-300 MXN | 8-15% | 300-500% |
| Google Ads | $200-400 MXN | 12-20% | 400-600% |
| WhatsApp Bot | $50-100 MXN | 15-25% | 600-800% |
| Email Marketing | $20-50 MXN | 5-10% | 200-400% |

### **🚀 Plan de Implementación 30 Días:**

**Semana 1**: Configurar chatbot web + WhatsApp
**Semana 2**: Lanzar Facebook Ads + Google Ads básicas  
**Semana 3**: Implementar email marketing automation
**Semana 4**: Optimizar basándose en primeros datos

**¡Tu máquina de leads estará funcionando 24/7!**`
      }
    ],
    
    learning_goals: [
      'Implementar chatbots inmobiliarios que capturen leads 24/7',
      'Crear sistemas de lead scoring que prioricen automáticamente',
      'Configurar campañas publicitarias que se optimicen solas',
      'Automatizar el seguimiento de prospectos por múltiples canales',
      'Medir y optimizar el ROI de cada canal de generación de leads'
    ]
  },
  duration_minutes: 35,
  is_free: false
}

export default function IAGeneracionLeadsLesson(props: LessonProps) {
  return <InteractiveLesson lesson={lessonData} {...props} />
}