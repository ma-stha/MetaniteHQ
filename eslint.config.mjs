import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The service-role client bypasses Row Level Security. It must never be
    // imported by UI code. Only features/**/actions.ts and app/api/** may use it.
    files: ["components/**", "app/**/page.tsx", "app/**/layout.tsx", "features/**/components/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/supabase/admin",
              message: "Admin client bypasses RLS. Use it only in server actions or route handlers.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
