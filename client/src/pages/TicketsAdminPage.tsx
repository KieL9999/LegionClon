import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import { 
  Search, 
  Calendar, 
  User, 
  Tag,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Edit,
  Eye,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { queryClient } from "@/lib/queryClient";

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
  assignedUserInfo?: {
    username: string;
    role: string;
  };
}

const statusConfig = {
  open: {
    label: "Abierto",
    color: "bg-green-500/10 text-green-400 border-green-500/30",
    icon: AlertCircle
  },
  in_progress: {
    label: "En Progreso",
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    icon: Clock
  },
  resolved: {
    label: "Resuelto",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    icon: CheckCircle2
  },
  closed: {
    label: "Cerrado",
    color: "bg-red-500/10 text-red-400 border-red-500/30",
    icon: XCircle
  }
};

const priorityConfig = {
  low: { label: "Baja", color: "text-green-400" },
  normal: { label: "Normal", color: "text-blue-400" },
  high: { label: "Alta", color: "text-orange-400" },
  urgent: { label: "Urgente", color: "text-red-400" }
};

const categoryConfig = {
  general: { label: "General", color: "text-purple-400" },
  technical: { label: "Técnico", color: "text-cyan-400" },
  account: { label: "Cuenta", color: "text-indigo-400" },
  billing: { label: "Donaciones", color: "text-amber-400" },
  other: { label: "Otro", color: "text-gray-400" }
};

export default function TicketsAdminPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: ticketsData, isLoading } = useQuery<{ success: boolean; tickets: SupportTicket[] }>({
    queryKey: ['/api/admin/tickets'],
  });

  const tickets = ticketsData?.tickets || [];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['/api/admin/tickets'] });
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !searchQuery.trim() || 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-gaming-gold/20 to-gaming-gold/5 rounded-lg border border-gaming-gold/30">
                <Tag className="w-6 h-6 text-gaming-gold" />
              </div>
              <h1 className="text-3xl font-bold text-white">Gestión de Tickets de Soporte</h1>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-gaming-gold hover:bg-gaming-gold/90 text-black font-semibold"
              data-testid="button-refresh-tickets"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
          <p className="text-slate-400 ml-14">
            Administra y gestiona todos los tickets de soporte del sistema
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Buscar por título o usuario..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              data-testid="input-search-tickets"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-slate-900/50 border-slate-700 text-white" data-testid="select-status-filter">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="open">Abiertos</SelectItem>
              <SelectItem value="in_progress">En Progreso</SelectItem>
              <SelectItem value="resolved">Resueltos</SelectItem>
              <SelectItem value="closed">Cerrados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total</p>
                  <p className="text-2xl font-bold text-white">{tickets.length}</p>
                </div>
                <Tag className="w-8 h-8 text-gaming-gold" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-400">Abiertos</p>
                  <p className="text-2xl font-bold text-white">
                    {tickets.filter(t => t.status === 'open').length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-400">En Progreso</p>
                  <p className="text-2xl font-bold text-white">
                    {tickets.filter(t => t.status === 'in_progress').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-400">Resueltos</p>
                  <p className="text-2xl font-bold text-white">
                    {tickets.filter(t => t.status === 'resolved').length}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gaming-gold border-t-transparent"></div>
            <p className="mt-4 text-slate-400">Cargando tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-12 text-center">
              <Tag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No se encontraron tickets</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTickets.map((ticket) => {
              const StatusIcon = statusConfig[ticket.status as keyof typeof statusConfig]?.icon || AlertCircle;
              const statusInfo = statusConfig[ticket.status as keyof typeof statusConfig];
              
              return (
                <Card
                  key={ticket.id}
                  className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 border-slate-700/50 hover:border-gaming-gold/50 transition-all duration-300 group cursor-pointer"
                  onClick={() => setLocation(`/ticket/${ticket.id}`)}
                  data-testid={`ticket-card-${ticket.id}`}
                >
                  <CardContent className="p-5">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={`${statusInfo?.color} border px-2 py-1`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo?.label || ticket.status}
                      </Badge>
                      <Badge className={`bg-slate-800/50 ${priorityConfig[ticket.priority as keyof typeof priorityConfig]?.color} border-slate-700`}>
                        {priorityConfig[ticket.priority as keyof typeof priorityConfig]?.label}
                      </Badge>
                    </div>

                    {/* Ticket Info */}
                    <div className="space-y-3">
                      <h3 
                        className="font-bold text-white text-lg line-clamp-1 group-hover:text-gaming-gold transition-colors"
                        data-testid={`ticket-title-${ticket.id}`}
                      >
                        {ticket.title}
                      </h3>

                      <p className="text-sm text-slate-400 line-clamp-2 min-h-[2.5rem]">
                        {ticket.description}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Tag className="w-4 h-4" />
                          <span className={categoryConfig[ticket.category as keyof typeof categoryConfig]?.color}>
                            {categoryConfig[ticket.category as keyof typeof categoryConfig]?.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-400">
                          <User className="w-4 h-4" />
                          <span className="truncate">ID: {ticket.userId.slice(0, 8)}...</span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(ticket.createdAt), "dd MMM yyyy", { locale: es })}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-700/50">
                          {ticket.assignedUserInfo ? (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-semibold">
                              Asignado: {ticket.assignedUserInfo.username}#{ticket.assignedTo?.slice(-4).toUpperCase()}
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                              Sin Asignar
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-slate-800/50 border-slate-700 hover:bg-gaming-gold/10 hover:border-gaming-gold text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/ticket/${ticket.id}`);
                        }}
                        data-testid={`button-view-${ticket.id}`}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-slate-800/50 border-slate-700 hover:bg-gaming-gold/10 hover:border-gaming-gold text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/ticket/${ticket.id}`);
                        }}
                        data-testid={`button-edit-${ticket.id}`}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
