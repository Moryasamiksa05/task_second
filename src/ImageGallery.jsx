import { useState, useRef, useEffect } from "react";
import "./ImageGallery.css";

const ImageGallery = ({ images, onDelete }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRefs = useRef([]);

  const handleDelete = (index) => {
    onDelete(index);
    setOpenMenuIndex(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuIndex !== null &&
        menuRefs.current[openMenuIndex] &&
        !menuRefs.current[openMenuIndex].contains(event.target)
      ) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuIndex]);

  return (
    <div className="gallery">
      <h2>Uploaded Images</h2>
      {images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        <div className="gallery-grid">
          {images.map((img, i) => (
            <div
              key={i}
              className="gallery-card"
              ref={(el) => (menuRefs.current[i] = el)}
            >
              <img src={img} alt={`uploaded-${i}`} />

              <div className="menu-container">
                <button
                  className="menu-button"
                  onClick={() =>
                    setOpenMenuIndex(openMenuIndex === i ? null : i)
                  }
                >
                  &#8942;
                </button>

                {openMenuIndex === i && (
                  <div className="menu-dropdown">
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(i)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
