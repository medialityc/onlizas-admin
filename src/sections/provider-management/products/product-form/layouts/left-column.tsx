import BasicInfoSection from '../components/basic-info-section';
import CategoriesAndSuppliersSection from '../components/categories-suppliers-section';
import SpecificationsSection from '../components/specifications-section';

function LeftColumn() {
  return (
    <div className="space-y-8">
      <BasicInfoSection />
      <CategoriesAndSuppliersSection />
      <SpecificationsSection />
    </div>
  );
}

export default LeftColumn;
