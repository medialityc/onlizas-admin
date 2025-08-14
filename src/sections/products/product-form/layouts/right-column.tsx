import ProductImageSection from '../components/product-image-section';
import AboutProductSection from '../components/about-product-section';
import ProductDetailsSection from '../components/product-details-section';

function RightColumn() {
  return (
    <div className="space-y-8">
      <ProductImageSection />
      <AboutProductSection />
      <ProductDetailsSection />
    </div>
  );
}

export default RightColumn;
