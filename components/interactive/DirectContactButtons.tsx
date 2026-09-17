"use client";

import { openSms, telHref, whatsappHref } from "@/data/site";

type Props = {
  message?: string;
  className?: string;
  showCall?: boolean;
};

export default function DirectContactButtons({ message, className = "mt-4 flex flex-wrap gap-3", showCall = true }: Props) {
  return (
    <div className={className}>
      {showCall ? (
        <a className="btn btn-green !py-2" href={telHref()}>
          Call
        </a>
      ) : null}
      <a className="btn btn-gold !py-2" href={whatsappHref(message)} target="_blank" rel="noreferrer">
        WhatsApp
      </a>
      <button type="button" className="btn btn-outline !py-2" onClick={() => openSms(message)}>
        SMS
      </button>
    </div>
  );
}
