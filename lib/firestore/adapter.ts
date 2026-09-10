import { randomBytes } from "crypto";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  type Firestore,
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";

type Dict = Record<string, any>;

const DATE_FIELDS = new Set([
  "createdAt",
  "updatedAt",
  "expiresAt",
  "startDate",
  "endDate",
  "dueDate",
  "startedAt",
  "startsAt",
  "submittedAt",
  "gradedAt",
  "publishDate",
  "joinedAt",
  "recordedAt",
]);

const RELATIONS: Record<string, Record<string, { type: "belongsTo" | "hasMany"; collection: string; key: string }>> = {
  users: {
    taughtClasses: { type: "hasMany", collection: "classes", key: "teacherId" },
    memberships: { type: "hasMany", collection: "classMembers", key: "studentId" },
    sessions: { type: "hasMany", collection: "sessions", key: "userId" },
  },
  sessions: {
    user: { type: "belongsTo", collection: "users", key: "userId" },
  },
  classes: {
    teacher: { type: "belongsTo", collection: "users", key: "teacherId" },
    members: { type: "hasMany", collection: "classMembers", key: "classId" },
    quizzes: { type: "hasMany", collection: "quizzes", key: "classId" },
    assignments: { type: "hasMany", collection: "assignments", key: "classId" },
    attendance: { type: "hasMany", collection: "attendance", key: "classId" },
    announcements: { type: "hasMany", collection: "announcements", key: "classId" },
    liveMeetings: { type: "hasMany", collection: "liveMeetings", key: "classId" },
  },
  classMembers: {
    class: { type: "belongsTo", collection: "classes", key: "classId" },
    student: { type: "belongsTo", collection: "users", key: "studentId" },
  },
  quizzes: {
    class: { type: "belongsTo", collection: "classes", key: "classId" },
    teacher: { type: "belongsTo", collection: "users", key: "teacherId" },
    questions: { type: "hasMany", collection: "questions", key: "quizId" },
    attempts: { type: "hasMany", collection: "quizAttempts", key: "quizId" },
  },
  questions: {
    quiz: { type: "belongsTo", collection: "quizzes", key: "quizId" },
    answers: { type: "hasMany", collection: "quizAnswers", key: "questionId" },
  },
  quizAttempts: {
    quiz: { type: "belongsTo", collection: "quizzes", key: "quizId" },
    student: { type: "belongsTo", collection: "users", key: "studentId" },
    answers: { type: "hasMany", collection: "quizAnswers", key: "attemptId" },
  },
  quizAnswers: {
    attempt: { type: "belongsTo", collection: "quizAttempts", key: "attemptId" },
    question: { type: "belongsTo", collection: "questions", key: "questionId" },
  },
  assignments: {
    class: { type: "belongsTo", collection: "classes", key: "classId" },
    teacher: { type: "belongsTo", collection: "users", key: "teacherId" },
    submissions: { type: "hasMany", collection: "assignmentSubmissions", key: "assignmentId" },
  },
  assignmentSubmissions: {
    assignment: { type: "belongsTo", collection: "assignments", key: "assignmentId" },
    student: { type: "belongsTo", collection: "users", key: "studentId" },
  },
  attendance: {
    class: { type: "belongsTo", collection: "classes", key: "classId" },
    student: { type: "belongsTo", collection: "users", key: "studentId" },
  },
  announcements: {
    class: { type: "belongsTo", collection: "classes", key: "classId" },
    author: { type: "belongsTo", collection: "users", key: "authorId" },
  },
  liveMeetings: {
    class: { type: "belongsTo", collection: "classes", key: "classId" },
    createdByUser: { type: "belongsTo", collection: "users", key: "createdBy" },
  },
};

const COUNT_MAP: Record<string, Record<string, { collection: string; key: string }>> = {
  classes: {
    members: { collection: "classMembers", key: "classId" },
    quizzes: { collection: "quizzes", key: "classId" },
    assignments: { collection: "assignments", key: "classId" },
  },
  quizzes: {
    questions: { collection: "questions", key: "quizId" },
    attempts: { collection: "quizAttempts", key: "quizId" },
  },
  assignments: {
    submissions: { collection: "assignmentSubmissions", key: "assignmentId" },
  },
};

