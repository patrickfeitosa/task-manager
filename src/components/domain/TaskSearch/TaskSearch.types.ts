export type TaskSearchProps = {
  // Nothing to search (no tasks exist at all).
  disabled?: boolean;
  // Search term from the URL (`?q=`).
  q: string;
};
