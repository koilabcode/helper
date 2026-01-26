/* eslint-disable no-console */
import crypto from "crypto";
import { faqsFactory } from "@tests/support/factories/faqs";
import { mailboxFactory } from "@tests/support/factories/mailboxes";
import { addDays } from "date-fns";
import { db } from "@/db/client";
import { env } from "@/lib/env";

const LABORARIO_FAQS = [
  {
    question: "¿Cómo registro mi entrada y salida en Laborario?",
    answer: `Para registrar tu jornada laboral en Laborario:

1. Accede al Portal de Empleado en laborario.com/employee/login
2. Inicia sesión con tu email y contraseña
3. Pulsa el botón "Fichar Entrada" cuando comiences tu jornada
4. Al finalizar, pulsa "Fichar Salida"

El sistema registrará automáticamente la hora exacta de cada fichaje. Puedes ver tus registros del día actual y el resumen de horas semanales en la pantalla principal.`,
  },
  {
    question: "¿Qué es el RD-ley 8/2019 y cómo me afecta?",
    answer: `El Real Decreto-ley 8/2019 establece la obligación de registrar la jornada laboral en España. Puntos clave:

- **Obligatorio desde mayo 2019**: Todas las empresas deben registrar la hora de inicio y fin de la jornada de sus trabajadores
- **Conservación 4 años**: Los registros deben guardarse durante 4 años y estar disponibles para inspecciones
- **Sanciones**: El incumplimiento puede conllevar multas de 626€ a 6.250€
- **Acceso del trabajador**: Tienes derecho a acceder a tus registros de jornada

Laborario cumple con todos estos requisitos automáticamente, generando registros inmutables con marca de tiempo.`,
  },
  {
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
    question: "¿Qué hago si olvidé fichar mi entrada o salida?",
    answer: `Si olvidaste fichar, debes contactar con el administrador de tu empresa para que corrija el registro. El proceso es:

1. Comunica a tu responsable o administrador el olvido
2. Indica la hora real de entrada o salida
3. El administrador realizará la corrección en el sistema

**Importante**: Por motivos de cumplimiento legal, los empleados no pueden modificar directamente sus propios registros. Todas las correcciones quedan registradas en el historial de auditoría.

Para evitar olvidos, te recomendamos fichar nada más llegar y justo antes de salir.`,
  },
  {
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
    question: "¿Durante cuánto tiempo se guardan los registros de jornada?",
    answer: `Según la normativa española (RD-ley 8/2019), los registros de jornada deben conservarse durante **4 años**.

En Laborario:

- **Almacenamiento seguro**: Todos los registros se guardan en servidores seguros con copias de seguridad
- **Inmutabilidad**: Los registros no pueden ser eliminados ni alterados, garantizando su validez legal
- **Auditoría completa**: Cualquier corrección queda registrada con fecha, hora y usuario que la realizó
- **Disponibilidad**: Los registros están accesibles en cualquier momento para inspecciones de trabajo

Esta conservación es automática y no requiere ninguna acción por tu parte.`,
  },
  {
    question: "¿Puedo acceder a Laborario desde mi móvil?",
    answer: `Sí, Laborario es completamente accesible desde dispositivos móviles.

**Cómo acceder**:
1. Abre el navegador de tu móvil (Chrome, Safari, etc.)
2. Ve a laborario.com/employee/login
3. Inicia sesión con tus credenciales
4. Podrás fichar entrada/salida igual que desde un ordenador

**Características móviles**:
- Diseño adaptado a pantallas pequeñas
- Botones grandes para fichar fácilmente
- Visualización de tus registros del día
- Funciona con conexión a internet (WiFi o datos)

No es necesario instalar ninguna aplicación, funciona directamente desde el navegador.`,
  },
  {
    question: "¿Cómo exporto los informes de jornada para inspecciones?",
    answer: `Para exportar informes (solo administradores):

1. Accede al Portal de Administrador
2. Ve a la sección "Informes" o "Registros de Jornada"
3. Selecciona el rango de fechas deseado
4. Filtra por empleado si es necesario
5. Pulsa "Exportar" y elige el formato (PDF o Excel)

**Para inspecciones de trabajo**:
- Los informes incluyen todos los datos requeridos por ley
- Cada registro muestra: empleado, fecha, hora entrada, hora salida
- Se incluye el historial de modificaciones si las hubiera
- Los documentos están listos para presentar ante la Inspección de Trabajo

**Nota**: Esta funcionalidad está planificada para próximas versiones. Actualmente, contacta con soporte para solicitar informes.`,
  },
  {
    question: "¿Qué datos son obligatorios según la normativa laboral?",
    answer: `Según el artículo 34.9 del Estatuto de los Trabajadores, los datos obligatorios son:

**Datos mínimos requeridos**:
- Hora de inicio de la jornada
- Hora de finalización de la jornada
- Identificación del trabajador
- Fecha del registro

**Laborario registra automáticamente**:
- ✅ Hora exacta de entrada (con marca de tiempo)
- ✅ Hora exacta de salida (con marca de tiempo)
- ✅ Identificación del empleado (nombre y email)
- ✅ Empresa asociada
- ✅ Fecha completa del registro
- ✅ Historial de modificaciones (auditoría)

Todos estos datos se almacenan de forma inmutable y están disponibles para inspecciones durante los 4 años que exige la ley.`,
  },
];

export const seedLaborario = async () => {
  console.log("Checking if Laborario mailbox exists...");

  const existingMailbox = await db.query.mailboxes.findFirst();

  if (existingMailbox) {
    console.log("A mailbox already exists. Skipping mailbox creation.");
    console.log(`Existing mailbox: ${existingMailbox.name} (${existingMailbox.slug})`);
  } else {
    console.log("Creating Laborario mailbox...");
    const widgetSecret = crypto.randomUUID();

    await mailboxFactory.create({
      name: "Laborario",
      slug: "laborario",
      promptUpdatedAt: addDays(new Date(), 1),
      widgetHMACSecret: widgetSecret,
      widgetDisplayMode: "always",
    });

    console.log("Laborario mailbox created successfully!");
    console.log(`Widget HMAC Secret: ${widgetSecret}`);
  }

  console.log("\nCreating Laborario FAQs...");

  for (const faq of LABORARIO_FAQS) {
    const content = `**${faq.question}**\n\n${faq.answer}`;
    await faqsFactory.create({
      content,
      enabled: true,
    });
    console.log(`✓ Created FAQ: ${faq.question.substring(0, 50)}...`);
  }

  console.log(`\nCreated ${LABORARIO_FAQS.length} FAQs for Laborario.`);
};

if (env.NODE_ENV !== "development" && env.VERCEL_ENV !== "preview") {
  console.log("This is a development-only script");
  process.exit(1);
}

seedLaborario()
  .then(() => {
    console.log("\nLaborario seed completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Laborario seed failed:", error);
    process.exit(1);
  });
