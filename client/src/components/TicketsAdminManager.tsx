import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LifeBuoy, Search, User, Calendar, AlertCircle, CheckCircle2, Clock, XCircle, RefreshCw, Edit, Eye, Crown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SupportTicket {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  imageUrl?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  creatorUsername?: string;
  creatorRole?: string;
  creatorVipLevel?: number;
  assignedUserInfo?: {
    username: string;
    role: string;
  };
}

interface StaffMember {
  id: string;
  username: string;
  role: string;
}

const statusColors = {
  open: "bg-green-500/20 text-green-400 border-green-500/30",
  in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  resolved: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  closed: "bg-red-500/20 text-red-400 border-red-500/30"
};

const statusLabels = {
  open: "Abierto",
  in_progress: "En Progreso",
  resolved: "Resuelto",
  closed: "Cerrado"
};

const statusIcons = {
  open: AlertCircle,
  in_progress: Clock,
  resolved: CheckCircle2,
  closed: XCircle
};

const priorityColors = {
  low: "bg-green-500/20 text-green-400 border-green-500/30",
  normal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  urgent: "bg-red-500/20 text-red-400 border-red-500/30"
};

const priorityLabels = {
  low: "Baja",
  normal: "Normal",
  high: "Alta",
  urgent: "Urgente"
};

const categoryColors = {
  general: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  technical: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  account: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  billing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  other: "bg-gray-500/20 text-gray-400 border-gray-500/30"
};

const categoryLabels = {
  general: "General",
  technical: "Técnico",
  account: "Cuenta",
  billing: "Donaciones",
  other: "Otro"
};

// VIP Level colors with neon effect
const vipColors: Record<number, string> = {
  0: "bg-gray-900/50 text-gray-400 border-gray-500/50 shadow-[0_0_10px_rgba(156,163,175,0.3)]",
  1: "bg-emerald-900/50 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(52,211,153,0.5)]",
  2: "bg-blue-900/50 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(96,165,250,0.5)]",
  3: "bg-purple-900/50 text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(192,132,252,0.5)]",
  4: "bg-pink-900/50 text-pink-400 border-pink-500/50 shadow-[0_0_15px_rgba(244,114,182,0.5)]",
  5: "bg-orange-900/50 text-orange-400 border-orange-500/50 shadow-[0_0_15px_rgba(251,146,60,0.5)]",
  6: "bg-red-900/50 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(248,113,113,0.5)]",
  7: "bg-amber-900/50 text-amber-400 border-amber-500/50 shadow-[0_0_20px_rgba(251,191,36,0.6)]",
  8: "bg-cyan-900/50 text-cyan-400 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.6)]",
  9: "bg-yellow-900/50 text-yellow-400 border-yellow-500/50 shadow-[0_0_25px_rgba(250,204,21,0.7)]",
  10: "bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-transparent bg-clip-text border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.8)]"
};

const vipLabels: Record<number, string> = {
  0: "VIP 0",
  1: "VIP 1",
  2: "VIP 2",
  3: "VIP 3",
  4: "VIP 4",
  5: "VIP 5",
  6: "VIP 6",
  7: "VIP 7",
  8: "VIP 8",
  9: "VIP 9",
  10: "VIP 10"
};

