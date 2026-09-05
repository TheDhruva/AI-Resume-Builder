export default {
  providers: [
    {
      // npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<subdomain>.clerk.accounts.dev
      // Clerk Dashboard → JWT Templates → create template named "convex"
      domain:
        process.env.CLERK_JWT_ISSUER_DOMAIN ||
        "https://mighty-narwhal-24.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
