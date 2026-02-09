interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-gray-200 p-4 lg:block">
      {children ?? (
        <div className="text-sm text-gray-400">Filters will appear here</div>
      )}
    </aside>
  );
}
