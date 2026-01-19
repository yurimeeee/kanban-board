import { ArrowRight, Code2, Rocket, ShieldCheck } from 'lucide-react';

import { Button } from '@components/ui/button';
import KanbanBoard from '@components/feature/home/KanbanBoard';
// src/pages/HomePage.tsx
import styled from '@emotion/styled';

const HeroSection = styled.section`
  padding: 5rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2rem;
  padding: 4rem 1rem;
  max-width: 1000px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const FeatureCard = styled.div`
  padding: 2rem;
  border-radius: 0.75rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--card));
  transition: all 0.2s;

  &:hover {
    border-color: hsl(var(--primary));
    transform: translateY(-4px);
  }
`;

export function HomePage() {
  return (
    <div className="flex-1">
      <KanbanBoard />

      {/* Hero 영역 */}
      <HeroSection>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          더 빠르고, 더 예쁘게 <br />
          <span className="text-primary">React 템플릿</span>
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
          Emotion의 유연함과 Shadcn UI의 완성도를 하나로 담았습니다. 이미 구축된 테스트 환경과 절대 경로 설정으로 바로 개발을 시작하세요.
        </p>
        <div className="flex gap-4 mt-4">
          <Button size="lg" className="gap-2">
            시작하기 <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg">
            문서 읽기
          </Button>
        </div>
      </HeroSection>

      <hr className="border-border" />

      {/* Feature 영역 */}
      <FeatureGrid>
        <FeatureCard>
          <Rocket className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">빠른 속도</h3>
          <p className="text-muted-foreground text-sm">Vite 기반의 초고속 HMR로 변경 사항을 즉시 확인하세요.</p>
        </FeatureCard>

        <FeatureCard>
          <Code2 className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">절대 경로</h3>
          <p className="text-muted-foreground text-sm">@components, @lib 등 깔끔한 임포트 구조가 설정되어 있습니다.</p>
        </FeatureCard>

        <FeatureCard>
          <ShieldCheck className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">안정성</h3>
          <p className="text-muted-foreground text-sm">Vitest와 Testing Library로 작성된 테스트 환경을 제공합니다.</p>
        </FeatureCard>
      </FeatureGrid>
    </div>
  );
}
