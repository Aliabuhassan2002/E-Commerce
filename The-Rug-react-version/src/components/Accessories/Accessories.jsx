// import React, { useState } from "react";
// import { Minus, Plus, ShoppingCart } from 'react-feather';

// const products = [
//   { id: 1, name: "Rug Pad", price: 50, image: "src/assets/22159497_72902322744531.jpg" },
//   { id: 2, name: "Rug Pad", price: 50, image: "src/assets/22159497_72902322744531.jpg" },
//   { id: 3, name: "Rug Pad", price: 50, image: "src/assets/22159497_72902322744531.jpg" },
//   { id: 4, name: "Rug Pad", price: 50, image: "src/assets/22159497_72902322744531.jpg" },
//   { id: 5, name: "Rug Pad", price: 50, image: "src/assets/22159497_72902322744531.jpg" },
//   { id: 6, name: "Rug Pad", price: 50, image: "src/assets/22159497_72902322744531.jpg" },
// ];

// const Accessories = () => {
//   const [cart, setCart] = useState([]);
//   const [quantities, setQuantities] = useState({});

//   const handleQuantityChange = (id, value) => {
//     setQuantities((prev) => ({ ...prev, [id]: Math.max(0, value) }));
//   };

//   return (
//     <div className="p-6 pt-35">
//       <h2 className="text-2xl font-bold text-center mb-6">Accessories</h2>
//       <div className="grid grid-cols-3 gap-6">
//         {products.map((product) => (
//         //   <div key={product.id} className="border rounded-lg p-4 shadow-md">
//         //     <img
//         //       src={product.image}
//         //       alt={product.name}
//         //       className="w-full h-40 object-cover rounded-md"
//         //     />
//         //     <h5 className="text-lg font-bold mt-2 text-center">{product.name}</h5>
//         //     <div className="flex justify-between items-center mt-2">
//         //       <div className="flex items-center">
//         //         <button
//         //           className="p-2 border rounded-l-lg"
//         //           onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 0) - 1)}
//         //         >
//         //           <Minus size={16} />
//         //         </button>
//         //         <input
//         //           type="number"
//         //           className="w-12 text-center border-t border-b"
//         //           value={quantities[product.id] || 0}
//         //           onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
//         //         />
//         //         <button
//         //           className="p-2 border rounded-r-lg"
//         //           onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 0) + 1)}
//         //         >
//         //           <Plus size={16} />
//         //         </button>
//         //       </div>
//         //       <span className="text-xl font-bold">${product.price}</span>
//         //     </div>
//         //     <button className="w-full mt-3 bg-blue-500 text-white py-2 rounded-lg flex justify-center items-center gap-2">
//         //       <ShoppingCart size={16} /> Add to Cart
//         //     </button>
//         //   </div>

//         <div key={product.id} className="border rounded-lg p-4 shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
//     <img
//       src={product.image}
//       alt={product.name}
//       className="w-full h-40 object-cover rounded-md mb-4" // Added margin-bottom
//     />
//     <h5 className="text-lg font-bold text-center mb-2">{product.name}</h5> {/* Added margin-bottom */}
//     <div className="flex justify-between items-center mb-3"> {/* Added margin-bottom */}
//       <div className="flex items-center">
//         <button
//           className="p-2 border rounded-l-lg bg-gray-100 hover:bg-gray-200" // Added background color and hover effect
//           onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 0) - 1)}
//         >
//           <Minus size={16} />
//         </button>
//         <input
//           type="number"
//           className="w-12 text-center border-t border-b focus:outline-none" // Added focus outline removal
//           value={quantities[product.id] || 0}
//           onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
//         />
//         <button
//           className="p-2 border rounded-r-lg bg-gray-100 hover:bg-gray-200" // Added background color and hover effect
//           onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 0) + 1)}
//         >
//           <Plus size={16} />
//         </button>
//       </div>
//       <span className="text-xl font-bold">${product.price}</span>
//     </div>
//     <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex justify-center items-center gap-2 transition duration-300"> {/* Added hover effect and transition */}
//       <ShoppingCart size={16} /> Add to Cart
//     </button>
//   </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Accessories;


import React, { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "../../ProductSlice";
import "./Accessories.css"


const products = [
  { id: 1, name: "Rug Pad", price: 50, image: "src/assets/22159497_72902322744531.jpg" },
  { id: 2, name: "Rug Pad", price: 50, image: "src/assets/22159497_72902322744531.jpg" },
  { id: 3, name: "Rug Pad", price: 50, image: "src/assets/22159497_72902322744531.jpg" },
  { id: 4, name: "Rug Pad", price: 50, image: "src/assets/22159497_72902322744531.jpg" },
  { id: 5, name: "Rug Pad", price: 50, image: "src/assets/22159497_72902322744531.jpg" },
  { id: 6, name: "Rug Pad", price: 50, image: "src/assets/22159497_72902322744531.jpg" },
];

const Accessories = () => {

    const dispatch=useDispatch();


function increaseCounter(){

    dispatch(increment());

}

  return (
    <div className=" flex flex-col justify-center p-6 pt-35">
      <h2 className="text-2xl font-bold text-center mb-6">Accessories</h2>
    <div className="p-6 grid grid-cols-3 gap-6 justify-center ml-33">
      {products.map((product) => (
        <div key={product.id} className="w-72 border rounded-lg shadow-lg overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-lg font-bold">{product.name}</h5>
              <button className="button"  onClick={ increaseCounter }
              
              
              >

              <ShoppingCart size={20} className="text-gray-600 text-stone-600" />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center border rounded-md overflow-hidden">
                <button
                  className="p-2 bg-gray-200"
                 
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  className="w-12 text-center border-t border-b"
                min={0}
                
                />
                <button
                  className="p-2 bg-gray-200"
              
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-xl font-bold">${product.price}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};
export default Accessories;
