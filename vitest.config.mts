import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		cloudflareTest({
			wrangler: { configPath: "./wrangler.jsonc" },
		}),
	],
	test: {
		// Reporte en consola + reporte JUnit XML (formato que leen los CI)
		reporters: ["default", "junit"],
		outputFile: { junit: "./test-results/junit.xml" },
		coverage: {
			// En el runtime de Workers solo funciona istanbul (no v8)
			provider: "istanbul",
			include: ["src/**/*.ts"],
			reporter: ["text", "html", "lcov", "cobertura", "json-summary"],
			reportsDirectory: "./coverage",
		},
	},
});
