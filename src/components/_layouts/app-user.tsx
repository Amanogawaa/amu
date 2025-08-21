import { signout } from "./action";

export default async function SignOutButton({ user }: { user: object }) {
  console.log(user);

  return (
    <>
      <button
        onClick={signout}
        className="bg-slate-200 dark:bg-slate-800 text-foreground rounded-md px-2 py-1"
      >
        Sign out hee
      </button>
    </>
  );
}
