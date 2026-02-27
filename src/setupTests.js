// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// Mock Firebase
jest.mock('./firebase', () => ({
  db: {}
}));

// Mock console methods for testing
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn()
};
