interface PageLayoutProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({ sidebar, children }: PageLayoutProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl">
      {sidebar && (
        <aside className="hidden w-72 shrink-0 border-r border-gray-200 p-4 lg:block">
          {sidebar}
        </aside>
      )}
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
