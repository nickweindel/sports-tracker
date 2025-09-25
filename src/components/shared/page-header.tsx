import { Badge } from "@/components/ui/badge";

type PageHeaderProps = {
  user: string
}

export function PageHeader({ user }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center space-x-4">
        <Badge>{user}</Badge>
      </div>
    </header>
  )
}