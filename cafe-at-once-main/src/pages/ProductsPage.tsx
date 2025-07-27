import React, { useState } from 'react';
import { Filter, Search, Grid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../data/products';
import { useProducts } from '../hooks/useProducts';

const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const limit = 12;

  // Use the backend API
  const { products, loading, error, totalResults, totalPages } = useProducts({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    search: searchTerm || undefined,
    page,
    limit,
    sort: sortBy,
  });

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'concentrate', label: 'Concentrates' },
    { value: 'tube', label: 'Coffee Tubes' },
    { value: 'flavored', label: 'Flavored Coffee' },
    { value: 'tea', label: 'Tea' },
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1); // Reset to first page
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setPage(1); // Reset to first page
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setPage(1); // Reset to first page
  };

  return (
    <div className="min-h-screen bg-cream pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          {/* Vertical Sidebar - Amazon Style */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-6 mr-8 h-fit sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shop by Category</h2>
            
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryChange(category.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{category.label}</span>
                    <span className="text-sm opacity-75">
                      ({category.value === 'all' ? totalResults : '...'})
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Price Filter */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-md font-medium text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary mr-2" />
                  <span className="text-sm">₹0 - ₹400</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary mr-2" />
                  <span className="text-sm">₹400 - ₹600</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary mr-2" />
                  <span className="text-sm">₹600+</span>
                </label>
              </div>
            </div>

            {/* Health Benefits Filter */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-md font-medium text-gray-900 mb-3">Health Benefits</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary mr-2" />
                  <span className="text-sm">Sugar Free</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary mr-2" />
                  <span className="text-sm">Gluten Free</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary mr-2" />
                  <span className="text-sm">Organic</span>
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
              <p className="text-lg text-gray-600">
                <span className="text-green-600 font-semibold">India's Healthiest Coffee</span> - 
                Discover our premium collection of coffee concentrates
              </p>
            </div>

            {/* Search and Controls */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {products.length} of {totalResults} products
                {selectedCategory !== 'all' && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
              </p>
            </div>

            {/* Product Grid/List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Products</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg"
                >
                  Try Again
                </button>
              </div>
            ) : products.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 border rounded-lg ${
                          page === pageNum
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;