
# Project Overview

This is a Next.js application designed to help with event planning, specifically for assigning participants to tables. The application allows a user to define the number of tables, input a list of participants, and then automatically assign those participants to seats at the tables.

# Implemented Features

*   **Dynamic Table Creation:** Users can specify the number of tables required for their event.
*   **Participant Input:** A text area allows for easy input of participant names, with each name on a new line.
*   **Random Assignment with Custom Confirmation:** With a "Finalizar" button, the application displays a custom popup message before randomly assigning participants to available seats. If the user confirms, the assignment proceeds; otherwise, it is cancelled.
*   **Update Assignment:** With an "Actualizar" button, a text area allows for the entry of new participants, who are then assigned to empty seats without changing the positions of existing participants.
*   **Visual Representation:** Each table is visually represented by a poker table image with chairs, and the names of the assigned participants are displayed on those chairs.
*   **Participant List per Table:** A list of participants is displayed horizontally next to the title of each table.
*   **Real-time Summary:** The application provides a real-time count of the total number of participants.
*   **Reserved "Crupier" Seat:** Position 2 at each table is reserved for the "Crupier" and is not available for participant assignment. This seat is visually distinguished with a red background.
*   **Draggable Participants:** Users can reorder participants by dragging and dropping their names between seats.
*   **Move-Only Drag-and-Drop:** Participants can only be moved to empty seats. If the destination seat is occupied, the move is prevented.
*   **Drag-to-Delete:** A garbage collector icon appears at the bottom right of the screen when a participant is being dragged. Dropping the participant onto this icon deletes them from the system.

# Design and Styling

*   **Layout:** The application uses a clean, centered layout. The main components are organized in a single column, with clear headings and spacing.
*   **Styling:** The application uses Tailwind CSS for styling, with a simple and modern design. The color scheme is based on grays, with blue and green for interactive elements. The background color of the page is Alice Blue (`#f0f8ff`).
*   **Visual Elements:** The poker table image provides a visual and intuitive representation of the seating arrangement.
*   **Iconography:** A garbage collector icon appears when a participant is dragged, allowing for their deletion.
*   **Participant Labels:** The participant labels have a background color of `RGB(153, 69, 61)`, bold black text, and a font size of 14px.

# Current Plan

The current plan was to implement a complete and user-friendly interface for assigning participants to tables. This involved the following steps:

1.  **Create the initial setup:** A simple interface to input the number of tables.
2.  **Display tables and chairs:** For each table, display a poker table image with 9 chairs around it.
3.  **Implement participant assignment:** Add the functionality to input participant names and assign them to chairs when the "Finalizar" button is clicked.
4.  **Display assigned names:** Show the names of the assigned participants on the chairs.
5.  **Add a participant list:** Display a list of participants for each table.
6.  **Refine the layout:** Adjust the layout to be more organized and visually appealing, including centering the table image and placing the participant list next to the table title.
7.  **Add vertical spacing:** Add a 20px margin-top to the poker table image to create more separation from the participant list.
8.  **Change background color:** Update the background color of the page to `#f0f8ff` (Alice Blue).
9.  **Reserve "Crupier" seat:** Label position 2 as "Crupier", block it from assignment, and give it a distinct red color.
10. **Implement Draggable Participants:** Add the ability to reorder participants by dragging their names between seats.
11. **Update Participant Label Color:** Change the background color of participant labels to `RGB(153, 69, 61)` with bold black text.
12. **Implement Move-Only Drag-and-Drop:** Updated the drag-and-drop functionality to only allow moving participants to empty seats.
13. **Add Drag-to-Delete:** Implemented a garbage collector icon that appears when a participant is dragged, allowing for their deletion without confirmation.
14. **Update "Actualizar" Button Logic:** Modified the "Actualizar" button to only assign new participants to empty seats, without changing the positions of existing participants.
15. **Add Custom Confirmation to "Finalizar":** Replaced the browser's default confirmation with a custom popup for the "Finalizar" button.
