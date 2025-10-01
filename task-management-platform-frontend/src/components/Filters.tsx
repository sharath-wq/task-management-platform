import React, { useEffect, useState } from "react";
import type { Filters } from "../interface";

interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export default function FilterComponent({ filters, setFilters }: Props) {
  const [searchText, setSearchText] = useState(filters.search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters({ ...filters, search: searchText });
    }, 500);

    return () => clearTimeout(handler);
  }, [searchText]);

  return (
    <aside className="sidebar">
      <h3>Filters</h3>

      <div className="filter-group">
        <label>Status:</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="all">All</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Priority:</label>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Search:</label>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search tasks..."
        />
      </div>
    </aside>
  );
}
