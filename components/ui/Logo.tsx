import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/data/site";

type Props = {
  size?: number;
  priority?: boolean;
  className?: string;
  href?: string | false;
};

export default function Logo({ size = 72, priority = false, className = "", href = "/" }: Props) {
  const img = (
    <Image
      src={SITE.logo}
      alt="Alvasatiya Islamic Center official logo"
      width={size}
      height={size}
      priority={priority}
      className={`rounded-full object-cover shadow-[0_6px_16px_rgba(40,54,24,0.18)] ${className}`}
      style={{ width: size, height: size }}
    />
  );
  if (href === false) return img;
  return (
    <Link href={href} className="inline-flex shrink-0 items-center justify-center" aria-label={`${SITE.name} home`}>
      {img}
    </Link>
  );
}
