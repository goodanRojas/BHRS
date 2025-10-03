import { motion, AnimatePresence } from "framer-motion";

export default function Table({ columns, data, legend, footer, onRowClick }) {
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Legend */}
      {legend && (
        <div className="mb-3 ">
          <h2 className="text-2xl font-bold text-gray-800">{legend}</h2>
        </div>
      )}

      {/* Scrollable Table Container */}
      <div className="overflow-x-auto overflow-y-auto max-h-[60vh] rounded-2xl shadow-lg bg-white">
        <table className="w-full text-left border-collapse">
          {/* Table Head */}
          <thead className="bg-gradient-to-r from-indigo-100 to-indigo-200 sticky top-0 z-10">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wide"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            <AnimatePresence>
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <motion.tr
                    key={rowIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
                    className={`odd:bg-white even:bg-gray-50 hover:bg-indigo-50 transition-colors ${onRowClick ? "cursor-pointer" : ""
                      }`}
                    onClick={() => onRowClick?.(row.__id)} >
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
                      >
                        {row[col.key] !== null && row[col.key] !== undefined
                          ? row[col.key]
                          : "—"}
                      </td>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>

          {/* Table Footer */}
          {footer && (
            <tfoot className="bg-gradient-to-r from-indigo-100 to-indigo-200">
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-3 text-sm text-gray-700 font-medium text-center"
                >
                  {footer}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
