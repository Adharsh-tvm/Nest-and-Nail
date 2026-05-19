export const RESPONSE_MESSAGES = {
  // Generic
  SUCCESS: "Success",
  BAD_REQUEST: "Bad request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Resource not found",
  INTERNAL_SERVER_ERROR: "Internal server error",
  CREATED: "Created",
  MISSING_FIELDS: "Missing required fields",

  // Chat
  MESSAGE_SENT: "Message sent successfully",
  MESSAGES_FETCHED: "Messages fetched successfully",

  // Auth
  REGISTER_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",

  OTP_SENT: "OTP sent successfully",
  OTP_VERIFIED: "OTP verified successfully",
  INVALID_OTP: "Invalid Otp",

  INVALID_CREDENTIALS: "Invalid email or password",
  TOKEN_REFRESH_SUCCESS: "Token refreshed successfully",

  GOOGLE_AUTH_SUCCESS: "Google user authenticated successfully",
  GOOGLE_AUTH_FAILED: "Google authentication failed",

  // Users
  USER_FETCHED: "User fetched successfully",
  USERS_FETCHED: "Users fetched successfully",
  USER_UPDATED: "User updated successfully",
  USER_NOT_FOUND: "User not found",
  USER_BLOCKED: "User is blocked",
  USER_ACCESS_UPDATED: "User access updated successfully",
  SKILLS_UPDATED: "Skills Updated Successfully",
  ADDRESS_UPDATED: "Address Updated Successfully",
  FAILED: "Failed to Update",

  // Admin
  CLIENTS_FETCHED: "Clients fetched successfully",
  WORKERS_FETCHED: "Workers fetched successfully",
  USER_APPROVED: "User approved successfully",
  USER_REJECTED: "User rejected successfully",

  // Uploads
  PROFILE_UPLOADED: "Profile picture uploaded successfully",
  PROFILE_UPDATED: "Profile picture updated successfully",
  DOCUMENT_UPLOADED: "Document uploaded successfully",
  FILE_MISSING: "File is missing",
  UPDATED: "Updated Successfully",

  //
  REFRESH_TOKEN_MISSING: "Refresh token missing",
  INVALID_REFRESH_TOKEN: "Invalid refresh token",
  PASSWORD_MISMATCH: "Passwords do not match",
  INVALID_FILE_TYPE: "Invalid file type",

  // Service
  WORKER_SERVICES_FETCHED: "Worker services fetched successfully",
  SERVICE_DETAILS_FETCHED: "Service details fetched successfully",
  ACTIVE_SERVICE_FETCHED: "Active service fetched successfully",
  SERVICE_STARTED: "Service started successfully",
  SERVICE_COMPLETED: "Service completed successfully",
  SERVICE_CANCELLED: "Service cancelled successfully",
  ALL_SERVICES_FETCHED: "All Services Fetched Successfully",
  WORKER_BOOKED: "Worker booked successfully",
  SERVICE_HISTORY_FETCHED: "Service history fetched successfully",
  ONGOING_SERVICES_FETCHED: "Ongoing services fetched",
  SERVICE_ID_REQUIRED: "serviceId is required",

  // Meetings / Video Call
  SCHEDULED_MEETINGS_FETCHED: "Scheduled video calls fetched",
  MEETING_HISTORY_FETCHED: "Video call history fetched",
  MEETING_FETCHED: "Meeting fetched",
  MEETINGS_FETCHED: "Meetings fetched successfully",
  MEETING_DETAILS_FETCHED: "Meeting fetched successfully",
  JOINED_VIDEO_CALL: "Joined video call successfully",
  CALL_ENDED: "Call ended successfully",
  LEFT_VIDEO_CALL: "Left video call successfully",

  // Blocks
  DATES_REQUIRED: "Dates are required",
  DATES_BLOCKED: "Dates blocked successfully",
  BLOCKED_DATES_FETCHED: "Blocked dates fetched successfully",

  // Wallet / Payments
  RECHARGE_ORDER_CREATED: "Recharge order created",
  RECHARGE_SUCCESS: "Recharge successful",
  TRANSACTIONS_FETCHED: "Transactions fetched",
  PAYMENT_ORDER_CREATED: "Payment order created",
  PAYMENT_VERIFIED: "Payment verified successfully",
  WALLET_PAYMENT_SUCCESS: "Wallet payment successful",

  // Notifications
  NOTIFICATIONS_FETCHED: "Notifications fetched",
  NOTIFICATION_MARKED_READ: "Notification marked as read",

  // Concerns
  CONCERN_RAISED: "Concern raised successfully",
  CONCERNS_FETCHED: "Concerns fetched",
  CONCERNS_FETCHED_SUCCESS: "Concerns fetched successfully",
  CONCERN_RESOLVED: "Concern resolved successfully",

  // Workers
  WORKER_DETAILS_FETCHED: "Worker details fetched",
  BULK_AVAILABILITY_FETCHED: "Bulk availability fetched",
  AVAILABILITY_FETCHED: "Availability fetched",
  DASHBOARD_DATA_FETCHED: "Dashboard data fetched successfully",

  // Reviews
  REVIEW_SUBMITTED: "Review submitted",

  // Validation Errors
  ROLE_REQUIRED: "Role is required",
  GOOGLE_AUTH_MISSING_FIELDS: "email, name, and role are required",
  USER_ROLE_REQUIRED: "user_role is required",
  EMAIL_ROLE_REQUIRED: "Email and role are required",
  INVALID_OTP_EXP: "Invalid or expired OTP",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_CHANGED: "Password changed successfully",
  RATING_REQUIRED: "Rating is required",
};
