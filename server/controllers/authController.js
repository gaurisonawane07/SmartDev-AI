import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return "Password must contain uppercase letters, lowercase letters, and numbers";
  }
  return null;
};

const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }
  if (name.trim().length > 50) {
    return "Name must not exceed 50 characters";
  }
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return "Name can only contain letters and spaces";
  }
  return null;
};

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // Check if all fields provided
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all fields",
      });
    }

    // Validate name
    const nameError = validateName(name);
    if (nameError) {
      return res.status(400).json({
        message: nameError,
      });
    }

    // Validate email
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({
        message: passwordError,
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}


async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // Check if password is provided
    if (!password || password.length === 0) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export { registerUser, loginUser };
