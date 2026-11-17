import { Card, CardContent } from '@Ui/Card';
import { Skeleton } from '@Ui/Skeleton';

// Same shape as a TaskItem (title, description, date, two actions) to avoid layout shift.
export const TaskCardSkeleton = () => (
  <Card aria-hidden="true">
    <CardContent className="flex items-start gap-3">
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="size-9" />
        <Skeleton className="size-9" />
      </div>
    </CardContent>
  </Card>
);
