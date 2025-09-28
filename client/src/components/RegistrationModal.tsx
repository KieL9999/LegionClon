import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  User, 
  Lock, 
  Mail, 
  Eye,
  EyeOff,
  Check,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const registrationSchema = z.object({
  username: z.string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(16, "El nombre de usuario no puede tener más de 16 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Solo se permiten letras, números y guión bajo"),
  email: z.string()
    .email("Ingresa un email válido")
    .min(1, "El email es requerido"),
  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(32, "La contraseña no puede tener más de 32 caracteres"),
  confirmPassword: z.string().min(1, "Confirma tu contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function RegistrationModal({ open, onOpenChange }: RegistrationModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: Omit<RegistrationForm, 'confirmPassword'>) => {
      const response = await apiRequest('POST', '/api/register', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "¡Cuenta creada exitosamente!",
        description: "Ya puedes iniciar sesión y comenzar tu aventura en Legion Plus.",
      });
      
      onOpenChange(false);
      form.reset();
      
      // Invalidate relevant queries if any
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Hubo un problema. Por favor intenta de nuevo.";
      
      toast({
        title: "Error al crear cuenta",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: RegistrationForm) => {
    const { confirmPassword, ...registrationData } = data;
    registerMutation.mutate(registrationData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gradient-to-br from-background to-card border-gaming-gold/20" data-testid="modal-registration">
        <DialogHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gaming-gold/10 rounded-full border border-gaming-gold/20">
              <Shield className="w-8 h-8 text-gaming-gold" />
            </div>
          </div>
          
          <DialogTitle className="text-2xl font-gaming font-bold text-gaming-gold">
            Crear Cuenta
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Únete a miles de aventureros en Legion Plus
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-foreground">
              Nombre de Usuario
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Tu nombre de usuario"
                className="pl-10"
                data-testid="input-username"
                {...form.register("username")}
              />
            </div>
            {form.formState.errors.username && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Correo Electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="pl-10"
                data-testid="input-email"
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                className="pl-10 pr-10"
                data-testid="input-password"
                {...form.register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                data-testid="button-toggle-password"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirmar Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirma tu contraseña"
                className="pl-10 pr-10"
                data-testid="input-confirm-password"
                {...form.register("confirmPassword")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                data-testid="button-toggle-confirm-password"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Separator className="my-4" />

          {/* Requirements Info */}
          <div className="bg-card/40 border border-gaming-gold/20 rounded-lg p-3">
            <h4 className="font-semibold text-foreground mb-2 text-sm flex items-center gap-2">
              <Check className="w-4 h-4 text-gaming-emerald" />
              Requisitos de la cuenta:
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Usuario: 3-16 caracteres (solo letras, números y _)</li>
              <li>• Contraseña: mínimo 6 caracteres</li>
              <li>• Email válido para recuperación de cuenta</li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-gaming-gold to-yellow-500 hover:from-yellow-500 hover:to-gaming-gold text-black font-bold"
            disabled={registerMutation.isPending}
            data-testid="button-register"
          >
            {registerMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Creando cuenta...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Crear Cuenta
              </>
            )}
          </Button>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Button 
              variant="ghost" 
              className="p-0 h-auto text-gaming-gold hover:text-yellow-400 underline font-normal"
              onClick={() => {
                // TODO: Replace with real login functionality
                console.log('Login clicked');
              }}
              data-testid="button-login-link"
            >
              Iniciar Sesión
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}