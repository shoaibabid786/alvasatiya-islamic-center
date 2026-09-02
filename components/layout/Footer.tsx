import Link from "next/link";
import { Mail, MapPin, Phone, Share2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { SITE } from "@/data/site";
import { FOOTER_QUICK, NAV } from "@/data/navigation";

const about = NAV.find((n) => n.label === "About Us")?.children ?? [];
const islamic = NAV.find((n) => n.label === "Islamic Services")?.children ?? [];
const social = NAV.find((n) => n.label === "Social Services")?.children ?? [];
const departments = (NAV.find((n) => n.label === "Departments")?.children ?? []).filter(
  (d) => !["Organizational Website", "Majlis Tajiran"].includes(d.label)
);

export default function Footer() {
  return (
    <footer className="mt-auto bg-green-deep text-ivory islamic-pattern">
      <div className="section-container py-14">
        <div className="flex justify-center mb-10">
          <Logo size={120} href="/" className="brightness-110" />
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          <div>
            <h2 className="text-gold font-semibold tracking-wide mb-3">{SITE.name.toUpperCase()}</h2>
            <p className="text-sm text-ivory/80 leading-relaxed">{SITE.description}</p>
            <p className="mt-3 text-gold-soft text-sm">{SITE.tagline}</p>
          </div>
          <FooterCol title="About" links={about} />
          <FooterCol title="Islamic Services" links={islamic} />
          <FooterCol title="Social Services" links={social} />
          <FooterCol title="Departments" links={departments} />
          <FooterCol title="Quick Actions" links={FOOTER_QUICK.map((l) => ({ label: l.label, href: l.href }))} />
          <FooterCol
            title="Staff Login"
            links={[
              { label: "Admin Login", href: "/login?next=/portal/admin" },
              { label: "Teacher Login", href: "/login?next=/portal/teacher" },
            ]}
          />
        </div>
        <div className="gold-line my-10" />
        <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-ivory/80">
          <p className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-gold" /> {SITE.address}</p>
          <p className="inline-flex items-center gap-2"><Phone className="w-4 h-4 text-gold" /> {SITE.phone}</p>
          <p className="inline-flex items-center gap-2"><Mail className="w-4 h-4 text-gold" /> {SITE.email}</p>
          <Link href={SITE.social.facebook} className="inline-flex items-center gap-2 hover:text-gold">
            <Share2 className="w-4 h-4" /> Facebook
          </Link>
        </div>
        <p className="mt-8 text-center text-sm text-ivory/70">
          © {SITE.name}. All Rights Reserved.
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
