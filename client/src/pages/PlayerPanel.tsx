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
import { changePasswordSchema, changeEmailSchema, USER_ROLES, ROLE_LABELS, changeRoleSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, Settings, Shield, Key, Mail, ArrowLeft, Users, Crown, TrendingUp, TrendingDown, BarChart3, Search, Server, Calendar, FileText, Newspaper, Download } from "lucide-react";
import WebFeaturesManager from "@/components/WebFeaturesManager";
import ServerNewsManager from "@/components/ServerNewsManager";
import DownloadsManager from "@/components/DownloadsManager";
import { Link } from "wouter";
import Header from "@/components/Header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ChangePasswordData, ChangeEmailData, ChangeRoleData, User as UserType } from "@shared/schema";

// Helper function to check if user is GM of any level
const isGM = (role: string) => {
  return role !== USER_ROLES.PLAYER;
};

// Helper function to get role display name
const getRoleDisplayName = (role: string) => {
  return ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role;
};

// Helper function to filter users by search query
const filterUsersBySearch = (users: UserType[], searchQuery: string) => {
  if (!searchQuery.trim()) return [];
  
  const query = searchQuery.toLowerCase().trim();
  return users.filter(user => 
    user.username.toLowerCase().includes(query) || 
    user.email.toLowerCase().includes(query)
  );
};

