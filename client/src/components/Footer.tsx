import { Link } from "wouter";
import { SiInstagram, SiX } from "react-icons/si";
import { Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Links Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/about">
                <Button variant="ghost" className="justify-start p-0 h-auto" data-testid="link-about">
                  About Us
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="ghost" className="justify-start p-0 h-auto" data-testid="link-faq">
                  FAQ
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
              <a 
                href="https://instagram.com/unimart" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="link-instagram"
              >
                <Button variant="outline" size="icon" className="hover-elevate">
                  <SiInstagram className="h-5 w-5" />
                </Button>
              </a>
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
            <p className="text-sm text-muted-foreground">
              Your campus marketplace for buying, selling, and connecting with fellow students.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link href="/account?tab=legal#terms">
              <Button variant="link" className="text-muted-foreground h-auto p-0" data-testid="link-footer-terms">
                Terms & Conditions
              </Button>
            </Link>
            <Link href="/account?tab=legal#privacy">
              <Button variant="link" className="text-muted-foreground h-auto p-0" data-testid="link-footer-privacy">
                Privacy Policy
              </Button>
            </Link>
          </div>
          <p>© 2024 CampusMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
