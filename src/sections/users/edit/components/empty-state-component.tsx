

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => (
  <div className="text-center py-12 text-muted-foreground">
    {icon}
    <p className="text-lg font-medium mb-2">{title}</p>
    <p className="text-sm">{description}</p>
  </div>
);