const cache: Record<string, { at: number; rows: Dict[] }> = {};
const CACHE_MS = 3000;

function now() {
  return new Date();
}

function newId() {
  return `fs_${randomBytes(8).toString("hex")}`;
}

function stripUndefined(value: any): any {
  if (Array.isArray(value)) return value.map(stripUndefined);
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === "object") {
    const next: Dict = {};
    for (const [key, item] of Object.entries(value)) {
      if (item === undefined) continue;
      next[key] = stripUndefined(item);
    }
    return next;
  }
  return value;
}

function revive(doc: Dict) {
  const next = { ...doc };
  for (const key of Object.keys(next)) {
    if (DATE_FIELDS.has(key) && typeof next[key] === "string") {
      const date = new Date(next[key]);
      if (!Number.isNaN(date.getTime())) next[key] = date;
    }
  }
  return next;
}

function clone<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, item) => (item instanceof Date ? item.toISOString() : item)),
  );
}

function documentId(collectionName: string, data: Dict, where?: Dict) {
  if (data?.id) return String(data.id);
  if (where?.id) return String(where.id);
  if (where?.key && collectionName === "settings") return String(where.key);
  const compound = where ? Object.values(where).find((value) => value && typeof value === "object" && !Array.isArray(value) && !("in" in value) && !("contains" in value) && !("gt" in value) && !("lte" in value) && !("some" in value)) : null;
  const source = (compound && typeof compound === "object" ? compound : data) as Dict;
  if (collectionName === "classMembers" && source?.classId && source?.studentId) return `${source.classId}_${source.studentId}`;
  if (collectionName === "attendance" && source?.classId && source?.studentId && source?.date) {
    return `${source.classId}_${source.studentId}_${source.date}`;
  }
  if (collectionName === "quizAttempts" && source?.quizId && source?.studentId) return `${source.quizId}_${source.studentId}`;
  if (collectionName === "quizAnswers" && source?.attemptId && source?.questionId) return `${source.attemptId}_${source.questionId}`;
  if (collectionName === "assignmentSubmissions" && source?.assignmentId && source?.studentId) {
    return `${source.assignmentId}_${source.studentId}`;
  }
  if (collectionName === "settings" && source?.key) return String(source.key);
  return newId();
}

function valueOf(item: any) {
  if (item instanceof Date) return item.getTime();
  if (typeof item === "string" && DATE_FIELDS.size) {
    const date = new Date(item);
    if (!Number.isNaN(date.getTime()) && item.includes("T")) return date.getTime();
  }
  return item;
}

function matchCondition(docValue: any, condition: any): boolean {
  if (condition === undefined) return true;
  if (condition && typeof condition === "object" && !(condition instanceof Date) && !Array.isArray(condition)) {
    if ("in" in condition) return Array.isArray(condition.in) && condition.in.includes(docValue);
    if ("contains" in condition) return String(docValue || "").toLowerCase().includes(String(condition.contains || "").toLowerCase());
    if ("gt" in condition) return valueOf(docValue) > valueOf(condition.gt);
    if ("gte" in condition) return valueOf(docValue) >= valueOf(condition.gte);
    if ("lt" in condition) return valueOf(docValue) < valueOf(condition.lt);
    if ("lte" in condition) return valueOf(docValue) <= valueOf(condition.lte);
    if ("some" in condition) return false;
  }
  return docValue === condition;
}

function flattenWhere(where?: Dict) {
  if (!where) return {};
  const next: Dict = { ...where };
  for (const [key, value] of Object.entries(where)) {
    if (key.includes("_") && value && typeof value === "object" && !Array.isArray(value) && !("in" in value) && !("contains" in value)) {
      Object.assign(next, value);
      delete next[key];
    }
  }
  return next;
}

