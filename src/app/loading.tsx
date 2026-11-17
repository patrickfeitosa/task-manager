import { TaskCardSkeleton } from '@Domain/TaskCardSkeleton';

const Loading = () => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: 5 }, (_, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders, never reordered
      <TaskCardSkeleton key={index} />
    ))}
  </div>
);

export default Loading;
