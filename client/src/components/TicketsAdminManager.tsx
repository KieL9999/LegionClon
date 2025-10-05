import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LifeBuoy, Search, User, Calendar, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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

export default function TicketsAdminManager() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all tickets for admin
  const { data: ticketsData, isLoading } = useQuery<{ success: boolean; tickets: SupportTicket[] }>({
    queryKey: ['/api/admin/tickets'],
  });

  const tickets = ticketsData?.tickets || [];

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
    
    return (
      <Card 
        key={ticket.id} 
        className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/50 hover:border-gaming-gold/50 transition-all duration-300"
        data-testid={`admin-ticket-card-${ticket.id}`}
      >
        <CardContent className="p-6">
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

              {/* User ID Badge */}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gaming-gold" />
                <Badge 
                  className="bg-gaming-gold/20 text-gaming-gold border-gaming-gold/30 font-mono"
                  data-testid={`ticket-user-${ticket.id}`}
                >
                  {ticket.userId.slice(0, 8)}...
                </Badge>
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

              {/* Date and assignment */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}</span>
                </div>
                {ticket.assignedTo && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 font-mono text-xs">
                    Asignado: {ticket.assignedTo.slice(0, 8)}
                  </Badge>
                )}
              </div>
            </div>

            {/* Action button */}
            <Link href={`/ticket/${ticket.id}`}>
              <Button
                className="bg-gaming-gold hover:bg-gaming-gold/90 text-black font-semibold shrink-0"
                data-testid={`button-view-admin-ticket-${ticket.id}`}
              >
                Ver Ticket
              </Button>
            </Link>
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
            <Badge className="bg-gaming-gold/20 text-gaming-gold border-gaming-gold/30 text-lg px-4 py-2">
              {tickets.length} Total
            </Badge>
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
    </div>
  );
}
