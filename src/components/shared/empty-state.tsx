"use client";

import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        {icon || <SearchX className="w-8 h-8 text-gray-400" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 text-center max-w-sm mb-4">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} className="bg-orange-500 hover:bg-orange-600">
          {action.label}
        </Button>
      )}
    </div>
  );
}
