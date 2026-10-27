import type { ImageMetadata } from "astro";
import cajas from "@/assets/tours/laguna-toreadora/20261012_0293.webp";
import ingapirca from "@/assets/tours/ingapirca/20261012_0101.webp";
import cuenca from "../../public/assets/menu/tours/walking-tour-cuenca.webp";
import giron from "../../public/assets/menu/tours/chorro-de-giron.jpg";
import chordeleg from "../../public/assets/menu/tours/chordeleg-joyeria.jpg";
import gualaceo from "../../public/assets/menu/tours/gualaceo-textiles.jpg";
import guachapala from "../../public/assets/menu/tours/guachapala-andacocha.jpg";
import artesano from "../../public/assets/menu/tours/ruta-artesano.jpg";
import canar from "@/assets/tours/cojitambo/20261012_0167.webp";
import azuay from "../../public/assets/menu/destinos/azuay.jpg";
import { destinationLabels, type DestinationId } from "./tours/taxonomy";

interface DestinationPresentation {
	image: ImageMetadata;
	alt?: string;
	/** False for supplied photographs of the actual destination. */
	illustrativePhotos?: boolean;
	caption: string;
	description: string;
	position?: string;
	portraitPosition?: string;
}

const presentation: Record<DestinationId, DestinationPresentation> = {
	"el-cajas": { image: cajas, alt: "Laguna Toreadora y montañas del Parque Nacional El Cajas", illustrativePhotos: false, caption: "Entre lagunas y montañas", description: "Respira el aire del páramo, camina junto a lagunas y descubre otra forma de sentir los Andes.", position: "50% 55%", portraitPosition: "55% 50%" },
	ingapirca: { image: ingapirca, alt: "Templo del Sol del Complejo Arqueológico Ingapirca", illustrativePhotos: false, caption: "Huellas de nuestra historia", description: "Un encuentro con las raíces cañaris e incas. Recorre Ingapirca y descubre las historias que siguen vivas entre sus piedras.", position: "50% 60%", portraitPosition: "60% 55%" },
	cuenca: { image: cuenca, caption: "Calles que cuentan historias", description: "Patios, plazas y sabores: descubre Cuenca paso a paso, con la mirada de quienes la viven cada día." },
	giron: { image: giron, caption: "La fuerza de la naturaleza", description: "Descubre la historia de Girón y la cascada El Chorro, o continúa la aventura hasta la laguna de Busa en San Fernando." },
	chordeleg: { image: chordeleg, caption: "El arte de nuestras manos", description: "Descubre el trabajo de los artesanos y la tradición de la filigrana. En Chordeleg, cada detalle tiene una historia." },
	gualaceo: { image: gualaceo, caption: "Tradición entre hilos y colores", description: "Conoce los saberes del tejido y el carácter del Austro en un recorrido por las tradiciones de Gualaceo." },
	guachapala: { image: guachapala, caption: "Entre montañas y milagros", description: "Descubre Andacocha y Guachaventura: fe, senderos, miradores, aventura y una pausa en piscinas temperadas." },
	paute: { image: azuay, caption: "Naturaleza y sabores en familia", description: "Descubre Jurassic Paute, Animal Paute y los sabores del valle en un recorrido desde Cuenca." },
	sigsig: { image: artesano, caption: "Saberes que siguen vivos", description: "Artesanía, memoria y paisajes del Austro. Descubre Sígsig como parte de un viaje por nuestros pueblos y sus tradiciones." },
	canar: { image: canar, alt: "Terrazas arqueológicas de Cojitambo en la provincia de Cañar", illustrativePhotos: false, caption: "Memoria y caminos ancestrales", description: "Descubre el patrimonio del Cañar: paisajes andinos, caminos ancestrales e historias que conectan con las raíces cañaris e incas.", position: "50% 60%" },
};

/** Shared destination photography for the hero, menu and home cards. */
export const destinations = Object.entries(destinationLabels).map(([id, title]) => {
	const detail = presentation[id as DestinationId];
	if (!detail?.image) {
		throw new Error(`El destino "${id}" necesita imagen, caption y description en src/data/destinations.ts. Su nombre está definido en src/data/tours/taxonomy.ts, pero falta completar su presentación.`);
	}
	return { id: id as DestinationId, title, ...detail, alt: detail.alt ?? `Vista ilustrativa de ${title}`, illustrativePhotos: detail.illustrativePhotos ?? true };
});
