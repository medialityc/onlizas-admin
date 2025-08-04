import { UserIcon } from "@heroicons/react/24/solid";

interface UserFormHeaderProps {
  title: string;
  description: string;
}

export const UserFormHeader = ({ title, description }: UserFormHeaderProps) => (
  <div className="text-center space-y-4">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full">
      <UserIcon className="h-8 w-8 text-white" />
    </div>
    <div>
      <h1 className="text-3xl font-bold bg-primary bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  </div>
);
