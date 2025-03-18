import React from "react";

interface DataTableProps<T extends { id: number }> {
  headers: string[];
  data: T[];
  emptyMessage?: string;
  onModify: (item: T) => void;
  onDelete: (id: number) => void;
  renderCell: (item: T) => React.ReactNode;
  colSpan?: number;
}

export function DataTable<T extends { id: number }>({
  headers,
  data,
  emptyMessage = "Aucune donnée trouvée",
  onModify,
  onDelete,
  renderCell,
  colSpan = 7,
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 space-y-6">
      <table className="w-full">
        <thead className="bg-blue-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-5 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="text-center py-4 text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                {renderCell(item)}
                <td className="flex px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => onModify(item)}
                    className="text-blue-600 hover:bg-blue-100 p-2 rounded transition transform hover:scale-125"
                  >
                    ✏️
                  </button>
                  <div className="border-r-2" />
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:bg-red-100 p-2 rounded transition transform hover:scale-125"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
