import {
  institutions as seed,
  SERVICE_INSTITUTION_SLUGS,
  TEHFEEZ_SLUG,
  type Institution,
  type InstitutionOverride,
  type ProgramStat,
  type StatValue,
} from "@/data/institutions";
import { getDb, saveDb } from "@/lib/academy-db";

function mergePrograms(base: ProgramStat[], override?: ProgramStat[]) {
  if (!override?.length) return base;
  return base.map((program) => {
    const next = override.find((item) => item.id === program.id);
    return next ? { ...program, ...next, id: program.id } : program;
  });
}

function applyOverride(base: Institution, override?: InstitutionOverride): Institution {
  if (!override) return base;
  return {
    ...base,
    ...override,
    slug: base.slug,
    programs: mergePrograms(base.programs, override.programs),
    intro: override.intro ?? base.intro,
    facilities: override.facilities ?? base.facilities,
    activities: override.activities ?? base.activities,
  };
}

export function getPublishedInstitutions(): Institution[] {
  const db = getDb();
  const overrides = new Map((db.institutionOverrides ?? []).map((item) => [item.slug, item]));
  const merged = seed.map((item) => applyOverride(item, overrides.get(item.slug)));
  const branches = merged.filter((item) => item.kind === "branch" && item.parentSlug === TEHFEEZ_SLUG);
  const publishedSum = branches.reduce((sum, branch) => sum + (typeof branch.students === "number" ? branch.students : 0), 0);
  return merged.map((item) => {
    if (item.slug !== TEHFEEZ_SLUG) return item;
    return {
      ...item,
      students: publishedSum,
      programs: item.programs.map((program) =>
        program.id === "hifz-ul-quran" ? { ...program, students: publishedSum } : program
      ),
    };
  });
}

export function getPublishedInstitution(slug: string) {
  return getPublishedInstitutions().find((item) => item.slug === slug);
}

export function getHeadquarters() {
  return getPublishedInstitutions().find((item) => item.kind === "headquarters")!;
}

export function getTehfeezBranches() {
  return getPublishedInstitutions().filter((item) => item.kind === "branch" && item.parentSlug === TEHFEEZ_SLUG);
}

export function getServiceInstitutions() {
  const list = getPublishedInstitutions();
  return SERVICE_INSTITUTION_SLUGS.map((slug) => list.find((item) => item.slug === slug)).filter(
    (item): item is Institution => Boolean(item)
  );
}

export function saveInstitutionOverride(payload: InstitutionOverride) {
  const db = getDb();
  db.institutionOverrides = db.institutionOverrides ?? [];
  const index = db.institutionOverrides.findIndex((item) => item.slug === payload.slug);
  const cleaned: InstitutionOverride = {
    ...payload,
    students: parseStat(payload.students),
    programs: payload.programs?.map((program) => ({
      ...program,
      students: parseStat(program.students) ?? null,
    })),
  };
  if (index >= 0) db.institutionOverrides[index] = { ...db.institutionOverrides[index], ...cleaned };
  else db.institutionOverrides.push(cleaned);
  saveDb(db);
  return getPublishedInstitution(payload.slug);
}

function parseStat(value: StatValue | undefined): StatValue | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function branchParamToSlug(branch: string) {
  const match = branch.match(/^branch-([1-5])$/);
  if (!match) return null;
  return `alvasatiya-tehfeez-ul-quran-branch-${match[1]}`;
}
