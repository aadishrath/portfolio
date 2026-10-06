## The experience
A portfolio built to make frontend work easy to explore: featured projects, keyboard-accessible details, clear navigation, and direct contact and resume actions.

## Frontend engineering
- Reusable project cards, dialogs, navigation, and contact components.
- Lazy-loaded routes with loading and error states.
- Responsive layouts for mobile and desktop.
- A shared theme system across headings, buttons, and project details.
- One content source for profile, skills, and project information.

## Accessible interactions
- Focus trapping, Escape dismissal, and focus restoration in dialogs.
- Mobile navigation that stays out of the tab order when closed.
- Visible keyboard focus, semantic controls, and a skip-to-content link.
- Reduced-motion support and a persistent color-theme preference.

## Verification and trade-offs
Playwright checks navigation, project dialogs, theme persistence, and project links. Production checks verify assets and enforce a JavaScript chunk budget.

The portfolio is a static application. Direct email contact keeps the experience simple, and no backend or AI service is needed to browse the work. AI frontend experience is demonstrated through the AdiBank Copilot project.
