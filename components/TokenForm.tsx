import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { createGrid } from "@/lib/db_actions/grid";

export function TokenForm({ grid }: IGrid) {
  // Initialize state for form fields
  const [formData, setFormData] = useState({
    upperLimit: grid.upperLimit,
    lowerLimit: grid.lowerLimit,
    gridNumber: grid.gridCount,
    solAmount: grid.quantityInvested / 1000,
  });

  // Add loading state for the button
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Mock function to simulate form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (
        !formData.upperLimit ||
        !formData.lowerLimit ||
        !formData.gridNumber ||
        !formData.solAmount
      ) {
        throw new Error("Please fill in all fields");
      }

      if (parseFloat(formData.upperLimit) <= parseFloat(formData.lowerLimit)) {
        throw new Error("Upper limit must be greater than lower limit");
      }

      if (parseInt(formData.gridNumber) <= 0) {
        throw new Error("Grid number must be greater than 0");
      }

      if (parseFloat(formData.solAmount) <= 0) {
        throw new Error("SOL amount must be greater than 0");
      }

      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Log the submitted data
      console.log("Grid settings submitted:", {
        upperLimit: parseFloat(formData.upperLimit),
        lowerLimit: parseFloat(formData.lowerLimit),
        gridNumber: parseInt(formData.gridNumber),
        solAmount: parseFloat(formData.solAmount),
      });

      if (grid.currentPrice) {
        // Show success message
        toast.success("Grid settings adjusted successfully!");
      } else {
        const newGridData = {
          sourceTokenSymbol: grid.sourceTokenSymbol,
          targetTokenSymbol: grid.targetTokenSymbol,
          sourceTokenId: grid.sourceTokenId,
          targetTokenId: grid.targetTokenId,

          // upperLimit: 0.004,  // Upper price limit ($110)
          // lowerLimit: 0.0025,   // Lower price limit ($90)
          // gridCount: 20,      // Number of grid levels
          // quantityInvested: 0.05  // Amount in SOL to invest in each grid level

          upperLimit: parseFloat(formData.upperLimit),
          lowerLimit: parseFloat(formData.lowerLimit),
          gridCount: parseInt(formData.gridNumber),
          quantityInvested: parseFloat(formData.solAmount),
        };

        const createdGrid = await createGrid(newGridData);
        toast.success("Grid created successfully!");
      }

      // Reset form (optional)
      // setFormData({
      //   upperLimit: "",
      //   lowerLimit: "",
      //   gridNumber: "",
      //   solAmount: "",
      // });
    } catch (error: any) {
      console.error("Error submitting grid settings:", error);
      toast.error(error.message || "Failed to adjust grid settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full h-full p-4 bg-[#2a2a2a] border-[#3a3a3a]">
      <h3 className="text-lg font-medium text-gray-200 mb-4">
        Manage Grid Settings for {grid.targetTokenSymbol}
      </h3>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="upperLimit">Upper Limit</Label>
          <Input
            id="upperLimit"
            type="number"
            placeholder="Enter Grid Upper Limit"
            className="bg-[#333333] border-[#444444] text-white"
            value={formData.upperLimit}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lowerLimit">Lower Limit</Label>
          <Input
            id="lowerLimit"
            type="number"
            placeholder="Enter Grid Lower Limit"
            className="bg-[#333333] border-[#444444] text-white"
            value={formData.lowerLimit}
            onChange={handleChange}
            inputMode="decimal"
            style={{
              WebkitAppearance: "none",
              MozAppearance: "textfield",
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gridNumber">Number of grids</Label>
          <Input
            id="gridNumber"
            type="number"
            placeholder="Enter Number of Grids"
            className="bg-[#333333] border-[#444444] text-white"
            value={formData.gridNumber}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="solAmount">Current SOL Invested</Label>
          <Input
            id="solAmount"
            type="number"
            placeholder="Enter SOL Amount"
            className="bg-[#333333] border-[#444444] text-white"
            value={formData.solAmount}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adjusting..." : "Adjust"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
