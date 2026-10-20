# Developer Notes

## Current Status (as of today)
- Version 1.5 (notifications) is **almost working**.
- Immediate notification works? (Testing pending)
- Delayed notification via `setTimeout` is likely being blocked by Chromium's security policy.
- **Next step:** Try Service Worker approach for scheduled reminders.

## Known Issue
- `new Notification()` inside `setTimeout` may be silently blocked by Chromium.
- Test site (bennish.net/web-notifications) works, so system permissions are fine.

## Next Session Goal
- Fix the 1-minute delayed notification.
- Then move to Version 2.0 (Finished Projects trophy case + visual polish).
