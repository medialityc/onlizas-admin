/**
 * Common props interface for authentication forms that handle both email and phone verification
 */
export interface AuthFormProps {
  email?: string;
  phoneNumber?: string;
  phoneNumberCountryId?: number;
}

/**
 * Type guard to check if email is provided
 */
export const hasEmail = (
  props: AuthFormProps
): props is AuthFormProps & { email: string } => {
  return !!props.email;
};

/**
 * Type guard to check if phone number is provided with country ID
 */
export const hasPhoneNumber = (
  props: AuthFormProps
): props is AuthFormProps & {
  phoneNumber: string;
  phoneNumberCountryId: number;
} => {
  return !!props.phoneNumber && props.phoneNumberCountryId !== undefined;
};

/**
 * Type guard to check if any valid identifier is provided
 */
export const hasValidIdentifier = (props: AuthFormProps): boolean => {
  return hasEmail(props) || hasPhoneNumber(props);
};
