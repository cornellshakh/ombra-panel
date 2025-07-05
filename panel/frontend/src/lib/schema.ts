import { t } from "i18next";
import { z } from "zod";
import { isStringEmpty } from "./utils";

// ----------------------------------------
// When item is marked as optional, it means that the BE will process it
// or FE will handle it. It's not required to be sent from the client.
// ----------------------------------------

export const REQUIRED_LENGTH = 1;
export const MAX_NAME_LENGTH = 50;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 30;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 60;
export const MAX_DESCRIPTION_LENGTH = 255;
export const MIN_COLOR_LENGTH = 3;
export const MAX_COLOR_LENGTH = 7;
export const MAX_HWID_LENGTH = 200;
export const MAX_REASON_LENGTH = 255;

const IdSchema = z.number().nonnegative().int().optional();

const NameSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z
    .string()
    .min(REQUIRED_LENGTH, { message: `${t("form.error.required.text")}` })
    .max(MAX_NAME_LENGTH, {
      message: `${t("form.error.required.length.name_max", { length: MAX_NAME_LENGTH })}`,
    });

const DescriptionSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z.string().max(MAX_DESCRIPTION_LENGTH, {
    message: `${t("form.error.required.length.description_max", { length: MAX_DESCRIPTION_LENGTH })}`,
  });

export const ColorSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z
    .string()
    .min(MIN_COLOR_LENGTH, `${t("form.error.required.text")}`)
    .max(
      MAX_COLOR_LENGTH,
      `${t("form.error.required.length.color_max", { length: MAX_COLOR_LENGTH })}`
    )
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
      message: `${t("form.error.required.valid.color_hex")}`,
    });

const UserNameSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z
    .string()
    .min(MIN_USERNAME_LENGTH, {
      message: `${t("form.error.required.length.username_min", { length: MIN_USERNAME_LENGTH })}`,
    })
    .max(MAX_USERNAME_LENGTH, {
      message: `${t("form.error.required.length.username_max", { length: MAX_USERNAME_LENGTH })}`,
    });

const EmailSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z
    .string()
    .min(REQUIRED_LENGTH, { message: `${t("form.error.required.text")}` })
    .email({ message: `${t("form.error.required.valid.email")}` });

const PasswordSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z
    .string()
    .min(MIN_PASSWORD_LENGTH, {
      message: `${t("form.error.required.length.password_min", { length: MIN_PASSWORD_LENGTH })}`,
    })
    .max(MAX_PASSWORD_LENGTH, {
      message: `${t("form.error.required.length.password_max", { length: MAX_PASSWORD_LENGTH })}`,
    });

const ConfirmPasswordSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z
    .string()
    .min(MIN_PASSWORD_LENGTH, {
      message: `${t("form.error.required.length.password_min", { length: MIN_PASSWORD_LENGTH })}`,
    })
    .max(MAX_PASSWORD_LENGTH, {
      message: `${t("form.error.required.length.password_max", { length: MAX_PASSWORD_LENGTH })}`,
    });

const HWIDSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z.string().max(MAX_HWID_LENGTH, {
    message: `${t("form.error.required.length.HWID_max", { length: MAX_HWID_LENGTH })}`,
  });

const DateRangeSchema = z.object({
  start: z.date().nullable().default(null),
  end: z.date().nullable().default(null),
});

export const RoleSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z
    .object({
      roleId: IdSchema,
      name: NameSchema(t),
      description: DescriptionSchema(t),
      color: ColorSchema(t),
      permissions: z.array(PermissionSchema(t)).default([]),
    })
    .refine((data) => !isStringEmpty(data.name), {
      message: `${t("form.error.required.text")}`,
      path: ["name"],
    })
    .refine((data) => !isStringEmpty(data.description), {
      message: `${t("form.error.required.text")}`,
      path: ["description"],
    })
    .refine((data) => !isStringEmpty(data.color), {
      message: `${t("form.error.required.text")}`,
      path: ["color"],
    });

export type Role = z.infer<ReturnType<typeof RoleSchema>>;

export const PermissionSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z
    .object({
      permissionId: IdSchema,
      name: NameSchema(t),
      description: DescriptionSchema(t),
    })
    .refine((data) => !isStringEmpty(data.name), {
      message: `${t("form.error.required.text")}`,
      path: ["name"],
    })
    .refine((data) => !isStringEmpty(data.description), {
      message: `${t("form.error.required.text")}`,
      path: ["description"],
    });
export type Permission = z.infer<ReturnType<typeof PermissionSchema>>;

