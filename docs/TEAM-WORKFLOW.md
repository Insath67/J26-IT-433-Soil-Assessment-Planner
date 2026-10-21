# Four-member workflow with the leader's two repositories

The delivery bundle contains frontend and backend side by side. Keep the existing two GitHub repositories.

1. Back up any uncommitted work in both local clones.
2. Fetch origin in GitHub Desktop. Select the intended feature branch based on the leader's `test` branch, or the existing assigned branch.
3. Copy only the contents of this bundle's `frontend` folder into `Soil-Assessment-Frontend`.
4. Copy only the contents of `backend` into `Soil-Assessment-Backend`.
5. Keep each repository's existing `.git` folder. Never copy the frontend repo inside the backend or vice versa.
6. Review Changes. `.env`, `.venv`, node_modules and dist must not be staged. Existing tracked generated files require a separate reviewed removal from Git tracking.
7. Commit actual logical changes as they are completed: shared structure, home/routes, crop frontend integration, API migration/tests. Do not fabricate earlier dates or imply that reorganizing completed code represents old development activity.
8. Push your member branch. Create a PR into `test` in each relevant repository. Have the group review shared files and run checks before merging.
9. Test frontend and backend together after both PRs are integrated.

Each member owns their feature folder in both repos. Agree shared changes to `App.jsx`, `globals.css`, Navigation, `app/main.py`, package dependencies and API schemas with the group.

A frontend branch cannot be merged directly into a different backend repository. Integration means running both repos together using the agreed API contract.

Coordinate endpoint names and units before connecting soil scanning → soil health → crop recommendation → fertilizer guidance. These automatic handoffs are not implemented in this package.
