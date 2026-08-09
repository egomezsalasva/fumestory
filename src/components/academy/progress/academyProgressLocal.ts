import type { LessonStatus } from "../curriculum";
import type { MaterialMasteryMap } from "../utils/materialMastery";
import { MAX_LIVES } from "../session/constants";

export const ACADEMY_PROGRESS_STORAGE_KEY = "fumestory.academyProgress.v1";

export type AcademyLessonProgress = {
	repeats: number;
	status: LessonStatus;
};

/** Durable Academy progress — guest localStorage and later DB JSON. */
export type AcademyProgressV1 = {
	v: 1;
	updatedAt: string;
	lives: number;
	lessonStreak: number;
	lessons: Record<string, AcademyLessonProgress>;
	materialMastery: MaterialMasteryMap;
	learnedMaterialKeys: string[];
	seenMaterialKeys: string[];
};

export function createEmptyAcademyProgress(
	now = new Date().toISOString(),
): AcademyProgressV1 {
	return {
		v: 1,
		updatedAt: now,
		lives: MAX_LIVES,
		lessonStreak: 0,
		lessons: {},
		materialMastery: {},
		learnedMaterialKeys: [],
		seenMaterialKeys: [],
	};
}

function isLessonStatus(value: unknown): value is LessonStatus {
	return value === "locked" || value === "available" || value === "completed";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value.filter((item): item is string => typeof item === "string");
}

function parseMaterialMastery(value: unknown): MaterialMasteryMap {
	if (!isPlainObject(value)) return {};
	const mastery: MaterialMasteryMap = {};
	for (const [key, raw] of Object.entries(value)) {
		if (typeof raw === "number" && Number.isFinite(raw)) {
			mastery[key] = raw;
		}
	}
	return mastery;
}

function parseLessons(value: unknown): Record<string, AcademyLessonProgress> {
	if (!isPlainObject(value)) return {};
	const lessons: Record<string, AcademyLessonProgress> = {};
	for (const [lessonId, raw] of Object.entries(value)) {
		if (!isPlainObject(raw)) continue;
		const repeats = raw.repeats;
		const status = raw.status;
		if (typeof repeats !== "number" || !Number.isFinite(repeats)) continue;
		if (!isLessonStatus(status)) continue;
		lessons[lessonId] = {
			repeats: Math.max(0, Math.floor(repeats)),
			status,
		};
	}
	return lessons;
}

/** Returns null if missing or invalid. */
export function parseAcademyProgress(raw: unknown): AcademyProgressV1 | null {
	if (!isPlainObject(raw)) return null;
	if (raw.v !== 1) return null;

	const lives = raw.lives;
	const lessonStreak = raw.lessonStreak;
	if (typeof lives !== "number" || !Number.isFinite(lives)) return null;
	if (typeof lessonStreak !== "number" || !Number.isFinite(lessonStreak)) {
		return null;
	}

	return {
		v: 1,
		updatedAt:
			typeof raw.updatedAt === "string"
				? raw.updatedAt
				: new Date().toISOString(),
		lives: Math.max(0, Math.min(MAX_LIVES, Math.floor(lives))),
		lessonStreak: Math.max(0, Math.floor(lessonStreak)),
		lessons: parseLessons(raw.lessons),
		materialMastery: parseMaterialMastery(raw.materialMastery),
		learnedMaterialKeys: parseStringArray(raw.learnedMaterialKeys),
		seenMaterialKeys: parseStringArray(raw.seenMaterialKeys),
	};
}

export function loadAcademyProgressLocal(): AcademyProgressV1 | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(ACADEMY_PROGRESS_STORAGE_KEY);
		if (!raw) return null;
		return parseAcademyProgress(JSON.parse(raw) as unknown);
	} catch {
		return null;
	}
}

export function saveAcademyProgressLocal(progress: AcademyProgressV1): void {
	if (typeof window === "undefined") return;
	const next: AcademyProgressV1 = {
		...progress,
		v: 1,
		updatedAt: new Date().toISOString(),
	};
	try {
		window.localStorage.setItem(
			ACADEMY_PROGRESS_STORAGE_KEY,
			JSON.stringify(next),
		);
	} catch {
		// Quota / private mode — ignore
	}
}

export function clearAcademyProgressLocal(): void {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.removeItem(ACADEMY_PROGRESS_STORAGE_KEY);
	} catch {
		// ignore
	}
}
