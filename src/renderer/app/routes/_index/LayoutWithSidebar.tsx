import {
  SidebarProvider,
  SidebarTrigger
} from "../../components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export function LayoutWithSidebar({ children }: { children: React.ReactNode; }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
