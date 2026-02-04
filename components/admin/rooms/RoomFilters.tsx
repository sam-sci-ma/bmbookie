"use client";

import { Search, FilterX } from "lucide-react";

interface RoomFiltersProps {
  onSearch: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
}

export default function RoomFilters({ onSearch, onFilterChange, onClear }: RoomFiltersProps) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-card border border-border rounded-[2rem] shadow-sm transition-colors">
      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search room name or number..." 
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D7492A]/50 transition-all text-sm font-medium"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Campus Filter */}
          <select 
            onChange={(e) => onFilterChange('campus', e.target.value)}
            className="bg-muted/50 border border-border rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider outline-none cursor-pointer hover:bg-muted transition-colors"
          >
            <option value="">All Campuses</option>
            <option value="Benguerir">Benguerir</option>
            <option value="Rabat">Rabat</option>
          </select>

          {/* Building Filter */}
          <select 
            onChange={(e) => onFilterChange('building_id', e.target.value)}
            className="bg-muted/50 border border-border rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider outline-none cursor-pointer hover:bg-muted transition-colors"
          >
            <option value="">All Buildings</option>
            {/* These would ideally be dynamic from your Buildings table */}
            <option value="Building A">Building A</option>
            <option value="Building B">Building B</option>
          </select>

          {/* Bloc (Location) Filter */}
          <select 
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="bg-muted/50 border border-border rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider outline-none cursor-pointer hover:bg-muted transition-colors"
          >
            <option value="">All Blocs</option>
            <option value="A">Bloc A</option>
            <option value="B">Bloc B</option>
            <option value="C">Bloc C</option>
          </select>

          {/* Access Filter */}
          <select 
            onChange={(e) => onFilterChange('is_restricted', e.target.value)}
            className="bg-muted/50 border border-border rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider outline-none cursor-pointer hover:bg-muted transition-colors"
          >
            <option value="">All Access</option>
            <option value="false">Public</option>
            <option value="true">Restricted</option>
          </select>

        </div>

        {/* Clear Button */}
        <button 
          onClick={onClear}
          className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-red-600 transition-colors"
        >
          <FilterX size={16} />
          <span className="hidden xl:inline">Clear</span>
        </button>

      </div>
    </div>
  );
}