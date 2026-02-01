import React from "react";
import Button from "@/components/ui/button";
import { useExampleStore } from "@/stores/example-store";

function ExampleSection() {
  const { lastClickedCta, ctaClickCount, setLastClickedCta } = useExampleStore();

  return (
    // use section name for id
    <section id="section-name" className="relative z-0">
      <div className="px-global py-section-md">
        <div className="max-w-global mx-auto">
          <div className="flex flex-col items-center gap-4">
            {/* Dont' add any font styles + color styles to p, h1, h2 ,h3 because i have already made them global.css */}
            <h1 className="max-w-[10em] text-center">Example Section</h1>
            <p className="max-w-[24em] text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste,
              neque laboriosam id harum consequatur quidem dolorem aperiam sit
            </p>
          </div>

          {lastClickedCta && (
            <p className="text-center text-sm opacity-80">
              Last clicked: {lastClickedCta} (total: {ctaClickCount})
            </p>
          )}

          {/* always use button component whenever there is a button */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => setLastClickedCta("Book a Demo")}
            >
              Book a Demo
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={() => setLastClickedCta("Learn More")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExampleSection;