function matches(doc: Dict, where?: Dict): boolean {
  if (!where) return true;
  const flat = flattenWhere(where);
  if (flat.AND) return (flat.AND as Dict[]).every((item) => matches(doc, item));
  if (flat.OR) return (flat.OR as Dict[]).some((item) => matches(doc, item));
  for (const [key, condition] of Object.entries(flat)) {
    if (key === "AND" || key === "OR") continue;
    if (condition && typeof condition === "object" && "some" in condition) {
      const related = doc[key];
      if (!Array.isArray(related)) return false;
      if (!related.some((item) => matches(item, condition.some))) return false;
      continue;
    }
    if (condition && typeof condition === "object" && !("in" in condition) && !("contains" in condition) && !("gt" in condition) && !("gte" in condition) && !("lt" in condition) && !("lte" in condition) && !(condition instanceof Date) && !Array.isArray(condition)) {
      const related = doc[key];
      if (!related || !matches(related, condition)) return false;
      continue;
    }
    if (!matchCondition(doc[key], condition)) return false;
  }
  return true;
}

function persistable(name: string, row: Dict) {
  const next = { ...row };
  delete next._count;
  for (const key of Object.keys(RELATIONS[name] || {})) delete next[key];
  return stripUndefined(next);
}

function pick(doc: Dict, select?: Dict) {
  if (!select) return doc;
  const next: Dict = {};
  for (const key of Object.keys(select)) if (select[key]) next[key] = doc[key];
  return next;
}

function splitData(data: Dict) {
  const plain: Dict = {};
  const nested: Dict = {};
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === "object" && (value.create || value.createMany)) nested[key] = value;
    else plain[key] = value;
  }
  return { plain, nested };
}

export class FirestoreModel {
  constructor(
    private store: FirestoreStore,
    private collectionName: string,
  ) {}

  async findMany(args: Dict = {}): Promise<any[]> {
    return this.store.query(this.collectionName, args);
  }

  async findFirst(args: Dict = {}): Promise<any> {
    const rows = await this.store.query(this.collectionName, { ...args, take: 1 });
    return rows[0] || null;
  }

  async findUnique(args: Dict = {}): Promise<any> {
    const rows = await this.store.query(this.collectionName, { ...args, take: 1 });
    return rows[0] || null;
  }

  async count(args: Dict = {}) {
    const rows = await this.store.query(this.collectionName, { where: args.where });
    return rows.length;
  }

  async create(args: Dict): Promise<any> {
    return this.store.create(this.collectionName, args);
  }

  async createMany(args: { data: Dict[] }) {
    for (const data of args.data) await this.store.create(this.collectionName, { data });
    return { count: args.data.length };
  }

  async update(args: Dict): Promise<any> {
    return this.store.update(this.collectionName, args);
  }

  async updateMany(args: Dict) {
    const rows = await this.store.query(this.collectionName, { where: args.where });
    for (const row of rows) await this.store.update(this.collectionName, { where: { id: row.id }, data: args.data });
    return { count: rows.length };
  }

  async delete(args: Dict) {
    const current = await this.findUnique({ where: args.where });
    if (!current) return current;
    await this.store.remove(this.collectionName, current.id);
    return current;
  }

  async deleteMany(args: Dict = {}) {
    const rows = await this.store.query(this.collectionName, { where: args.where });
    for (const row of rows) await this.store.remove(this.collectionName, row.id);
    return { count: rows.length };
  }

  async upsert(args: Dict) {
    const existing = await this.findUnique({ where: args.where });
    if (existing) return this.update({ where: { id: existing.id }, data: args.update });
    return this.create({ data: { ...flattenWhere(args.where), ...args.create } });
  }

  async groupBy(args: Dict) {
    const rows = await this.store.query(this.collectionName, { where: args.where });
    const groups = new Map<string, Dict>();
    const by: string[] = args.by || [];
    for (const row of rows) {
      const key = by.map((field) => String(row[field])).join("|");
      if (!groups.has(key)) {
        const group: Dict = { _count: { _all: 0 } };
        for (const field of by) group[field] = row[field];
        groups.set(key, group);
      }
      groups.get(key)!._count._all += 1;
    }
    return [...groups.values()];
  }
}

