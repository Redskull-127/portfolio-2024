'use server';
import { revalidatePath } from 'next/cache';
const clearCachesByServerAction = async (
  path: string,
  mode?: 'layout' | 'page',
) => {
  try {
    if (path) {
      revalidatePath(path, mode);
    } else {
      revalidatePath('/', mode);
    }
  } catch (error) {
    console.error('clearCachesByServerAction=> ', error);
  }
};
export default clearCachesByServerAction;
