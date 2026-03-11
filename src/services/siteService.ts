import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import {
  defaultHero,
  defaultAbout,
  defaultTimeline,
  defaultIdentity,
  defaultContact,
} from "@/lib/defaults";
import type {
  HeroData,
  AboutData,
  TimelineItem,
  IdentityData,
  Director,
  GalleryItem,
  ContactData,
  UploadResult,
} from "@/types";

// ============================================================
// UPLOAD DE IMAGEM
// ============================================================

export async function uploadImage(
  file: File | Blob,
  path: string
): Promise<UploadResult> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

export async function deleteImage(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch {
    // Ignora erro se arquivo não existir
  }
}

// ============================================================
// HERO
// ============================================================

export async function getHero(): Promise<HeroData> {
  const docRef = doc(db, "siteContent", "hero");
  const snap = await getDoc(docRef);
  if (snap.exists()) return snap.data() as HeroData;
  return defaultHero;
}

export async function saveHero(data: HeroData): Promise<void> {
  await setDoc(doc(db, "siteContent", "hero"), data);
}

// ============================================================
// QUEM SOMOS
// ============================================================

export async function getAbout(): Promise<AboutData> {
  const docRef = doc(db, "siteContent", "about");
  const snap = await getDoc(docRef);
  if (snap.exists()) return snap.data() as AboutData;
  return defaultAbout;
}

export async function saveAbout(data: AboutData): Promise<void> {
  await setDoc(doc(db, "siteContent", "about"), data);
}

// ============================================================
// TIMELINE / HISTÓRIA
// ============================================================

export async function getTimeline(): Promise<TimelineItem[]> {
  const q = query(collection(db, "timeline"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  if (snap.empty) return defaultTimeline;
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TimelineItem));
}

export async function addTimelineItem(
  item: Omit<TimelineItem, "id">
): Promise<TimelineItem> {
  const docRef = await addDoc(collection(db, "timeline"), item);
  return { id: docRef.id, ...item };
}

export async function updateTimelineItem(
  id: string,
  data: Partial<TimelineItem>
): Promise<void> {
  await updateDoc(doc(db, "timeline", id), data);
}

export async function deleteTimelineItem(id: string): Promise<void> {
  await deleteDoc(doc(db, "timeline", id));
}

// ============================================================
// IDENTIDADE
// ============================================================

export async function getIdentity(): Promise<IdentityData> {
  const docRef = doc(db, "siteContent", "identity");
  const snap = await getDoc(docRef);
  if (snap.exists()) return snap.data() as IdentityData;
  return defaultIdentity;
}

export async function saveIdentity(data: IdentityData): Promise<void> {
  await setDoc(doc(db, "siteContent", "identity"), data);
}

// ============================================================
// DIRETORIA
// ============================================================

export async function getDirectors(): Promise<Director[]> {
  const q = query(collection(db, "directors"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Director));
}

export async function addDirector(
  data: Omit<Director, "id">
): Promise<Director> {
  const docRef = await addDoc(collection(db, "directors"), data);
  return { id: docRef.id, ...data };
}

export async function updateDirector(
  id: string,
  data: Partial<Director>
): Promise<void> {
  await updateDoc(doc(db, "directors", id), data);
}

export async function deleteDirector(id: string): Promise<void> {
  await deleteDoc(doc(db, "directors", id));
}

// ============================================================
// GALERIA
// ============================================================

export async function getGallery(): Promise<GalleryItem[]> {
  const q = query(collection(db, "gallery"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItem));
}

export async function addGalleryItem(
  data: Omit<GalleryItem, "id">
): Promise<GalleryItem> {
  const docRef = await addDoc(collection(db, "gallery"), data);
  return { id: docRef.id, ...data };
}

export async function updateGalleryItem(
  id: string,
  data: Partial<GalleryItem>
): Promise<void> {
  await updateDoc(doc(db, "gallery", id), data);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await deleteDoc(doc(db, "gallery", id));
}

// ============================================================
// CONTATO
// ============================================================

export async function getContact(): Promise<ContactData> {
  const docRef = doc(db, "siteContent", "contact");
  const snap = await getDoc(docRef);
  if (snap.exists()) return snap.data() as ContactData;
  return defaultContact;
}

export async function saveContact(data: ContactData): Promise<void> {
  await setDoc(doc(db, "siteContent", "contact"), data);
}
