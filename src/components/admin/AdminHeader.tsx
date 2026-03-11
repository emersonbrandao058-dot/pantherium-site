interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function AdminHeader({
  title,
  subtitle,
  action,
}: AdminHeaderProps) {
  const parts = title.split("/");

  return (
    <div className="admin-header">
      <div className="admin-header__content">
        <div>
          {parts.length > 1 ? (
            <h1 className="admin-title">
              <span className="admin-title__white">{parts[0].trim()}</span>{" "}
              <span className="admin-title__green">/ {parts[1].trim()}</span>
            </h1>
          ) : (
            <h1 className="admin-title">
              <span className="admin-title__white">{title}</span>
            </h1>
          )}

          {subtitle && <p className="admin-subtitle">{subtitle}</p>}
        </div>

        {action ? <div className="admin-header__action">{action}</div> : null}
      </div>

      <div className="admin-header__divider" />
    </div>
  );
}