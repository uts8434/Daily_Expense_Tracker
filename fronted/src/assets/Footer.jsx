import React from "react";
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
        <a href="#" className="text-gray-400 hover:text-white transition duration-300">
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <a href="#" className="text-[#0077B5] hover:text-[#005582] transition duration-300">
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
        <a href="#" className="text-gray-400 hover:text-white transition duration-300">
          <FontAwesomeIcon icon={faXTwitter} />
        </a>
      </div>

      {/* Footer Text */}
      <p className="text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Created by{" "}
        <span className="text-white font-semibold">Utsav Kumar Singh</span>
      </p>
    </footer>
  );
}

export default Footer;
