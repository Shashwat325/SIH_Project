import { Link } from "react-router-dom";

interface SpeciesCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
}

const SpeciesCard = ({ id, name, description, image, category }: SpeciesCardProps) => {
  return (
    <Link to={`/species/${id}`}>
      <div className="ocean-card p-6 h-full group cursor-pointer wave-animation">
        <div className="flex flex-col h-full">
          {/* Image */}
          <div className="w-full h-48 bg-gradient-to-br from-ocean-light to-ocean-muted rounded-lg mb-4 overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          
          {/* Category Badge */}
          <div className="inline-flex w-fit mb-3">
            <span className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {category}
            </span>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>
          
          {/* Hover indicator */}
          <div className="mt-4 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Learn more →
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SpeciesCard;