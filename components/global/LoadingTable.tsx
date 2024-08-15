import { Skeleton } from "../ui/skeleton";

type LoadingTableProps = {
  rows?: number;
};

function LoadingTable({ rows = 5 }: LoadingTableProps) {
  const tableRows = Array.from({ length: rows }, (_, index) => index);

  return (
    <>
      {tableRows.map((index) => (
        <div key={index} className="mb-4">
          <Skeleton className="w-full h-8 rounded" />
        </div>
      ))}
    </>
  );
}

export default LoadingTable;
