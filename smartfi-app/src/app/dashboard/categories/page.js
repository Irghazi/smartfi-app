'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { 
  Utensils, Car, Film, HeartPulse, GraduationCap, 
  Receipt, Wallet, ShoppingCart, Plane, Home, 
  Zap, Droplet, Wifi, Phone, Coffee, 
  Shirt, Gift, Monitor, Briefcase, Plus, Circle, LayoutGrid 
} from 'lucide-react';

const ICON_MAP = {
  Utensils, Car, Film, HeartPulse, GraduationCap, 
  Receipt, Wallet, ShoppingCart, Plane, Home, 
  Zap, Droplet, Wifi, Phone, Coffee, 
  Shirt, Gift, Monitor, Briefcase, Plus
};

const COLORS = [
  'bg-blue-500', 'bg-sky-500', 'bg-cyan-500', 'bg-teal-500', 'bg-indigo-500', 
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-yellow-500', 
  'bg-amber-500', 'bg-orange-500', 'bg-stone-500', 'bg-neutral-500', 'bg-slate-500'
];

// Helper untuk background default
const getHexColor = (colorClass) => {
  if (!colorClass) return null;
  if (colorClass.startsWith('#')) return colorClass;
  const colorMap = {
    'bg-blue-500': '#3b82f6', 'bg-sky-500': '#0ea5e9', 'bg-cyan-500': '#06b6d4', 'bg-teal-500': '#14b8a6', 'bg-indigo-500': '#6366f1', 
    'bg-violet-500': '#8b5cf6', 'bg-purple-500': '#a855f7', 'bg-fuchsia-500': '#d946ef', 'bg-pink-500': '#ec4899', 'bg-yellow-500': '#eab308', 
    'bg-amber-500': '#f59e0b', 'bg-orange-500': '#f97316', 'bg-stone-500': '#78716c', 'bg-neutral-500': '#737373', 'bg-slate-500': '#64748b'
  };
  return colorMap[colorClass] || colorClass;
};

