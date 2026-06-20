# TowMech Partner Portal Deployment

## Render Services Required
1.  **Backend (Existing)**: `towmech-backend` (Web Service)
2.  **Partner Portal**: `towmech-partner-portal` (Static Site or Web Service for Next.js)
3.  **Admin Dashboard (Existing)**: `towmech-admin-dashboard` (Static Site)

## Environment Variables Required
### Partner Portal (Frontend)
*   `NEXT_PUBLIC_API_URL`: URL of the deployed backend.

### Backend
*   `JWT_SECRET`: Secret for signing partner tokens.
*   `DEFAULT_COUNTRY`: Default isolation workspace (e.g., ZA).
*   `ENABLE_OTP_DEBUG`: Set to `true` for staging/dev.
*   `STATIC_OTP`: Optional static code for testing.

## DNS Records Required
*   `fleet.towmech.com` -> Point to Partner Portal (Fleet route)
*   `insurance.towmech.com` -> Point to Partner Portal (Insurance route)
*   `api.towmech.com` -> Point to Backend

## Database Collections Required
*   `partners`: Stores company records (Fleet/Mechanic/Insurance).
*   `driververificationcodes`: Fleet driver linking tokens.
*   `insurancecodes`: Policy holder verification tokens.
*   `financiallogs`: Audit trail for all partner/financial actions.
*   `users`: Updated with `partnerId` and partner roles.
