# User Directory App

A production-style React Native assignment app built with React Native CLI, React Navigation, Redux Toolkit + Thunk, Redux Persist, Axios, and NetInfo.

## Features

- Email/password login with validation and remember-me support
- Protected navigation flow with splash auth check
- User directory fetched from `https://jsonplaceholder.typicode.com/users`
- Pull-to-refresh, retry state, search, and simple pagination simulation
- Offline banner with cached data fallback
- Profile screen with full user details
- Favorites tab with persisted notes per user
- Dark/light theme toggle with persisted preference

## Tech Stack

- React Native CLI
- React Navigation (`native-stack` + `bottom-tabs`)
- Redux Toolkit with thunk middleware
- Redux Persist + AsyncStorage
- Axios
- `@react-native-community/netinfo`

## Project Structure

```text
src/
  components/
  hooks/
  navigation/
  screens/
  services/
  store/
  theme/
  types/
```

## Setup

```bash
npm install
```

## Run the App

### 1. Start Metro

```bash
npm start
```

### 2. Run Android

```bash
npm run android
```

### 3. Run iOS

```bash
bundle install
cd ios && bundle exec pod install && cd ..
npm run ios
```

## Quality Checks

```bash
npm run lint
npx tsc --noEmit
npm test -- --runInBand --watchAll=false
```

## Login Rules

- Any email containing `@` is accepted
- Password must be at least `8` characters

## Architecture Notes

- `auth` slice stores session state and last login metadata
- `users` slice stores directory data, cached API response, favorites, and notes
- `settings` slice stores theme preference
- Persisted cache makes the last successful directory load available offline
- Custom hooks keep screen logic compact and reusable

## What I’d Improve With More Time

- Add a dedicated settings screen and richer theme system
- Add integration tests for login, offline flow, and favorites persistence
- Improve avatar/loading animations with a richer shimmer effect
- Add stronger deep-link handling when opening a profile before data is cached

## Demo Flow

1. App launch and splash auth check
2. Login success
3. Browse users and search
4. Open profile and add to favorites
5. Show favorites tab and saved note
6. Turn network off to show cached/offline mode
7. Logout and clear persisted session
