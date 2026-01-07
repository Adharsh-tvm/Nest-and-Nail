export const RESPONSE_MESSAGES = {
    
  // Generic
  SUCCESS: "Success",
  INTERNAL_SERVER_ERROR: "Internal server error",
  BAD_REQUEST: "Bad request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Resource not found",

  // Auth
  REGISTER_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  OTP_SENT: "OTP sent successfully",
  OTP_VERIFIED: "OTP verified successfully",
  INVALID_CREDENTIALS: "Invalid email or password",
  TOKEN_REFRESH_SUCCESS: "Token refreshed successfully",

  // Users
  USER_FETCHED: "User fetched successfully",
  USERS_FETCHED: "Users fetched successfully",
  USER_UPDATED: "User updated successfully",
  USER_NOT_FOUND: "User not found",
  USER_BLOCKED: "User is blocked",
  USER_ACCESS_UPDATED: "User access updated successfully",

  // Admin
  CLIENTS_FETCHED: "Clients fetched successfully",
  WORKERS_FETCHED: "Workers fetched successfully",
  USER_APPROVED: "User approved successfully",
  USER_REJECTED: "User rejected successfully",

  // Uploads
  PROFILE_UPLOADED: "Profile picture uploaded successfully",
  DOCUMENT_UPLOADED: "Document uploaded successfully",
  FILE_MISSING: "File is missing",
};
