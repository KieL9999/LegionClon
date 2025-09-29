import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, type LoginData } from "@shared/schema";
import { Loader2, LogIn } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess?: (user: any) => void;
}

export default function LoginModal({ open, onOpenChange, onLoginSuccess }: LoginModalProps) {
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    try {
      setIsLoading(true);
      await login(data.username, data.password);
      
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión exitosamente",
      });
      
      // Call the success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess(null); // The user data is now available through context
      }
      
      // Reset form and close modal
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-gaming text-gaming-gold flex items-center gap-2">
            <LogIn className="w-6 h-6" />
            Iniciar Sesión
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Accede a tu cuenta de AetherWoW para participar en el foro y disfrutar de todas las funciones.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Nombre de usuario</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tu nombre de usuario"
                      className="bg-background border-border focus:border-gaming-gold"
                      data-testid="input-login-username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Tu contraseña"
                      className="bg-background border-border focus:border-gaming-gold"
                      data-testid="input-login-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full bg-gaming-gold hover:bg-gaming-gold/90 text-black font-medium"
                disabled={isLoading}
                data-testid="button-submit-login"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <button
                  type="button"
                  className="p-0 h-auto text-gaming-gold hover:text-gaming-gold/80 underline bg-transparent border-none cursor-pointer"
                  onClick={() => {
                    onOpenChange(false);
                    // Here you could open the registration modal
                  }}
                  data-testid="link-register-from-login"
                >
                  Regístrate aquí
                </button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}