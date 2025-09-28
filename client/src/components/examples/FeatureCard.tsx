import FeatureCard from '../FeatureCard';
import featureImage from "@assets/generated_images/Fated_raids_screenshot_916448c2.png";

export default function FeatureCardExample() {
  return (
    <div className="max-w-sm">
      <FeatureCard 
        image={featureImage}
        title="Fated Raids"
        description="Hemos implementado 'raids fatales' lo que significa que hemos actualizado tanto las recompensas como la dificultad de todos los raids de Legion."
        type="Action"
        category="raids"
      />
    </div>
  );
}