import RHFSwitch from "@/components/react-hook-form/rhf-switch";

interface ToggleProps {
  name: string;
  label?: string;
}

export default function FormToggle(props: ToggleProps) {
  return <RHFSwitch {...props} />;
}
