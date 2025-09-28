import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { changePasswordSchema, changeEmailSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, Settings, Shield, Key, Mail } from "lucide-react";
import type { ChangePasswordData, ChangeEmailData } from "@shared/schema";

export function PlayerPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Change password form
  const passwordForm = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Change email form
  const emailForm = useForm<ChangeEmailData>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      newEmail: "",
      password: "",
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordData) => 
      apiRequest("POST", "/api/change-password", data),
    onSuccess: () => {
      toast({
        title: "Contraseña cambiada",
        description: "Tu contraseña ha sido actualizada exitosamente",
      });
      passwordForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo cambiar la contraseña",
        variant: "destructive",
      });
    },
  });

  // Change email mutation
  const changeEmailMutation = useMutation({
    mutationFn: (data: ChangeEmailData) => 
      apiRequest("POST", "/api/change-email", data),
    onSuccess: () => {
      toast({
        title: "Email cambiado",
        description: "Tu email ha sido actualizado exitosamente",
      });
      emailForm.reset();
      // Invalidate user query to refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo cambiar el email",
        variant: "destructive",
      });
    },
  });

  const onPasswordSubmit = (data: ChangePasswordData) => {
    changePasswordMutation.mutate(data);
  };

  const onEmailSubmit = (data: ChangeEmailData) => {
    changeEmailMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acceso Denegado</CardTitle>
            <CardDescription>
              Debes iniciar sesión para acceder al panel del jugador
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <User className="h-8 w-8 text-amber-500" />
              Panel del Jugador
            </h1>
            <p className="text-gray-400">
              Administra tu cuenta y configuraciones
            </p>
          </div>

          {/* User Info Card */}
          <Card className="mb-8 bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-xl">{user.username}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {user.email}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={user.role === "GM" ? "default" : "secondary"}
                    className={user.role === "GM" ? "bg-amber-600 text-white" : ""}
                  >
                    {user.role === "GM" ? "Game Master" : "Jugador"}
                  </Badge>
                  {user.role === "GM" && (
                    <Shield className="h-5 w-5 text-amber-500" />
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
              <TabsTrigger value="profile" className="text-white data-[state=active]:bg-amber-600">
                <User className="h-4 w-4 mr-2" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="security" className="text-white data-[state=active]:bg-amber-600">
                <Settings className="h-4 w-4 mr-2" />
                Seguridad
              </TabsTrigger>
              {user.role === "GM" && (
                <TabsTrigger value="admin" className="text-white data-[state=active]:bg-amber-600">
                  <Shield className="h-4 w-4 mr-2" />
                  Administrador
                </TabsTrigger>
              )}
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Información del Perfil</CardTitle>
                  <CardDescription className="text-gray-400">
                    Información básica de tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Nombre de Usuario</Label>
                      <p className="text-gray-300 bg-gray-700/50 p-2 rounded border">
                        {user.username}
                      </p>
                    </div>
                    <div>
                      <Label className="text-white">Email</Label>
                      <p className="text-gray-300 bg-gray-700/50 p-2 rounded border">
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-white">Rol</Label>
                      <p className="text-gray-300 bg-gray-700/50 p-2 rounded border">
                        {user.role === "GM" ? "Game Master" : "Jugador"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-white">Miembro desde</Label>
                      <p className="text-gray-300 bg-gray-700/50 p-2 rounded border">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "No disponible"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              {/* Change Password */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Key className="h-5 w-5 text-amber-500" />
                    Cambiar Contraseña
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Actualiza tu contraseña para mantener tu cuenta segura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Contraseña Actual</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                data-testid="input-current-password"
                                className="bg-gray-700/50 border-gray-600 text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Nueva Contraseña</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                data-testid="input-new-password"
                                className="bg-gray-700/50 border-gray-600 text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Confirmar Nueva Contraseña</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                data-testid="input-confirm-password"
                                className="bg-gray-700/50 border-gray-600 text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        data-testid="button-change-password"
                        disabled={changePasswordMutation.isPending}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        {changePasswordMutation.isPending ? "Cambiando..." : "Cambiar Contraseña"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Change Email */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mail className="h-5 w-5 text-amber-500" />
                    Cambiar Email
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Actualiza tu dirección de correo electrónico
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                      <FormField
                        control={emailForm.control}
                        name="newEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Nuevo Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                data-testid="input-new-email"
                                placeholder="nuevo@email.com"
                                className="bg-gray-700/50 border-gray-600 text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={emailForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Confirmar con Contraseña</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                data-testid="input-email-password"
                                className="bg-gray-700/50 border-gray-600 text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        data-testid="button-change-email"
                        disabled={changeEmailMutation.isPending}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        {changeEmailMutation.isPending ? "Cambiando..." : "Cambiar Email"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admin Tab (only for GMs) */}
            {user.role === "GM" && (
              <TabsContent value="admin">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-amber-500" />
                      Panel de Administrador
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Funciones exclusivas para Game Masters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-gray-700/50 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Gestión de Usuarios</CardTitle>
                          <CardDescription className="text-gray-400">
                            Administrar cuentas de jugadores
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            data-testid="button-manage-users"
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                            disabled
                          >
                            Próximamente
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-700/50 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Configuración del Servidor</CardTitle>
                          <CardDescription className="text-gray-400">
                            Ajustes del servidor de juego
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            data-testid="button-server-config"
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                            disabled
                          >
                            Próximamente
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-700/50 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Eventos</CardTitle>
                          <CardDescription className="text-gray-400">
                            Crear y gestionar eventos del servidor
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            data-testid="button-manage-events"
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                            disabled
                          >
                            Próximamente
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-700/50 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Logs del Sistema</CardTitle>
                          <CardDescription className="text-gray-400">
                            Revisar actividad del servidor
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            data-testid="button-system-logs"
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                            disabled
                          >
                            Próximamente
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}