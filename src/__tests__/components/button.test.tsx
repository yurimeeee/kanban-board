import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { Button } from '@components/ui/button'; // 절대 경로 사용

describe('Button 컴포넌트 (Shadcn UI)', () => {
  it('버튼 텍스트가 정상적으로 나타난다', () => {
    render(<Button>테스트 버튼</Button>);
    expect(screen.getByText('테스트 버튼')).toBeInTheDocument();
  });

  it('클릭 시 onClick 핸들러가 호출된다', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>클릭</Button>);

    fireEvent.click(screen.getByText('클릭'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