export function PlayerPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Get all users query (for admin)
  const usersQuery = useQuery<{ users: UserType[] }>({
    queryKey: ["/api/users"],
    enabled: user ? isGM(user.role) : false,
  });

  // Change role mutation
  const changeRoleMutation = useMutation({
    mutationFn: (data: ChangeRoleData) => 
      apiRequest("POST", "/api/change-role", data),
    onSuccess: () => {
      toast({
        title: "Rol cambiado",
        description: "El rol del usuario ha sido actualizado exitosamente",
      });
      // Invalidate users query to refresh user list
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo cambiar el rol",
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
      <div>
        <Header />
        <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Acceso Denegado</CardTitle>
              <CardDescription>
                Debes iniciar sesión para acceder al panel del jugador
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Navigation breadcrumb */}
            <div className="mb-6">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" data-testid="button-back-home">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al inicio
                </Button>
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                <User className="h-8 w-8 text-gaming-gold" />
                Panel del Jugador
              </h1>
              <p className="text-muted-foreground">
                Administra tu cuenta y configuraciones
              </p>
            </div>

            {/* User Info Card */}
            <Card className="mb-8 bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground text-xl">{user.username}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {user.email}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={isGM(user.role) ? "default" : "secondary"}
                      className={isGM(user.role) ? "bg-gaming-gold text-white" : ""}
                    >
                      {getRoleDisplayName(user.role)}
                    </Badge>
                    {isGM(user.role) && (
                      <Shield className="h-5 w-5 text-gaming-gold" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className={`grid w-full ${isGM(user.role) ? 'grid-cols-3' : 'grid-cols-2'} bg-muted`}>
                <TabsTrigger value="profile" className="text-foreground data-[state=active]:bg-gaming-gold">
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </TabsTrigger>
                <TabsTrigger value="security" className="text-foreground data-[state=active]:bg-gaming-gold">
                  <Settings className="h-4 w-4 mr-2" />
                  Seguridad
                </TabsTrigger>
                {isGM(user.role) && (
                  <TabsTrigger value="admin" className="text-foreground data-[state=active]:bg-gaming-gold">
                    <Shield className="h-4 w-4 mr-2" />
                    Administrador
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Información del Perfil</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Información básica de tu cuenta
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-foreground">Nombre de Usuario</Label>
                        <p className="text-foreground bg-muted p-2 rounded border">
                          {user.username}
                        </p>
                      </div>
                      <div>
                        <Label className="text-foreground">Email</Label>
                        <p className="text-foreground bg-muted p-2 rounded border">
                          {user.email}
                        </p>
                      </div>
                      <div>
                        <Label className="text-foreground">Rol</Label>
                        <p className="text-foreground bg-muted p-2 rounded border">
                          {getRoleDisplayName(user.role)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-foreground">Miembro desde</Label>
                        <p className="text-foreground bg-muted p-2 rounded border">
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
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Key className="h-5 w-5 text-gaming-gold" />
                      Cambiar Contraseña
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
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
                              <FormLabel className="text-foreground">Contraseña Actual</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  data-testid="input-current-password"
                                  className="bg-input border-border text-foreground"
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
                              <FormLabel className="text-foreground">Nueva Contraseña</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  data-testid="input-new-password"
                                  className="bg-input border-border text-foreground"
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
                              <FormLabel className="text-foreground">Confirmar Nueva Contraseña</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  data-testid="input-confirm-password"
                                  className="bg-input border-border text-foreground"
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
                          className="bg-gaming-gold hover:bg-gaming-gold/90 text-white"
                        >
                          {changePasswordMutation.isPending ? "Cambiando..." : "Cambiar Contraseña"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {/* Change Email */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Mail className="h-5 w-5 text-gaming-gold" />
                      Cambiar Email
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
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
                              <FormLabel className="text-foreground">Nuevo Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  data-testid="input-new-email"
                                  placeholder="nuevo@email.com"
                                  className="bg-input border-border text-foreground"
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
                              <FormLabel className="text-foreground">Confirmar con Contraseña</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  data-testid="input-email-password"
                                  className="bg-input border-border text-foreground"
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
                          className="bg-gaming-gold hover:bg-gaming-gold/90 text-white"
                        >
                          {changeEmailMutation.isPending ? "Cambiando..." : "Cambiar Email"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Admin Tab (only for GMs) */}
              {isGM(user.role) && (
                <TabsContent value="admin">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Shield className="h-5 w-5 text-gaming-gold" />
                        Panel de Administrador
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Funciones exclusivas para Game Masters - {getRoleDisplayName(user.role)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="game-admin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-muted">
                          <TabsTrigger 
                            value="game-admin" 
                            className="data-[state=active]:bg-gaming-gold data-[state=active]:text-white"
                            data-testid="tab-game-admin"
                          >
                            <Crown className="h-4 w-4 mr-2" />
                            Administración del Juego
                          </TabsTrigger>
                          <TabsTrigger 
                            value="web-config" 
                            className="data-[state=active]:bg-gaming-gold data-[state=active]:text-white"
                            data-testid="tab-web-config"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Configuraciones Web
                          </TabsTrigger>
                        </TabsList>

                        {/* Administración del Juego Tab */}
                        <TabsContent value="game-admin" className="mt-6">
                          <div className="space-y-6">
                        {/* Estadísticas de la Jerarquía GM */}
                        {usersQuery.data?.users && (
                          <Card className="bg-muted border-border">
                            <CardHeader>
                              <CardTitle className="text-foreground text-lg flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-gaming-gold" />
                                Estadísticas de la Jerarquía
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {(() => {
                                const roleStats = usersQuery.data.users.reduce((stats: any, userData: UserType) => {
                                  stats[userData.role] = (stats[userData.role] || 0) + 1;
                                  return stats;
                                }, {});
                                
                                const gmCount = usersQuery.data.users.filter((userData: UserType) => isGM(userData.role)).length;
                                const playerCount = usersQuery.data.users.filter((userData: UserType) => !isGM(userData.role)).length;
                                
                                // Definir todos los niveles GM en orden jerárquico
                                const gmRoles = [
                                  { role: USER_ROLES.ADMINISTRADOR, label: "Nivel 7", name: "Administradores" },
                                  { role: USER_ROLES.COMMUNITY_MANAGER, label: "Nivel 6", name: "Community Managers" },
                                  { role: USER_ROLES.GM_JEFE, label: "Nivel 5", name: "GM Jefe" },
                                  { role: USER_ROLES.GM_SUPERIOR, label: "Nivel 4", name: "GM Superior" },
                                  { role: USER_ROLES.GM_EVENTOS, label: "Nivel 3", name: "GM Eventos" },
                                  { role: USER_ROLES.GM_SOPORTE, label: "Nivel 2", name: "GM Soporte" },
                                  { role: USER_ROLES.GM_ASPIRANTE, label: "Nivel 1", name: "GM Aspirante" }
                                ];
                                
                                return (
                                  <div className="space-y-4">
                                    {/* Estadísticas Generales */}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="text-center p-3 bg-gradient-to-r from-gaming-gold/20 to-gaming-gold/10 rounded border border-gaming-gold/30">
                                        <p className="text-3xl font-bold text-gaming-gold">{gmCount}</p>
                                        <p className="text-sm text-muted-foreground">Total Game Masters</p>
                                      </div>
                                      <div className="text-center p-3 bg-background rounded border">
                                        <p className="text-3xl font-bold text-foreground">{playerCount}</p>
                                        <p className="text-sm text-muted-foreground">Jugadores</p>
                                      </div>
                                    </div>
                                    
                                    {/* Jerarquía GM Completa */}
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Distribución por Nivel GM</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {gmRoles.map((gmRole) => (
                                          <div key={gmRole.role} className="flex items-center justify-between p-2 bg-background rounded border">
                                            <div className="flex items-center gap-2">
                                              <Crown className="h-4 w-4 text-gaming-gold" />
                                              <div>
                                                <p className="text-xs font-medium text-foreground">{gmRole.label}</p>
                                                <p className="text-xs text-muted-foreground">{gmRole.name}</p>
                                              </div>
                                            </div>
                                            <Badge 
                                              className={`text-xs ${(roleStats[gmRole.role] || 0) > 0 ? 'bg-gaming-gold text-white' : 'bg-muted text-muted-foreground'}`}
                                            >
                                              {roleStats[gmRole.role] || 0}
                                            </Badge>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </CardContent>
                          </Card>
                        )}

                        {/* Game Masters */}
                        <Card className="bg-muted border-border">
                          <CardHeader>
                            <CardTitle className="text-foreground text-lg flex items-center gap-2">
                              <Crown className="h-5 w-5 text-gaming-gold" />
                              Game Masters Activos
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                              Staff del servidor con permisos especiales
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {usersQuery.isLoading ? (
                              <div className="text-muted-foreground">Cargando usuarios...</div>
                            ) : usersQuery.error ? (
                              <div className="text-destructive">Error al cargar usuarios</div>
                            ) : (
                              <div className="space-y-3">
                                {usersQuery.data?.users?.filter((userData: UserType) => isGM(userData.role)).map((userData: UserType) => (
                                  <div key={userData.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gaming-gold/10 to-transparent rounded border border-gaming-gold/20">
                                    <div className="flex items-center gap-3">
                                      <Crown className="h-5 w-5 text-gaming-gold" />
                                      <div>
                                        <p className="font-medium text-foreground flex items-center gap-2">
                                          {userData.username}
                                          {userData.id === user.id && <span className="text-sm text-gaming-gold">(Tu cuenta)</span>}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{userData.email}</p>
                                      </div>
                                      <Badge className="bg-gaming-gold text-white">
                                        {getRoleDisplayName(userData.role)}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {userData.id !== user.id && (
                                        <>
                                          <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => {
                                              changeRoleMutation.mutate({
                                                userId: userData.id,
                                                newRole: USER_ROLES.PLAYER
                                              });
                                            }}
                                            disabled={changeRoleMutation.isPending}
                                            data-testid={`button-demote-${userData.id}`}
                                          >
                                            <TrendingDown className="h-4 w-4 mr-1" />
                                            Expulsar GM
                                          </Button>
                                          <Select
                                            value={userData.role}
                                            onValueChange={(newRole) => {
                                              changeRoleMutation.mutate({
                                                userId: userData.id,
                                                newRole: newRole as any
                                              });
                                            }}
                                            disabled={changeRoleMutation.isPending}
                                          >
                                            <SelectTrigger className="w-40 bg-input border-border text-foreground" data-testid={`select-gm-role-${userData.id}`}>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value={USER_ROLES.GM_ASPIRANTE}>
                                                GM Nivel 1
                                              </SelectItem>
                                              <SelectItem value={USER_ROLES.GM_SOPORTE}>
                                                GM Nivel 2
                                              </SelectItem>
                                              <SelectItem value={USER_ROLES.GM_EVENTOS}>
                                                GM Nivel 3
                                              </SelectItem>
                                              <SelectItem value={USER_ROLES.GM_SUPERIOR}>
                                                GM Nivel 4
                                              </SelectItem>
                                              <SelectItem value={USER_ROLES.GM_JEFE}>
                                                GM Nivel 5
                                              </SelectItem>
                                              <SelectItem value={USER_ROLES.COMMUNITY_MANAGER}>
                                                GM Nivel 6
                                              </SelectItem>
                                              <SelectItem value={USER_ROLES.ADMINISTRADOR}>
                                                GM Nivel 7
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )) || []}
                                {usersQuery.data?.users?.filter((userData: UserType) => isGM(userData.role)).length === 0 && (
                                  <p className="text-muted-foreground text-center py-4">No hay Game Masters registrados</p>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Buscar Jugador */}
                        <Card className="bg-muted border-border">
                          <CardHeader>
                            <CardTitle className="text-foreground text-lg flex items-center gap-2">
                              <Search className="h-5 w-5 text-gaming-gold" />
                              Buscar Jugador
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                              Busca jugadores por nombre de usuario o correo electrónico y asigna niveles GM
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {/* Campo de búsqueda */}
                            <div className="mb-4">
                              <Input
                                type="text"
                                placeholder="Buscar por nombre de usuario o correo electrónico..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-input border-border text-foreground placeholder:text-muted-foreground"
                                data-testid="input-search-player"
                              />
                            </div>

                            {usersQuery.isLoading ? (
                              <div className="text-muted-foreground">Cargando usuarios...</div>
                            ) : usersQuery.error ? (
                              <div className="text-destructive">Error al cargar usuarios</div>
                            ) : (
                              <div className="space-y-3">
                                {(() => {
                                  if (!searchQuery.trim()) {
                                    return (
                                      <div className="text-center py-8">
                                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-muted-foreground">
                                          Escribe un nombre de usuario o correo electrónico para buscar jugadores
                                        </p>
                                      </div>
                                    );
                                  }

                                  const filteredUsers = filterUsersBySearch(usersQuery.data?.users || [], searchQuery);
                                  
                                  if (filteredUsers.length === 0) {
                                    return (
                                      <div className="text-center py-8">
                                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-muted-foreground">
                                          No se encontraron jugadores que coincidan con "{searchQuery}"
                                        </p>
                                      </div>
                                    );
                                  }

                                  return filteredUsers.map((userData: UserType) => (
                                  <div key={userData.id} className="flex items-center justify-between p-3 bg-background rounded border">
                                    <div className="flex items-center gap-3">
                                      <User className="h-5 w-5 text-muted-foreground" />
                                      <div>
                                        <p className="font-medium text-foreground">{userData.username}</p>
                                        <p className="text-sm text-muted-foreground">{userData.email}</p>
                                      </div>
                                      <Badge variant="secondary">
                                        {getRoleDisplayName(userData.role)}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="default"
                                        className="bg-gaming-gold hover:bg-gaming-gold/90 text-white"
                                        onClick={() => {
                                          changeRoleMutation.mutate({
                                            userId: userData.id,
                                            newRole: USER_ROLES.GM_ASPIRANTE
                                          });
                                        }}
                                        disabled={changeRoleMutation.isPending}
                                        data-testid={`button-promote-${userData.id}`}
                                      >
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                        Promover a GM
                                      </Button>
                                      <Select
                                        value={userData.role}
                                        onValueChange={(newRole) => {
                                          changeRoleMutation.mutate({
                                            userId: userData.id,
                                            newRole: newRole as any
                                          });
                                        }}
                                        disabled={changeRoleMutation.isPending}
                                      >
                                        <SelectTrigger className="w-40 bg-input border-border text-foreground" data-testid={`select-player-role-${userData.id}`}>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value={USER_ROLES.PLAYER}>
                                            Jugador
                                          </SelectItem>
                                          <SelectItem value={USER_ROLES.GM_ASPIRANTE}>
                                            GM Nivel 1
                                          </SelectItem>
                                          <SelectItem value={USER_ROLES.GM_SOPORTE}>
                                            GM Nivel 2
                                          </SelectItem>
                                          <SelectItem value={USER_ROLES.GM_EVENTOS}>
                                            GM Nivel 3
                                          </SelectItem>
                                          <SelectItem value={USER_ROLES.GM_SUPERIOR}>
                                            GM Nivel 4
                                          </SelectItem>
                                          <SelectItem value={USER_ROLES.GM_JEFE}>
                                            GM Nivel 5
                                          </SelectItem>
                                          <SelectItem value={USER_ROLES.COMMUNITY_MANAGER}>
                                            GM Nivel 6
                                          </SelectItem>
                                          <SelectItem value={USER_ROLES.ADMINISTRADOR}>
                                            GM Nivel 7
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  ));
                                })()}
                              </div>
                            )}
                          </CardContent>
                        </Card>

                            {/* Eventos del Juego */}
                            <Card className="bg-muted border-border">
                              <CardHeader>
                                <CardTitle className="text-foreground text-lg flex items-center gap-2">
                                  <Calendar className="h-5 w-5 text-gaming-gold" />
                                  Eventos del Juego
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                  Crear y gestionar eventos del servidor
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <Button 
                                  data-testid="button-manage-events"
                                  className="w-full bg-gaming-gold hover:bg-gaming-gold/90 text-white"
                                  disabled
                                >
                                  Próximamente
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                        </TabsContent>

                        {/* Configuraciones Web Tab */}
                        <TabsContent value="web-config" className="mt-6">
                          <div className="space-y-6">
                            <Card className="bg-muted border-border">
                              <CardHeader>
                                <CardTitle className="text-foreground text-lg flex items-center gap-2">
                                  <Server className="h-5 w-5 text-gaming-gold" />
                                  Gestión de Características
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                  Administrar las características del servidor mostradas en la página principal
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <WebFeaturesManager />
                              </CardContent>
                            </Card>

                            <Card className="bg-muted border-border">
                              <CardHeader>
                                <CardTitle className="text-foreground text-lg flex items-center gap-2">
                                  <Newspaper className="h-5 w-5 text-gaming-gold" />
                                  Gestión de Noticias del Servidor
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                  Administrar las noticias del servidor mostradas en la página principal
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <ServerNewsManager />
                              </CardContent>
                            </Card>

                            <Card className="bg-muted border-border">
                              <CardHeader>
                                <CardTitle className="text-foreground text-lg flex items-center gap-2">
                                  <Download className="h-5 w-5 text-gaming-gold" />
                                  Gestión de Descargas
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                  Administrar las descargas del cliente principal, parches y herramientas
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <DownloadsManager />
                              </CardContent>
                            </Card>

                            <Card className="bg-muted border-border">
                              <CardHeader>
                                <CardTitle className="text-foreground text-lg flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-gaming-gold" />
                                  Logs del Sistema
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                  Revisar actividad y logs del servidor web
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <Button 
                                  data-testid="button-system-logs"
                                  className="w-full bg-gaming-gold hover:bg-gaming-gold/90 text-white"
                                  disabled
                                >
                                  Próximamente
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}