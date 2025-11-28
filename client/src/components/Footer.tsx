import { Link } from "wouter";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-6 py-20">

        {/* --- TOP GRID (4 columns like VSCO: branding + 3 columns) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">

          {/* LEFT COLUMN — Branding + Social */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold leading-tight">
              WE MADE IT SO YOU CAN GET RID OF IT
            </h2> {/* REQUIRE GOOD SLOGAN BEFORE LAUNCH */}

            <div className="space-y-3">
              <h3 className="font-semibold text-base uppercase tracking-wide text-muted-foreground">
                Follow Us
              </h3>

              <div className="flex gap-4">
                <a href="https://instagram.com/unimart" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="hover-elevate">
                    <SiInstagram className="h-5 w-5" />
                  </Button>
                </a>
                <a href="https://tiktok.com/@unimart" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="hover-elevate">
                    <SiTiktok className="h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* SITEMAP COLUMN */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base uppercase tracking-wide">Sitemap</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/account">
                <Button variant="ghost" className="justify-start p-0 h-auto">
                  Your Account
                </Button>
              </Link>

              <Link href="/explore">
                <Button variant="ghost" className="justify-start p-0 h-auto">
                  Marketplace
                </Button>
              </Link>

              <Link href="/sell">
                <Button variant="ghost" className="justify-start p-0 h-auto">
                  List an Item
                </Button>
              </Link>

              <Link href="/locoloco">
                <Button variant="ghost" className="justify-start p-0 h-auto">
                  LocoLoco
                </Button>
              </Link>

              <Link href="/design-room">
                <Button variant="ghost" className="justify-start p-0 h-auto">
                  Build Your Room
                </Button>
              </Link>

            </div>
          </div>

          {/* COMPANY COLUMN */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base uppercase tracking-wide">Company</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/about">
                <Button variant="ghost" className="justify-start p-0 h-auto">
                  About Us
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="ghost" className="justify-start p-0 h-auto">
                  FAQ
                </Button>
              </Link>
              <Link href="/messages?contact=support">
                <Button variant="ghost" className="justify-start p-0 h-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>

          {/* COMMUNITY COLUMN */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base uppercase tracking-wide">Community</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/community">
                <Button variant="ghost" className="justify-start p-0 h-auto">
                  Campus Groups
                </Button>
              </Link>

              <Link href="/blog">
                <Button variant="ghost" className="justify-start p-0 h-auto">
                  Blog
                </Button>
              </Link>

              <Link href="/ambassadors">
                <Button variant="ghost" className="justify-start p-0 h-auto">
                  Ambassador Program
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ——— SPACING BEFORE BOTTOM ELEMENTS ——— */}
        <div className="py-16"></div>

        {/* CTA BUTTONS ABOVE DIVIDER */}
        <div className="flex justify-end mb-8">
          <div className="flex gap-4">
            <Link href="/explore">
              <Button className="px-6 py-2 rounded-full">
                Start Buying
              </Button>
            </Link>

            <Link href="/sell">
              <Button variant="outline" className="px-6 py-2 rounded-full">
                Start Selling
              </Button>
            </Link>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t pt-6"></div>

        {/* SAFETY & LEGAL ROW */}
        <div className="flex flex-wrap gap-6 justify-start mt-6 text-sm text-muted-foreground">
          <Link href="/account?tab=report">Report a Concern</Link>
          <Link href="/account?tab=legal#terms">Terms & Conditions</Link>
          <Link href="/account?tab=legal#privacy">Privacy Policy</Link>
          <span>Your Privacy Choices</span>
        </div>

        {/* COPYRIGHT BELOW DIVIDER, RIGHT-ALIGNED */}
        <div className="flex justify-end mt-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Campusly LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
