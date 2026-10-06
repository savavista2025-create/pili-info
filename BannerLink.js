"use client";
import Link from "next/link";

export default function BannerLink({href,title,subtitle,icon,wide=false}) {
  return (
    <Link href={href} className={"home-banner" + (wide ? " home-banner-wide" : "")}>
      <div className="home-banner-icon">{icon}</div>
      <div className="home-banner-copy">
        <div className="home-banner-title">{title}</div>
        <div className="home-banner-subtitle">{subtitle}</div>
      </div>
      <div className="home-banner-arrow">›</div>
    </Link>
  );
}
