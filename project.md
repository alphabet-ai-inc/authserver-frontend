### Project: authserver-frontend

#### 1. **Home.js**
- **Purpose:** Serves as the main landing page, showing a login prompt or a welcome message based on authentication status. Highlights features using Bootstrap Icons.
- **Key Elements:** 
  - `LoginPrompt` component
  - `useAuthSession` hook
  - `useNavigate` from React Router
  - Layout with Bootstrap & Icons
  - Feature grid for services, users, databases, etc.

---

#### 2. **useAuthSession.js**
- **Purpose:** Custom hook managing auth/session state, JWT tokens, session validation, refresh, logout.
- **Key Elements:** 
  - State: `jwtToken`, `sessionChecked`, `isLoggedInExplicitly`, etc.
  - Effects: Session check, token validation
  - Functions: `toggleRefresh`, `logOut`
  - Backend: Uses fetch for API interactions

---

#### 3. **NavBar.js**
- **Purpose:** Provides navigation links like "List Apps" & "Logout."
- **Key Elements:** 
  - Navigation handlers 
  - Bootstrap classes and icons
  - App manager title (non-link unless navigates home)

---

#### 4. **Apps.js**
- **Purpose:** Displays list of user apps, with options to add new apps.
- **Key Elements:** 
  - `useAuth` context
  - `apps` state
  - Bootstrap icons (`bi-list-ul`, `bi-plus-circle`)

---

#### 5. **ThisApp.js**
- **Purpose:** Shows details for a specific app, allowing edits or deletion.
- **Key Elements:** 
  - `useParams` for app ID
  - `useAuth` for session
  - `useNavigate`
  - Action icons

---

#### 6. **Home.test.js**
- **Purpose:** Unit testing for Home component.
- **Key Elements:** 
  - Mocks dependencies
  - Tests login prompts, loading, welcome states

---

#### 7. **useAuthSession.test.js**
- **Purpose:** Unit testing for session hook.
- **Key Elements:** 
  - Mocks fetch, navigation, SweetAlert2
  - Tests session validation, token refresh, logout

---

#### 8. **package.json**
- **Purpose:** Manages project metadata and dependencies.
- **Includes:** React, Bootstrap, Bootstrap Icons, testing libraries, etc.

---

#### 9. **public and images**
- Stores static assets like images (`switch1.jpeg`) used in UI.

---

### How to Extend or Maintain
- **Add new features:**
  - Create new components inside the `components/` directory.
  - Connect to backend or state as needed.
- **Add new hooks:**
  - Create in the `hooks/` directory for custom logic.
- **Add tests:**
  - Place new `.test.js` files alongside relevant components/hooks.
- **Add images:**
  - Store in `images/` and import as needed.
- **Update dependencies:**
  - Modify `package.json` and run `npm install`.

---

### Directory Structure:
```
authserver-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Home.js
│   │   ├── NavBar.js
│   │   ├── Apps.js
│   │   ├── ThisApp.js
│   │   └── Home.test.js
│   ├── hooks/
│   │   ├── useAuthSession.js
│   │   └── useAuthSession.test.js
│   ├── images/
│   │   └── switch1.jpeg
│   └── utils/
│       └── Alert.js
├── package.json
└── ...
```

