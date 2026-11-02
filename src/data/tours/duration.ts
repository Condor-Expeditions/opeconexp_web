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
	if (!stages.length || stages.some(stage => stage.durationMinutes === null)) return "Por confirmar";
	const minutes = stages.reduce((total, stage) => {
		formatStageDuration(stage.durationMinutes);
		return total + (stage.durationMinutes ?? 0);
	}, 0);
	const hours = Math.max(0.5, Math.round(minutes / 30) / 2);
	return `Aprox. ${hours} ${hours === 1 ? "hora" : "horas"}`;
}