export default function TicketsAdminManager() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch all tickets for admin
  const { data: ticketsData, isLoading } = useQuery<{ success: boolean; tickets: SupportTicket[] }>({
    queryKey: ['/api/admin/tickets'],
  });

  // Fetch all staff members
  const { data: staffData } = useQuery<{ success: boolean; staff: StaffMember[] }>({
    queryKey: ['/api/admin/staff'],
  });

  const tickets = ticketsData?.tickets || [];
  const staffMembers = staffData?.staff || [];

  // Mutation to assign ticket
  const assignTicketMutation = useMutation({
    mutationFn: async ({ ticketId, assignedTo }: { ticketId: string; assignedTo: string | null }) => {
      const response = await fetch(`/api/tickets/${ticketId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ assignedTo })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al asignar el ticket');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tickets'] });
      toast({
        title: "Ticket asignado",
        description: "El ticket ha sido asignado exitosamente",
      });
      setDialogOpen(false);
      setSelectedTicketId(null);
      setSelectedAssignee("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al asignar el ticket",
        variant: "destructive"
      });
    }
  });
  
  // Refresh tickets function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['/api/admin/tickets'] });
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Filter tickets by search query (username/userId)
  const filteredTickets = tickets.filter(ticket => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return ticket.userId.toLowerCase().includes(query) || 
           ticket.title.toLowerCase().includes(query);
  });

  // Separate tickets by status
  const openTickets = filteredTickets.filter(t => t.status === 'open' || t.status === 'in_progress');
  const closedTickets = filteredTickets.filter(t => t.status === 'resolved' || t.status === 'closed');

  const renderTicketCard = (ticket: SupportTicket) => {
    const StatusIcon = statusIcons[ticket.status as keyof typeof statusIcons];
    const vipLevel = ticket.creatorVipLevel ?? 0;
    
    return (
      <Card 
        key={ticket.id} 
        className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 hover:border-gaming-gold/50 transition-all duration-300 relative"
        data-testid={`admin-ticket-card-${ticket.id}`}
      >
        {/* VIP Badge - Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <Badge 
            className={`${vipColors[vipLevel] || vipColors[0]} font-bold text-sm px-3 py-1 flex items-center gap-1.5`}
            data-testid={`ticket-vip-${ticket.id}`}
          >
            <Crown className="w-4 h-4" />
            {vipLabels[vipLevel] || "VIP 0"}
          </Badge>
        </div>

        <CardContent className="p-6 pr-24">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-3">
              {/* Header with title and status icon */}
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <StatusIcon className="w-5 h-5 text-gaming-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground truncate mb-1" data-testid={`ticket-title-${ticket.id}`}>
                    {ticket.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {ticket.description}
                  </p>
                </div>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-2 flex-wrap">
                <User className="w-4 h-4 text-gaming-gold" />
                <Badge 
                  className="bg-gaming-gold/20 text-gaming-gold border-gaming-gold/30 font-semibold"
                  data-testid={`ticket-user-${ticket.id}`}
                >
                  {ticket.creatorUsername || 'Desconocido'}
                </Badge>
                {ticket.assignedUserInfo ? (
                  <Badge 
                    className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-semibold"
                    data-testid={`ticket-assigned-user-${ticket.id}`}
                  >
                    Asignado a: {ticket.assignedUserInfo.username}
                  </Badge>
                ) : (
                  <Badge 
                    className="bg-gray-500/20 text-gray-400 border-gray-500/30"
                    data-testid={`ticket-unassigned-${ticket.id}`}
                  >
                    Sin Asignar
                  </Badge>
                )}
              </div>

              {/* Metadata badges */}
              <div className="flex flex-wrap gap-2">
                <Badge 
                  className={statusColors[ticket.status as keyof typeof statusColors]}
                  data-testid={`ticket-status-${ticket.id}`}
                >
                  {statusLabels[ticket.status as keyof typeof statusLabels]}
                </Badge>
                <Badge 
                  className={priorityColors[ticket.priority as keyof typeof priorityColors]}
                  data-testid={`ticket-priority-${ticket.id}`}
                >
                  {priorityLabels[ticket.priority as keyof typeof priorityLabels]}
                </Badge>
                <Badge 
                  className={categoryColors[ticket.category as keyof typeof categoryColors]}
                  data-testid={`ticket-category-${ticket.id}`}
                >
                  {categoryLabels[ticket.category as keyof typeof categoryLabels]}
                </Badge>
              </div>

              {/* Date */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 shrink-0">
              <Link href={`/ticket/${ticket.id}`}>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold w-full"
                  data-testid={`button-view-ticket-${ticket.id}`}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver
                </Button>
              </Link>
              <Button
                onClick={() => {
                  setSelectedTicketId(ticket.id);
                  setSelectedAssignee(ticket.assignedTo || "");
                  setDialogOpen(true);
                }}
                className="bg-gaming-gold hover:bg-gaming-gold/90 text-black font-semibold"
                data-testid={`button-edit-ticket-${ticket.id}`}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gaming-gold/20 rounded-xl">
              <LifeBuoy className="h-6 w-6 text-gaming-gold" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-foreground text-2xl font-bold">
                Gestión de Tickets de Soporte
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base mt-1">
                Administra todos los tickets de soporte de los usuarios
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-gaming-gold/20 text-gaming-gold border-gaming-gold/30 text-lg px-4 py-2">
                {tickets.length} Total
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-400"
                data-testid="button-refresh-tickets"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search Bar */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar por ID de usuario o título de ticket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-foreground placeholder:text-muted-foreground"
              data-testid="input-search-tickets"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Mostrando {filteredTickets.length} de {tickets.length} tickets
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tickets Tabs */}
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 p-1">
          <TabsTrigger 
            value="open" 
            className="data-[state=active]:bg-gaming-gold data-[state=active]:text-black font-semibold"
            data-testid="tab-admin-open-tickets"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Tickets Abiertos ({openTickets.length})
          </TabsTrigger>
          <TabsTrigger 
            value="closed" 
            className="data-[state=active]:bg-slate-600 data-[state=active]:text-white font-semibold"
            data-testid="tab-admin-closed-tickets"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Tickets Cerrados ({closedTickets.length})
          </TabsTrigger>
        </TabsList>

        {/* Open Tickets Tab */}
        <TabsContent value="open" className="mt-6">
          <ScrollArea className="h-[600px] pr-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground">Cargando tickets...</div>
              </div>
            ) : openTickets.length > 0 ? (
              <div className="space-y-4">
                {openTickets.map(renderTicketCard)}
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50">
                <CardContent className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No hay tickets abiertos
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? "No se encontraron tickets que coincidan con tu búsqueda"
                      : "Todos los tickets están resueltos o cerrados"
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Closed Tickets Tab */}
        <TabsContent value="closed" className="mt-6">
          <ScrollArea className="h-[600px] pr-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground">Cargando tickets...</div>
              </div>
            ) : closedTickets.length > 0 ? (
              <div className="space-y-4">
                {closedTickets.map(renderTicketCard)}
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50">
                <CardContent className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No hay tickets cerrados
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? "No se encontraron tickets cerrados que coincidan con tu búsqueda"
                      : "Los tickets resueltos aparecerán aquí"
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Assign Ticket Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-gaming-gold text-xl">Asignar Ticket a GM</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Selecciona un GM para asignar este ticket. Puedes remover la asignación seleccionando "Sin asignar".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600">
                <SelectValue placeholder="Seleccionar GM..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="none" className="text-gray-400">
                  Sin asignar
                </SelectItem>
                {staffMembers.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.username} - {staff.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setSelectedTicketId(null);
                  setSelectedAssignee("");
                }}
                className="bg-slate-800 hover:bg-slate-700 border-slate-600"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (selectedTicketId) {
                    assignTicketMutation.mutate({
                      ticketId: selectedTicketId,
                      assignedTo: selectedAssignee === "none" ? null : selectedAssignee || null
                    });
                  }
                }}
                disabled={assignTicketMutation.isPending}
                className="bg-gaming-gold hover:bg-gaming-gold/90 text-black"
              >
                {assignTicketMutation.isPending ? "Asignando..." : "Asignar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
