"use client";

import { useChat as useAIChat } from "@ai-sdk/react";
import { ArrowLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageContent, useHelperClient } from "@helperai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_PATH } from "@/components/constants";
import { cn } from "@/lib/utils";

// Static FAQs with answers - no AI needed
const LABORARIO_FAQS = [
  {
    emoji: "⏰",
    question: "¿Cómo registro mi entrada y salida en Laborario?",
    answer: `Para registrar tu jornada laboral en Laborario:

1. Accede al Portal de Empleado en laborario.com/employee/login
2. Inicia sesión con tu email y contraseña
3. Pulsa el botón "Fichar Entrada" cuando comiences tu jornada
4. Al finalizar, pulsa "Fichar Salida"

El sistema registrará automáticamente la hora exacta de cada fichaje. Puedes ver tus registros del día actual y el resumen de horas semanales en la pantalla principal.`,
  },
  {
    emoji: "📋",
    question: "¿Qué es el RD-ley 8/2019 y cómo me afecta?",
    answer: `El Real Decreto-ley 8/2019 establece la obligación de registrar la jornada laboral en España.

**Puntos clave:**
- **Obligatorio desde mayo 2019**: Todas las empresas deben registrar la hora de inicio y fin de la jornada de sus trabajadores
- **Conservación 4 años**: Los registros deben guardarse durante 4 años y estar disponibles para inspecciones
- **Sanciones**: El incumplimiento puede conllevar multas de 626€ a 6.250€
- **Acceso del trabajador**: Tienes derecho a acceder a tus registros de jornada

Laborario cumple con todos estos requisitos automáticamente, generando registros inmutables con marca de tiempo.`,
  },
  {
    emoji: "📊",
    question: "¿Cómo puedo consultar mis horas trabajadas esta semana?",
    answer: `Para consultar tus horas trabajadas:

1. Accede al Portal de Empleado
2. En la pantalla principal verás:
   - **Resumen del día**: Entrada, salida y horas trabajadas hoy
   - **Resumen semanal**: Total de horas acumuladas esta semana

También puedes ver el historial de fichajes de días anteriores en la sección de registros.

Si necesitas un informe detallado, contacta con el administrador de tu empresa para que te lo genere.`,
  },
  {
    emoji: "🔧",
    question: "¿Qué hago si olvidé fichar mi entrada o salida?",
    answer: `Si olvidaste fichar, debes contactar con el administrador de tu empresa para que corrija el registro.

**El proceso es:**
1. Comunica a tu responsable o administrador el olvido
2. Indica la hora real de entrada o salida
3. El administrador realizará la corrección en el sistema

**Importante:** Por motivos de cumplimiento legal, los empleados no pueden modificar directamente sus propios registros. Todas las correcciones quedan registradas en el historial de auditoría.

Para evitar olvidos, te recomendamos fichar nada más llegar y justo antes de salir.`,
  },
  {
    emoji: "👥",
    question: "¿Cómo añado nuevos empleados a mi empresa?",
    answer: `Para añadir empleados (solo administradores de empresa):

1. Accede al Portal de Administrador en laborario.com/company-admin/login
2. Ve a la sección "Empleados" en el menú lateral
3. Pulsa "Añadir Empleado"
4. Completa los datos requeridos:
   - Nombre completo
   - Email (se usará para el acceso)
   - Departamento (opcional)
5. Guarda los cambios

El empleado recibirá un email con sus credenciales de acceso. También puedes gestionar empleados existentes, desactivar cuentas o modificar sus datos desde esta sección.`,
  },
  {
    emoji: "🗄️",
    question: "¿Durante cuánto tiempo se guardan los registros de jornada?",
    answer: `Según la normativa española (RD-ley 8/2019), los registros de jornada deben conservarse durante **4 años**.

**En Laborario:**
- **Almacenamiento seguro**: Todos los registros se guardan en servidores seguros con copias de seguridad
- **Inmutabilidad**: Los registros no pueden ser eliminados ni alterados, garantizando su validez legal
- **Auditoría completa**: Cualquier corrección queda registrada con fecha, hora y usuario que la realizó
- **Disponibilidad**: Los registros están accesibles en cualquier momento para inspecciones de trabajo

Esta conservación es automática y no requiere ninguna acción por tu parte.`,
  },
  {
    emoji: "📱",
    question: "¿Puedo acceder a Laborario desde mi móvil?",
    answer: `Sí, Laborario es completamente accesible desde dispositivos móviles.

**Cómo acceder:**
1. Abre el navegador de tu móvil (Chrome, Safari, etc.)
2. Ve a laborario.com/employee/login
3. Inicia sesión con tus credenciales
4. Podrás fichar entrada/salida igual que desde un ordenador

**Características móviles:**
- Diseño adaptado a pantallas pequeñas
- Botones grandes para fichar fácilmente
- Visualización de tus registros del día
- Funciona con conexión a internet (WiFi o datos)

No es necesario instalar ninguna aplicación, funciona directamente desde el navegador.`,
  },
  {
    emoji: "📄",
    question: "¿Cómo exporto los informes de jornada para inspecciones?",
    answer: `Para exportar informes (solo administradores):

1. Accede al Portal de Administrador
2. Ve a la sección "Informes" o "Registros de Jornada"
3. Selecciona el rango de fechas deseado
4. Filtra por empleado si es necesario
5. Pulsa "Exportar" y elige el formato (PDF o Excel)

**Para inspecciones de trabajo:**
- Los informes incluyen todos los datos requeridos por ley
- Cada registro muestra: empleado, fecha, hora entrada, hora salida
- Se incluye el historial de modificaciones si las hubiera
- Los documentos están listos para presentar ante la Inspección de Trabajo

**Nota:** Esta funcionalidad está planificada para próximas versiones. Actualmente, contacta con soporte para solicitar informes.`,
  },
  {
    emoji: "⚖️",
    question: "¿Qué datos son obligatorios según la normativa laboral?",
    answer: `Según el artículo 34.9 del Estatuto de los Trabajadores, los datos obligatorios son:

**Datos mínimos requeridos:**
- Hora de inicio de la jornada
- Hora de finalización de la jornada
- Identificación del trabajador
- Fecha del registro

**Laborario registra automáticamente:**
- Hora exacta de entrada (con marca de tiempo)
- Hora exacta de salida (con marca de tiempo)
- Identificación del empleado (nombre y email)
- Empresa asociada
- Fecha completa del registro
- Historial de modificaciones (auditoría)

Todos estos datos se almacenan de forma inmutable y están disponibles para inspecciones durante los 4 años que exige la ley.`,
  },
];

