import { db, storage } from '@lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const updateUserProfile = async (userId: string, data: {
  name: string;
  phone: string;
  photoFile?: File;
}) => {
  let photoURL = '';

  // 사진이 있다면 Storage에 업로드
  if (data.photoFile) {
    const storageRef = ref(storage, `profiles/${userId}/photo`);
    await uploadBytes(storageRef, data.photoFile);
    photoURL = await getDownloadURL(storageRef);
  }

  // Firestore 유저 정보 저장 (merge 옵션으로 기존 데이터 유지)
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    displayName: data.name,
    phoneNumber: data.phone,
    ...(photoURL && { photoURL }),
    updatedAt: Date.now(),
  }, { merge: true });
};