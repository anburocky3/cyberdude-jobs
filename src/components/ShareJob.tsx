"use client";

import { useCallback, useEffect, useState } from "react";
import { Link as LinkIcon, Share2 } from "lucide-react";

type Props = {
  title: string;
  url?: string;
  text?: string;
};

export default function ShareJob({ title, url, text }: Props) {
  const [shareUrl, setShareUrl] = useState<string>(url || "");
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by setting URL only after mount
  useEffect(() => {
    setMounted(true);
    if (!url && typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, [url]);
  const shareText = text || `Check out this job: ${title}`;

  const doNativeShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: shareText, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch {
      // no-op when user cancels share
    }
  }, [shareText, shareUrl, title]);

  const encodedUrl = encodeURIComponent(shareUrl || "");
  const encodedText = encodeURIComponent(shareText);

  const links = [
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"
          />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
        >
          <circle cx={4} cy={4} r={2} fill="currentColor" fillOpacity={0}>
            <animate
              fill="freeze"
              attributeName="fill-opacity"
              dur="0.15s"
              values="0;1"
            />
          </circle>
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4}
          >
            <path strokeDasharray={12} strokeDashoffset={12} d="M4 10v10">
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.15s"
                dur="0.2s"
                values="12;0"
              />
            </path>
            <path strokeDasharray={12} strokeDashoffset={12} d="M10 10v10">
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.45s"
                dur="0.2s"
                values="12;0"
              />
            </path>
            <path
              strokeDasharray={24}
              strokeDashoffset={24}
              d="M10 15c0 -2.76 2.24 -5 5 -5c2.76 0 5 2.24 5 5v5"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.65s"
                dur="0.2s"
                values="24;0"
              />
            </path>
          </g>
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      name: "X",
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m13.081 10.712l-4.786-6.71a.6.6 0 0 0-.489-.252H5.28a.6.6 0 0 0-.488.948l6.127 8.59m2.162-2.576l6.127 8.59a.6.6 0 0 1-.488.948h-2.526a.6.6 0 0 1-.489-.252l-4.786-6.71m2.162-2.576l5.842-6.962m-8.004 9.538L5.077 20.25"
          />
        </svg>
      ),
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {}
  };

  return (
    <section className="">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="text-lg font-semibold">Share this job</h2>
        <div className="space-x-4">
          <button
            onClick={doNativeShare}
            className="hover:text-orange-600 cursor-pointer"
            title="Share this"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleCopy}
            className="hover:text-orange-600 cursor-pointer"
            title="Copy this link!"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {links.map(({ name, href, icon }) => (
          <a
            key={name}
            href={mounted && shareUrl ? href : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded border px-3 py-2 text-xs hover:bg-gray-50"
            title={`Share on ${name}!`}
          >
            {icon}
          </a>
        ))}
      </div>
    </section>
  );
}
