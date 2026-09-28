import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Transaction } from '@/types/transaction';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
} from 'lucide-react';

export function TransactionsPage() {
  const [filter, setFilter] = useState('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getTransactions(filter)
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, [filter]);

  const totalIn = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = Math.abs(
    transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  return (
    <div className="space-y-6 pb-6 w-full min-w-0 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#FF5B26] mb-1">
            Wallet & Statements
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">
            Transactions
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Review your ride payments, commissions, and bank settlement payouts.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Inflows
            </p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              +{formatCurrency(totalIn)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Rides & incentives</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Payouts
            </p>
            <p className="text-2xl font-bold text-navy mt-1">
              -{formatCurrency(totalOut)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Withdrawn to bank</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Net Balance
            </p>
            <p className="text-2xl font-bold text-[#FF5B26] mt-1">
              {formatCurrency(totalIn - totalOut)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Available for transfer</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#FF5B26] flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { label: 'All Transactions', value: 'all' },
          { label: 'Earnings', value: 'earnings' },
          { label: 'Payouts', value: 'payouts' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-3 text-sm font-semibold transition-colors relative outline-none ${
              filter === tab.value
                ? 'border-b-2 border-[#FF5B26] text-[#FF5B26]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Container with strictly isolated scroll */}
      <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <table className="w-full min-w-[760px] divide-y divide-gray-100 text-left">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
                      </td>
                    ))}
                  </tr>
                ))}
              {!loading &&
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-4 text-xs text-gray-600 whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">
                    {tx.description}
                  </td>
                  <td
                    className={`px-5 py-4 text-sm font-bold whitespace-nowrap ${
                      tx.amount < 0 ? 'text-gray-900' : 'text-emerald-600'
                    }`}
                  >
                    {tx.amount > 0 ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(Math.abs(tx.amount))}`}
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-gray-500 whitespace-nowrap">
                    {tx.paymentMethod}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        tx.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : tx.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}