import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { CustomModal } from '@/components/ui/custom-modal';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Separator } from '@components/ui/separator';
import { auth } from '@lib/firebase';
import { toast } from 'sonner';
import { useState } from 'react';

export function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // 로그인 / 회원가입 모드 전환 상태
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 구글 로그인
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('구글 계정으로 로그인되었습니다.');
      onClose();
    } catch (err: any) {
      toast.error('구글 로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 로그인/회원가입 통합 핸들러
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('회원가입이 완료되었습니다!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('성공적으로 로그인되었습니다.');
      }
      onClose();
    } catch (err: any) {
      const message = isSignUp ? '회원가입 실패' : '로그인 실패';
      toast.error(`${message}: 이메일이나 비밀번호를 확인해주세요.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomModal
      title={isSignUp ? '계정 만들기' : '다시 오신 걸 환영합니다'}
      description={isSignUp ? '정보를 입력하여 새로운 계정을 생성하세요.' : '이메일을 사용하여 로그인하세요.'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        {/* SNS 로그인 영역 */}
        <Button variant="outline" type="button" disabled={isLoading} onClick={handleGoogleSignIn} className="w-full">
          {/* 구글 로고 아이콘 대체 가능 */}
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google로 계속하기
        </Button>

        <div className="relative flex items-center py-2">
          <Separator />
          <span className="absolute left-1/2 -translate-x-1/2 bg-background px-2 text-xs text-muted-foreground uppercase">Or continue with</span>
        </div>

        {/* 이메일 로그인 양식 */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? '처리 중...' : isSignUp ? '가입하기' : '로그인'}
          </Button>
        </form>

        {/* 모드 전환 섹션 */}
        <div className="text-center text-sm">
          {isSignUp ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}{' '}
          <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="font-semibold text-primary underline underline-offset-4">
            {isSignUp ? '로그인' : '회원가입'}
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
