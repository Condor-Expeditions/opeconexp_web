import type { ImageMetadata } from "astro";
import cajas from "@/assets/tours/cajas.jpg";
import ingapirca from "@/assets/tours/ingapirca.jpg";
import cuenca from "../../public/assets/menu/tours/walking-tour-cuenca.webp";
import giron from "../../public/assets/menu/tours/chorro-de-giron.jpg";
import chordeleg from "../../public/assets/menu/tours/chordeleg-joyeria.jpg";
import gualaceo from "../../public/assets/menu/tours/gualaceo-textiles.jpg";
import guachapala from "../../public/assets/menu/tours/guachapala-andacocha.jpg";
import artesano from "../../public/assets/menu/tours/ruta-artesano.jpg";
import canar from "../../public/assets/menu/destinos/canar.jpg";
import azuay from "../../public/assets/menu/destinos/azuay.jpg";
import { destinationLabels, type DestinationId } from "./tours/taxonomy";

interface DestinationPresentation {
	image: ImageMetadata;
	caption: string;
	description: string;
	position?: string;
	portraitPosition?: string;
}

const presentation: Record<DestinationId, DestinationPresentation> = {
	"el-cajas": { image: cajas, caption: "Entre lagunas y montañas", description: "Respira el aire del páramo, camina junto a lagunas y descubre otra forma de sentir los Andes.", portraitPosition: "55% 50%" },
	ingapirca: { image: ingapirca, caption: "Huellas de nuestra historia", description: "Un encuentro con las raíces cañaris e incas. Recorre Ingapirca y descubre las historias que siguen vivas entre sus piedras.", portraitPosition: "60% 50%" },
	cuenca: { image: cuenca, caption: "Calles que cuentan historias", description: "Patios, plazas y sabores: descubre Cuenca paso a paso, con la mirada de quienes la viven cada día." },
	giron: { image: giron, caption: "La fuerza de la naturaleza", description: "Cascadas, caminos e historias del Austro. Deja que el paisaje de Girón marque el ritmo de tu próxima aventura." },
	chordeleg: { image: chordeleg, caption: "El arte de nuestras manos", description: "Descubre el trabajo de los artesanos y la tradición de la filigrana. En Chordeleg, cada detalle tiene una historia." },
	gualaceo: { image: gualaceo, caption: "Tradición entre hilos y colores", description: "Conoce los saberes del tejido y el carácter del Austro en un recorrido por las tradiciones de Gualaceo." },
	guachapala: { image: guachapala, caption: "Un encuentro con nuestras raíces", description: "Una propuesta para descubrir Guachapala, su paisaje y el entorno de Andacocha. Estamos preparando los detalles de esta experiencia." },
	sigsig: { image: artesano, caption: "Saberes que siguen vivos", description: "Artesanía, memoria y paisajes del Austro. Descubre Sígsig como parte de un viaje por nuestros pueblos y sus tradiciones." },
	"san-fernando": { image: azuay, caption: "Una pausa junto al agua", description: "El recorrido continúa en San Fernando, entre el paisaje de la laguna de Busa y la tranquilidad de los Andes." },
	canar: { image: canar, caption: "Memoria y caminos ancestrales", description: "Descubre el patrimonio del Cañar: paisajes andinos, caminos ancestrales e historias que conectan con las raíces cañaris e incas." },
};

/** Presentation images are illustrative; replace with approved destination photography. */
export const destinations = Object.entries(destinationLabels).map(([id, title]) => {
	const detail = presentation[id as DestinationId];
	if (!detail?.image) {
		throw new Error(`El destino "${id}" necesita imagen, caption y description en src/data/destinations.ts. Su nombre está definido en src/data/tours/taxonomy.ts, pero falta completar su presentación.`);
	}
	return { id: id as DestinationId, title, ...detail };
});
