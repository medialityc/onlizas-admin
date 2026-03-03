import {
  FormProvider as Form,
  SubmitHandler,
  UseFormReturn,
  FieldErrors,
} from "react-hook-form";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit: SubmitHandler<any>;
  onError?: (errors: FieldErrors) => void;
  autocomplete?: string | undefined;
  className?: string;
  id?: string;
  noValidate?: boolean;
};

export default function FormProvider({
  children,
  onSubmit,
  onError,
  methods,
  autocomplete,
  className,
  id,
  noValidate = false,
}: Props) {
  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit, onError)}
        autoComplete={autocomplete}
        className={className}
        noValidate={noValidate}
        id={id ?? "form"}
      >
        {children}
      </form>
    </Form>
  );
}
