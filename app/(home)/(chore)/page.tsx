import { getViewModeCookie } from "@/actions";
import ChoreHome from "@/components/chore-view/chore-home";
import type { ViewMode } from "@/types/types";

export default async function ChorePage() {
  const viewModeCookie = await getViewModeCookie();
  const viewMode = (viewModeCookie?.value ?? "private") as ViewMode;

  return <ChoreHome defaultViewMode={viewMode} />;
}
