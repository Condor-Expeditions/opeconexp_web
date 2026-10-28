/** Uses the existing WhatsApp channel; no storage, fake send state or backend. */
export function initContactForm() {
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (!form) return;
  const field = (id: string) => {
    const element = form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`#${id}`);
    if (!element) throw new Error(`Falta el campo de contacto: ${id}`);
    return element;
  };
  const output = form.querySelector<HTMLInputElement>('input[name="text"]');
  if (!output) return;
  const date = field("contact-date") as HTMLInputElement;
  const today = new Date();
  date.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const submit = () => {
    const name = field("contact-name").value.trim();
    const lines = [
      name ? `Hola, soy ${name}. Quisiera información para mi próximo viaje.` : "Hola, quisiera información para mi próximo viaje.",
      `Interés: ${field("contact-tour").value}.`,
    ];
    if (date.value) lines.push(`Fecha aproximada: ${date.value}.`);
    const travelers = field("contact-travelers").value;
    if (travelers) lines.push(`Personas: ${travelers}.`);
    const message = field("contact-message").value.trim();
    if (message) lines.push(message);
    lines.push("Entiendo que esta consulta no confirma una reserva.");
    output.value = lines.join("\n");
    // Native GET navigation handles URL encoding and preserves browser validation.
  };
  form.addEventListener("submit", submit);
  form.hidden = false;
  return () => form.removeEventListener("submit", submit);
}
