import React from 'react';
import { Link } from 'react-router-dom';

const ShopFilters = () => {
  const sizes = [
    { id: 1, label: 'XS', image: 'src/assets/rug8/small.png' },
    { id: 2, label: 'S', image: 'src/assets/rug8/mediumjpg.jpg' },
    { id: 3, label: 'M', image: 'src/assets/rug8/large.jpg' },
    { id: 4, label: 'L', image: 'src/assets/rug8/xl.jpg' },
    { id: 5, label: 'XL', image: 'src/assets/rug8/xll.jpg' },
    { id: 6, label: 'XXL', image: 'src/assets/25229.jpg' },
  ];

  const colors = [
    { id: 1, name: 'Ruby Red', color: '#FF0000' },
    { id: 2, name: 'Sunset Peach', color: '#FFB07F' },
    { id: 3, name: 'Sunshine Yellow', color: '#FFFF00' },
    { id: 4, name: 'Storm Gray', color: '#808080' },
    { id: 5, name: 'Midnight Black', color: '#1A1A1A' },
    { id: 6, name: 'Rich Brown', color: '#4A2012' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-200 to-gray-900 py-16 px-4 flex items-center justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Shop By Size */}
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8 transition-transform duration-300 hover:scale-105">
          <h2 className="text-3xl font-semibold text-center text-white mb-6">Shop By Size</h2>
          <div className="grid grid-cols-3 gap-6">
            {sizes.map((size) => (
              <div key={size.id} className="group relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {size.label}
                  </span>
                </div>
                <Link to={'/shop'}>
                <img
                  src={size.image}
                  alt={`Size ${size.label}`}
                  className="w-full aspect-square object-cover rounded-2xl transform group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  />
                  </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Shop By Color */}

        <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8 transition-transform duration-300 hover:scale-105">
          <h2 className="text-3xl font-semibold text-center text-white mb-6">Shop By Color</h2>
          <div className="grid grid-cols-3 gap-8">
            {colors.map((color) => (
              <div key={color.id} className="group relative flex flex-col items-center">
                <Link to={'/shop'}>
                <div
                  className="w-20 h-20 rounded-full shadow-xl border-2 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl cursor-pointer"
                  style={{ backgroundColor: color.color }}
                  />
                  </Link>
                <p className="text-sm font-medium text-white mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {color.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopFilters;
