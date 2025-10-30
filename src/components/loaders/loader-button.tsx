import { Button, ButtonProps } from "../button/button";

interface LoaderButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonProps {
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
