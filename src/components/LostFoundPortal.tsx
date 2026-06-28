import React, { useState } from 'react';
import { LostFoundItem } from '../types';
import { Search, Plus, Trash, Check, MessageSquare, AlertCircle, Phone, User, Calendar, MapPin, Inbox } from 'lucide-react';

export default function LostFoundPortal() {
  // Lost Found database state (in local storage)
  const [items, setItems] = useState<LostFoundItem[]>(() => {
    const saved = localStorage.getItem('sms_lostfound');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'lf1',
        itemName: 'Hp Laser Mouse – Black',
        type: 'Lost',
        category: 'Electronics',
        description: 'Lost Hp USB laser mouse in computer Lab 3 on 5th row desk. Please contact if found.',
        date: '2026-06-25',
        location: 'Computer Lab 3',
        reporterName: 'Amit Sharma',
        reporterContact: '+91 98765 11111',
        resolved: false
      },
      {
        id: 'lf2',
        itemName: 'BCA 5th Sem Syllabus Handbook',
        type: 'Found',
        category: 'Books',
        description: 'Found a printed spiral syllabus book lying in the college canteen on Table 4.',
        date: '2026-06-27',
        location: 'College Canteen Table 4',
        reporterName: 'Saurabh Anand',
        reporterContact: 'saurabh.anand@college.edu',
        resolved: false
      }
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<'All' | 'Lost' | 'Found'>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState<'Lost' | 'Found'>('Lost');
  const [category, setCategory] = useState<'Electronics' | 'Documents' | 'Books' | 'Personal' | 'Other'>('Electronics');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');

  // Selected contact item state
  const [contactingItem, setContactingItem] = useState<LostFoundItem | null>(null);
  const [contactMsg, setContactMsg] = useState('');

  const saveItems = (updated: LostFoundItem[]) => {
    setItems(updated);
    localStorage.setItem('sms_lostfound', JSON.stringify(updated));
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !description || !reporterName || !reporterContact) return;

    const newItem: LostFoundItem = {
      id: `lf-${Date.now()}`,
      itemName,
      type: itemType,
      category,
      description,
      date: date || new Date().toISOString().split('T')[0],
      location: location || 'Campus',
      reporterName,
      reporterContact,
      resolved: false
    };

    saveItems([newItem, ...items]);
    
    // reset form
    setItemName('');
    setDescription('');
    setDate('');
    setLocation('');
    setReporterName('');
    setReporterContact('');
    setShowCreateModal(false);
  };

  const handleToggleResolve = (itemId: string) => {
    const updated = items.map(it => {
      if (it.id === itemId) {
        return {
          ...it,
          resolved: !it.resolved
        };
      }
      return it;
    });
    saveItems(updated);
  };

  const handleSendClaimMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMsg.trim() || !contactingItem) return;

    alert(`Message dispatched to ${contactingItem.reporterName} successfully! They will contact you shortly.`);
    setContactMsg('');
    setContactingItem(null);
  };

  // Filter items
  const filteredItems = items.filter(it => {
    const typeMatch = activeType === 'All' || it.type === activeType;
    const searchMatch = it.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        it.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        it.location.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && searchMatch;
  });

  return (
    <div className="space-y-6" id="lost_found_portal_module">
      {/* Configuration Header Row */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Inbox className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Campus Lost & Found Register</h3>
            <p className="text-xs text-slate-500 font-medium font-sans">Crowdsourced locker room to report lost personal components or return discovered items.</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer self-start md:self-auto transition"
        >
          <Plus className="h-4 w-4" />
          Report Item
        </button>
      </div>

      {/* Directory Filter controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Toggle Types */}
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 w-max select-none shadow-2xs">
          <button
            onClick={() => setActiveType('All')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md cursor-pointer transition ${
              activeType === 'All' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => setActiveType('Lost')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md cursor-pointer transition ${
              activeType === 'Lost' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Lost Reports
          </button>
          <button
            onClick={() => setActiveType('Found')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md cursor-pointer transition ${
              activeType === 'Found' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Found Bulletins
          </button>
        </div>

        {/* Text Filter */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search items, tags, places..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-slate-200 rounded-lg py-1.5 pl-8.5 pr-3 text-xs focus:outline-blue-500 font-semibold w-64 bg-white"
          />
        </div>
      </div>

      {/* Grid of reported items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-xl max-w-md mx-auto">
          <p className="text-xs text-slate-400 italic">No reports listed matching search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map(it => (
            <div key={it.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                    it.type === 'Lost' 
                      ? 'bg-red-50 text-red-600 border border-red-100' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}>
                    {it.type}
                  </span>

                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    {it.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-2">
                    {it.itemName}
                    {it.resolved && (
                      <span className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded font-extrabold flex items-center gap-0.5">
                        <Check className="h-3 w-3" /> Resolved
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{it.description}</p>
                </div>
              </div>

              {/* Specifications */}
              <div className="border-t border-slate-50 pt-3 text-[11px] text-slate-400 font-semibold grid grid-cols-2 gap-y-1.5 gap-x-2">
                <span className="flex items-center gap-1 font-sans">
                  <Calendar className="h-3.5 w-3.5 text-slate-300" /> Date: {it.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-300" /> Place: {it.location}
                </span>
                <span className="flex items-center gap-1 col-span-2">
                  <User className="h-3.5 w-3.5 text-slate-300" /> Contact Owner: {it.reporterName}
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-1 border-t border-slate-50 gap-2">
                <button
                  onClick={() => handleToggleResolve(it.id)}
                  className="border border-slate-200 hover:bg-slate-50 text-[10px] font-bold py-1 px-2.5 rounded-lg cursor-pointer"
                >
                  {it.resolved ? 'Mark Unresolved' : 'Mark Resolved'}
                </button>

                <button
                  onClick={() => setContactingItem(it)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold py-1 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Claim / Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Claim / Contact Dialog Overlay */}
      {contactingItem && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-xl border border-slate-200 max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-slate-800 text-sm">Contact owner ({contactingItem.reporterName})</h4>
              <button
                onClick={() => setContactingItem(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base focus:outline-none"
              >
                ×
              </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs space-y-1.5 font-medium text-blue-800">
              <div className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                <span className="font-bold">Immediate contact link:</span>
              </div>
              <p className="font-mono font-bold select-all text-slate-700">{contactingItem.reporterContact}</p>
            </div>

            <form onSubmit={handleSendClaimMessage} className="space-y-3 text-xs font-semibold">
              <label className="block text-slate-500 uppercase">Write a secured message</label>
              <textarea
                required
                rows={3}
                placeholder="Write your email/phone and details of how you can pick up the item..."
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-blue-500 text-slate-700 font-medium"
              />

              <div className="flex justify-end pt-2 border-t border-slate-100 gap-2">
                <button
                  type="button"
                  onClick={() => setContactingItem(null)}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-1.5 px-4 rounded-lg cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-5 rounded-lg cursor-pointer shadow-xs transition"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Host report item dialog */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-slate-800 text-sm">Submit Lost & Found Report</h4>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base focus:outline-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-500 uppercase mb-1">Item Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Leather wallet, blue folder..."
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Type</label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-blue-500 font-bold"
                  >
                    <option value="Lost">Lost Item</option>
                    <option value="Found">Found Item</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-blue-500 font-bold"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Documents">Documents</option>
                    <option value="Books">Books</option>
                    <option value="Personal">Personal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Brief Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Paste details of make, color, contents, unique tags..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Location / Venue</label>
                  <input
                    type="text"
                    placeholder="Auditorium, Desk 3..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Reporter Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Saurabh Anand"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Reporter Phone/Email</label>
                  <input
                    type="text"
                    required
                    placeholder="+91..."
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100 gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2 px-4 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg cursor-pointer shadow-xs transition"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
