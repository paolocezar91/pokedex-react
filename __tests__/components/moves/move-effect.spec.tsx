import MoveEffect from '@/components/moves/move-effect';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { IMove } from 'pokeapi-typescript';

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@/context/UserContext', () => ({
  useUser: () => ({
    settings: { descriptionLang: 'en' }
  })
}));

describe('MoveEffect Component', () => {
  const mockData = {
    effect_entries: [
      {
        language: {
          name: 'en',
          url: ''
        },
        effect: 'A new effect'
      }
    ]
  } as unknown as IMove;

  it('should render the component with English description', () => {
    render(<MoveEffect moveData={mockData} />);

    expect(screen.getByRole('heading', { name: 'moves.moveEffect.title' })).toBeInTheDocument();
    expect(screen.getByText('A new effect')).toBeInTheDocument();
  });

  it('should handle empty descriptions array', () => {
    const emptyData = {
      effect_entries: []
    } as unknown as IMove;

    render(<MoveEffect moveData={emptyData} />);

    expect(screen.getByRole('heading', { name: 'moves.moveEffect.title' })).toBeInTheDocument();
    expect(screen.queryByText('moves.moveEffect.empty')).toBeInTheDocument();
  });

  it('should match snapshot with English description', () => {
    const { asFragment } = render(<MoveEffect moveData={mockData} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should match snapshot with no valid description', () => {
    const emptyData = {
      effect_entries: []
    } as unknown as IMove;

    const { asFragment } = render(<MoveEffect moveData={emptyData} />);
    expect(asFragment()).toMatchSnapshot();
  });
});