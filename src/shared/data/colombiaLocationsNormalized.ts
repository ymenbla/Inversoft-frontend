import {
  ColombiaCity,
  ColombiaDepartment,
  colombiaCities as rawColombiaCities,
  colombiaDepartments as rawColombiaDepartments
} from "@/shared/data/colombiaLocations";

const canonicalDepartmentNames: Record<number, string> = {
  5: "Antioquia",
  8: "Atl\u00e1ntico",
  11: "Bogot\u00e1 D.C.",
  13: "Bol\u00edvar",
  15: "Boyac\u00e1",
  17: "Caldas",
  18: "Caquet\u00e1",
  19: "Cauca",
  20: "Cesar",
  23: "C\u00f3rdoba",
  25: "Cundinamarca",
  27: "Choc\u00f3",
  41: "Huila",
  44: "La Guajira",
  47: "Magdalena",
  50: "Meta",
  52: "Nari\u00f1o",
  54: "Norte de Santander",
  63: "Quind\u00edo",
  66: "Risaralda",
  68: "Santander",
  70: "Sucre",
  73: "Tolima",
  76: "Valle del Cauca",
  81: "Arauca",
  85: "Casanare",
  86: "Putumayo",
  88: "Archipi\u00e9lago de San Andr\u00e9s, Providencia y Santa Catalina",
  91: "Amazonas",
  94: "Guain\u00eda",
  95: "Guaviare",
  97: "Vaup\u00e9s",
  99: "Vichada"
};

function normalizeLocationName(value: string): string {
  return value
    .normalize("NFC")
    .replace(/\uFFFD/g, "")
    .trim();
}

export const colombiaDepartments: ColombiaDepartment[] = rawColombiaDepartments.map(
  (department) => ({
    ...department,
    name: canonicalDepartmentNames[department.id] ?? normalizeLocationName(department.name)
  })
);

export const colombiaCities: ColombiaCity[] = rawColombiaCities.map((city) => ({
  ...city,
  name: normalizeLocationName(city.name),
  departmentName:
    canonicalDepartmentNames[city.departmentId] ?? normalizeLocationName(city.departmentName)
}));