export const GameTypeSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z
    .object({
      gameTypeId: IdSchema,
      name: NameSchema(t),
      description: DescriptionSchema(t),
      color: ColorSchema(t),
    })
    .refine((data) => !isStringEmpty(data.name), {
      message: `${t("form.error.required.text")}`,
      path: ["name"],
    })
    .refine((data) => !isStringEmpty(data.description), {
      message: `${t("form.error.required.text")}`,
      path: ["description"],
    })
    .refine((data) => !isStringEmpty(data.color), {
      message: `${t("form.error.required.text")}`,
      path: ["color"],
    });
export type GameType = z.infer<ReturnType<typeof GameTypeSchema>>;

export const GameSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z
    .object({
      gameId: IdSchema,
      name: NameSchema(t),
      gameType: GameTypeSchema(t).nullable().default(null),
      color: ColorSchema(t),
    })
    .refine((data) => !isStringEmpty(data.name), {
      message: `${t("form.error.required.text")}`,
      path: ["name"],
    })
    .refine((data) => data.gameType !== null, {
      message: `${t("form.error.required.text")}`,
      path: ["gameType"],
    })
    .refine((data) => !isStringEmpty(data.color), {
      message: `${t("form.error.required.text")}`,
      path: ["color"],
    });
export type Game = z.infer<ReturnType<typeof GameSchema>>;

export const ThemeSchema = z.enum(["light", "dark", "system"]);
export type Theme = z.infer<typeof ThemeSchema>;

export const ThemeOptions = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
): Record<Theme, string> => ({
  light: t("settings.theme.light"),
  dark: t("settings.theme.dark"),
  system: t("settings.theme.system"),
});

export const DateFormatSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z.enum([
    `${t("settings.date.day_abbr")}${t("settings.date.day_abbr")}.${t("settings.date.month_abbr")}${t("settings.date.month_abbr")}.${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}`,
    `${t("settings.date.day_abbr")}${t("settings.date.day_abbr")}-${t("settings.date.month_abbr")}${t("settings.date.month_abbr")}-${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}`,
    `${t("settings.date.day_abbr")}${t("settings.date.day_abbr")}/${t("settings.date.month_abbr")}${t("settings.date.month_abbr")}/${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}`,
    `${t("settings.date.month_abbr")}${t("settings.date.month_abbr")}/${t("settings.date.day_abbr")}${t("settings.date.day_abbr")}/${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}`,
    `${t("settings.date.month_abbr")}${t("settings.date.month_abbr")}-${t("settings.date.day_abbr")}${t("settings.date.day_abbr")}-${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}`,
    `${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}/${t("settings.date.month_abbr")}${t("settings.date.month_abbr")}/${t("settings.date.day_abbr")}${t("settings.date.day_abbr")}`,
    `${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}-${t("settings.date.month_abbr")}${t("settings.date.month_abbr")}-${t("settings.date.day_abbr")}${t("settings.date.day_abbr")}`,
  ]);
export type DateFormat = z.infer<ReturnType<typeof DateFormatSchema>>;

export const DateFormatOptions = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
): Record<DateFormat, string> => ({
  "DD.MM.YYYY": `${t("settings.date.day")}.${t("settings.date.month")}.${t("settings.date.year")} (EU)`,
  "DD-MM-YYYY": `${t("settings.date.day")}-${t("settings.date.month")}-${t("settings.date.year")} (EU)`,
  "DD/MM/YYYY": `${t("settings.date.day")}/${t("settings.date.month")}/${t("settings.date.year")} (EU)`,
  "MM/DD/YYYY": `${t("settings.date.month")}/${t("settings.date.day")}/${t("settings.date.year")} (US)`,
  "MM-DD-YYYY": `${t("settings.date.month")}-${t("settings.date.day")}-${t("settings.date.year")} (US)`,
  "YYYY/MM/DD": `${t("settings.date.year")}/${t("settings.date.month")}/${t("settings.date.day")} (ASIA)`,
  "YYYY-MM-DD": `${t("settings.date.year")}-${t("settings.date.month")}-${t("settings.date.day")} (ASIA)`,
});

export const TimeFormatSchema = z.enum(["12", "24"]);
export type TimeFormat = z.infer<typeof TimeFormatSchema>;

export const CurrencyFormatSchema = z.enum(["EUR", "USD", "RUB", "CNY"]);
export type CurrencyFormat = z.infer<typeof CurrencyFormatSchema>;

type CurrencyDetail = {
  description: string;
  locale: string;
};

export const CurrencyOptions = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
): Record<CurrencyFormat, CurrencyDetail> => ({
  EUR: { description: `${t("settings.currency.euro")} (€)`, locale: "de-DE" },
  USD: { description: `${t("settings.currency.dollar")} ($)`, locale: "en-US" },
  RUB: { description: `${t("settings.currency.ruple")} (₽)`, locale: "ru-RU" },
  CNY: { description: `${t("settings.currency.yuan")} (¥)`, locale: "zh-CN" },
});

