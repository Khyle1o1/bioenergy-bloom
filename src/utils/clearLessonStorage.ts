/**
 * Utility to clear all lesson-related localStorage data
 * Used when resetting progress or starting fresh
 */
export function clearAllLessonStorage() {
  try {
    const keysToRemove: string[] = [];
    
    // Find all keys related to lessons
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('lesson') || 
        key.includes('sections_done') ||
        key.includes('current_section') ||
        key.includes('pair_data') ||
        key.includes('show_what') ||
        key.includes('go_further')
      )) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all found keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log(`Cleared ${keysToRemove.length} lesson storage items`);
  } catch (error) {
    console.error('Error clearing lesson storage:', error);
  }
}

/**
 * Clear storage for a specific lesson
 */
export function clearLessonStorage(lessonId: 'lesson1' | 'lesson2' | 'lesson3') {
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(lessonId)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log(`Cleared ${keysToRemove.length} items for ${lessonId}`);
  } catch (error) {
    console.error(`Error clearing ${lessonId} storage:`, error);
  }
}
