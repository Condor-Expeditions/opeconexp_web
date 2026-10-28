/** Formats editable stage minutes without suggesting a fixed departure time. */
export function formatStageDuration(minutes: number | null): string {
	if (minutes === null) return "Por confirmar";
	if (!Number.isInteger(minutes) || minutes <= 0) throw new Error("La duración debe ser un número entero positivo de minutos o null.");
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	if (!hours) return `${rest} min`;
	return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

/** The published total always follows the itinerary, including pauses and transfers. */
export function itineraryDuration(stages: { durationMinutes: number | null }[]): string {
	if (!stages.length || stages.some(stage => stage.durationMinutes === null)) return "Por confirmar";
	return formatStageDuration(stages.reduce((total, stage) => total + (stage.durationMinutes ?? 0), 0));
}
