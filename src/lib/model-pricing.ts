import { prisma } from "@/lib/db";

export type PricingConfig = {
  inputCostPer1MTokensToman: number;
  outputCostPer1MTokensToman: number;
};

const fallbackPricing: PricingConfig = {
  inputCostPer1MTokensToman: 120000,
  outputCostPer1MTokensToman: 180000
};

export async function getModelPricing(modelName: string): Promise<PricingConfig> {
  try {
    const pricing = await prisma.modelPricing.findFirst({
      where: { modelName, isActive: true }
    });
    if (!pricing) return fallbackPricing;
    return {
      inputCostPer1MTokensToman: pricing.inputCostPer1MTokensToman,
      outputCostPer1MTokensToman: pricing.outputCostPer1MTokensToman
    };
  } catch {
    return fallbackPricing;
  }
}

export function estimateTokenCostToman(
  pricing: PricingConfig,
  inputTokens: number,
  outputTokens: number
) {
  const inputCost =
    (inputTokens / 1_000_000) * pricing.inputCostPer1MTokensToman;
  const outputCost =
    (outputTokens / 1_000_000) * pricing.outputCostPer1MTokensToman;
  return Math.round(inputCost + outputCost);
}
