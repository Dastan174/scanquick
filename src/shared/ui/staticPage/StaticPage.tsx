import scss from './staticPage.module.scss';

export default function StaticPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={scss.wrap}>
      <div className="container">
        <h1>{title}</h1>
        {updated && <p className={scss.updated}>{updated}</p>}
        <div className={scss.prose}>{children}</div>
      </div>
    </div>
  );
}
