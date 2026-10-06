export default function BrandLogo({large=false}) {
  return (
    <div className={large ? 'brand-logo large' : 'brand-logo'}>
      <div className="brand-wordmark">
        <span className="brand-pili">Pili</span>
        <span className="brand-swoosh" />
      </div>
      <div className="brand-sub">Vaš market</div>
    </div>
  );
}
