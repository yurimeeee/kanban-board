import * as z from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '@lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useUserStore } from '@store/userSlice';
import { zodResolver } from '@hookform/resolvers/zod';

const profileSchema = z.object({
  displayName: z.string().min(2, '이름은 2글자 이상이어야 합니다.'),
  phoneNumber: z.string().regex(/^\d{10,11}$/, '올바른 전화번호 형식이 아닙니다. (- 제외)'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function MyPage() {
  const user = useUserStore((state) => state.user);
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // 기존 정보 불러오기
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Google 로그인 사용자 확인
    const isGoogle = user.providerData?.some(
      (provider) => provider.providerId === 'google.com'
    );
    setIsGoogleUser(!!isGoogle);

    const fetchUserData = async () => {
      if (!user?.uid) return;

      // Google 사용자는 기본 정보 사용
      if (isGoogle) {
        setValue('displayName', user.displayName || '');
        setValue('phoneNumber', profile?.phoneNumber || '');
        setPreviewUrl(user.photoURL || null);
        return;
      }

      // 스토어에 프로필이 있으면 먼저 사용
      if (profile) {
        setValue('displayName', profile.displayName || '');
        setValue('phoneNumber', profile.phoneNumber || '');
        setPreviewUrl(profile.photoURL || null);
        return;
      }

      // 이메일 사용자는 Firestore에서 정보 불러오기
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setValue('displayName', data.displayName || '');
        setValue('phoneNumber', data.phoneNumber || '');
        setPreviewUrl(data.photoURL || null);
        // 스토어에 저장
        setProfile({
          displayName: data.displayName || null,
          phoneNumber: data.phoneNumber || null,
          photoURL: data.photoURL || null,
          email: user.email || null,
        });
      } else {
        // 첫 방문 시 기본값 설정
        setValue('displayName', user.displayName || '');
        setValue('phoneNumber', '');
        setPreviewUrl(user.photoURL || null);
      }
    };
    fetchUserData();
  }, [user, profile, setValue, navigate, setProfile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user?.uid) return;
    setLoading(true);

    try {
      let photoURL = previewUrl;

      // 1. 이미지가 새로 선택되었다면 Storage에 업로드
      if (photoFile) {
        const storageRef = ref(storage, `profiles/${user.uid}/photo`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }

      const profileData = {
        displayName: values.displayName,
        phoneNumber: values.phoneNumber,
        photoURL,
        email: user.email,
        updatedAt: Date.now(),
      };

      // 2. Firestore users/{userId} 문서에 정보 저장
      await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });

      // 3. 스토어 업데이트
      updateProfile({
        displayName: values.displayName,
        phoneNumber: values.phoneNumber,
        photoURL,
        email: user.email,
      });

      // 프리뷰 URL 업데이트 (Storage URL로)
      setPreviewUrl(photoURL);
      setPhotoFile(null);

      toast.success('프로필이 업데이트되었습니다.');
    } catch (error) {
      console.error(error);
      toast.error('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>내 프로필 관리</CardTitle>
          <CardDescription>
            {isGoogleUser
              ? 'Google 계정으로 로그인하셨습니다. 프로필 정보는 Google 계정에서 관리됩니다.'
              : '프로필 정보를 설정하고 관리하세요.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 프로필 이미지 업로드 섹션 */}
            <div className="flex flex-col items-center gap-4 py-4">
              <Avatar className="w-24 h-24 border">
                <AvatarImage src={previewUrl || ''} />
                <AvatarFallback className="text-2xl">
                  {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!isGoogleUser && (
                <div className="flex flex-col items-center">
                  <Label
                    htmlFor="photo"
                    className="cursor-pointer bg-secondary px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary/80"
                  >
                    사진 변경
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>

            {/* 로그인 방식 표시 */}
            <div className="space-y-2">
              <Label>로그인 방식</Label>
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
                {isGoogleUser ? (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-sm">Google 계정</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">이메일 로그인</span>
                  </>
                )}
              </div>
            </div>

            {/* 이메일 (수정 불가) */}
            <div className="space-y-2">
              <Label>이메일</Label>
              <Input value={user?.email || ''} disabled className="bg-muted" />
            </div>

            {/* 이름 입력 */}
            <div className="space-y-2">
              <Label htmlFor="displayName">이름 *</Label>
              <Input
                id="displayName"
                placeholder="이름을 입력하세요"
                disabled={isGoogleUser}
                {...register('displayName')}
              />
              {errors.displayName && (
                <p className="text-sm text-destructive">{errors.displayName.message}</p>
              )}
            </div>

            {/* 연락처 입력 */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">연락처 {!isGoogleUser && '*'}</Label>
              <Input
                id="phoneNumber"
                placeholder="숫자만 입력 (예: 01012345678)"
                {...register('phoneNumber')}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
              )}
            </div>

            {!isGoogleUser && (
              <div className="flex justify-end gap-2 pt-4">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  {loading ? '저장 중...' : '프로필 저장'}
                </Button>
              </div>
            )}

            {isGoogleUser && (
              <div className="flex justify-end gap-2 pt-4">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  {loading ? '저장 중...' : '연락처 저장'}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
