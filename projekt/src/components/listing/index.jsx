"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import useFetch from "@/hooks/useFetch";
import Pagination from "../pagination";
import SearchBox from "../searchBox";
import FilterButtons from "../filterButtons";

const FILTERS = [
  { label: "New", value: "new" },
  { label: "A-Z Ascending", value: "alpha-asc" },
  { label: "Z-A Descending", value: "alpha-desc" },
  { label: "By User", value: "by-user" },
];

const sortItems = (a, b, type) => {
  switch (type) {
    case "alpha-asc":
      return (a.title || "")
        .toLowerCase()
        .localeCompare((b.title || "").toLowerCase());
    case "alpha-desc":
      return (b.title || "")
        .toLowerCase()
        .localeCompare((a.title || "").toLowerCase());
    case "new":
      return new Date(b.createdAt) - new Date(a.createdAt);
    case "by-user":
      return (a.userId || 0) - (b.userId || 0);
    default:
      return 0;
  }
};

const SORT_FUNCTIONS = {
  "alpha-asc": (a, b) => sortItems(a, b, "alpha-asc"),
  "alpha-desc": (a, b) => sortItems(a, b, "alpha-desc"),
  new: (a, b) => sortItems(a, b, "new"),
  "by-user": (a, b) => sortItems(a, b, "by-user"),
};

export default function Listing() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("new");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // kravsspecifikation: maks 6 bytte-ting ad gangen
  const { data, error, loading } = useFetch("/listings");
  const { data: categories } = useFetch("/categories");

  const filteredItems = useMemo(() => {
    let result = Array.isArray(data) ? data : [];

    // Filtrer efter kategori
    if (selectedCategory) {
      result = result.filter((item) => item.categoryId === selectedCategory);
    }

    if (search) {
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(search.toLowerCase()) ||
          item.description?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    const sortFunction = SORT_FUNCTIONS[filter];
    if (sortFunction) {
      result = [...result].sort(sortFunction);
    }

    return result;
  }, [data, search, filter, selectedCategory]);

  // Nulstil side når der søges eller filtreres
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, selectedCategory]);

  const paginatedItems = useMemo(() => {
    // gemmer dem der skal vises på den aktuelle side så vi ikke skal beregne det hver gang
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredItems, currentPage]);

  const titleRefs = useRef({});
  const [overflowingIds, setOverflowingIds] = useState({});

  useEffect(() => {
    setOverflowingIds(
      paginatedItems.reduce((acc, item) => {
        const ref = titleRefs.current[item.id];
        if (ref?.scrollWidth > ref?.clientWidth) acc[item.id] = true;
        return acc;
      }, {}),
    );
  }, [paginatedItems]);

  const categoryList = Array.isArray(categories) ? categories : [];

  return (
    <div className="listing">
      <div className="listing__controls">
        <SearchBox
          search={search}
          onSearchChange={setSearch}
          placeholder="Search"
        />
        <FilterButtons
          filters={FILTERS}
          currentFilter={filter}
          onFilterChange={setFilter}
        />
      </div>

      {/* Opgave A: Kategori-filtrering */}
      {categoryList.length > 0 && (
        <div className="listing__categories">
          <button
            className={`listing__category-btn${
              !selectedCategory ? " listing__category-btn--active" : ""
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categoryList.map((cat) => (
            <button
              key={cat.id}
              className={`listing__category-btn${
                selectedCategory === cat.id
                  ? " listing__category-btn--active"
                  : ""
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {search && filteredItems.length === 0 && !loading && (
        <div className="listing__search-results">
          No search results found for come back later: "{search}"
        </div>
      )}

      {loading && <div className="listing__loading">Loading...</div>}
      {error && <div className="listing__error">Error: {error.message}</div>}

      <div className="listing__grid">
        {paginatedItems.map((item) => (
          <Link
            href={`/details/${item.id}`}
            className="listing__card"
            key={item.id}
          >
            <div className="listing__image">
              {item.asset?.url ? (
                <Image
                  src={item.asset.url}
                  alt={item.title}
                  width={300}
                  height={300}
                  loading="lazy"
                  className="listing__img"
                />
              ) : (
                <Image
                  src="/images/placeholder.svg"
                  alt={item.title}
                  width={300}
                  height={300}
                  loading="lazy"
                  className="listing__img"
                />
              )}
            </div>
            <div className="listing__title-wrapper">
              <p
                className={`listing__title marquee-text${
                  overflowingIds[item.id] ? " overflowing" : ""
                }`}
                ref={(titleElement) =>
                  (titleRefs.current[item.id] = titleElement)
                }
              >
                {item.title || "Text"}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.max(1, Math.ceil(filteredItems.length / itemsPerPage))}
        // "ceil" runder op til nærmeste hele tal
        onPageChange={(page) => {
          setCurrentPage(page);
        }}
      />
    </div>
  );
}
