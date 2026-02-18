import { Button } from "../button/button";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
}
interface LoaderButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonProps {
  className?: string;
  loading?: boolean;
  children: React.ReactNode;
}
const LoaderButton = ({
  className,
  children,
  loading = false,
  type = "button",
  ...props
}: LoaderButtonProps) => {
  return (
    <Button type={type} className={className} {...props}>
      {loading && (
        <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
      )}
      {children}
    </Button>
  );
};
export default LoaderButton;
