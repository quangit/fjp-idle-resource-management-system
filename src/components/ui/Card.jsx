import { cn } from '@/lib/utils';

const Card = ({ className, children }) => (
  <div className={cn("bg-surface border border-border rounded-lg p-6", className)}>
    {children}
  </div>
);

const CardHeader = ({ className, children }) => (
  <div className={cn("mb-4", className)}>
    {children}
  </div>
);

const CardTitle = ({ className, children }) => (
  <h3 className={cn("text-lg font-semibold text-text", className)}>
    {children}
  </h3>
);

const CardDescription = ({ className, children }) => (
  <p className={cn("text-sm text-text-secondary", className)}>
    {children}
  </p>
);

const CardContent = ({ className, children }) => (
  <div className={cn("", className)}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