export class FirestoreStore {
  user = new FirestoreModel(this, "users");
  session = new FirestoreModel(this, "sessions");
  setting = new FirestoreModel(this, "settings");
  class = new FirestoreModel(this, "classes");
  classMember = new FirestoreModel(this, "classMembers");
  quiz = new FirestoreModel(this, "quizzes");
  question = new FirestoreModel(this, "questions");
  quizAttempt = new FirestoreModel(this, "quizAttempts");
  quizAnswer = new FirestoreModel(this, "quizAnswers");
  assignment = new FirestoreModel(this, "assignments");
  assignmentSubmission = new FirestoreModel(this, "assignmentSubmissions");
  attendance = new FirestoreModel(this, "attendance");
  announcement = new FirestoreModel(this, "announcements");
  liveMeeting = new FirestoreModel(this, "liveMeetings");

  private db(): Firestore {
    return getFirestoreDb();
  }

  async load(name: string) {
    const hit = cache[name];
    if (hit && Date.now() - hit.at < CACHE_MS) return hit.rows;
    const snap = await getDocs(collection(this.db(), name));
    const rows = snap.docs.map((item) => revive({ id: item.id, ...item.data() }));
    cache[name] = { at: Date.now(), rows };
    return rows;
  }

  invalidate(name?: string) {
    if (name) delete cache[name];
    else Object.keys(cache).forEach((key) => delete cache[key]);
  }

  async query(name: string, args: Dict = {}) {
    let rows = clone(await this.load(name)).map(revive);
    rows = await this.attachRelationFilters(name, rows, args.where);
    if (args.include) rows = await this.applyIncludes(name, rows, args.include);
    rows = rows.filter((row) => matches(row, args.where));
    if (args.orderBy) rows = this.sortRows(rows, args.orderBy);
    const skip = args.skip || 0;
    const take = args.take;
    if (typeof skip === "number" && skip) rows = rows.slice(skip);
    if (typeof take === "number") rows = rows.slice(0, take);
    if (args.select) rows = rows.map((row) => pick(row, args.select));
    return rows;
  }

  private async attachRelationFilters(name: string, rows: Dict[], where?: Dict) {
    if (!where) return rows;
    const rels = RELATIONS[name] || {};
    const parts = [where, ...(where.OR || []), ...(where.AND || [])];
    const keys = new Set(parts.flatMap((part) => Object.keys(part || {})));
    for (const key of keys) {
      const rel = rels[key];
      if (!rel) continue;
      const related = await this.load(rel.collection);
      for (const row of rows) {
        if (rel.type === "hasMany") {
          row[key] = related.filter((item) => item[rel.key] === row.id).map((item) => revive(clone(item)));
        } else {
          const match = related.find((item) => item.id === row[rel.key]);
          row[key] = match ? revive(clone(match)) : null;
        }
      }
    }
    return rows;
  }

  private sortRows(rows: Dict[], orderBy: Dict | Dict[]) {
    const orders = Array.isArray(orderBy) ? orderBy : [orderBy];
    return rows.sort((a, b) => {
      for (const order of orders) {
        const [field, direction] = Object.entries(order)[0] as [string, any];
        const dir = typeof direction === "string" ? direction : "asc";
        let left = a[field];
        let right = b[field];
        if (direction && typeof direction === "object") {
          const [nestedField, nestedDir] = Object.entries(direction)[0] as [string, string];
          left = a[field]?.[nestedField];
          right = b[field]?.[nestedField];
          const cmp = String(left || "").localeCompare(String(right || ""));
          if (cmp) return nestedDir === "desc" ? -cmp : cmp;
          continue;
        }
        const lv = valueOf(left);
        const rv = valueOf(right);
        if (lv < rv) return dir === "desc" ? 1 : -1;
        if (lv > rv) return dir === "desc" ? -1 : 1;
      }
      return 0;
    });
  }

