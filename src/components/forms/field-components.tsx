import { cn } from "@/lib/utils";
import { type ComponentType } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const AuthForm = ({
  className,
  label,
  icon: Icon,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  ...props
}: {
  className?: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  type?: string;
}) => {
  return (
    <div className="relative grid gap-2">
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none text-custom_foreground absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4" />
        )}
        <Label className="sr-only" aria-hidden="true">
          {label}
        </Label>
        <Input
          type={type}
          placeholder={label}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={cn(
            "rounded-xl border border-Winter_Teal placeholder:text-sm p-6 pl-12 active:border-Winter_Teal focus:border-Winter_Teal focus:outline-none focus-visible:ring-0",
            error && "border-red-500",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

const AuthButton = ({
  text,
  disabled = false,
  ...props
}: {
  text: string;
  disabled?: boolean;
}) => {
  return (
    <Button
      type="submit"
      disabled={disabled}
      className={cn(
        "w-full bg-Evergreen_Dusk rounded-2xl cursor-pointer p-6 text-sm font-inter font-semibold text-white hover:bg-custom_foreground/80 hover:ease-in",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      {...props}
    >
      {text}
    </Button>
  );
};

export { AuthForm, AuthButton };
