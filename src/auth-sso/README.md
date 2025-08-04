# Configuration for SSO Authentication

1. Install the necessary dependencies for SSO authentication in your Next.js application. You can use the following command:

2. Create env file in the root of the project with the following content:

# The API URL for the ZasDistributor application

NEXT_PUBLIC_API_URL=https://api.zasdistributor.com/api/

# The URL for the SSO login endpoint

NEXT_PUBLIC_SSO_URL=https://login.zasdistributor.com

# The Secret key for NextAuth.js

NEXTAUTH_SECRET=ZasDistributor

# The url of the Next.js application in production

NEXT_PUBLIC_APP_URL=http://localhost:3000

3.Call the login page on '/' route of your Next.js application. This will redirect the user to the SSO login page.

4. Update the clients config file to include this application as a client adding this production URL to the list of allowed URLs. 