import { redirect } from "next/navigation";

export default function PersonalizationRulesPage() {
  redirect("/admin/personalization-groups?tab=rules");
}
