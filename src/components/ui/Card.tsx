import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  textColor: string;
}

export function Card({ title, value, icon: Icon, iconColor, bgColor, textColor }: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-2 ${bgColor} rounded-full`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-2xl font-semibold ${textColor}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}