import {
  FormProvider as Form,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit: SubmitHandler<any>;
  autocomplete?: string | undefined;
  className?: string;
  id?: string;
  noValidate?: boolean;
};

export default function FormProvider({
  children,
  onSubmit,
  methods,
  autocomplete,
  className,
  id,
  noValidate = false,
}: Props) {
  return (
    <Form {...methods}>
      <form
        onSubmit={onSubmit}
        autoComplete={autocomplete}
        className={className}
        noValidate={noValidate}
        id={id ?? "form"}
      >
        {children}
        {/* ...existing code... */}
      </form>
    </Form>
  );
}
