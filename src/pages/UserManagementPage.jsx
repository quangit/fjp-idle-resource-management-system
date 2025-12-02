import { useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';
import { USERS } from '@/lib/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Search, Plus, Upload, Download, Trash2, Lock, Unlock, Edit, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

const columns = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-border text-primary focus:ring-primary bg-surface"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(value) => table.toggleAllPageRowsSelected(!!value.target.checked)}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-border text-primary focus:ring-primary bg-surface"
        checked={row.getIsSelected()}
        onChange={(value) => row.toggleSelected(!!value.target.checked)}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <button className="flex items-center" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Username <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${status === 'Active' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
          {status}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <button className="text-text-secondary hover:text-primary"><Edit size={16} /></button>
        <button className="text-text-secondary hover:text-error"><Trash2 size={16} /></button>
        <button className="text-text-secondary hover:text-warning">
          {row.original.status === 'Active' ? <Lock size={16} /> : <Unlock size={16} />}
        </button>
      </div>
    ),
  },
];

const UserManagementPage = () => {
  const [data] = useState(USERS);
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <input placeholder="Search users..." className="pl-10 w-full md:w-80 bg-background border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center bg-primary text-white px-3 py-2 text-sm rounded-md hover:bg-primary-focus transition-colors"><Plus className="h-4 w-4 mr-2" /> Add User</button>
            <button className="flex items-center bg-border text-text px-3 py-2 text-sm rounded-md hover:bg-border/80 transition-colors"><Upload className="h-4 w-4 mr-2" /> Import</button>
            <button className="flex items-center bg-border text-text px-3 py-2 text-sm rounded-md hover:bg-border/80 transition-colors"><Download className="h-4 w-4 mr-2" /> Export</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-4 py-3 font-medium text-text-secondary">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-border hover:bg-surface">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6 text-sm">
          <div className="text-text-secondary">
            {Object.keys(rowSelection).length} of {table.getCoreRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1 rounded-md disabled:opacity-50 hover:bg-border"><ChevronLeft size={16} /></button>
            <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1 rounded-md disabled:opacity-50 hover:bg-border"><ChevronRight size={16} /></button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagementPage;
