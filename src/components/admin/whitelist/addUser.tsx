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

const formSchema = z.object({
  email: z.string().email({ message: "Añade un email valido" }),
});

function AddUserModal() {
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
        title: "Admin añadido correctamente",
        description: `nuevo admin con email ${values.email} ha sido añadido`,
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      toast({
        description: `error ${JSON.stringify(error)}`,
        variant: "destructive",
      });
    } finally {
      await form.reset();
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Añade un admin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añade un nuevo admin</DialogTitle>
          <DialogDescription>
            Añade una nueva persona para que pueda acceder al dashboard, esta
            persona podrá subir y ver las fuentes de dato existentes y tendrá
            acceso completo al dashboard.
          </DialogDescription>
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
                  <FormLabel>Email a añadir</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="yo@inedge.tech"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Añade el email que quieres que sea admin
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Añadir admin</Button>
          </form>
        </Form>{" "}
      </DialogContent>
    </Dialog>
  );
}

export { AddUserModal };
