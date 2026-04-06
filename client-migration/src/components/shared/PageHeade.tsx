import { Icon } from "lucide-react";

export const PageHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  description?: string;
}> = ({ title, description }) => {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
};
