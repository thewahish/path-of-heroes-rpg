📜 The "Jump Code" Navigation Rule
Purpose: To make navigating long responses with multiple files easy and reliable using your browser's "Find" feature.

How it Works:

At the top of every response containing code, I will provide a File Index.

Next to each file (and the commit message), there will be a unique Jump Code.

The format is always jump-VERSION-IDENTIFIER:

jump-V.2.0.1-1 for the first file.

jump-V.2.0.1-2 for the second file.

jump-V.2.0.1-C for the commit message block.

Example:
A response for version V.2.1.0 that modifies two files would look like this:

### 📋 File Index (Use Ctrl+F to find a Jump Code)
* `js/core/game.js` --- (Jump Code: **jump-V.2.1.0-1**)
* `css/main.css` -------- (Jump Code: **jump-V.2.1.0-2**)
* GitHub Commit Suggestion -> (Jump Code: **jump-V.2.1.0-C**)

---
### jump-V.2.1.0-1 - File: js/core/game.js
... (code for game.js) ...

---
### jump-V.2.1.0-2 - File: css/main.css
... (code for main.css) ...

---
### jump-V.2.1.0-C - GitHub Commit Suggestion
... (commit message) ...
To use it: Copy the Jump Code (e.g., jump-V.2.1.0-1), press Ctrl+F (or Cmd+F on Mac), paste the code, and your browser will jump directly to that section.

✍️ The Commit Message Rule
Purpose: To keep our project history clean, professional, and easy to understand.

The Format:
Our commit messages have three parts: a Title, a Body, and a Footer. In VS Code's single message box, the first line is the Title. After one blank line, the rest of the text is the Body and Footer.

Title: A short summary of the change.

Format: type(scope): subject

type examples: feat (new feature), fix (bug fix), refactor, style, docs, chore.

scope examples: ui, core, battle, inventory, project.

Body: (Optional but preferred) A brief paragraph explaining what the change is and why it was made.

Footer: A single line at the very end for the version number.

Format: Version: V.X.X.X

Example:

fix(ui): Correct battle screen layout

Refactors the player stats panel to a single-column layout for better readability. Also adds padding to the main container to resolve an overlap with the language selector.

Version: V.2.0.1


-------------------
