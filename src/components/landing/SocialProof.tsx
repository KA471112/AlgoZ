import React from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

interface Statistic {
  label: string;
  value: string;
  description: string;
}

interface SocialProofProps {
  testimonials?: Testimonial[];
  statistics?: Statistic[];
}

const SocialProof = ({
  testimonials = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Portfolio Manager",
      company: "Quantum Capital",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      content:
        "AlgoZ has transformed our trading strategy. The automation tools are incredibly powerful and reliable.",
      rating: 5,
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      role: "Independent Trader",
      company: "Self-employed",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      content:
        "The platform's ease of use and advanced features make it my go-to choice for algorithmic trading.",
      rating: 5,
    },
  ],
  statistics = [
    {
      label: "Total Trading Volume",
      value: "$2.5B+",
      description: "Processed in 2023",
    },
    {
      label: "Active Traders",
      value: "50,000+",
      description: "Worldwide",
    },
    {
      label: "Success Rate",
      value: "94%",
      description: "Profitable strategies",
    },
  ],
}: SocialProofProps) => {
  return (
    <section className="w-full py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Trusted by Traders Worldwide
          </h2>
          <p className="text-muted-foreground">
            Join thousands of successful traders using AlgoZ
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {statistics.map((stat, index) => (
            <Card key={index} className="bg-card">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="text-sm py-1 px-4">
              SOC 2 Certified
            </Badge>
            <Badge variant="secondary" className="text-sm py-1 px-4">
              256-bit Encryption
            </Badge>
            <Badge variant="secondary" className="text-sm py-1 px-4">
              24/7 Support
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