export const SettingsSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z.object({
    settingId: z.number().nonnegative().int(),
    theme: ThemeSchema.default("system"), // not on the BE
    language: z.string().max(2).default("en"),
    date: DateFormatSchema(t).default(
      `${t("settings.date.day_abbr")}${t("settings.date.day_abbr")}.${t("settings.date.month_abbr")}${t("settings.date.month_abbr")}.${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}${t("settings.date.year_abbr")}`
    ),
    time: TimeFormatSchema.default("24"),
    currency: CurrencyFormatSchema.default("USD"),
  });
export type Settings = z.infer<ReturnType<typeof SettingsSchema>>;

export const UserStatusSchema = z.enum([
  "active",
  "banned",
  "frozen",
  "inactive",
]);
export type UserStatus = z.infer<typeof UserStatusSchema>;

export const UserStatusColorMap: Record<UserStatus, string> = {
  active: "#10B981",
  banned: "#EF4444",
  frozen: "#F59E0B",
  inactive: "#6B7280",
};

export const UserStatusOptions = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
): Record<UserStatus, string> => ({
  active: t("user.status.active"),
  banned: t("user.status.banned"),
  frozen: t("user.status.frozen"),
  inactive: t("user.status.inactive"),
});

export const ListingStatusSchema = z.enum(["active", "inactive"]);

export const UserSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z
    .object({
      userId: IdSchema,
      username: UserNameSchema(t),
      email: EmailSchema(t),
      password: PasswordSchema(t).optional(),
      HWID: HWIDSchema(t).nullable().default(null),
      registerDate: z.date().optional(),
      registerIP: z.string().max(40).optional(),
      subscription: DateRangeSchema.nullable().default(null),
      lastLogin: z.date().nullable().optional(),
      lastEdit: z.date().optional(),
      lastIP: z.string().max(40).optional(),
      status: UserStatusSchema.default("inactive"),
      roles: z.array(RoleSchema(t)).default([]),
      games: z.array(GameSchema(t)).optional(),
    })
    .refine((data) => !isStringEmpty(data.username), {
      message: `${t("form.error.required.text")}`,
      path: ["username"],
    })
    .refine((data) => !isStringEmpty(data.email), {
      message: `${t("form.error.required.text")}`,
      path: ["email"],
    })
    .refine(
      (data) =>
        !(
          (data.subscription === null || data.subscription.start === null) &&
          data.games !== undefined &&
          data?.games!.length > 0
        ),
      {
        message: t("form.error.empty.user_games_without_subscription"),
        path: ["subscription"],
      }
    )
    .refine(
      (data) =>
        !(
          data.subscription &&
          data.games !== undefined &&
          data?.games!.length === 0
        ),
      {
        message: t("form.error.empty.user_subscription_without_game"),
        path: ["games"],
      }
    );
export type User = z.infer<ReturnType<typeof UserSchema>>;

export const UserIdentitySchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z.object({
    userId: IdSchema,
    username: UserNameSchema(t),
    email: EmailSchema(t),
    roles: z.array(z.string()),
    permissions: z.array(z.string()),
  });

export type UserIdentity = z.infer<ReturnType<typeof UserIdentitySchema>>;

export const SessionStatusSchema = z.enum(["connected", "disconnected"]);
export type SessionStatus = z.infer<typeof SessionStatusSchema>;

export const SessionStatusOptions = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
): Record<SessionStatus, string> => ({
  connected: t("session.status.connected"),
  disconnected: t("session.status.disconnected"),
});

export const SessionSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z.object({
    sessionId: IdSchema,
    user: UserSchema(t),
    game: GameSchema(t),
    status: SessionStatusSchema,
    createdAt: z.date().optional(),
  });
export type Session = z.infer<ReturnType<typeof SessionSchema>>;

export const SessionLogsSchema = z.object({
  sessionLogId: IdSchema,
  sessionId: IdSchema,
});
export type SessionLogs = z.infer<typeof SessionLogsSchema>;

export const SuspensionStatusSchema = z.enum(["banned", "frozen"]);
export type SuspensionStatus = z.infer<typeof SuspensionStatusSchema>;

export const SuspensionStatusColorMap: Record<SuspensionStatus, string> = {
  banned: "#EF4444",
  frozen: "#F59E0B",
};

export const SuspensionStatusOptions = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
): Record<SuspensionStatus, string> => ({
  banned: t("suspension.status.banned"),
  frozen: t("suspension.status.frozen"),
});

export const SuspensionSchema = z.object({
  suspensionId: IdSchema,
  user: UserSchema(t),
  status: SuspensionStatusSchema,
  reason: z
    .string()
    .min(REQUIRED_LENGTH, { message: t("form.error.required.text") })
    .max(MAX_REASON_LENGTH, {
      message: t("form.error.required.length.reason_max", {
        length: MAX_REASON_LENGTH,
      }),
    }),
  HWID: HWIDSchema(t).nullable(),
  suspendedBy: UserSchema(t),
  suspension: DateRangeSchema.nullable().default(null),
  isActive: z.boolean().default(true),
  lastEdit: z.date().optional(),
});
export type Suspension = z.infer<typeof SuspensionSchema>;

