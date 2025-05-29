const ImageGallery = ({ images }) => {
  return (
    <div className="gallery">
      <h2>Uploaded Images</h2>
      {images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        <div className="gallery-grid">
          {images.map((img, i) => (
            <div key={i} className="gallery-card">
              <img src={img} alt={`uploaded-${i}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
