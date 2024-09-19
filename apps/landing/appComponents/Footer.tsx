import {
  FaDiscord,
  FaDribbble,
  FaFacebook,
  FaGithub,
  FaXTwitter,
} from "react-icons/fa6";
import Logo from "./icons/Logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-logo">
          <Logo className="h-8 w-8" fill="#ffffff" />
        </div>
        <div className="footer-content">
          <div className="footer-subContent">
            <h2>Resources</h2>
            <ul className="list">
              <li>Create Collab</li>
              <li>Documentation</li>
              <li>API reference</li>
            </ul>
          </div>
          <div className="footer-subContent">
            <h2>Follow us</h2>
            <ul className="list">
              <li>Github</li>
              <li>Discord</li>
            </ul>
          </div>
          <div className="footer-subContent">
            <h2>Legal</h2>
            <ul className="list">
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024 CollabIq All Rights Reserved.
        </span>
        <div className="footer-icons">
          <Link href="#">
            <FaFacebook />
            <span className="sr-only">Facebook page</span>
          </Link>
          <Link href="#">
            <FaDiscord />
            <span className="sr-only">Discord community</span>
          </Link>
          <Link href="#">
            <FaXTwitter />
            <span className="sr-only">Twitter page</span>
          </Link>
          <Link href="#">
            <FaGithub />
            <span className="sr-only">GitHub account</span>
          </Link>
          <Link href="#">
            <FaDribbble />
            <span className="sr-only">Dribbble account</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
