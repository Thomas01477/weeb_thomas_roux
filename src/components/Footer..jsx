const Footer = () => {
  return (
    <footer className="bg-white pt-15">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">weeb</h3>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-blue-gray">PRODUCT</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-purple">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Overview
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Browse
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Accessibility
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Five
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-blue-gray">SOLUTIONS</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-purple">
                  Brainstorming
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Ideation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Wireframing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Research
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-blue-gray">RESOURCES</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-purple">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Tutorials
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-blue-gray">COMPANY</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-purple">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple">
                  Careers
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <p className="text-sm flex mt-15">
            © 2023 Weeb, Inc. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-purple">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-purple">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-purple">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-purple">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
