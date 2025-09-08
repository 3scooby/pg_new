import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ROLE_VALUES } from '../types';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }
  next();
};

export const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('username')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('User name is required and must be less than 15 characters'),
  body('role')
    .optional()
    .isIn(ROLE_VALUES)
    .withMessage('Role must be one of: ' + ROLE_VALUES.join(', ')),
  handleValidationErrors
];

export const validateUserLogin = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body('role')
    .optional()
    .isIn(ROLE_VALUES)
    .withMessage('Role must be one of: ' + ROLE_VALUES.join(', ')),
  handleValidationErrors,
];

export const validatePaymentRequest = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter code'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description is required and must be less than 500 characters'),
  body('customerEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid customer email'),
  body('gateway')
    .isIn(['stripe', 'paypal', 'razorpay'])
    .withMessage('Gateway must be one of: stripe, paypal, razorpay'),
  handleValidationErrors
];

export const validateCreatePayout = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter code'),
  body('description')
    .optional()
    .isString()
    .isLength({ min: 0, max: 500 })
    .withMessage('Description must be <= 500 characters'),
  handleValidationErrors
];

export const validateSubmitPayoutUpi = [
  body('payoutId')
    .isUUID()
    .withMessage('payoutId must be a valid UUID'),
  body('upiId')
    .isString()
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z]+$/)
    .withMessage('Invalid UPI ID format'),
  handleValidationErrors
];