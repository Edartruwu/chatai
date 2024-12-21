"use client";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addNewUser, NewChatUserResponse } from "@/server/chat/addNewUser";
import { motion } from "framer-motion";

const occupationKeys = [
  "universityTeacher",
  "researcher",
  "socialScienceProfessional",
  "journalist",
  "universityStudent",
  "programmer",
  "platformWorker",
  "other",
] as const;

const genderKeys = ["male", "female", "other", "preferNotToSay"] as const;

const formSchema = z.object({
  edad: z.coerce.number().min(1, {
    message: "invalidAge",
  }),
  ocupacion: z
    .union([z.enum(occupationKeys), z.string()])
    .refine((val) => val !== "", {
      message: "selectOccupation",
    }),
  genero: z.enum([...genderKeys, ""], {
    errorMap: () => ({ message: "selectGender" }),
  }),
  otroGenero: z.string().optional(),
  ubicacion: z.string().min(1, {
    message: "Please enter your location",
  }),
});

export type UserFormValues = z.infer<typeof formSchema>;

const MotionCard = motion(Card);
const MotionCardContent = motion(CardContent);
const MotionButton = motion(Button);

export function UserProfileForm(): JSX.Element {
  const t = useTranslations("userForm");
  const { toast } = useToast();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      edad: undefined,
      ocupacion: "",
      genero: "",
      otroGenero: "",
      ubicacion: "",
    },
  });

  function onSubmit(values: UserFormValues): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      addNewUser(values)
        .then((res: NewChatUserResponse) => {
          const requiredFields: (keyof NewChatUserResponse)[] = [
            "id",
            "age",
            "gender",
            "ocupation",
          ];
          function isValidField(field: keyof NewChatUserResponse): boolean {
            if (field === "age") {
              return typeof res[field] === "number";
            }
            return typeof res[field] === "string";
          }
          let isValid = true;
          for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (!isValidField(field)) {
              isValid = false;
              break;
            }
          }
          if (isValid) {
            localStorage.setItem("chatUserData", JSON.stringify(res));
            toast({ title: t("welcome_toast") });
            resolve();
          } else {
            throw new Error(
              "Response does not contain the required fields or they are of the wrong type.",
            );
          }
        })
        .catch((error) => {
          toast({
            description: t("error_toast"),
            variant: "destructive",
          });
          reject(error);
        })
        .finally(() => {
          location.reload();
        });
    });
  }

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <CardHeader className="flex flex-col items-center justify-center gap-2">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CardTitle className="text-2xl font-bold">{t("welcome")}</CardTitle>
        </motion.div>
        <CardDescription className="text-center">
          {t("formDescription")}
        </CardDescription>
      </CardHeader>
      <MotionCardContent
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="ocupacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("occupation")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("occupationPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {occupationKeys.map((key) => (
                        <SelectItem key={key} value={key}>
                          {t(`occupations.${key}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.value === "other" && (
                    <Input
                      placeholder={t("occupationPlaceholder")}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="edad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("age")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("agePlaceholder")}
                      min={1}
                      max={100}
                      {...field}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value);
                        field.onChange(value);
                      }}
                      value={field.value === undefined ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("gender")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("genderPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genderKeys.map((key) => (
                        <SelectItem key={key} value={key}>
                          {t(`genders.${key}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("genero") === "other" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FormField
                  control={form.control}
                  name="otroGenero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("otherGender")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("otherGenderPlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
            <FormField
              control={form.control}
              name="ubicacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("location")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("locationPlaceholder")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <MotionButton
              className="w-full"
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("submit")}
            </MotionButton>
          </form>
        </Form>
      </MotionCardContent>
    </MotionCard>
  );
}
