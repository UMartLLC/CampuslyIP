import { Link } from "wouter";
// Imports social media icons from react-icons/si (Simple Icons).
import { SiInstagram, SiX } from "react-icons/si";
// Imports Twitter icon from lucide-react (used as an alternative Twitter/X icon).
import { Twitter } from "lucide-react";
// Imports the styled Button component from the local UI library.
import { Button } from "@/components/ui/button";

// -----------------------------------------------------------------------------
// 1. Footer Component
// -----------------------------------------------------------------------------

// The Footer component provides site-wide navigation, social links, and copyright information.
export default function Footer() {
  return (
    // Sets the top border and background color using theme tokens. Uses mt-auto to push the footer to the bottom of the viewport.
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              {/* Uses wouter Link for client-side routing within the application. */}
              
              <Link href="/about">
                {/* Renders as a ghost button, styled to look like a simple text link aligned to the start. */}
                <Button variant="ghost" className="justify-start p-0 h-auto" data-testid="link-about">
                  About Us
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="ghost" className="justify-start p-0 h-auto" data-testid="link-faq">
                  FAQ
                </Button>
              </Link>
              <Link href="/account?tab=legal">
                <Button variant="ghost" className="justify-start p-0 h-auto" data-testid="link-legal">
                  Legal
                </Button>
              </Link>
              <Link href="/messages?contact=support">
                <Button variant="ghost" className="justify-start p-0 h-auto" data-testid="link-contact-us">
                  Contact Us
                </Button>
              </Link>
              <Link href="/account?tab=report">
                <Button variant="ghost" className="justify-start p-0 h-auto" data-testid="link-report-concern">
                  Report a Concern
                </Button>
              </Link>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Follow Us</h3>
            <div className="flex gap-4">
              {/* External link to Instagram. */}
              <a 
                href="https://instagram.com/unimart" 
                target="_blank" 
                rel="noopener noreferrer" // Security best practice for external links.
                data-testid="link-instagram"
              >
                {/* Renders an outline button styled as a square icon, with hover elevation. */}
                <Button variant="outline" size="icon" className="hover-elevate">
                  <SiInstagram className="h-5 w-5" />
                </Button>
              </a>
              {/* External link to X (Twitter). */}
              <a 
                href="https://x.com/unimart" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="link-x"
              >
                <Button variant="outline" size="icon" className="hover-elevate">
                  <SiX className="h-5 w-5" />
                </Button>
              </a>
              {/* Alternative external link to Twitter, using a different icon. */}
              <a 
                href="https://twitter.com/unimart" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="link-twitter"
              >
                <Button variant="outline" size="icon" className="hover-elevate">
                  <Twitter className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">About UniMart</h3>
            {/* Descriptive text using muted foreground color. */}
            <p className="text-sm text-muted-foreground">
              Your campus marketplace for buying, selling, and connecting with fellow students.
            </p>
          </div>
        </div>

        {/* Legal & Copyright Section */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {/* Links to Terms & Conditions section of the Legal page. */}
            <Link href="/account?tab=legal#terms">
              <Button variant="ghost" className="text-muted-foreground h-auto p-0" data-testid="link-footer-terms">
                Terms & Conditions
              </Button>
            </Link>
            {/* Links to Privacy Policy section of the Legal page. */}
            <Link href="/account?tab=legal#privacy">
              <Button variant="ghost" className="text-muted-foreground h-auto p-0" data-testid="link-footer-privacy">
                Privacy Policy
              </Button>
            </Link>
          </div>
          {/* Copyright notice. */}
          <p>© 2024 CampusMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}