import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6">
      {/* Social Icons */}
      <div className="flex justify-center gap-6 text-3xl mb-4">
        <Link to="https://github.com/uts8434"  target="_blank" className="text-gray-400 hover:text-white transition duration-300">
          <FontAwesomeIcon icon={faGithub} />
        </Link>
        <Link to="https://www.linkedin.com/in/utsavkrsingh8434/" target="_blank" className="text-[#0077B5] hover:text-[#005582] transition duration-300">
          <FontAwesomeIcon icon={faLinkedin} />
        </Link>
        <Link to="#" className="text-gray-400 hover:text-white transition duration-300">
          <FontAwesomeIcon icon={faXTwitter} />
        </Link>
      </div>

      {/* Footer Text */}
      <p className="text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Created by{" "}
        <span className="text-red-500  font-semibold">Utsav Kumar Singh</span>
      </p>
    </footer>
  );
}

export default Footer;
