import type { APIRoute } from "astro";
import { tours, tourHref } from "@/data/tours";
import { absoluteUrl } from "@/data/seo";
import { launchConfig } from "@/data/launch.config";

export const GET: APIRoute = () => {
	const paths = ["/", "/tours/", "/sobre-nosotros/", "/contacto/", "/politicas-comerciales/", ...tours.map(tourHref)];
	const urls = (launchConfig.showCountdown ? ["/"] : paths).map(path => `<url><loc>${absoluteUrl(path)}</loc></url>`).join("");
	return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
