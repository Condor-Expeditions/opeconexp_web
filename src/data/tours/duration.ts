/** Formats editable stage minutes without suggesting a fixed departure time. */
export function formatStageDuration(minutes: number | null): string {
	if (minutes === null) return "Por confirmar";
	if (!Number.isInteger(minutes) || minutes <= 0) throw new Error("La duración debe ser un número entero positivo de minutos o null.");
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	if (!hours) return `${rest} min`;
	return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

/** Approximate total from the itinerary, including pauses and transfers.
 * Round to the nearest half hour; quarter-hour ties round up. */
export function itineraryDuration(stages: { durationMinutes: number | null }[]): string {
	// Si la lista está vacía o alguna etapa carece de duración, devolvemos "Por confirmar"
	if (!stages.length || stages.some(stage => stage.durationMinutes === null)) return "Por confirmar";

	// Sumar los minutos de todas las etapas (asumiendo que ya fueron validados por formatStageDuration)
	const minutes = stages.reduce((total, stage) => {
		// Llamamos a formatStageDuration solo para validar que el valor sea entero positivo o null.
		formatStageDuration(stage.durationMinutes);
		return total + (stage.durationMinutes ?? 0);
	}, 0);

	// En lugar de redondear a medio‑hora, devolvemos la duración exacta usando formatStageDuration.
	// Esto mostrará "4 h 30 min", "8 h", "45 min", etc.
	return formatStageDuration(minutes);
}
