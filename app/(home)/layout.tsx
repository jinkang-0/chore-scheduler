import { HomeDialogProvider } from "@/context/home-dialog";

export default function HomeLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <HomeDialogProvider>{children}</HomeDialogProvider>;
}
