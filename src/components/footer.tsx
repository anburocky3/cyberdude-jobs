export default function Footer() {
  return (
    <footer className="mt-5 border-t bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-4 text-xs text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          © {new Date().getFullYear()}{" "}
          <a
            href="https://cyberdudenetworks.com"
            target="_blank"
            className="hover:text-orange-800"
          >
            CyberDude Networks Pvt. Ltd.
          </a>{" "}
          All rights reserved.
        </p>
        <p>
          Built with ❤️ by the{" "}
          <span className="hover:animate-pulse cursor-pointer">
            CyberDude team.
          </span>
        </p>
      </div>
    </footer>
  );
}
