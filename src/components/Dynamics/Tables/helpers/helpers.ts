import { HTMLProps } from "react";

function getNestedValue<T>(obj: T, path: string): any {
  const keys = path?.split(".");
  return keys?.reduce((acc: any, key: any) => {
    if (acc) {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }
  }, obj);
}
function handlePropsDynamic<T>(props: HTMLProps<any>, item: T) {
  try {
    const propsArray = Object.entries(props);
    const resultObj: Record<string, any> = {};

    propsArray.forEach(([key, value]) => {
      if (typeof value === "string") {
        let newValue = value;
        const conditionRegex =
          /if:\s*'([^']+?)'\s*equal:\s*'([^']+?)'\s*result:\s*'([^']+?)'(\s*elif:\s*'([^']+?)'\s*equal:\s*'([^']+?)'\s*result:\s*'([^']+?)')*(\s*else:\s*'([^']+?)')?/g;

        let conditionMatch;
        while ((conditionMatch = conditionRegex.exec(newValue)) !== null) {
          const conditionData: any = {
            if: {
              path: conditionMatch[1],
              equal: conditionMatch[2],
              result: conditionMatch[3],
            },
            elif: [],
            else: conditionMatch[9] || null,
          };

          let i = 4;
          while (conditionMatch[i]) {
            conditionData.elif.push({
              path: conditionMatch[i],
              equal: conditionMatch[i + 1],
              result: conditionMatch[i + 2],
            } as unknown as any);
            i += 3;
          }
          const finalResult = evaluateCondition(item, conditionData);
          newValue = newValue.replace(conditionMatch[0], finalResult);
        }
        newValue = newValue.replace(/{|}/g, "").trim();
        resultObj[key] = newValue;
      } else {
        resultObj[key] = value;
      }
    });

    return resultObj;
  } catch (error) {
    return {};
  }
}

function evaluateCondition(item: any, conditionData: any) {
  if (evaluateConditionPart(item, conditionData.if)) {
    return conditionData.if.result;
  }
  for (const elif of conditionData.elif) {
    if (evaluateConditionPart(item, elif)) {
      return elif.result;
    }
  }
  return conditionData.else || "";
}

function evaluateConditionPart(
  item: any,
  condition: { path: string; equal: string }
) {
  const value = getNestedValue(item, condition.path);
  return value === condition.equal;
}

export { getNestedValue, handlePropsDynamic };