export const KeySchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z
    .object({
      keyId: IdSchema,
      key: z.string().max(200).optional(),
      gameType: GameTypeSchema(t).nullable().default(null),
      game: GameSchema(t).nullable().default(null),
      createdBy: UserSchema(t).optional(),
      usedBy: UserSchema(t).nullable().default(null),
      createdAt: z.date().optional(),
      usedAt: z.date().nullable().default(null),
      isUsed: z.boolean().nullable().optional(),
    })
    .refine((data) => !(data.gameType === null), {
      message: `${t("form.error.required.text")}`,
      path: ["gameType"],
    })
    .refine((data) => !(data.game === null), {
      message: `${t("form.error.required.text")}`,
      path: ["game"],
    });
export type Key = z.infer<ReturnType<typeof KeySchema>>;

export const LogLevel = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z.enum([
    `${t("logs.level.INFO")}`,
    `${t("logs.level.ERROR")}`,
    `${t("logs.level.WARNING")}`,
    `${t("logs.level.DEBUG")}`,
  ]);
export type LogLevel = z.infer<ReturnType<typeof LogLevel>>;

export const LogLevelOptions = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
): Record<LogLevel, string> => ({
  INFO: t("logs.level.INFO"),
  ERROR: t("logs.level.ERROR"),
  WARNING: t("logs.level.WARNING"),
  DEBUG: t("logs.level.DEBUG"),
});

export const LogMethod = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z.enum([
    `${t("logs.method.GET")}`,
    `${t("logs.method.POST")}`,
    `${t("logs.method.PUT")}`,
    `${t("logs.method.DELETE")}`,
    `${t("logs.method.PATH")}`,
  ]);
export type LogMethod = z.infer<ReturnType<typeof LogMethod>>;

export const LogMethodOptions = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
): Record<LogMethod, string> => ({
  GET: t("logs.method.GET"),
  POST: t("logs.method.POST"),
  PUT: t("logs.method.PUT"),
  DELETE: t("logs.method.DELETE"),
});

export const ServerLogSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z.object({
    createdAt: z.date(),
    level: LogLevel(t),
    functionName: z.string(),
    lineNumber: z.string(),
    method: LogMethod(t),
    endpoint: z.string(),
    message: z.string(),
  });
export type ServerLog = z.infer<ReturnType<typeof ServerLogSchema>>;

export const SignInFormSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z.object({
    username: UserNameSchema(t),
    password: PasswordSchema(t),
  });
export type SignInFormType = z.infer<ReturnType<typeof SignInFormSchema>>;

export const SignUpFormSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z
    .object({
      username: UserNameSchema(t),
      email: EmailSchema(t),
      password: PasswordSchema(t),
      confirmPassword: ConfirmPasswordSchema(t),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: `${t("form.error.required.password_match")}`,
      path: ["confirmPassword"],
    });
export type SignUpFormType = z.infer<ReturnType<typeof SignUpFormSchema>>;

export const DiscountSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z.object({
    discountId: IdSchema,
    name: z.string().max(50, {
      message: t("form.error.required.valid.name"),
    }),
    duration: DateRangeSchema.nullable().default(null),
    discount: z
      .number()
      .nonnegative()
      .min(0)
      .max(1, {
        message: t("form.error.required.valid.discount"),
      }), // Represents the percentage discount, e.g., 0.10 for 10%
    isActive: z.boolean().default(true),

    intendedListings: z.array(IdSchema).default([]).optional(),

    listingsId: z.array(IdSchema).default([]).optional(),
  });
export type Discount = z.infer<ReturnType<typeof DiscountSchema>>;

export const ListingSchema = (
  t: (
    arg: string,
    options?: Record<string, string | number | undefined>
  ) => string
) =>
  z.object({
    listingId: IdSchema,
    name: NameSchema(t),
    description: DescriptionSchema(t),
    game: GameSchema(t),
    price: z
      .number()
      .nonnegative()
      .min(0.01, {
        message: t("form.error.required.valid.price"),
      }),
    copies: z
      .number()
      .nonnegative()
      .int()
      .min(1, {
        message: t("form.error.required.valid.copies"),
      }),
    sold: z.number().nonnegative().int().default(0).optional(),
    isActive: z.boolean().default(true),
    discount: DiscountSchema(t).nullable().optional(),
    duration: DateRangeSchema.nullable().default(null),
  });

export type Listing = z.infer<ReturnType<typeof ListingSchema>>;
