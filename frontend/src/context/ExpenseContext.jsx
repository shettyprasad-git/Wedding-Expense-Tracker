import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import { json2csv } from 'json-2-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExpenseContext = createContext();

export const useExpense = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [globalCategory, setGlobalCategory] = useState('All');
  const { user } = useAuth();

  const fetchExpenses = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  // Dedicated fetch for specific event pages if needed (though global sync is usually better for dash)
  const fetchEventExpenses = async (eventName) => {
    try {
      const res = await api.get(`/expenses/${eventName.toLowerCase()}`);
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch event expenses:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const addExpense = async (formData) => {
    try {
      const res = await api.post('/expenses', formData);
      setExpenses([res.data, ...expenses]);
      return res.data;
    } catch (err) { console.error(err); throw err; }
  };

  const updateExpense = async (id, formData) => {
    try {
      const res = await api.put(`/expenses/${id}`, formData);
      setExpenses(expenses.map(exp => exp._id === id ? res.data : exp));
      return res.data;
    } catch (err) { console.error(err); throw err; }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(exp => exp._id !== id));
    } catch (err) { console.error(err); throw err; }
  };

  // Modern Filtering Logic
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const expDate = new Date(exp.date).getTime();
      const start = dateRange.start ? new Date(dateRange.start).getTime() : 0;
      const end = dateRange.end ? new Date(dateRange.end).getTime() : Infinity;
      
      const matchesDate = expDate >= start && expDate <= end;
      const matchesCategory = globalCategory === 'All' || exp.category === globalCategory;
      
      return matchesDate && matchesCategory;
    });
  }, [expenses, dateRange, globalCategory]);

  const totals = useMemo(() => {
    const events = ['engagement', 'mehndi', 'marriage', 'dinner'];
    const initialTotals = events.reduce((acc, s) => ({ ...acc, [s]: 0 }), { GrandTotal: 0 });
    
    return filteredExpenses.reduce((acc, exp) => {
      const key = exp.event?.toLowerCase();
      if (acc.hasOwnProperty(key)) {
        acc[key] += (exp.price || 0);
      }
      acc.GrandTotal += (exp.price || 0);
      return acc;
    }, initialTotals);
  }, [filteredExpenses]);

  // Export Utilities
  const exportAllToCSV = () => {
    try {
      const csv = json2csv(filteredExpenses.map(e => ({
        Event: e.event,
        Name: e.name,
        Category: e.category,
        Price: e.price,
        Date: new Date(e.date).toLocaleDateString(),
        Description: e.description || ''
      })));
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Wedding_Expenses_Report_${new Date().toLocaleDateString()}.csv`;
      link.click();
    } catch (err) { console.error('❌ CSV Export Error:', err); }
  };

  const exportAllToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(157, 118, 193); 
      doc.text('Wedding Expense Tracker Report', 14, 22);
      
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      doc.text(`Total Amount: ₹${totals.GrandTotal.toLocaleString()}`, 14, 38);
      
      const tableColumn = ["Event", "Name", "Category", "Price", "Date"];
      const tableRows = filteredExpenses.map(e => [
        e.event?.toUpperCase(),
        e.name,
        e.category,
        `Rs. ${e.price.toLocaleString()}`,
        new Date(e.date).toLocaleDateString()
      ]);

      doc.autoTable({
        startY: 45,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [157, 118, 193], fontWeight: 'bold' },
        styles: { fontSize: 10 },
      });

      doc.save(`Wedding_Report_${new Date().toLocaleDateString()}.pdf`);
    } catch (err) { console.error('❌ PDF Export Error:', err); }
  };

  return (
    <ExpenseContext.Provider value={{ 
      expenses: filteredExpenses, 
      allExpenses: expenses,
      loading, 
      totals, 
      dateRange,
      setDateRange,
      globalCategory,
      setGlobalCategory,
      fetchExpenses,
      fetchEventExpenses,
      addExpense, 
      updateExpense, 
      deleteExpense,
      exportAllToCSV,
      exportAllToPDF
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
