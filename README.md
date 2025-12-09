# Quiz Festif - Vue.js 3

Application de quiz festif construite avec Vue.js 3, Vue Router, Pinia et TailwindCSS.

## Installation

\`\`\`bash
cd vue-app
npm install
npm run dev
\`\`\`

## Configuration API

Créez un fichier `.env` à la racine du projet :

\`\`\`env
VITE_API_URL=http://localhost:3001/api
\`\`\`

## Endpoints API requis

Votre backend doit implémenter les endpoints suivants :

### Auth
- `POST /api/auth/login` - Connexion (body: { email, password })
- `POST /api/auth/signup` - Inscription (body: { email, password, display_name })
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/profile` - Profil utilisateur
- `PUT /api/auth/profile` - Modifier profil

### Quiz
- `GET /api/quizzes` - Liste des quiz de l'utilisateur
- `GET /api/quizzes/:id` - Détails d'un quiz
- `GET /api/quizzes/:id/play` - Quiz avec questions (pour jouer)
- `POST /api/quizzes` - Créer un quiz (body: { title })
- `PUT /api/quizzes/:id` - Modifier un quiz
- `DELETE /api/quizzes/:id` - Supprimer un quiz
- `GET /api/quizzes/:id/stats` - Statistiques du quiz

### Questions
- `POST /api/quizzes/:quizId/questions` - Ajouter une question
- `PUT /api/questions/:id` - Modifier une question
- `DELETE /api/questions/:id` - Supprimer une question

### Participation
- `POST /api/quizzes/:id/participate` - Soumettre une participation
- `GET /api/participations/:id` - Résultat d'une participation
- `GET /api/quizzes/:id/participants` - Liste des participants

## Structure des réponses attendues

### Login Response
\`\`\`json
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "display_name": "John"
  }
}
\`\`\`

### Quiz Response
\`\`\`json
{
  "quiz": {
    "id": "uuid",
    "title": "Quiz de Noël",
    "question_count": 5,
    "participant_count": 10,
    "questions": [
      {
        "id": "uuid",
        "question_text": "Question ?",
        "options": ["A", "B", "C", "D"],
        "correct_option_index": 0
      }
    ]
  }
}
\`\`\`

### Stats Response
\`\`\`json
{
  "quiz": { "id": "uuid", "title": "Quiz" },
  "participantCount": 10,
  "averageScore": 75,
  "mostMissedQuestion": "Question difficile ?",
  "participants": [
    {
      "id": "uuid",
      "participant_name": "Alice",
      "score": 5,
      "total_questions": 5
    }
  ]
}
\`\`\`