// Static FAQ view - no AI needed
const StaticFAQView = ({
  faq,
  mailboxName,
  onBack,
  onStartChat,
}: {
  faq: (typeof LABORARIO_FAQS)[0];
  mailboxName: string;
  onBack: () => void;
  onStartChat: () => void;
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="border-b border-border bg-card p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} iconOnly size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-white">Soporte de Laborario</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-4">
            {/* User question */}
            <div className="rounded-xl p-4 max-w-[80%] ml-auto bg-primary">
              <p className="text-primary-foreground">{faq.question}</p>
            </div>

            {/* Static answer */}
            <div className="rounded-xl p-4 max-w-[80%] bg-card">
              <div className="prose prose-sm max-w-none prose-invert whitespace-pre-wrap">
                {faq.answer}
              </div>
            </div>

            {/* Option to continue with AI */}
            <div className="flex justify-center mt-4">
              <Button variant="outlined" onClick={onStartChat} className="gap-2">
                <MessageCircle className="h-4 w-4" />
                ¿Necesitas más ayuda? Habla con nuestro asistente
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatWidget = ({
  initialMessage,
  onBack,
}: {
  initialMessage: string;
  onBack: () => void;
}) => {
  const { client } = useHelperClient();
  const didSendInitial = useRef(false);

  const fetchWithAuth = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const token = await client.getToken();
      return fetch(input, {
        ...init,
        headers: { ...init?.headers, Authorization: `Bearer ${token}` },
      });
    },
    [client],
  );

  const { messages, input, handleInputChange, handleSubmit, status, append } = useAIChat({
    api: `${BASE_PATH}/api/chat/instant`,
    fetch: fetchWithAuth,
  });

  useEffect(() => {
    if (!didSendInitial.current && initialMessage) {
      didSendInitial.current = true;
      append({ role: "user", content: initialMessage });
    }
  }, [initialMessage, append]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="border-b border-border bg-card p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} iconOnly size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-white">Soporte de Laborario</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                className={cn(
                  "rounded-xl p-4 max-w-[80%]",
                  message.role === "user" ? "ml-auto bg-primary" : "bg-card",
                )}
                key={message.id}
              >
                <MessageContent
                  className={cn("prose prose-sm max-w-none prose-invert", {
                    "text-primary-foreground": message.role === "user",
                  })}
                  message={message}
                />
              </div>
            ))}
            {status === "submitted" && (
              <div className="flex items-center gap-1">
                <div className="size-2 bg-primary rounded-full animate-default-pulse [animation-delay:-0.3s]" />
                <div className="size-2 bg-primary rounded-full animate-default-pulse [animation-delay:-0.15s]" />
                <div className="size-2 bg-primary rounded-full animate-default-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-card p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={handleInputChange}
              className="flex-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSubmit(e);
                }
              }}
            />
            <Button type="submit">
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const HomepageContent = ({ mailboxName }: { mailboxName: string }) => {
  const [question, setQuestion] = useState("");
  const [selectedFAQ, setSelectedFAQ] = useState<(typeof LABORARIO_FAQS)[0] | null>(null);
  const [chatActive, setChatActive] = useState(false);
  const [chatQuestion, setChatQuestion] = useState("");
  const { client } = useHelperClient();

  // Pre-initialize the widget session so the token is ready when the user submits
  useEffect(() => {
    client.initialize();
  }, [client]);

  const handleStartChat = (initialQuestion?: string) => {
    const q = initialQuestion || question;
    if (!q.trim()) return;
    setChatQuestion(q);
    setChatActive(true);
  };

  const handleBackToMain = () => {
    setChatActive(false);
    setChatQuestion("");
    setSelectedFAQ(null);
    setQuestion("");
  };

  // Show AI chat — no conversation creation, no DB, just stream
  if (chatActive) {
    return (
      <ChatWidget
        initialMessage={chatQuestion}
        onBack={handleBackToMain}
      />
    );
  }

  // Show static FAQ answer
  if (selectedFAQ) {
    return (
      <StaticFAQView
        faq={selectedFAQ}
        mailboxName={mailboxName}
        onBack={handleBackToMain}
        onStartChat={() => {
          setQuestion(selectedFAQ.question);
          handleStartChat(selectedFAQ.question);
        }}
      />
    );
  }

  // Show homepage
  return (
    <div className="min-h-dvh bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Soporte de Laborario</h1>
          <p className="text-muted-foreground">¿En qué podemos ayudarte hoy?</p>
        </div>

        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Escribe tu pregunta"
              className="w-full h-12 px-6 text-base rounded-full pr-14 bg-card border-border"
              onKeyDown={(e) => {
                if (e.key === "Enter" && question.trim()) {
                  handleStartChat();
                }
              }}
            />
            <button
              onClick={() => question.trim() && handleStartChat()}
              disabled={!question.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LABORARIO_FAQS.map((faq, index) => (
              <button
                key={index}
                onClick={() => setSelectedFAQ(faq)}
                className="p-6 rounded-xl bg-card text-left transition-colors hover:bg-secondary"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{faq.emoji}</span>
                  <span className="text-foreground">{faq.question}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
