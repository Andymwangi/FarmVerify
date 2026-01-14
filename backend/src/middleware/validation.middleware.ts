import { body, param, query } from "express-validator";

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("farmSize")
    .notEmpty()
    .withMessage("Farm size is required")
    .isFloat({ min: 0.1 })
    .withMessage("Farm size must be a positive number"),
  body("cropType")
    .trim()
    .notEmpty()
    .withMessage("Crop type is required"),
  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),
  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

export const updateStatusValidation = [
  param("id")
    .notEmpty()
    .withMessage("Farmer ID is required")
    .isUUID()
    .withMessage("Invalid farmer ID"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["PENDING", "CERTIFIED", "DECLINED"])
    .withMessage("Status must be PENDING, CERTIFIED, or DECLINED"),
  body("reason")
    .optional()
    .trim(),
];

export const queryValidation = [
  query("status")
    .optional()
    .isIn(["PENDING", "CERTIFIED", "DECLINED"])
    .withMessage("Invalid status filter"),
  query("search")
    .optional()
    .trim(),
];
