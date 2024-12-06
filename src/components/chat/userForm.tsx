"use client";
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

const occupations = [
  "Abogado",
  "Médico",
  "Ingeniero",
  "Profesor",
  "Diseñador",
  "Contador",
  "Arquitecto",
  "Enfermero",
  "Programador",
  "Otro",
] as const;

const genders = ["Masculino", "Femenino", "Otro", "Prefiero no decir"] as const;

const formSchema = z.object({
  edad: z.coerce.number().min(1, {
    message: "Edad no válida",
  }),
  ocupacion: z.enum(occupations, {
    errorMap: () => ({ message: "Por favor, selecciona una ocupación." }),
  }),
  genero: z.enum([...genders, ""], {
    errorMap: () => ({ message: "Por favor, selecciona un género." }),
  }),
  otroGenero: z.string().optional(),
});

export type UserFormValues = z.infer<typeof formSchema>;

const MotionCard = motion(Card);
const MotionCardContent = motion(CardContent);
const MotionButton = motion(Button);

export function UserProfileForm() {
  const { toast } = useToast();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      edad: undefined,
      ocupacion: undefined,
      genero: "",
      otroGenero: "",
    },
  });

  async function onSubmit(values: UserFormValues): Promise<void> {
    try {
      const res: NewChatUserResponse = await addNewUser(values);
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
        toast({ title: "Hola! Bienvenido al ODP-CHAT" });
      } else {
        throw new Error(
          "Response does not contain the required fields or they are of the wrong type.",
        );
      }
    } catch (error) {
      toast({
        description: `${error}`,
        variant: "destructive",
      });
    } finally {
      location.reload();
    }
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
          <CardTitle className="text-2xl font-bold">
            Bienvenido a ODP-CHAT
          </CardTitle>
        </motion.div>
        <CardDescription className="text-center">
          Por favor, completa tu información personal para continuar.
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
                  <FormLabel>Ocupación</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu ocupación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {occupations.map((occupation) => (
                        <SelectItem key={occupation} value={occupation}>
                          {occupation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="edad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Cuántos años tienes?</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ingresa tu edad"
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
                  <FormLabel>Género</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu género" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genders.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("genero") === "Otro" && (
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
                      <FormLabel>Especifica tu género</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ingresa tu género" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
            <MotionButton
              className="w-full"
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Empezar!
            </MotionButton>
          </form>
        </Form>
      </MotionCardContent>
    </MotionCard>
  );
}
