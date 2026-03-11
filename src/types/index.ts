// ============================================================
// TIPOS DO SITE PÚBLICO
// ============================================================

export interface HeroData {
  badge: string;
  title: string;
  subtitle: string;
  tagline: string;
  secondaryText: string;
  logoUrl: string;
}

export interface AboutData {
  title: string;
  text1: string;
  text2: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  order: number;
}

export interface IdentityData {
  pantherTitle: string;
  pantherText: string;
  pantherImageUrl: string;
  snakeTitle: string;
  snakeText: string;
  snakeImageUrl: string;
  centerArtUrl: string;
  unionText: string;
}

export interface Director {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  featured: boolean;
  order: number;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  order: number;
}

export interface ContactData {
  instagram: string;
  email: string;
  cta: string;
  finalText: string;
}

// ============================================================
// TIPOS DO PAINEL ADMIN
// ============================================================

export interface AdminUser {
  uid: string;
  email: string | null;
}

export interface UploadResult {
  url: string;
  path: string;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}
