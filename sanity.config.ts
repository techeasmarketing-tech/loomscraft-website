import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { colorInput } from "@sanity/color-input";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { projectId, dataset, apiVersion } from "./sanity/env";
const singletons = ["siteSettings", "homePage"];
export default defineConfig({
  name: "default",
  title: "Loom Craftz",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    colorInput(),
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({ defaultApiVersion: apiVersion })]
      : []),
  ],
  schema: {
    types: schemaTypes,
    templates: (t) =>
      t.filter(({ schemaType }) => !singletons.includes(schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      singletons.includes(schemaType)
        ? prev.filter(
            ({ action }) =>
              action &&
              ["publish", "discardChanges", "restore"].includes(action),
          )
        : prev,
  },
});
