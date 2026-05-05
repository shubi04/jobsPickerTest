import { Search, X } from "lucide-react";
import { useState } from "react";

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
const experienceLevels = ["Entry Level", "Mid Level", "Senior Level", "Executive"];

interface JobFiltersProps {
  onSearch: (q: string) => void;
  onFilter: (name: string, value: string) => void;
  onClear: () => void;
  filters: { q: string; type: string; experience: string };
}

export function JobFilters({ onSearch, onFilter, onClear, filters }: JobFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(filters.q || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const hasFilters = filters.q || filters.type || filters.experience;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jobs by title, skill, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button type="submit" className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-muted-foreground">Job Type:</span>
        {jobTypes.map((type) => (
          <button
            key={type}
            onClick={() => onFilter("type", type)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              filters.type === type ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-muted-foreground">Experience:</span>
        {experienceLevels.map((level) => (
          <button
            key={level}
            onClick={() => onFilter("experience", level)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              filters.experience === level ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {hasFilters && (
        <button onClick={onClear} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
          Clear all filters
        </button>
      )}
    </div>
  );
}
