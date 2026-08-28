import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "url";

import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
// import neon from './neon-vite-plugin.ts'

const offline = process.env.VITE_APP_RUNTIME === "offline";

const config = defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	server: {
		watch: {
			ignored: ["**/src-tauri/**"],
		},
	},
	plugins: [
		devtools(),
		nitro(),
		// neon,
		// this is the plugin that enables path aliases
		viteTsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tailwindcss(),
		tanstackStart(
			offline
				? {
						spa: {
							enabled: true,
							prerender: {
								outputPath: "/index.html",
								crawlLinks: false,
							},
						},
					}
				: undefined,
		),
		viteReact(),
	],
});

export default config;
