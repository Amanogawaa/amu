import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        return {
          email: params.email as string,
          firstName: params.firstName as string,
          lastName: params.lastName as string,
          program: params.program as string,
          year: Number(params.year),
          school: params.school as string,
        };
      },
    }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) {
        return args.existingUserId;
      }

      const { profile } = args;
      return await ctx.db.insert("users", {
        email: profile.email,
        firstName: profile.firstName as string,
        lastName: profile.lastName as string,
        program: profile.program as string,
        year: profile.year as number,
        school: profile.school as string,
      });
    },
  },
});
