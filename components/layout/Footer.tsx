import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, MessageSquare, Phone } from "lucide-react";
import { SITE, smsHref, telHref, whatsappHref } from "@/data/site";
import Logo from "@/components/ui/Logo";

const WEBSITE_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Founder", href: "/about/founder" },
  { label: "Al Quran", href: "/quran" },
  { label: "Courses", href: "/courses" },
  { label: "Institutions", href: "/institutions" },
  { label: "News & Media", href: "/news" },
  { label: "Contact", href: "/contact" },
];

const SERVICE_LINKS = [
  { label: "Donate", href: "/social-services/donate" },
  { label: "Fatwa Q&A", href: "/social-services/fatwa-qa" },
  { label: "Prayer Times", href: "/social-services/prayer-times" },
  { label: "Books Library", href: "/islamic-services/books-library" },
  { label: "Welfare Services", href: "/social-services/welfare-services" },
  { label: "Feedback", href: "/feedback" },
  { label: "Sign in", href: "/login" },
];

const SOCIAL = [
  { label: "Facebook", href: SITE.social.facebook, icon: FacebookIcon },
  { label: "X / Twitter", href: SITE.social.twitter, icon: XIcon },
  { label: "YouTube", href: SITE.social.youtube, icon: YoutubeIcon },
  { label: "Instagram", href: SITE.social.instagram, icon: InstagramIcon },
].filter((item) => item.href);

export default function Footer() {
  return (
    <footer className="mt-auto bg-green-deep text-ivory islamic-pattern">
      <div className="section-container py-14">
      <div className="mb-10 flex flex-col items-center text-center">
        <Logo size={56} />
        <p className="mt-4 text-2xl font-bold uppercase tracking-[0.12em] text-gold-soft sm:text-3xl">
          Alvasatiya Islamic Center
        </p>
      </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-ivory/80 leading-relaxed">{SITE.description}</p>
            <p className="mt-4 text-sm text-ivory/80">
              Headquarters: <span className="text-gold-soft">{SITE.headquarters}</span>
            </p>
            <p className="mt-2 text-sm text-ivory/80">
              Founder: <span className="text-gold-soft">{SITE.founder.name}</span>
            </p>
            <p className="mt-3 text-gold-soft text-sm">{SITE.tagline}</p>
          </div>

          <FooterCol title="This Website" links={WEBSITE_LINKS} />
          <FooterCol title="Services" links={SERVICE_LINKS} />

          <div>
            <h3 className="text-gold font-semibold tracking-wide mb-3 uppercase text-sm">Contact</h3>
            <ul className="space-y-3 text-sm text-ivory/80">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  {SITE.headquarters}
                  <br />
                  {SITE.address}
                </span>
              </li>
              <li className="flex gap-2">
                <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <a href={telHref()} className="hover:text-gold">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex gap-2">
                <MessageCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <a href={whatsappHref()} target="_blank" rel="noreferrer" className="hover:text-gold">
                  WhatsApp
                </a>
              </li>
              <li className="flex gap-2">
                <MessageSquare className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <a href={smsHref()} className="hover:text-gold">
                  SMS
                </a>
              </li>
              <li className="flex gap-2">
                <Mail className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <a href={`mailto:${SITE.email}`} className="hover:text-gold">
                  {SITE.email}
                </a>
              </li>
              <li className="flex gap-2">
                <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{SITE.officeHours}</span>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              {SOCIAL.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 text-gold-soft hover:bg-gold hover:text-green-deep transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="gold-line my-10" />
        <p className="text-center text-sm text-ivory/70">
          © {new Date().getFullYear()} Alvasatiya Islamic Center. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-gold font-semibold tracking-wide mb-3 uppercase text-sm">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-ivory/80 hover:text-gold">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14.7 10.3 21.2 3h-1.9l-5.6 6.4L9.3 3H3.5l7 10.1L3.5 21h1.9l6.1-7 4.9 7h5.8l-7.5-10.7ZM6.4 4.3h2.3l9 15.4h-2.3L6.4 4.3Z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6ZM9.8 15.5V8.9l6.1 3.3-6.1 3.3Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm9.2 1.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2Zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2Z" />
    </svg>
  );
}
