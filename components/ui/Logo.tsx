import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/data/site";

type Props = {
  size?: number;
  priority?: boolean;
  className?: string;
  href?: string | false;
};

export default function Logo({ size = 120, priority = false, className = "", href = "/" }: Props) {
  const img = (
    <Image
      src={SITE.logo}
      alt="Alvasatiya Islamic Center official logo with Arabic calligraphy"
      width={size}
      height={size}
      priority={priority}
      className={`h-auto max-w-full object-contain drop-shadow-md ${className}`}
      style={{ width: "auto", height: size, maxHeight: size }}
    />
  );
  if (href === false) return img;
  return (
    <Link href={href} className="inline-flex items-center justify-center" aria-label={`${SITE.name} home`}>
      {img}
    </Link>
  );
}
