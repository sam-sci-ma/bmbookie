"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Filter } from "lucide-react";
import { useDebounce } from "use-debounce";

interface SpaceFiltersProps {
  categories: string[];
}

export function SpaceFilters({ categories }: SpaceFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for immediate UI feedback
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("type") || "All");
  
  // Debounce the search term to avoid excessive DB calls (300ms)
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (debouncedSearch) {
      params.set("query", debouncedSearch);
    } else {
      params.delete("query");
    }

    if (activeCategory !== "All") {
      params.set("type", activeCategory);
    } else {
      params.delete("type");
    }

    // Update the URL without a full page reload
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, activeCategory, pathname, router]);

  return (
    <div className="space-y-6">
      {/* SEARCH BAR */}
      <div className="relative group max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search codes (e.g., B2-CR01) or Amphis..."
          className="w-full bg-card border-2 border-foreground p-3.5 pl-11 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] outline-none focus:border-primary transition-all font-bold placeholder:text-muted-foreground/40 text-sm"
        />
      </div>

      {/* CATEGORY CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
        <div className="bg-foreground text-background dark:bg-primary p-2.5 rounded-lg shrink-0 shadow-[2px_2px_0px_0px_rgba(215,73,42,1)]">
          <Filter className="w-3.5 h-3.5" />
        </div>
        {categories.map((type) => (
          <button
            key={type}
            onClick={() => setActiveCategory(type)}
            className={`rounded-lg border-2 font-black uppercase tracking-widest text-[9px] h-9 px-4 shrink-0 transition-all active:scale-95 ${
              activeCategory === type
                ? "bg-primary text-white border-primary shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                : "bg-card border-border hover:border-primary hover:text-primary shadow-[1px_1px_0px_0px_rgba(0,0,0,0.05)]"
            }`}
          >
            {type}{type !== "All" ? "s" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}