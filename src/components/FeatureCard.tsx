import React from 'react';

type FeatureCardProps = {
  title: string;
  description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <div className="bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="mt-4">{description}</p>
  </div>
);

export default FeatureCard;
