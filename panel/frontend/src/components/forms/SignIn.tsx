import { signInUser } from "@/api/auth/auth";
import { useAuthContext } from "@/api/auth/AuthProvider";
import { SignInFormSchema, SignInFormType } from "@/lib/schema";
import { getDefaultZodValues } from "@/lib/utils";
import CheckboxWithLabel from "@@/CheckboxWithLabel";
import PasswordField from "@@/forms/fields/PasswordField";
import TextLink from "@@/TextLink";
import ThemeToggle from "@@/ThemeToggle";
import { Button } from "@@/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@@/ui/card";
import { Form } from "@@/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import InputField from "./fields/InputField";

export default function SignIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuthContext();

  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<SignInFormType>({
    resolver: zodResolver(SignInFormSchema(t)),
    mode: "onBlur",
    defaultValues: getDefaultZodValues(SignInFormSchema(t)),
  });

  const handleSubmit = async (formData: SignInFormType) => {
    try {
      setIsSubmitting(true);
      await signInUser(
        formData.username,
        formData.password,
        rememberMe,
        navigate,
        "/dashboard",
        checkAuthStatus
      );
    } catch (error) {
      // Error is already handled by handleAuthOperation
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {t("form.auth.sign_in.title")}
          </CardTitle>
          <CardDescription>
            {t("form.auth.sign_in.description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-2"
            >
              <InputField
                name="username"
                label={t("form.label.username")}
                placeholder={t("form.placeholder.auth.username")}
                disabled={isSubmitting}
              />

              <PasswordField
                name="password"
                label={t("form.label.password")}
                placeholder={t("form.placeholder.auth.password")}
                showGenerator={false}
                disabled={isSubmitting}
              />

              <div className="space-y-0">
                <div className="text-right">
                  <TextLink
                    to="/signIn/forgotPassword"
                    text={t("form.auth.sign_in.forgot_password")}
                  />
                </div>

                <CheckboxWithLabel
                  label={t("form.auth.sign_in.remember_me")}
                  checked={rememberMe}
                  onChange={setRememberMe}
                  disabled={isSubmitting}
                />
              </div>

              <Button className="w-full mt-2" type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? t("form.common.submitting") 
                  : t("form.auth.sign_in.button")}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col">
          <div className="text-sm">
            {t("form.auth.sign_in.switch")}{" "}
            <TextLink to="/signUp" text={t("form.auth.sign_in.link")} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
