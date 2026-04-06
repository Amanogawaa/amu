export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
  session: {
    absolute: 30 * 24 * 60 * 60 * 1000,
  },
};
