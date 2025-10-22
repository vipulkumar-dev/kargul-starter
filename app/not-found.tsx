import Link from "next/link";
import Button from "@/components/ui/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
export default function NotFound() {
  return (
    <>
      <Header />
      <section id="not-found" className="relative z-0">
        <div className="px-global py-section-md pt-[110px]">
          <div className="max-w-global mx-auto">
            <div className="flex flex-col items-center gap-8 md:gap-[34px]">
              <div className="flex w-full max-w-[484px] flex-col items-center gap-5">
                <h1 className="bg-gradient-to-b from-[#202020] to-[#515151] bg-clip-text text-center text-4xl font-bold tracking-[-0.03em] text-transparent md:text-[64px] md:leading-[60px]">
                  This Campaign Doesn&apos;t Exist...
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-3.5">
                  <Link href="/">
                    <Button variant="primary" size="lg">
                      Back Home
                    </Button>
                  </Link>

                  <Link href="https://sideshift.app/signup">
                    <Button variant="secondary" size="lg">
                      <span>Join Sideshift</span>
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative -z-10 aspect-[1160/580] w-full rounded-2xl md:aspect-[1160/355]">
                <Image
                  src="/assets/404/404.png"
                  alt="Workflow"
                  width={100}
                  height={100}
                  className="absolute top-1/2 left-1/2 w-[160%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover md:w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
