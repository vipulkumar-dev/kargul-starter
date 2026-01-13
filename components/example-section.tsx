import React from "react";
import Button from "@/components/ui/Button";

function ExampleSection() {
  return (
    // use section name for id
    <section id="section-name" className="relative z-0">
      <div className="px-global py-section-md">
        <div className="max-w-global mx-auto">
          <div className="flex flex-col items-center gap-4">
            {/* Dont' add any font styles to p, h1, h2 ,h3 because i have already made them global.css */}
            <h1 className="max-w-[15ch] text-center">Example Section</h1>
            <p className="max-w-[40ch] text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste,
              neque laboriosam id harum consequatur quidem dolorem aperiam sit
            </p>
          </div>
          {/* always use button component whenever there is a button */}
          <Button variant="primary" size="md">
            Book a Demo
          </Button>

          <Button variant="secondary" size="md">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ExampleSection;
