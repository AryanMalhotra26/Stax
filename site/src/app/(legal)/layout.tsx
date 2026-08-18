import { Nav } from "@/components/chrome/Nav";
import { Footer } from "@/components/chrome/Footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main id="main" className="bg-bone">
        <div className="container-stax pt-36 md:pt-44 pb-24 md:pb-32">
          <div className="max-w-2xl [&_h2]:text-h3 [&_h2]:mt-12 [&_h2]:mb-3 [&_p]:text-ink-soft [&_p]:leading-relaxed [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:space-y-2 [&_li]:text-ink-soft [&_li]:ml-5 [&_li]:list-disc">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
