import React from "react";

import { cn } from "@/lib/utils";

const CheckoutSteps = ({ current = 0 }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center py-10 space-y-2 md:space-y-0 md:space-x-4">
      {["Dates", "Rooms", "Options", "Book"].map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              "p-2 w-56 rounded-full text-center text-sm",
              index === current ? "bg-secondary text-black" : "bg-gray-200"
            )}
          >
            {step}
          </div>
          {step !== "opiton-room" && (
            <hr className="w-16 border-t border-gray-300 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
export default CheckoutSteps;
