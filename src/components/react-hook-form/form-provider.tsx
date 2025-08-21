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
};

export default function FormProvider({
  children,
  onSubmit,
  methods,
  autocomplete,
  className,
  id,
}: Props) {
  const handleFormSubmit = (data: any) => {
    console.log("📋 FormProvider handleSubmit called with:", data);
    // Print errors before submit

    return onSubmit(data);
  };

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleFormSubmit)}
        autoComplete={autocomplete}
        className={className}
        id={id ?? "form"}
      >
        {children}
        {/* ...existing code... */}
      </form>
    </Form>
  );
}
