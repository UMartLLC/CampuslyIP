import { Link } from "wouter";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-6 py-10">

        {/* TOP SECTION - Tagline + Link Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6">

          {/* LEFT - Tagline */}
          <div className="lg:col-span-3">
            <h2 className="text-xl md:text-2xl font-bold italic leading-tight tracking-tight">
              WE MADE IT SO<br />YOU CAN GET RID OF IT
            </h2>
          </div>

          {/* RIGHT - 4 Link Columns */}
          <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* SITEMAP */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Sitemap
              </h3>
              <nav className="flex flex-col space-y-1.5 text-sm">
                <Link href="/account" className="hover:underline">Your Account</Link>
                <Link href="/items" className="hover:underline">Marketplace</Link>
                <Link href="/sell" className="hover:underline">Sell an Item</Link>
                <Link href="/locoloco" className="hover:underline">LocoLoco</Link>
                <Link href="/design-room" className="hover:underline">Build Your Room</Link>
              </nav>
            </div>

            {/* COMPANY */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Company
              </h3>
              <nav className="flex flex-col space-y-1.5 text-sm">
                <Link href="/about" className="hover:underline">About Us</Link>
                <Link href="/faq" className="hover:underline">FAQ</Link>
                <Link href="/messages?contact=support" className="hover:underline">Contact Us</Link>
              </nav>
            </div>

            {/* COMMUNITY */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Community
              </h3>
              <nav className="flex flex-col space-y-1.5 text-sm">
                <Link href="/community" className="hover:underline">Campus Groups</Link>
                <Link href="/blog" className="hover:underline">Blog</Link>
                <Link href="/ambassadors" className="hover:underline">Ambassador Program</Link>
              </nav>
            </div>

            {/* FOLLOW US */}
            <div className="space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Follow Us
              </h3>
              <div className="flex gap-3">
                <a href="https://instagram.com/unimart" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <SiInstagram className="h-4 w-4" />
                  </Button>
                </a>
                <a href="https://tiktok.com/@unimart" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <SiTiktok className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE - Logo + CTA Buttons */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-10 mb-6">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
              <span className="text-xs font-bold">U</span>
            </div>
            <span className="text-sm font-semibold tracking-wide">UniMart</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <Link href="/items">
              <Button variant="outline" size="sm" className="rounded-full px-5">
                Start Buying
              </Button>
            </Link>
            <Link href="/sell">
              <Button size="sm" className="rounded-full px-5">
                Start Selling
              </Button>
            </Link>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t" />

        {/* BOTTOM - Legal links left, Copyright right */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/account?tab=legal#terms" className="hover:underline">Terms of Use</Link>
            <Link href="/account?tab=legal#privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/account?tab=report" className="hover:underline">Report a Concern</Link>
            <span className="flex items-center gap-1">
              <span className="inline-block w-4 h-4 rounded-full bg-muted-foreground/20" />
              Your Privacy Choices
            </span>
          </div>
          <p className="whitespace-nowrap">
            © {new Date().getFullYear()} Campusly LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
