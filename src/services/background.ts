import { updateBadgeImpersonationStatus } from '../common';

// make sure we update the badge when the page loads
chrome.webNavigation.onCompleted.addListener(() => {
  updateBadgeImpersonationStatus();
});
