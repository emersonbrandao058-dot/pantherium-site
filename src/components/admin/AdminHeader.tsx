"use client";

import type { ReactNode } from "react";

interface AdminHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function AdminHeader({
  title,
  description,
  action,
}: AdminHeaderProps) {
  return (
    <div className="admin-header">
      <div className="admin-header__content">
        <h1 className="admin-page-title">{title}</h1>
        {description && (
          <p className="admin-page-description">{description}</p>
        )}
      </div>

      {action && <div className="admin-header__action">{action}</div>}
    </div>
  );
}
