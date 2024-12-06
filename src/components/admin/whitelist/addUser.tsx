"use client";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AddAdmin } from "@/server/addAdmin";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

function AddUserModal() {
  const t = useTranslations("whitelist");

  const formSchema = z.object({
    email: z.string().email({ message: t("invalidEmail") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await AddAdmin(values.email);
      toast({
        title: t("adminAddedTitle"),
        description: t("adminAddedDescription", { email: values.email }),
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      toast({
        description: t("errorDescription", { error: JSON.stringify(error) }),
        variant: "destructive",
      });
    } finally {
      await form.reset();
      location.reload();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{t("addAdmin")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addNewAdmin")}</DialogTitle>
          <DialogDescription>{t("addNewAdminDescription")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-row items-center justify-center gap-3"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("emailToAdd")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("emailPlaceholder")}
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("emailDescription")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{t("addAdmin")}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { AddUserModal };
