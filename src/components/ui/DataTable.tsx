/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyMessage?: string;
  renderMobileCard?: (item: T) => React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  sortColumn,
  sortDirection,
  onSort,
  emptyMessage = 'No records found.',
  renderMobileCard,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-[#6B7280] bg-white rounded-xl border border-[#E5E7EB]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table: visible on md and up */}
      <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-[#525252]">
              {columns.map((col) => {
                const isSorted = sortColumn === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={`py-3 px-4 font-semibold text-[#242424] select-none whitespace-nowrap ${
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    } ${col.sortable ? 'cursor-pointer hover:bg-[#F3F4F6]' : ''} ${
                      col.className || ''
                    }`}
                    onClick={() => col.sortable && onSort && onSort(col.key)}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === 'right' ? 'justify-end w-full' : ''
                      }`}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-[#9CA3AF]">
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-[#F36B21]" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-[#F36B21]" />
                            )
                          ) : (
                            <span className="w-3.5 h-3.5 inline-block opacity-0" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="hover:bg-[#F9FAFB] transition-colors"
              >
                {columns.map((col) => {
                  return (
                    <td
                      key={col.key}
                      className={`py-3.5 px-4 text-[#242424] align-middle ${
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      } ${col.className || ''}`}
                    >
                      {col.render ? col.render(item) : String(item[col.key] ?? '')}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List: visible below md */}
      <div className="md:hidden space-y-3">
        {renderMobileCard ? (
          data.map((item) => (
            <div key={keyExtractor(item)}>{renderMobileCard(item)}</div>
          ))
        ) : (
          data.map((item) => (
            <div
              key={keyExtractor(item)}
              className="bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-2 text-xs"
            >
              {columns.map((col) => (
                <div key={col.key} className="flex justify-between items-center py-1 border-b border-[#F9FAFB] last:border-b-0">
                  <span className="text-[#6B7280] font-medium">{col.header}</span>
                  <span className="text-[#242424] font-medium">
                    {col.render ? col.render(item) : String(item[col.key] ?? '')}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
