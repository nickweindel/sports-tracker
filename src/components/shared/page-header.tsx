import { createClient } from "@/lib/supabase/client";

import { Badge } from "@/components/ui/badge";
import { Braces, CircleUser } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRouter } from "next/navigation";

type PageHeaderProps = {
  user: string
}

export function PageHeader({ user }: PageHeaderProps) {
  const router = useRouter();

  const sendToUpdatePasswordPage = () => {
    router.push("/auth/update-password");
  }

  const signOut = () => {
    const supabase = createClient();

    supabase.auth.signOut();

    router.push("/auth/login");
  }

  const userDropdownMenu = [
    {
      "key": "update_password",
      "text": "Update Password",
      "function": sendToUpdatePasswordPage
    },
    {
      "key": "logout",
      "text": "Logout",
      "function": signOut
    },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center space-x-4">
        <Badge>{user}</Badge>
      </div>
      <div className="flex flex-row gap-3">
        <Tooltip>
          <TooltipTrigger>
            <a href="https://github.com/nickweindel/sports-tracker" target="_blank">
              <Braces />
            </a>
          </TooltipTrigger>
          <TooltipContent>
            Click here to navigate to this project's GitHub repository.
          </TooltipContent>
        </Tooltip>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <CircleUser />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end">
            {userDropdownMenu.map(menuItem => {
              return (
                <DropdownMenuItem key={menuItem.key} onClick={menuItem.function}>
                  {menuItem.text}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}