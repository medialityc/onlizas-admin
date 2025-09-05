
import { RHFInputWithLabel } from "@/components/react-hook-form";

interface TextareaProps extends Omit<React.ComponentProps<typeof RHFInputWithLabel>, "name"> {
  name: string;
}

export default function FormTextarea(props: TextareaProps) {
  return <RHFInputWithLabel {...props} rows={3} type="textarea" />;
}
