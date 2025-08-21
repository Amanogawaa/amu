"use server";

import { createClient } from "@/utils/supabase/server";
import { AUTHSCHEMA, AuthState } from "@/utils/types";
import z from "zod";

const loginAction = async (formData: FormData): Promise<object> => {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = AUTHSCHEMA.safeParse(data);

  if (!result.success) {
    const error = z.treeifyError(result.error);
    throw new Error(
      JSON.stringify({
        email: error.properties?.email?.errors[0],
        password: error.properties?.password?.errors[0],
      })
    );
  }

  const { data: AuthData, error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return AuthData;
};

export const login = async (
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> => {
  try {
    const res = await loginAction(formData);

    return { data: res, errors: null };
  } catch (error) {
    if (error instanceof Error) {
      try {
        const parsedErrors = JSON.parse(error.message);
        return { data: null, errors: parsedErrors };
      } catch {
        return { data: null, errors: { general: error.message } };
      }
    }

    return { data: null, errors: { general: "An unexpected error occurred" } };
  }
};
