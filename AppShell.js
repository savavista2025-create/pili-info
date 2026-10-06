"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  ["/","Početna"],
  ["/promet","Promet"],
  ["/plate","Plate"],
  ["/troskovi","Troškovi"],
  ["/evidencije","Mesečni troškovi"],
  ["/analiza","Analiza"],
  ["/arhiva","Arhiva"]
];

export default function AppShell({children}) {
  const pathname = usePathname();

  return (
    <div className="app-page">
      <header className="brand-header">
        <Image src="/logo-pili.png" alt="PILI Vaš market" width={235} height={132} priority />
        <div className="brand-header-title">PILI INFO</div>
      </header>

      <nav className="top-tabs">
        {tabs.map(([href,label]) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={"top-tab" + (active ? " active" : "")}>
              {label}
            </Link>
          );
        })}
      </nav>

      <main className="main-full">{children}</main>
    </div>
  );
}
