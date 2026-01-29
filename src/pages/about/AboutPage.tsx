import { Calendar, CheckCircle, LayoutGrid, Shield, Table, Users, Zap } from 'lucide-react';

import { Button } from '@components/ui/button';
import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          효율적인 업무 관리,
          <br />
          <span className="text-primary">KANBAN TASK</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          드래그 앤 드롭으로 쉽게 관리하는 칸반 보드.
          <br />
          캘린더, 테이블 뷰로 다양한 방식으로 일정을 확인하세요.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button size="lg">시작하기</Button>
          </Link>
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">주요 기능</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-xl border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <LayoutGrid className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">칸반 보드</h3>
              <p className="text-muted-foreground">
                직관적인 드래그 앤 드롭으로 태스크 상태를 손쉽게 변경하세요. To Do, In Progress, Done 컬럼으로 업무 흐름을 한눈에 파악할 수 있습니다.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">캘린더 뷰</h3>
              <p className="text-muted-foreground">월별 캘린더에서 마감일 기준으로 태스크를 확인하세요. 일정 관리가 더욱 쉬워집니다.</p>
            </div>

            <div className="bg-background p-6 rounded-xl border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Table className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">테이블 뷰</h3>
              <p className="text-muted-foreground">정렬, 필터링, 검색 기능으로 태스크를 효율적으로 관리하세요. 우선순위와 상태별로 빠르게 필터링할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">왜 KANBAN TASK인가요?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">간편한 사용</h3>
              <p className="text-sm text-muted-foreground">복잡한 설정 없이 바로 시작할 수 있습니다</p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">실시간 동기화</h3>
              <p className="text-sm text-muted-foreground">어디서든 변경사항이 즉시 반영됩니다</p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">안전한 데이터</h3>
              <p className="text-sm text-muted-foreground">Firebase 기반의 안전한 클라우드 저장</p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">개인 맞춤</h3>
              <p className="text-sm text-muted-foreground">나만의 프로필과 설정으로 개인화된 경험</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-lg opacity-90 mb-8">손쉽게 가입하고 효율적인 업무 관리를 경험해보세요.</p>
          <Link to="/">
            <Button size="lg" variant="secondary">
              시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 KANBAN TASK. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
