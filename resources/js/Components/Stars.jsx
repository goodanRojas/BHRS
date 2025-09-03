import { Star, StarHalf, Star as StarOutline } from "lucide-react";

const Stars = ({ rating = 0, maxStars = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex space-x-1 text-yellow-500">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} fill="currentColor" stroke="none" />
      ))}
      {hasHalfStar && <StarHalf fill="currentColor" stroke="none" />}
      {[...Array(emptyStars)].map((_, i) => (
        <StarOutline key={i} stroke="currentColor" />
      ))}
    </div>
  );
};

export default Stars;
