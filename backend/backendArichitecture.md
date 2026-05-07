# Backend Architecture Documentation

This document outlines the in-depth architecture, database schema, and design patterns used in the dynamic personal portfolio backend.

## 🏗️ High-Level Architecture

The backend is built utilizing the **MERN** stack's backend technologies and follows the **Model-View-Controller (MVC)** design pattern to ensure clean separation of concerns and maximum scalability.

- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Cloud Storage**: Cloudinary (for storing images and PDFs)
- **File Handling**: Multer (in-memory processing)
- **Routing**: Modular Express Routers

---

## 📂 Folder Structure

```text
backend/
├── config/
│   ├── cloudinary.js         # Cloudinary SDK connection config
│   └── db.js                 # MongoDB Atlas connection setup
├── controllers/              # Core business logic
│   ├── achievementController.js
│   ├── contactController.js
│   ├── journeyController.js
│   ├── profileController.js
│   ├── projectController.js
│   ├── serviceController.js
│   └── technologyController.js
├── middleware/               # Global & Route-specific middlewares
│   ├── asyncHandler.js       # Wrapper to eliminate try/catch repetition
│   ├── errorMiddleware.js    # Custom global error handler
│   └── upload.js             # Multer setup + Cloudinary upload logic
├── models/                   # Mongoose Database Schemas
│   ├── Achievement.js
│   ├── Contact.js
│   ├── Journey.js
│   ├── Profile.js
│   ├── Project.js
│   ├── Service.js
│   └── Technology.js
├── routes/                   # API endpoint definitions mapping to controllers
│   ├── ...
├── .env                      # Environment variables
├── app.js                    # Express application setup & middleware injection
└── server.js                 # Application entry point
```

---

## 🗄️ Database Schemas & Collections

All tables (collections) in this architecture automatically generate `_id` fields as primary keys and include `createdAt` and `updatedAt` properties handled natively via Mongoose `timestamps`.

### 1. Profile Collection (`profiles`)
Stores the global data regarding the portfolio owner. This table typically holds a single document.

| Column / Field | Data Type | Properties | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | `required` | The full name of the user. |
| `role` | Array of Strings | - | Different titles (e.g., `["Full Stack", "Designer"]`). |
| `description` | String | `required` | Short intro/tagline describing the user. |
| `aboutMe` | String | - | Long-form bio detailing experience. |
| `profileImage` | String | - | Cloudinary URL pointing to the user's avatar. |
| `cvFile` | String | - | Cloudinary URL pointing to the user's resume PDF. |

### 2. Journey Collection (`journeys`)
Tracks timelines, education, and career milestones.

| Column / Field | Data Type | Properties | Description |
| :--- | :--- | :--- | :--- |
| `year` | String | `required` | The year or timeframe (e.g., "2020-2024"). |
| `title` | String | `required` | The milestone title (e.g., "Senior Developer"). |
| `label` | String | - | A category badge (e.g., "Education", "Career"). |
| `description` | String | `required` | Details about what was achieved. |

### 3. Technology Collection (`technologies`)
Stores the dynamic list of skills and tools.

| Column / Field | Data Type | Properties | Description |
| :--- | :--- | :--- | :--- |
| `technologyName`| String | `required` | The name of the tech (e.g., "React.js"). |
| `iconPath` | String | - | URL or string identifier for the technology's icon. |

### 4. Service Collection (`services`)
Outlines the services and offerings provided by the user.

| Column / Field | Data Type | Properties | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | `required` | Name of the service. |
| `description` | String | `required` | Deep explanation of the offering. |
| `icon` | String | - | Cloudinary image URL or string identifier. |
| `tags` | Array of Strings | - | Array of keywords associated with the service. |

### 5. Project Collection (`projects`)
A showcase of completed or ongoing software projects.

| Column / Field | Data Type | Properties | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | `required` | Project name. |
| `description` | String | `required` | Project summary. |
| `image` | String | - | Cloudinary URL for the project thumbnail. |
| `projectLink` | String | - | External URL (GitHub or live demo). |
| `technologies` | Array of Strings | - | Array of tech stack used for this project. |

### 6. Achievement Collection (`achievements`)
Stores certifications, awards, and notable honors.

| Column / Field | Data Type | Properties | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | `required` | Name of the achievement/certificate. |
| `description` | String | `required` | Details regarding the achievement. |
| `certificateImage`| String | - | Fallback/legacy Cloudinary image URL. |
| `imageUrl` | String | - | Main image URL representing the certificate. |
| `certificateTag` | String | - | Category tag (e.g., "Frontend", "Cloud"). |
| `companyName` | String | - | Issuing body (e.g., "AWS", "Google"). |
| `iconPath` | String | - | Logo or icon string URL of the issuer. |

### 7. Contact Collection (`contacts`)
Acts as a CRM inbox, securely storing messages sent by visitors through the frontend.

| Column / Field | Data Type | Properties | Description |
| :--- | :--- | :--- | :--- |
| `firstName` | String | `required` | Sender's first name. |
| `lastName` | String | `required` | Sender's last name. |
| `email` | String | `required` | Sender's contact email. |
| `description` | String | `required` | The combined subject and body of the message. |

---

## 🔄 API Flow & Error Handling

1. **Client Request**: The frontend hits a specific `REST endpoint` (e.g., `POST /api/contact`).
2. **Routing**: `app.js` directs the URL to the corresponding modular router (`contactRoutes.js`).
3. **Middleware Execution**: 
   - Multer middleware `upload.js` intercepts multipart form data.
   - If files exist, they are streamed to **Cloudinary** immediately from memory, and the resolved secure URLs are attached to the request payload.
4. **Controller Logic**: Uses the custom `asyncHandler` wrapper to process data and interact with Mongoose safely, abstracting away verbose `try...catch` blocks.
5. **Global Error Catcher**: If validation fails or the database rejects the payload, `errorMiddleware.js` cleanly formats the crash into a readable JSON object with accurate `4xx` or `5xx` status codes.
