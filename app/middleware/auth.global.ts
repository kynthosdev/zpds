// Define the routes you want to protect with `createRouteMatcher()`
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)'])

export default defineNuxtRouteMiddleware((to) => {
  // Use the `useAuth()` composable to access the `isSignedIn` property
  const { isSignedIn } = useAuth()

  // Check if the user is not signed in and is trying to access a protected route
  // If so, redirect them to the sign-in page
  if (!isSignedIn.value && isProtectedRoute(to)) {
    return navigateTo('/login')
  }
})
