import { SavedProject, PosterConfig } from './types';

const STORAGE_KEY = 'poster_forge_recent_projects';

export async function saveProjectLocally(
  name: string,
  config: PosterConfig,
  thumbnailUrl: string
): Promise<SavedProject[]> {
  if (typeof window === 'undefined') return [];

  const compressedThumb = await compressThumbnail(thumbnailUrl);
  const existing = getSavedProjects();
  const newProject: SavedProject = {
    id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name: name || 'Untitled Poster',
    createdAt: Date.now(),
    config,
    thumbnailUrl: compressedThumb,
  };

  const updated = [newProject, ...existing.slice(0, 9)]; // Keep max 10 recent
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save project locally:', err);
  }
  return updated;
}

function compressThumbnail(dataUrl: string, maxDim = 150): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width;
      let h = img.height;
      if (w > h) {
        if (w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        }
      } else {
        if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      canvas.width = Math.max(1, w);
      canvas.height = Math.max(1, h);
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export function getSavedProjects(): SavedProject[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to load recent projects:', err);
    return [];
  }
}

export function deleteSavedProject(id: string): SavedProject[] {
  if (typeof window === 'undefined') return [];

  const existing = getSavedProjects();
  const updated = existing.filter(p => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to delete saved project:', err);
  }
  return updated;
}
