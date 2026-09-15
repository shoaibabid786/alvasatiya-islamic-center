import Link from "next/link";
import { SITE } from "@/data/site";

type Props = {
  size?: number;
  priority?: boolean;
  className?: string;
  href?: string | false;
};

export default function Logo({ size = 48, className = "", href = "/" }: Props) {
  const img = (
    <img
      src="/favicon.svg"
      alt="Alvasatiya Islamic Center"
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
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
