import type { StructureResolver } from "sanity/structure";
const single = (S: any, id: string, title: string) =>
  S.listItem()
    .title(title)
    .id(id)
    .child(S.document().schemaType(id).documentId(id));
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("product").title("Products"),
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("occasion").title("Occasions"),
      S.divider(),
      single(S, "homePage", "Home page"),
      single(S, "siteSettings", "Site settings"),
      S.documentTypeListItem("page").title("Pages (Our Craft, Terms…)"),
      S.documentTypeListItem("faq").title("FAQs"),
    ]);
