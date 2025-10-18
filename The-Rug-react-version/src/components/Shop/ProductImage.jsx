import { useState, useEffect } from "react";

const ProductImage = ({ imageUrl, altText }) => {
  const [aspectRatio, setAspectRatio] = useState("4/3"); // قيمة افتراضية

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const newAspectRatio = `${img.naturalWidth}/${img.naturalHeight}`;
      setAspectRatio(newAspectRatio);
    };
  }, [imageUrl]);

  return (
    <div
      className={`relative overflow-hidden bg-[#FAF7F0]`}
      style={{ aspectRatio }}
    >
      <img
        src={imageUrl}
        alt={altText}
        className="w-full h-full object-contain"
      />
    </div>
  );
};
export default ProductImage;
