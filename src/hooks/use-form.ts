import { AuthButton, AuthForm } from "@/components/forms/field-components";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

const { fieldContext, formContext } = createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    AuthForm,
  },
  formComponents: {
    AuthButton,
  },
  fieldContext,
  formContext,
});