  private async applyIncludes(name: string, rows: Dict[], include: Dict) {
    const result = [];
    for (const row of rows) result.push(await this.applyInclude(name, row, include));
    return result;
  }

  private async applyInclude(name: string, row: Dict, include?: Dict) {
    if (!include) return row;
    const next = { ...row };
    for (const [field, spec] of Object.entries(include)) {
      if (!spec) continue;
      if (field === "_count") {
        const counts = spec.select || spec;
        next._count = {};
        for (const [countField, enabled] of Object.entries(counts)) {
          if (!enabled) continue;
          const map = COUNT_MAP[name]?.[countField];
          if (!map) {
            next._count[countField] = 0;
            continue;
          }
          const related = await this.load(map.collection);
          next._count[countField] = related.filter((item) => item[map.key] === row.id).length;
        }
        continue;
      }
      const rel = RELATIONS[name]?.[field];
      if (!rel) continue;
      const childInclude = spec === true ? undefined : spec.include;
      const childWhere = spec === true ? undefined : spec.where;
      const childTake = spec === true ? undefined : spec.take;
      const childOrder = spec === true ? undefined : spec.orderBy;
      if (rel.type === "belongsTo") {
        const relatedRows = await this.query(rel.collection, {
          where: { id: row[rel.key] || "__missing__" },
          include: childInclude,
          take: 1,
        });
        next[field] = relatedRows[0] || null;
      } else {
        let relatedRows = await this.query(rel.collection, {
          where: { [rel.key]: row.id, ...(childWhere || {}) },
          include: childInclude,
          orderBy: childOrder,
        });
        if (typeof childTake === "number") relatedRows = relatedRows.slice(0, childTake);
        next[field] = relatedRows;
      }
      if (rel.collection === "users") {
        const stripSecret = (user: Dict | null) => {
          if (!user) return user;
          const copy = { ...user };
          delete copy.passwordHash;
          return copy;
        };
        next[field] = Array.isArray(next[field]) ? next[field].map(stripSecret) : stripSecret(next[field]);
      }
    }
    return next;
  }

  async create(name: string, args: Dict) {
    const { plain, nested } = splitData(args.data || {});
    const id = documentId(name, plain);
    const row = stripUndefined({
      ...plain,
      id,
      createdAt: plain.createdAt || now(),
      updatedAt: now(),
    });
    await setDoc(doc(this.db(), name, id), persistable(name, row));
    this.invalidate(name);
    for (const [field, value] of Object.entries(nested)) {
      const rel = RELATIONS[name]?.[field];
      if (!rel || rel.type !== "hasMany") continue;
      const items = value.createMany?.data || (Array.isArray(value.create) ? value.create : [value.create]);
      for (const item of items) {
        await this.create(rel.collection, { data: { ...item, [rel.key]: id } });
      }
    }
    return this.query(name, { where: { id }, include: args.include }).then((rows) => rows[0]);
  }

  async update(name: string, args: Dict) {
    const current = (await this.query(name, { where: args.where }))[0];
    if (!current) throw new Error("Record not found.");
    const { plain, nested } = splitData(args.data || {});
    const row = stripUndefined({ ...current, ...plain, id: current.id, updatedAt: now() });
    await setDoc(doc(this.db(), name, current.id), persistable(name, row));
    this.invalidate(name);
    for (const [field, value] of Object.entries(nested)) {
      const rel = RELATIONS[name]?.[field];
      if (!rel || rel.type !== "hasMany") continue;
      const items = value.createMany?.data || (Array.isArray(value.create) ? value.create : [value.create]);
      for (const item of items) {
        await this.create(rel.collection, { data: { ...item, [rel.key]: current.id } });
      }
    }
    return this.query(name, { where: { id: current.id }, include: args.include }).then((rows) => rows[0]);
  }

  async remove(name: string, id: string) {
    await deleteDoc(doc(this.db(), name, id));
    this.invalidate(name);
  }

  async $transaction<T>(fn: (tx: FirestoreStore) => Promise<T>) {
    return fn(this);
  }

  async $disconnect() {
    return;
  }
}
