import { logoutAction } from "@/lib/action/auth-actions";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit">
        <LogOut className="w-6 h-6 hover:text-primary" />
      </Button>
    </form>
  );
}
