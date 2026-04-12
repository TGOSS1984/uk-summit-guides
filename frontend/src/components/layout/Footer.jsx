function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <p className="site-footer__eyebrow">UK Summit Guides</p>
          <h3 className="site-footer__title">Guided mountain days across the UK.</h3>
          <p className="site-footer__text">
            Built for route discovery, guided bookings, seasonal touring, and a
            clean modern mountain-first experience.
          </p>
        </div>

        <div>
          <h4 className="site-footer__heading">Explore</h4>
          <ul className="site-footer__list">
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
            <li>Routes</li>
            <li>Book Now</li>
          </ul>
        </div>

        <div>
          <h4 className="site-footer__heading">Contact</h4>
          <ul className="site-footer__list">
            <li>hello@uksummitguides.dev</li>
            <li>Customer support and booking enquiries</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;