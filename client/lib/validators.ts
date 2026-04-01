// Validation utilities for form fields

export const validators = {
  // Email validation
  email: (email: string): { valid: boolean; error?: string } => {
    if (!email || !email.trim()) {
      return { valid: false, error: "Email is required" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, error: "Please enter a valid email address" };
    }
    return { valid: true };
  },

  // Password validation
  password: (
    password: string,
    minLength: number = 6
  ): { valid: boolean; error?: string } => {
    if (!password || !password.trim()) {
      return { valid: false, error: "Password is required" };
    }
    if (password.length < minLength) {
      return {
        valid: false,
        error: `Password must be at least ${minLength} characters long`,
      };
    }
    // Optional: Check for password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return {
        valid: false,
        error:
          "Password must contain uppercase letters, lowercase letters, and numbers",
      };
    }

    return { valid: true };
  },

  // Name validation
  name: (name: string): { valid: boolean; error?: string } => {
    if (!name || !name.trim()) {
      return { valid: false, error: "Full name is required" };
    }
    if (name.trim().length < 2) {
      return { valid: false, error: "Name must be at least 2 characters long" };
    }
    if (name.trim().length > 50) {
      return { valid: false, error: "Name must not exceed 50 characters" };
    }
    // Check if name contains only letters and spaces
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return {
        valid: false,
        error: "Name can only contain letters and spaces",
      };
    }
    return { valid: true };
  },

  // Validate all registration fields
  validateRegistration: (data: {
    name: string;
    email: string;
    password: string;
  }): { valid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    const nameValidation = validators.name(data.name);
    if (!nameValidation.valid) {
      errors.name = nameValidation.error || "Invalid name";
    }

    const emailValidation = validators.email(data.email);
    if (!emailValidation.valid) {
      errors.email = emailValidation.error || "Invalid email";
    }

    const passwordValidation = validators.password(data.password);
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.error || "Invalid password";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Validate all login fields
  validateLogin: (data: {
    email: string;
    password: string;
  }): { valid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    const emailValidation = validators.email(data.email);
    if (!emailValidation.valid) {
      errors.email = emailValidation.error || "Invalid email";
    }

    const passwordValidation = validators.password(data.password, 1); // Just check it's not empty for login
    if (!passwordValidation.valid && !data.password) {
      errors.password = "Password is required";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
