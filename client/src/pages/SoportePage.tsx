import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SoportePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-3xl">🎧</span>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Centro de Soporte
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Encuentra respuestas a tus preguntas o contacta con nuestro equipo de soporte.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* FAQ Section */}
            <div className="bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/20 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">❓</span>
                <h2 className="text-2xl font-bold text-blue-400">Preguntas Frecuentes</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <h3 className="font-semibold text-white mb-2">¿Cómo creo una cuenta?</h3>
                  <p className="text-gray-300 text-sm">Haz clic en "Registro" en la parte superior de la página y completa el formulario con tus datos.</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <h3 className="font-semibold text-white mb-2">¿Cómo descargo el cliente?</h3>
                  <p className="text-gray-300 text-sm">Ve a la sección "Descargar" en el menú principal para obtener la última versión del cliente.</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <h3 className="font-semibold text-white mb-2">¿Problemas de conexión?</h3>
                  <p className="text-gray-300 text-sm">Verifica tu conexión a internet y asegúrate de tener la última versión del cliente instalada.</p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-lg rounded-2xl p-8 border border-cyan-500/20 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">📞</span>
                <h2 className="text-2xl font-bold text-cyan-400">Contactar Soporte</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <span className="text-xl">💬</span>
                  <div>
                    <h3 className="font-semibold text-white">Discord</h3>
                    <p className="text-gray-300 text-sm">Únete a nuestro servidor de Discord para soporte en tiempo real</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <span className="text-xl">📧</span>
                  <div>
                    <h3 className="font-semibold text-white">Email</h3>
                    <p className="text-gray-300 text-sm">soporte@aetherwow.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <span className="text-xl">🎫</span>
                  <div>
                    <h3 className="font-semibold text-white">Ticket de Soporte</h3>
                    <p className="text-gray-300 text-sm">Próximamente: Sistema de tickets integrado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-lg rounded-2xl p-8 border border-green-500/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🟢</span>
              <h2 className="text-2xl font-bold text-green-400">Estado del Servidor</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <h3 className="font-semibold text-green-400">Servidor Principal</h3>
                <p className="text-green-300 text-sm">En línea</p>
              </div>
              <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <h3 className="font-semibold text-green-400">Base de Datos</h3>
                <p className="text-green-300 text-sm">Operacional</p>
              </div>
              <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <h3 className="font-semibold text-green-400">Sitio Web</h3>
                <p className="text-green-300 text-sm">Funcionando</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}