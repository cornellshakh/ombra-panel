import { signUpUser } from "@/api/auth/auth";
import { SignUpFormSchema, SignUpFormType } from "@/lib/schema";
import { getDefaultZodValues } from "@/lib/utils";
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
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import InputField from "./fields/InputField";

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm<SignUpFormType>({
    resolver: zodResolver(SignUpFormSchema(t)),
    mode: "onBlur",
    defaultValues: getDefaultZodValues(SignUpFormSchema(t)),
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {t("form.auth.sign_up.title")}
          </CardTitle>
          <CardDescription>
            {t("form.auth.sign_up.description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((formData: SignUpFormType) =>
                signUpUser(
                  formData.username,
                  formData.email,
                  formData.password,
                  navigate,
                  "/signIn"
                )
              )}
              className="space-y-2"
            >
              <InputField
                name="username"
                label={t("form.label.username")}
                placeholder={t("form.placeholder.username")}
              />

              <InputField
                name="email"
                label={t("form.label.email")}
                placeholder={t("form.placeholder.email")}
              />

              <PasswordField
                name="password"
                label={t("form.label.password")}
                placeholder={t("form.placeholder.password")}
              />

              <PasswordField
                name="confirmPassword"
                label={t("form.label.confirm_password")}
                placeholder={t("form.placeholder.auth.confirm_password")}
                showGenerator={false}
              />

              <Button className="w-full" type="submit">
                {t("form.auth.sign_up.button")}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col">
          <div className="text-sm">
            {t("form.auth.sign_up.switch")}{" "}
            <TextLink to="/signIn" text={t("form.auth.sign_up.link")} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
