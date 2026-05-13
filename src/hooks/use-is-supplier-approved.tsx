import { useUserProfile } from "./react-query/use-user-profile";

export function useIsSupplierApproved(): boolean {
  const { data: user } = useUserProfile();
  // Treat undefined as approved (no restriction)
  return user?.isApproved !== false;
}
