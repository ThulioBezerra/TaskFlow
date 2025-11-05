# Animation & Micro-interactions

This section outlines the principles and key applications of motion design within TaskFlow, focusing on enhancing user experience, providing feedback, and subtly integrating gamification elements. Performance and accessibility will be key considerations.

### Motion Principles

*   **Purposeful:** Every animation should serve a clear purpose, such as guiding user attention, providing feedback, or indicating state changes. Avoid gratuitous animations.
*   **Subtle & Smooth:** Animations should be subtle, fluid, and contribute to a sense of polish without being distracting or causing motion sickness.
*   **Fast & Responsive:** Interactions should feel immediate. Animations should be quick enough not to impede user flow, typically under 300ms for most UI transitions.
*   **Consistent:** Apply consistent easing curves and durations across similar interactions to create a predictable experience.
*   **Delightful (Gamification):** Use micro-interactions and animations to provide positive feedback for gamification elements (e.g., earning a badge), making the experience more rewarding.

### Key Animations & Micro-interactions

*   **Task Card Movement:** Smooth transitions when dragging and dropping task cards on the Kanban board. (Duration: `~200ms`, Easing: `ease-out`)
*   **Badge Earned Notification:** A subtle, celebratory animation or toast notification when a user earns a new badge. (Duration: `~500ms`, Easing: `ease-in-out`)
*   **Button States:** Visual feedback (e.g., slight scale, color change) on hover, active, and disabled states for buttons. (Duration: `~100ms`, Easing: `ease-in-out`)
*   **Form Field Focus:** A clear, subtle animation or highlight when a form field gains focus. (Duration: `~150ms`, Easing: `ease-out`)
*   **Loading Indicators:** Engaging but non-intrusive loading spinners or progress bars for asynchronous operations. (Duration: `continuous`, Easing: `linear`)
*   **Menu/Sidebar Toggle:** Smooth slide-in/slide-out animations for navigation menus or sidebars. (Duration: `~250ms`, Easing: `ease-in-out`)