const DEFAULT_CATEGORIES = [
  { id: 'def-1', name: 'Makanan', type: 'expense', icon_name: 'Utensils', color: '#3b82f6', is_default: true },
  { id: 'def-2', name: 'Transportasi', type: 'expense', icon_name: 'Car', color: '#f59e0b', is_default: true },
  { id: 'def-3', name: 'Hiburan', type: 'expense', icon_name: 'Film', color: '#8b5cf6', is_default: true },
  { id: 'def-4', name: 'Gaji', type: 'income', icon_name: 'Wallet', color: '#10b981', is_default: true },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('expense');
  const [selectedIcon, setSelectedIcon] = useState('Wallet');
  const [selectedColor, setSelectedColor] = useState('bg-blue-500');

  const [supabase] = useState(() => 
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  );

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      let user = null;
      try {
        const { data } = await supabase.auth.getUser();
        user = data?.user;
      } catch (authError) {
        console.error('Failed to get user (Possible network/init error):', authError);
      }
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_categories')
        .select('*')
        .eq('user_id', user.id);

      if (error && error.code !== '42P01') { 
        console.error(error);
      }

      setCategories([...DEFAULT_CATEGORIES, ...(data || [])]);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [supabase]);

  const handleEditClick = (category) => {
    setIsEditing(true);
    setEditId(category.id);
    setNewName(category.name);
    setNewType(category.type);
    setSelectedIcon(category.icon_name || 'Wallet');
    setSelectedColor(category.color || category.bg_color || 'bg-blue-500');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditId(null);
    setNewName('');
    setNewType('expense');
    setSelectedIcon('Wallet');
    setSelectedColor('bg-blue-500');
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Pengguna tidak terautentikasi");

      if (isEditing) {
        const { error } = await supabase.from('user_categories')
          .update({
            name: newName,
            type: newType,
            icon_name: selectedIcon,
            color: selectedColor
          })
          .eq('id', editId);
          
        if (error) throw new Error(error.message || JSON.stringify(error));
      } else {
        const { error } = await supabase.from('user_categories').insert([
          {
            user_id: user.id,
            name: newName,
            type: newType,
            icon_name: selectedIcon,
            color: selectedColor,
            is_default: false
          }
        ]);
        if (error) throw new Error(error.message || JSON.stringify(error));
      }

      closeModal();
      fetchCategories();
    } catch (err) {
      console.error("Gagal menyimpan kategori:", err.message);
      alert('Gagal menyimpan kategori. Pastikan tabel user_categories ada di Supabase.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus kategori ini?')) return;
    try {
      const { error } = await supabase
        .from('user_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus kategori');
    }
  };

  return (
    <div className="w-full relative pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center flex-shrink-0">
            <LayoutGrid size={24} strokeWidth={2.5} className="text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black uppercase tracking-tight">Manajemen Kategori</h1>
            <p className="text-base text-black font-bold mt-1 uppercase tracking-wider">Kelola kategori transaksi sesuai kebutuhanmu.</p>
          </div>
        </div>
        <button 
          onClick={() => {
            closeModal();
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-5 py-3 text-sm font-bold uppercase hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center gap-2"
        >
          <Plus strokeWidth={3} size={20} /> Tambah Kategori Baru
        </button>
      </div>

      {/* Grid Container */}
      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-gray-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-40"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const IconComp = ICON_MAP[cat.icon_name] || Circle;
              const colorVal = cat.color || cat.bg_color;
              const isTailwindColor = colorVal && colorVal.startsWith('bg-');
              const hexColor = getHexColor(colorVal);
              
              return (
                <div key={cat.id} className="bg-white border-4 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col">
                  {/* Baris Atas Kartu */}
                  <div className="flex items-center justify-between">
                    {/* Ikon Kategori */}
                    <div 
                      className={`w-12 h-12 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black ${isTailwindColor ? colorVal : ''}`} 
                      style={!isTailwindColor && hexColor ? { backgroundColor: hexColor } : { backgroundColor: '#dbeafe' }}
                    >
                      <IconComp size={24} strokeWidth={2.5} />
                    </div>
                    
                    {/* Aksi (Edit & Delete) */}
                    {!cat.is_default && (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditClick(cat)} 
                          className="bg-yellow-300 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-1.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all text-black" 
                          aria-label="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)} 
                          className="bg-red-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-1.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all text-black" 
                          aria-label="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Tengah Kartu (Nama Kategori) */}
                  <div className="mt-5 flex-1">
                    <h3 className="text-black font-extrabold text-xl uppercase tracking-wider">{cat.name}</h3>
                  </div>

                  {/* Baris Bawah (Badge) */}
                  <div className="mt-4">
                    <span className={`inline-block px-3 py-1.5 border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${cat.type === 'expense' ? 'bg-red-400 text-black' : 'bg-green-400 text-black'}`}>
                      {cat.type === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Tambah/Edit Kategori */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b-4 border-black flex justify-between items-center bg-[#e6f0ff] sticky top-0 z-10">
              <h2 className="text-2xl font-bold text-black uppercase">{isEditing ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
              <button 
                onClick={closeModal} 
                className="bg-red-400 border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all text-black"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-white">
              <form id="categoryForm" onSubmit={handleAddCategory} className="space-y-6">
                
                {/* Nama Kategori */}
                <div>
                  <label className="block text-sm font-bold text-black uppercase tracking-widest mb-2">Nama Kategori</label>
                  <input 
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-3 border-4 border-black bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-black font-bold text-lg"
                    placeholder="Contoh: Belanja Bulanan"
                  />
                </div>

                {/* Tipe Kategori */}
                <div>
                  <label className="block text-sm font-bold text-black uppercase tracking-widest mb-2">Tipe</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setNewType('expense')}
                      className={`py-3 px-4 border-4 border-black text-sm font-bold uppercase transition-all flex justify-center items-center ${newType === 'expense' ? 'bg-red-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5' : 'bg-white text-black hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
                    >
                      Pengeluaran
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewType('income')}
                      className={`py-3 px-4 border-4 border-black text-sm font-bold uppercase transition-all flex justify-center items-center ${newType === 'income' ? 'bg-green-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5' : 'bg-white text-black hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
                    >
                      Pemasukan
                    </button>
                  </div>
                </div>

                {/* Grid Ikon */}
                <div>
                  <label className="block text-sm font-bold text-black uppercase tracking-widest mb-2">Pilih Ikon</label>
                  <div className="grid grid-cols-5 gap-3">
                    {Object.keys(ICON_MAP).map(iconName => {
                      const Icon = ICON_MAP[iconName];
                      const isSelected = selectedIcon === iconName;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setSelectedIcon(iconName)}
                          className={`flex items-center justify-center p-3 border-4 border-black transition-all ${isSelected ? 'bg-yellow-300 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5' : 'bg-white text-black hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
                        >
                          <Icon size={24} strokeWidth={isSelected ? 3 : 2} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Grid Warna */}
                <div>
                  <label className="block text-sm font-bold text-black uppercase tracking-widest mb-2">Pilih Warna</label>
                  <div className="grid grid-cols-5 gap-3">
                    {COLORS.map(color => {
                      const isSelected = selectedColor === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`w-full aspect-square border-4 border-black ${color} transition-all flex items-center justify-center ${isSelected ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' : 'hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
                        >
                          {isSelected && <div className="w-3 h-3 bg-white border-2 border-black rounded-none"></div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t-4 border-black bg-[#e6f0ff] sticky bottom-0 z-10">
              <button 
                type="submit"
                form="categoryForm"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-black py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold uppercase text-lg hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all disabled:bg-gray-400 disabled:shadow-none disabled:translate-y-0 disabled:translate-x-0 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'MENYIMPAN...' : (isEditing ? 'SIMPAN PERUBAHAN' : 'SIMPAN KATEGORI')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
