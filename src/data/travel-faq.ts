export interface TravelQuestion {
	question: string;
	answer: string;
	policyLink?: boolean;
}

export const travelQuestions: TravelQuestion[] = [
	{ question: "¿Desde dónde salen los tours?", answer: "Los recorridos del catálogo salen desde Cuenca, Ecuador. El punto de encuentro depende del tour; revisa su ficha y confirma con el equipo la ubicación y la hora exactas antes de salir." },
	{ question: "¿Todos los tours incluyen transporte y alimentación?", answer: "No todos incluyen los mismos servicios. Cada ficha detalla si la tarifa contempla transporte, guía, entradas, hidratación o alimentación, además de los gastos que se pagan por separado." },
	{ question: "¿Hay tours para familias con niños?", answer: "Hay experiencias dirigidas a familias, pero la edad recomendada y las exigencias físicas dependen del recorrido. Revisa las restricciones de cada ficha y comunica las edades de los participantes antes de reservar. Las rutas de altura requieren especial atención." },
	{ question: "¿Los recorridos están disponibles en inglés?", answer: "Las fichas indican atención en español. La disponibilidad y las condiciones de guía en inglés deben consultarse con el equipo antes de confirmar la salida." },
	{ question: "¿Cómo funciona el Free Walking Tour?", answer: "No tiene una tarifa fija ni requiere anticipo. Al finalizar puedes dejar un aporte voluntario al guía. Las entradas opcionales con costo no están incluidas. Su descripción no implica disponibilidad: consulta con el equipo si la experiencia está operativa y qué horarios pueden coordinarse." },
	{ question: "¿Qué pasa si cambia el clima o necesito cancelar?", answer: "Las opciones dependen de los plazos, las condiciones particulares de tu reserva y la causa del cambio. Revisa las políticas comerciales y confirma las condiciones aplicables antes de pagar.", policyLink: true },
	{ question: "¿Consultar por WhatsApp confirma mi reserva?", answer: "No. El mensaje inicia una conversación. La disponibilidad, la tarifa y las condiciones se revisan con el equipo; la reserva se confirma al completar el proceso acordado y recibir el comprobante o voucher del servicio." },
];
