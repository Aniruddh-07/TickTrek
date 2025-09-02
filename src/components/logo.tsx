import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Rocket className="h-6 w-6 text-primary" />
      <span className="text-lg font-semibold font-headline">TickTrek</span>
    </div>
  );
};

export default Logo;
