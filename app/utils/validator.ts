// Central validator file for all app input fields

export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email address";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) return "This field is required";
  if (!/^[a-zA-Z\s'-]+$/.test(name)) return "Invalid characters in name";
  return null;
};

export const validateRequired = (value: string): string | null => {
  if (!value) return "This field is required";
  return null;
};

export const validateNumeric = (value: string): string | null => {
  if (!value) return "This field is required";
  if (isNaN(Number(value))) return "Must be a number";
  return null;
};

export const validatePositiveNumber = (value: string): string | null => {
  if (!value) return "This field is required";
  const num = Number(value);
  if (isNaN(num)) return "Must be a number";
  if (num <= 0) return "Must be positive";
  return null;
};

export const validateOTP = (otp: string): string | null => {
  if (!otp) return "OTP is required";
  if (!/^\d{6}$/.test(otp)) return "OTP must be 6 digits";
  return null;
};
