# Nani

## Description

Describe your project in one/two lines.

## User Stories

-  **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault
-  **Signup:** As an anon I can sign up in the platform so that I can start browsing animes
-  **Login:** As a user I can login to the platform so that I can see my favorite animes
-  **Logout:** As a user I can logout from the platform so no one else can use it
-  **Change password:** As a user I can change my password to login to the platform
-  **Add Animes to your lists** As a user I can add a anime so that other user can check what animes I am watching, I have watched, I have planned to watch
-  **List Animes** As a user I want to see the animes so that I can choose one to watch
-  **Search Animes** As a user I want to search animes by name so that I can add them to my lists
-  **Search Users** As a user I want to search other users by name to follow them and see their lists
-  **See other users** As a user I want to see other users so that I can see check their lists and follow them
-  **See my profile** As a user I want to see my profile so that I can check my profile
-  **Edit my profile** As a user I want to edit my profile so that I can change my name and picture
-  **Edit my lists** As a user I want to edit my lists so that I can add or remove animes from my lists
-  **Delete my account** As a user I want to delete my account so that I can delete my account
-  **Follow users** As a user I want to follow other users so that I can see their lists
-  **Unfollow users** As a user I want to unfollow other users so that I can stop following them
-  **See my followers** As a user I want to see my followers so that I can see who follows me
-  **See my following** As a user I want to see my following so that I can see who I am following
-  **See my lists** As a user I want to see my lists so that I can see what animes I am watching, I have watched, I have planned to watch
-  **See my notifications** As a user I want to see my notifications so that I can check what is happening in the platform
-  **Write comments** As a user I want to write comments in the animes so that I can express my opinions and reply to other users

## Backlog

User profile:
- see my profile and my anime lists
- edit my profile
- edit my lists

Other user profile:
- see other users profiles and their anime lists
- follow other users
- unfollow other users

Log-in/Sign-up:
- login
- signup
- forget password

Homepage:
- see trending animes
- see animes you are watching

Friends:
- search users

Anime:
- search animes

Each anime page:
- see anime details
- add anime to my lists
- add comments to anime
- reply comments to anime

  
# Client

## Routes

- / - Homepage
- /login-signup - Signup/Login form
- /confirm/:id - Confirm email
- /reset-pass - Reset password form
- /password-reset/:id/:token - Reset password using token
- /profile - profile page
- /search - search animes
- /friends - search users
- /Follow/:id - ?
- /friendProfile/:friendId - friend profile page
- /anime/:animeId - anime details page
- /* - 404 page

## Pages

- Home Page (public)
- Sign-up/Log-in Page (anon only)
- Confirm Email Page (anon only)
- Reset Password Page (anon only)
- Friends Page (user only)
- Anime Page (user only)
- Anime Details Page (user only)
- My Profile Page (user only)
- Friends Profile Page (user only)
- 404 Page (public)

## Components

- Alert component
  - Input: children: any, type: string, message: string
  - Output: alert: any
- Anime component
  - Input: id: number, type: string
  - Output: anime: any
- AnimeDropdown component
  - Input: addWatching: any, addWatched: any, addPlanToWatch: any
  - Output: animeDropdown: any
- Comment component
  - Input: comment: object, replies: object, userId: number, deleteComment: any, updateComment: any, activeComment: any, addComment: any, parentId: number
  - Output: comment: any
- CommentForm component
  - Input: submitLabel: any, handleSubmit: any, initialText: string, hasCancelButton: boolean, handleCancel: any
  - Output: commentForm: any
- Footer component
  - Output: footer: any
- ListAnime component
  - Input: anime: any, type: string
  - Output: listAnime: any
- ListOfComments component
  - Input: currentUserId: number, animeId: number
  - Output: listOfComments: any
- Login component
  - Output: login: any
- Navbar component
  - Output: navbar: any
- PrivateRoute component
  - Input: children: any
  - Output: privateRoute: any
- Profiles component
  - Input: owner: object, followFriend: object
  - Output: profiles: any
- SearchBar component
  - Input: search: string, setSearch: any, setResults: any, searchBarInput: string
- Signup component
  - Output: signup: any
- Spinner component
  - Output: spinner: any

## IO


## Services

- Auth Service
  - auth.login(user)
  - auth.signup(user)
  - auth.logout()
  - auth.me()
  - auth.getUser() // synchronous
- Restaurant Service
  - restaurant.list()
  - restaurant.create(data)
  - restaurant.detail(id)
  - restaurant.addFavorite(id)
  - restaurant.removeFavorite(id)   

# Server

## Models

User model

```
firstName - string
lastName - string
username - String
email - String // required & unique
confirmed - Boolean
password - String
image - String
googleId - String
facebookId - String
watched - Array
watching - Array
planToWatch - Array
following - [ObjectID<User>]
followers - [ObjectID<User>]
```

Comment model

```
author - ObjectID<User> // required
id - String // required
animeId - Number // required
content - String // required
parentId - String
createdAt - Date
```

Token model

```
userId - ObjectID<User> // required
token - String // required
createdAt - Date // expires in 1 hour
```

## API Endpoints/Backend Routes

- POST /auth/signup
  - body:
    - username
    - email
    - password
- POST /auth/login
  - body:
    - email
    - password
- POST /auth/google/login
  - body:
    - email
    - googleId
    - image
- POST /auth/verify
  - body:
    - user
- GET /auth/profile
- GET /auth/:senderId
- PUT /auth/profile
  - body:
    - userName
    - image
- POST /auth/upload
  - body:
    - image
- GET /friend
- GET /friend/:id
- GET /friend/search/:searchBarInput
- GET /friend/:id/:add
- GET /friend/friendProfile/:id
- GET /anime/home
- GET /anime/:id
- GET /anime/search/:searchBarInput
- GET /anime/listAnime/page/:pageNumber
- GET /anime/addList/:id/:listOption
- GET /anime/deleteList/:id
- POST /comments/:animeId
  - body:
    - content
    - parentId
- GET /comments/:animeId
- DELETE /comments/:commentId
  - body: (empty)
- PUT /comments/:commentId
  - body:
    - content
- POST /email
  - body:
    - email
    - url
- GET /email/confirm/:id
- POST /email/reset
  - body:
    - url
- POST /email/:id/:token
  - body:
    - password

## Links

### Trello/Kanban

[Link to trello board](https://trello.com/b/VlgoqtCW/nani)

### Git

[Client repository Link](https://github.com/RaAlMer/Nani-frontend)
[Server repository Link](https://github.com/RaAlMer/Nani-backend)

[Deployed APP Link](https://nani-app.netlify.app)

### Slides

[Slides Link](https://docs.google.com/presentation/d/e/2PACX-1vTJgUgXQx1JNE9cHLbbgWkWaegQ4XngX0uQp3hbrBAqQYLOJIkO1gAVohExfEy0a3r0T1wGSjnvyCIh/pub?start=false&loop=false&delayms=3000)