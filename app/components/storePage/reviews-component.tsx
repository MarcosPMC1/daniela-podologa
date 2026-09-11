import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Star } from "lucide-react";

interface ReviewsComponentProps {
  content: {
    reviews?: {
      title?: string;
      list?: {
        name: string;
        rating: number;
        comment: string;
      }[];
    };
  };
  primaryColor?: string;
}

export function ReviewsComponent({
  content,
  primaryColor = "#0a9900",
}: ReviewsComponentProps) {
  const reviewsList = content?.reviews?.list ?? [];

  if (reviewsList.length === 0) return null;

  return (
    <section className="w-full px-4 sm:px-8 lg:px-16 py-16 lg:py-24" aria-label="Avaliações">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div
            className="p-2.5 rounded-2xl"
            style={{ backgroundColor: primaryColor + "22" }}
          >
            <MessageSquare className="w-6 h-6" style={{ color: primaryColor }} />
          </div>
          <h2 className="text-3xl font-bold">
            {content.reviews?.title || "O que dizem nossos clientes"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsList.map((review, index) => (
            <Card key={index} className="rounded-3xl shadow-xl border-0 ring-1 ring-black/10 overflow-hidden">
              <CardContent className="p-8 space-y-6">
                {/* Header: Avatar + Name */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-xl tracking-tight">{review.name}</span>
                </div>

                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5"
                      fill={i < review.rating ? primaryColor : "transparent"}
                      style={{ color: i < review.rating ? primaryColor : "#d1d5db" }}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-lg leading-relaxed text-muted-foreground italic">
                  "{review.comment}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
