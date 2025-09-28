import { useState } from 'react';
import { Button } from '@/components/ui/button';
import RegistrationModal from '../RegistrationModal';

export default function RegistrationModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        Abrir Modal de Registro
      </Button>
      <RegistrationModal open={open} onOpenChange={setOpen} />
    </div>
  );
}