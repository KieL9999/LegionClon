import { useState } from 'react';
import { Button } from '@/components/ui/button';
import RealmistModal from '../RealmistModal';

export default function RealmistModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        Abrir Modal Realmist
      </Button>
      <RealmistModal open={open} onOpenChange={setOpen} />
    </div>
  );
}