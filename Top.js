"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Top({title,subtitle,children}) {
  const pathname = usePathname();
  const showBack = pathname !== "/";
  return (
    <div className="top-wrap">
      {showBack && <Link href="/" className="back-btn">← Nazad</Link>}
      <div className="top">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="filters">{children}</div>
      </div>
    </div>
  );
}
